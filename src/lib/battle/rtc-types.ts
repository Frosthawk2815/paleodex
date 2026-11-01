// The small part of the WebRTC API the Bone War game uses, shared by the browser and
// react-native-webrtc so the connection code works on both.

export type RtcDescription = { type: string; sdp?: string | null };
export type RtcCandidate = { candidate?: string; sdpMid?: string | null; sdpMLineIndex?: number | null };

export interface RtcChannel {
  readyState: string;
  send(data: string): void;
  close(): void;
  addEventListener(type: 'open' | 'close' | 'error', fn: () => void): void;
  addEventListener(type: 'message', fn: (e: { data: unknown }) => void): void;
}

export interface RtcConnection {
  connectionState: string;
  createDataChannel(label: string): RtcChannel;
  createOffer(): Promise<RtcDescription>;
  createAnswer(): Promise<RtcDescription>;
  setLocalDescription(d: RtcDescription): Promise<void>;
  setRemoteDescription(d: RtcDescription): Promise<void>;
  addIceCandidate(c: RtcCandidate): Promise<void>;
  close(): void;
  addEventListener(type: 'icecandidate', fn: (e: { candidate: (RtcCandidate & { toJSON?: () => RtcCandidate }) | null }) => void): void;
  addEventListener(type: 'datachannel', fn: (e: { channel: RtcChannel }) => void): void;
  addEventListener(type: 'connectionstatechange', fn: () => void): void;
}

export type RtcConfig = { iceServers: { urls: string | string[] }[] };
