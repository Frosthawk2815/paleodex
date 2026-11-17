// The host's side of a Peer Review game: one direct WebRTC link to each player who joins with the
// battle code (players use openLink from link.ts as guests). The host passes messages between
// players. The signalling connection stays open only while the lobby is accepting players.

import { newConnection } from '@/lib/battle/rtc';
import type { RtcCandidate, RtcChannel, RtcConnection, RtcDescription } from '@/lib/battle/rtc-types';

const SIGNAL_URL = process.env.EXPO_PUBLIC_SIGNAL_URL ?? 'wss://0.peerjs.com:443';
const ICE = { iceServers: [{ urls: ['stun:stun.l.google.com:19302', 'stun:stun1.l.google.com:19302'] }] };
const PREFIX = 'paleodex-battle-';

export type HubState = { kind: 'connecting' } | { kind: 'open' } | { kind: 'error'; reason: 'code-taken' | 'server' } | { kind: 'closed' };

export type Hub = {
  send: (peer: string, msg: object) => void;
  broadcast: (msg: object, except?: string) => void;
  drop: (peer: string) => void;
  // Stop letting new players join (closes the signalling connection).
  lock: () => void;
  close: () => void;
};

// The public PeerJS server only passes on messages shaped like the official library's (see link.ts).
type Payload = { sdp?: RtcDescription; candidate?: RtcCandidate; type?: 'data'; connectionId?: string; label?: string; reliable?: boolean; serialization?: string };
type Signal = { type: string; src?: string; dst?: string; payload?: Payload };
type Peer = { pc: RtcConnection; channel: RtcChannel | null; remoteSet: boolean; pending: RtcCandidate[]; open: boolean };

const randomToken = () => Math.random().toString(36).slice(2, 12);

