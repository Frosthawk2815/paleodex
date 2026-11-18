import { usePreventRemove } from 'expo-router';
import { Alert, Platform } from 'react-native';

import { useT } from '@/lib/i18n';

// While a game is in progress, the phone's back key (or back gesture) asks before leaving, so a
// stray press near the bottom of the screen doesn't quit the game by accident.
// forfeit: leaving counts as giving up (a game against someone); otherwise the round is just lost.
export function useLeaveGuard(active: boolean, forfeit = false) {
  const t = useT();
  usePreventRemove(active, ({ repeat }) => {
    const title = t('Leave the game?');
    const body = forfeit ? t('Leaving counts as a forfeit.') : t('Your progress in this round will be lost.');
    if (Platform.OS === 'web') {
      if (window.confirm(`${title}\n\n${body}`)) repeat();
      return;
    }
    Alert.alert(title, body, [
      { text: t('Keep playing'), style: 'cancel' },
      { text: t('Leave'), style: 'destructive', onPress: repeat },
    ]);
  });
}
