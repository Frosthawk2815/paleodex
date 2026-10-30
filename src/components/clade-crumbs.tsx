import { Fragment, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { useInfoStyles } from '@/components/info-styles';
import type { Clade } from '@/data/life';

// Well-known groups, best first: the collapsed path starts at the first of these it contains,
// e.g. birds start at Dinosaurs and whales at Mammals.
const FAMILIAR = [
  'mammalia', 'dinosauria', 'pterosauria', 'ichthyosauria', 'sauropterygia', 'mosasauridae', 'squamata', 'testudines',
  'synapsida', 'temnospondyli', 'actinopterygii', 'chondrichthyes', 'placodermi', 'dipnoi', 'actinistia', 'sarcopterygii',
  'reptilia', 'trilobita', 'eurypterida', 'radiodonta', 'cephalopoda', 'crustacea', 'hexapoda', 'chelicerata', 'myriapoda',
  'arthropoda', 'mollusca', 'echinodermata', 'cnidaria', 'porifera', 'lobopodia', 'vertebrata', 'chordata',
];
// How many of the closest groups stay visible when collapsed.
const TAIL = 2;

// A family-tree path that starts collapsed (a familiar big group, "⋯ N more", then the closest
// groups) and expands in place to show every level, with an arrow at the end to collapse it again.
export function CladeCrumbs({ path, onOpenClade }: { path: Clade[]; onOpenClade: (id: string) => void }) {
  const info = useInfoStyles();
  // Which path was expanded: a different species or group starts collapsed again.
  const key = path.map((c) => c.id).join('/');
  const [openKey, setOpenKey] = useState<string | null>(null);
  const open = openKey === key;

  const ranked = FAMILIAR.map((id) => path.findIndex((c) => c.id === id)).filter((i) => i >= 0);
  const anchor = ranked.length ? ranked[0] : 0;
  const tailStart = Math.max(anchor + 1, path.length - TAIL);
  const hidden = tailStart - anchor - 1;
  // Not worth collapsing if it would hide fewer than two groups.
  const collapsible = hidden >= 2;
  const shown = !collapsible || open ? path : [path[anchor], ...path.slice(tailStart)];

  return (
    <View style={info.crumbs}>
      {shown.map((c, i) => (
        <Fragment key={c.id}>
          {i > 0 && <Text style={info.crumbSep}> › </Text>}
          {collapsible && !open && i === 1 && (
            <>
              <Text
                onPress={() => setOpenKey(key)}
                style={[styles.more, info.title, styles.small]}
                accessibilityRole="button"
                accessibilityLabel={`Show ${hidden} more groups in the family tree`}>
                ⋯ {hidden} more
              </Text>
              <Text style={info.crumbSep}> › </Text>
            </>
          )}
          <Text onPress={() => onOpenClade(c.id)} style={info.crumb} accessibilityRole="button">
            {c.common}
          </Text>
        </Fragment>
      ))}
      {collapsible && open && (
        <Text onPress={() => setOpenKey(null)} style={[styles.less, info.title, styles.small]} accessibilityRole="button" accessibilityLabel="Collapse the family tree">
          {'  ▲'}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  more: { paddingVertical: 4 },
  less: { paddingVertical: 4, paddingHorizontal: 4 },
  small: { fontSize: 14, fontWeight: '700' },
});