export function openHub(
  code: string,
  maxPeers: number,
  handlers: {
    onState: (s: HubState) => void;
    onJoin: (peer: string) => void;
    onLeave: (peer: string) => void;
    onMessage: (peer: string, msg: Record<string, unknown>) => void;
  },
): Hub {
  const myId = PREFIX + code;
  const peers = new Map<string, Peer>();
  let closed = false;
  let locked = false;
  const ws = new WebSocket(`${SIGNAL_URL}/peerjs?key=peerjs&id=${encodeURIComponent(myId)}&token=${randomToken()}&version=1.5.5`);
  const signal = (msg: Signal) => {
    if (ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify(msg));
  };
  const heartbeat = setInterval(() => signal({ type: 'HEARTBEAT' }), 5000);
  const stopSignalling = () => {
    clearInterval(heartbeat);
    if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) ws.close();
  };

  const drop = (id: string) => {
    const p = peers.get(id);
    if (!p) return;
    peers.delete(id);
    try {
      p.channel?.close();
      p.pc.close();
    } catch {
      // Already closed.
    }
    if (p.open) handlers.onLeave(id);
  };

  // reject: connect only to say why they can't join (full, or already started), then hang up.
  const early = new Map<string, RtcCandidate[]>();
  const accept = async (id: string, sdp: RtcDescription, connectionId: string, reject?: 'full' | 'started') => {
    const pc = newConnection(ICE);
    const peer: Peer = { pc, channel: null, remoteSet: false, pending: [], open: false };
    peers.set(id, peer);
    // Our routes go out only after the answer, so the player knows who they're from.
    let answered = false;
    const outbox: RtcCandidate[] = [];
    const sendCandidate = (c: RtcCandidate) => signal({ type: 'CANDIDATE', dst: id, payload: { candidate: c, type: 'data', connectionId } });
    pc.addEventListener('icecandidate', (e) => {
      if (!e.candidate) return;
      const j = e.candidate.toJSON ? e.candidate.toJSON() : e.candidate;
      const c = { candidate: j.candidate, sdpMid: j.sdpMid, sdpMLineIndex: j.sdpMLineIndex };
      if (answered) sendCandidate(c);
      else outbox.push(c);
    });
    pc.addEventListener('connectionstatechange', () => {
      if (pc.connectionState === 'failed' || pc.connectionState === 'disconnected' || pc.connectionState === 'closed') drop(id);
    });
    pc.addEventListener('datachannel', (e) => {
      const ch = e.channel;
      peer.channel = ch;
      ch.addEventListener('open', () => {
        if (reject) {
          ch.send(JSON.stringify({ t: 'rejected', reason: reject }));
          setTimeout(() => drop(id), 500);
          return;
        }
        peer.open = true;
        handlers.onJoin(id);
      });
      ch.addEventListener('message', (m) => {
        if (reject) return;
        try {
          const msg = JSON.parse(String(m.data));
          if (msg && typeof msg === 'object') handlers.onMessage(id, msg as Record<string, unknown>);
        } catch {
          // Not one of our messages.
        }
      });
      ch.addEventListener('close', () => drop(id));
    });
    await pc.setRemoteDescription(sdp);
    peer.remoteSet = true;
    for (const c of [...(early.get(id) ?? []), ...peer.pending.splice(0)]) pc.addIceCandidate(c).catch(() => {});
    early.delete(id);
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);
    signal({ type: 'ANSWER', dst: id, payload: { sdp: { type: answer.type, sdp: answer.sdp }, type: 'data', connectionId } });
    answered = true;
    for (const c of outbox.splice(0)) sendCandidate(c);
  };

  ws.onerror = () => {
    if (!locked && !closed) handlers.onState({ kind: 'error', reason: 'server' });
  };
  ws.onmessage = async (event) => {
    let msg: Signal;
    try {
      msg = JSON.parse(String(event.data));
    } catch {
      return;
    }
    switch (msg.type) {
      case 'OPEN':
        handlers.onState({ kind: 'open' });
        break;
      case 'ID-TAKEN':
        handlers.onState({ kind: 'error', reason: 'code-taken' });
        break;
      case 'OFFER':
        if (!msg.src || !msg.payload?.sdp || peers.has(msg.src)) break;
        accept(msg.src, msg.payload.sdp, msg.payload.connectionId ?? `dc_${randomToken()}`, locked ? 'started' : peers.size >= maxPeers ? 'full' : undefined).catch(() => drop(msg.src!));
        break;
      case 'CANDIDATE': {
        const p = msg.src ? peers.get(msg.src) : undefined;
        if (!msg.payload?.candidate || !msg.src) break;
        // A player's routes can arrive before their offer: keep them for when it does.
        if (!p) {
          const list = early.get(msg.src) ?? [];
          if (list.length < 30 && early.size < 60) early.set(msg.src, [...list, msg.payload.candidate]);
          break;
        }
        if (p.remoteSet) p.pc.addIceCandidate(msg.payload.candidate).catch(() => {});
        else p.pending.push(msg.payload.candidate);
        break;
      }
      case 'LEAVE':
        if (msg.src && peers.has(msg.src) && !peers.get(msg.src)!.open) drop(msg.src);
        break;
    }
  };

  handlers.onState({ kind: 'connecting' });
  const sendTo = (p: Peer | undefined, msg: object) => {
    if (p?.channel && p.channel.readyState === 'open') p.channel.send(JSON.stringify(msg));
  };
  return {
    send: (id, msg) => sendTo(peers.get(id), msg),
    broadcast: (msg, except) => {
      for (const [id, p] of peers) if (id !== except) sendTo(p, msg);
    },
    drop,
    lock: () => {
      locked = true;
      stopSignalling();
    },
    close: () => {
      if (closed) return;
      closed = true;
      stopSignalling();
      for (const [id, p] of peers) {
        sendTo(p, { t: 'bye' });
        drop(id);
      }
      handlers.onState({ kind: 'closed' });
    },
  };
}
