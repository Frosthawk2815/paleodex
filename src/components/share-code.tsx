import * as Clipboard from 'expo-clipboard';
import { useState } from 'react';
import { Pressable, Share, Text } from 'react-native';

import { useProfileStyles } from '@/components/profile-ui';
import { useT } from '@/lib/i18n';

// Shares a battle code through the phone's own share menu (messages, WhatsApp, email...), which opens
// over the app, so a host doesn't have to leave it to send the code. Where sharing isn't available
// (some web browsers) the code is copied instead.
export function ShareCodeButton({ code, game }: { code: string; game: string }) {
  const st = useProfileStyles();
  const t = useT();
  const [copied, setCopied] = useState(false);

  const share = async () => {
    const message = t('Join my {game} game in Animal Almanac! The battle code is {code}.', { game, code });
    try {
      await Share.share({ message });
    } catch {
      await Clipboard.setStringAsync(message);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Pressable
      onPress={share}
      accessibilityRole="button"
      accessibilityHint={t('Opens your phone’s share menu, so you can send the code without leaving the app')}
      style={({ pressed }) => [st.button, { alignSelf: 'stretch' }, pressed && st.pressed]}>
      <Text style={st.buttonText}>{copied ? t('Copied!') : t('📤 Share code')}</Text>
    </Pressable>
  );
}
