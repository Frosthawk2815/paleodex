// Phones: WebRTC from react-native-webrtc (needs a development build, not Expo Go).
import { RTCPeerConnection } from 'react-native-webrtc';

import type { RtcConfig, RtcConnection } from '@/lib/battle/rtc-types';

export const newConnection = (config: RtcConfig): RtcConnection => new RTCPeerConnection(config) as unknown as RtcConnection;
