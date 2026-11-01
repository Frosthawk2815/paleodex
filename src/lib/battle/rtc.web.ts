// Web: the browser's own WebRTC.
import type { RtcConfig, RtcConnection } from '@/lib/battle/rtc-types';

export const newConnection = (config: RtcConfig): RtcConnection => new RTCPeerConnection(config) as unknown as RtcConnection;
