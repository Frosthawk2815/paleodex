import { StyleSheet } from 'react-native';

// Styles shared by the information sections below the globe.
export const info = StyleSheet.create({
  wrap: {
    width: '100%',
    maxWidth: 720,
    alignSelf: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 48,
    gap: 10,
  },
  back: {
    alignSelf: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginBottom: 12,
  },
  pressed: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  backText: {
    color: '#9CC8FF',
    fontSize: 14,
    fontWeight: '600',
  },
  kicker: {
    color: '#FFD54A',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '800',
  },
  italic: {
    fontStyle: 'italic',
  },
  subtitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 17,
    fontWeight: '600',
  },
  meta: {
    color: 'rgba(255,255,255,0.65)',
    fontSize: 15,
  },
  heading: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    marginTop: 14,
  },
  body: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 16,
    lineHeight: 24,
    marginTop: 6,
  },
  note: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: 14,
    fontStyle: 'italic',
  },
  crumbs: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  crumb: {
    color: '#9CC8FF',
    fontSize: 14,
  },
  crumbSep: {
    color: 'rgba(255,255,255,0.35)',
    fontSize: 14,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: 'rgba(201,182,255,0.15)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(201,182,255,0.5)',
  },
  chipText: {
    color: '#D9CCFF',
    fontSize: 14,
    fontWeight: '600',
  },
  card: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: 'rgba(156,200,255,0.12)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(156,200,255,0.4)',
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  cardText: {
    flex: 1,
  },
  cardTitle: {
    color: '#9CC8FF',
    fontSize: 15,
    fontWeight: '600',
  },
  cardNote: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: 12,
    marginTop: 2,
  },
  list: {
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.15)',
    overflow: 'hidden',
  },
  row: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  rowTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  rowNote: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: 13,
    marginTop: 2,
  },
  badge: {
    color: '#FF9EC7',
    fontSize: 11,
    fontWeight: '700',
  },
  facts: {
    marginTop: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 14,
  },
  factRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255,255,255,0.1)',
    gap: 12,
  },
  factLabel: {
    width: 120,
    color: 'rgba(255,255,255,0.55)',
    fontSize: 14,
  },
  factValue: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});
