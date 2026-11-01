// A direct, peer-to-peer link between two phones for the Bone War quiz.
//
// The phones find each other through a PeerJS signalling server: the host registers its battle
// code there, and the guest sends a connection offer to that code. Once WebRTC has connected them,
// the signalling connection is closed and everything (choices, questions, answers) travels directly
// between the two phones over a WebRTC data channel. Nothing about the game is stored anywhere.

import { newConnection } from '@/lib/battle/rtc';
import type { RtcCandidate, RtcChannel, RtcConnection, RtcDescription } from '@/lib/battle/rtc-types';

// The free public PeerJS server by default; EXPO_PUBLIC_SIGNAL_URL points it elsewhere (for
// testing with a local server, or a server of our own later).
const SIGNAL_URL = process.env.EXPO_PUBLIC_SIGNAL_URL ?? 'wss://0.peerjs.com:443';
const SIGNAL_KEY = 'peerjs';
// Public STUN servers let each phone learn its address on the internet. (Some strict mobile and
// office networks block direct links; they would need a relay (TURN) server, which we don't run.)
const ICE = { iceServers: [{ urls: ['stun:stun.l.google.com:19302', 'stun:stun1.l.google.com:19302'] }] };
const PREFIX = 'paleodex-battle-';
const TIMEOUT_MS = 25000;

export type LinkState =
  | { kind: 'connecting' }
  // Host only: the code is registered and waiting for a friend to join.
  | { kind: 'waiting' }
  | { kind: 'open' }
  | { kind: 'closed' }
  | { kind: 'error'; reason: 'code-taken' | 'no-host' | 'failed' | 'server' };

export type Link = { send: (msg: object) => void; close: () => void };

const randomToken = () => Math.random().toString(36).slice(2, 12);
export const newBattleCode = () => String(Math.floor(100000 + Math.random() * 900000));

type Signal = { type: string; src?: string; dst?: string; payload?: { sdp?: RtcDescription; candidate?: RtcCandidate } };

export function openLink(
  role: 'host' | 'guest',
  code: string,
  onState: (s: LinkState) => void,
  onMessage: (msg: Record<string, unknown>) => void,
): Link {
  const hostId = PREFIX + code;
  const myId = role === 'host' ? hostId : `${hostId}-${randomToken()}`;
  let peerId: string | null = role === 'guest' ? hostId : null;
  let channel: RtcChannel | null = null;
  let closed = false;
  let opened = false;
  let remoteSet = false;
  const pendingCandidates: RtcCandidate[] = [];

  const ws = new WebSocket(`${SIGNAL_URL}/peerjs?key=${SIGNAL_KEY}&id=${encodeURIComponent(myId)}&token=${randomToken()}&version=1.5.5`);
  const pc: RtcConnection = newConnection(ICE);
  const signal = (msg: Signal) => {
    if (ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify(msg));
  };
  const heartbeat = setInterval(() => signal({ type: 'HEARTBEAT' }), 5000);
  // A guest that hasn't connected in time most likely has the wrong code.
  const timeout = role === 'guest' ? setTimeout(() => fail('no-host'), TIMEOUT_MS) : null;

  const stopSignalling = () => {
    clearInterval(heartbeat);
    if (timeout) clearTimeout(timeout);
    if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) ws.close();
  };
  const finish = (s: LinkState) => {
    if (closed) return;
    closed = true;
    stopSignalling();
    try {
      channel?.close();
      pc.close();
    } catch {
      // Already closed.
    }
    onState(s);
  };
  const fail = (reason: Extract<LinkState, { kind: 'error' }>['reason']) => finish({ kind: 'error', reason });

  const attachChannel = (ch: RtcChannel) => {
    channel = ch;
    ch.addEventListener('open', () => {
      opened = true;
      // Connected directly: the signalling server is no longer needed, and the code is freed.
      stopSignalling();
      onState({ kind: 'open' });
    });
    ch.addEventListener('message', (e) => {
      try {
        const msg = JSON.parse(String(e.data));
        if (msg && typeof msg === 'object') onMessage(msg as Record<string, unknown>);
      } catch {
        // Ignore anything that isn't one of our messages.
      }
    });
    ch.addEventListener('close', () => finish({ kind: 'closed' }));
  };

  const addCandidate = (c: RtcCandidate) => {
    if (remoteSet) pc.addIceCandidate(c).catch(() => {});
    else pendingCandidates.push(c);
  };
  const remoteReady = async (d: RtcDescription) => {
    await pc.setRemoteDescription(d);
    remoteSet = true;
    for (const c of pendingCandidates.splice(0)) pc.addIceCandidate(c).catch(() => {});
  };

  pc.addEventListener('icecandidate', (e) => {
    if (e.candidate && peerId) {
      const c = e.candidate.toJSON ? e.candidate.toJSON() : e.candidate;
      signal({ type: 'CANDIDATE', dst: peerId, payload: { candidate: { candidate: c.candidate, sdpMid: c.sdpMid, sdpMLineIndex: c.sdpMLineIndex } } });
    }
  });
  pc.addEventListener('connectionstatechange', () => {
    if (pc.connectionState === 'failed') fail('failed');
    if (pc.connectionState === 'disconnected' && opened) finish({ kind: 'closed' });
  });
  if (role === 'host') pc.addEventListener('datachannel', (e) => attachChannel(e.channel));

  ws.onerror = () => {
    if (!opened) fail('server');
  };
  ws.onmessage = async (event) => {
    let msg: Signal;
    try {
      msg = JSON.parse(String(event.data));
    } catch {
      return;
    }
    try {
      switch (msg.type) {
        case 'OPEN':
          if (role === 'host') {
            onState({ kind: 'waiting' });
          } else {
            attachChannel(pc.createDataChannel('battle'));
            const offer = await pc.createOffer();
            await pc.setLocalDescription(offer);
            signal({ type: 'OFFER', dst: hostId, payload: { sdp: { type: offer.type, sdp: offer.sdp } } });
          }
          break;
        case 'ID-TAKEN':
          fail(role === 'host' ? 'code-taken' : 'server');
          break;
        case 'ERROR':
          fail('server');
          break;
        case 'OFFER':
          // Only the first friend to join is accepted.
          if (role !== 'host' || peerId || !msg.src || !msg.payload?.sdp) break;
          peerId = msg.src;
          onState({ kind: 'connecting' });
          await remoteReady(msg.payload.sdp);
          {
            const answer = await pc.createAnswer();
            await pc.setLocalDescription(answer);
            signal({ type: 'ANSWER', dst: peerId, payload: { sdp: { type: answer.type, sdp: answer.sdp } } });
          }
          break;
        case 'ANSWER':
          if (role === 'guest' && msg.src === hostId && msg.payload?.sdp) await remoteReady(msg.payload.sdp);
          break;
        case 'CANDIDATE':
          if (msg.src === peerId && msg.payload?.candidate) addCandidate(msg.payload.candidate);
          break;
        case 'EXPIRE':
          // The server couldn't deliver our offer: nobody is hosting that code.
          if (role === 'guest' && !opened) fail('no-host');
          break;
        case 'LEAVE':
          if (msg.src === peerId && !opened) fail(role === 'guest' ? 'no-host' : 'failed');
          break;
      }
    } catch {
      fail('failed');
    }
  };

  onState({ kind: 'connecting' });
  return {
    send: (msg) => {
      if (channel && channel.readyState === 'open') channel.send(JSON.stringify(msg));
    },
    close: () => {
      if (channel && channel.readyState === 'open') channel.send(JSON.stringify({ t: 'bye' }));
      finish({ kind: 'closed' });
    },
  };
}
