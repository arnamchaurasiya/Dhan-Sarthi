import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Platform, StatusBar,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ArrowLeft, ChevronRight, AlertTriangle, BookOpen, BarChart2, Shield, Compass } from 'lucide-react-native';
import { DEFAULT_HOLDINGS } from './darpanData';

const ACTIONS = [
  {
    id: 'concentration',
    priority: 'HIGH',
    emoji: '⚠️',
    title: 'Review High Equity Concentration',
    subtitle: 'Your equity exposure at 48.2% is above recommended levels',
    cta: 'Understand Diversification',
    target: 'gyaan',
    color: '#dc2626',
    bg: '#fef2f2',
    border: '#fecaca',
    icon: AlertTriangle,
  },
  {
    id: 'reit_learn',
    priority: 'MEDIUM',
    emoji: '📚',
    title: 'Learn About REITs',
    subtitle: 'REITs provide real estate income with ~3 min reading time',
    cta: 'Open in Dhan Gyaan',
    target: 'gyaan',
    color: '#2563eb',
    bg: '#eff6ff',
    border: '#bfdbfe',
    icon: BookOpen,
  },
  {
    id: 'transactions',
    priority: 'MEDIUM',
    emoji: '📊',
    title: 'Review Recent Transactions',
    subtitle: '72% of recent purchases increased equity exposure',
    cta: 'View Transaction Feed',
    target: 'Transactions',
    color: '#8b5cf6',
    bg: '#f5f3ff',
    border: '#ddd6fe',
    icon: BarChart2,
  },
  {
    id: 'accounts',
    priority: 'LOW',
    emoji: '🔐',
    title: 'Review Connected Accounts',
    subtitle: '1 account last synced yesterday — verify it\'s up to date',
    cta: 'Manage Accounts',
    target: 'ConnectedAccounts',
    color: '#16a34a',
    bg: '#f0fdf4',
    border: '#bbf7d0',
    icon: Shield,
  },
  {
    id: 'marg',
    priority: 'INFO',
    emoji: '🧭',
    title: 'Evaluate Alternative Assets',
    subtitle: 'Use Dhan Marg to check which assets fit your risk profile',
    cta: 'Go to Dhan Marg',
    target: 'marg',
    color: '#d97706',
    bg: '#fffbeb',
    border: '#fde68a',
    icon: Compass,
  },
  {
    id: 'health',
    priority: 'INFO',
    emoji: '❤️',
    title: 'Review Portfolio Health Score',
    subtitle: 'Your score is 66/100 — see what\'s dragging it down',
    cta: 'View Health Analysis',
    target: 'PortfolioHealth',
    color: '#0ea5e9',
    bg: '#f0f9ff',
    border: '#bae6fd',
    icon: Shield,
  },
];

const PRIORITY_ORDER: Record<string, number> = { HIGH: 0, MEDIUM: 1, LOW: 2, INFO: 3 };
const PRIORITY_LABELS: Record<string, string> = {
  HIGH: '🔴 Critical',
  MEDIUM: '🟡 Important',
  LOW: '🟢 Routine',
  INFO: '🔵 Informational',
};

export default function ActionCenter() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const holdings = route.params?.holdings || DEFAULT_HOLDINGS;

  const sortedActions = [...ACTIONS].sort((a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]);

  const handleAction = (action: typeof ACTIONS[0]) => {
    if (action.target === 'gyaan') {
      navigation.navigate('Gyaan');
    } else if (action.target === 'marg') {
      navigation.navigate('Marg');
    } else if (action.target === 'Transactions') {
      navigation.navigate('Transactions', {});
    } else if (action.target === 'ConnectedAccounts') {
      navigation.navigate('ConnectedAccounts');
    } else if (action.target === 'PortfolioHealth') {
      navigation.navigate('PortfolioHealth');
    } else if (action.target === 'DiversificationOpportunity') {
      navigation.navigate('DiversificationOpportunity');
    }
  };

  // Group by priority
  const grouped: Record<string, typeof ACTIONS> = {};
  sortedActions.forEach(a => {
    if (!grouped[a.priority]) grouped[a.priority] = [];
    grouped[a.priority].push(a);
  });

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ArrowLeft color="#fff" size={22} />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Action Center</Text>
          <Text style={styles.headerSub}>{ACTIONS.length} items need your attention</Text>
        </View>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={{ padding: 16, paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
        {/* What is this */}
        <View style={styles.introBanner}>
          <Text style={styles.introTitle}>Your Portfolio To-Do List</Text>
          <Text style={styles.introText}>
            Dhan Darpan has identified these actions based on your portfolio analysis. These are not investment recommendations — they are educational and review actions.
          </Text>
        </View>

        {/* Actions by priority group */}
        {Object.entries(grouped).map(([priority, actions]) => (
          <View key={priority}>
            <Text style={styles.priorityHeader}>{PRIORITY_LABELS[priority]}</Text>
            {actions.map(action => {
              const Icon = action.icon;
              return (
                <TouchableOpacity
                  key={action.id}
                  style={[styles.actionCard, { borderLeftColor: action.color, borderLeftWidth: 4 }]}
                  onPress={() => handleAction(action)}
                  activeOpacity={0.8}
                >
                  <View style={styles.actionTop}>
                    <View style={[styles.actionIcon, { backgroundColor: action.bg }]}>
                      <Icon color={action.color} size={18} />
                    </View>
                    <View style={styles.actionContent}>
                      <Text style={styles.actionEmoji}>{action.emoji}</Text>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.actionTitle}>{action.title}</Text>
                        <Text style={styles.actionSubtitle}>{action.subtitle}</Text>
                      </View>
                    </View>
                    <ChevronRight color="#cbd5e1" size={16} />
                  </View>
                  <View style={[styles.actionCtaRow, { backgroundColor: action.bg, borderColor: action.border, borderWidth: 1 }]}>
                    <Text style={[styles.actionCtaText, { color: action.color }]}>{action.cta} →</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        ))}

        {/* The Darpan loop */}
        <View style={styles.loopCard}>
          <Text style={styles.loopTitle}>The Dhan Sarthi Loop</Text>
          {[
            { step: 'DARPAN', desc: 'Understand what you own', icon: '🔍' },
            { step: 'GYAAN', desc: 'Learn what options exist', icon: '📚' },
            { step: 'MARG', desc: 'Discover what fits you', icon: '🧭' },
            { step: 'INVEST', desc: 'Act with confidence', icon: '💼' },
            { step: 'DARPAN', desc: 'See your updated portfolio', icon: '🔄' },
          ].map((s, i) => (
            <View key={i} style={styles.loopRow}>
              <Text style={styles.loopEmoji}>{s.icon}</Text>
              <View style={styles.loopContent}>
                <Text style={styles.loopStep}>{s.step}</Text>
                <Text style={styles.loopDesc}>{s.desc}</Text>
              </View>
              {i < 4 && <View style={styles.loopArrow}><Text style={styles.loopArrowText}>↓</Text></View>}
            </View>
          ))}
        </View>

        {/* Quick links row */}
        <View style={styles.quickLinks}>
          <TouchableOpacity style={styles.quickLink} onPress={() => navigation.navigate('Gyaan')}>
            <BookOpen color="#1b3a6b" size={18} />
            <Text style={styles.quickLinkText}>Dhan Gyaan</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickLink} onPress={() => navigation.navigate('Marg')}>
            <Compass color="#1b3a6b" size={18} />
            <Text style={styles.quickLinkText}>Dhan Marg</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickLink} onPress={() => navigation.navigate('PortfolioInsights', { holdings })}>
            <BarChart2 color="#1b3a6b" size={18} />
            <Text style={styles.quickLinkText}>AI Insights</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#f4f7fb' },
  header: {
    backgroundColor: '#1b3a6b', flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 12 : 16,
    paddingBottom: 20, gap: 12,
  },
  backBtn: { width: 36, height: 36, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  headerSub: { color: '#bfdbfe', fontSize: 12 },
  scroll: { flex: 1 },

  introBanner: {
    backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 16,
    borderWidth: 1, borderColor: 'rgba(27,58,107,0.08)',
    shadowColor: '#1b3a6b', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2,
  },
  introTitle: { color: '#1e293b', fontSize: 15, fontWeight: 'bold', marginBottom: 6 },
  introText: { color: '#64748b', fontSize: 13, lineHeight: 21 },

  priorityHeader: { color: '#64748b', fontSize: 13, fontWeight: '700', marginBottom: 8, marginTop: 4, textTransform: 'uppercase', letterSpacing: 0.5 },

  actionCard: {
    backgroundColor: '#fff', borderRadius: 16, padding: 14, marginBottom: 10,
    borderWidth: 1, borderColor: 'rgba(27,58,107,0.07)',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.03, shadowRadius: 4, elevation: 1,
    overflow: 'hidden',
  },
  actionTop: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 10 },
  actionIcon: { width: 38, height: 38, borderRadius: 11, alignItems: 'center', justifyContent: 'center', marginRight: 10, flexShrink: 0 },
  actionContent: { flexDirection: 'row', alignItems: 'flex-start', flex: 1, gap: 8 },
  actionEmoji: { fontSize: 20, marginTop: 1 },
  actionTitle: { color: '#0f172a', fontSize: 14, fontWeight: 'bold', marginBottom: 2 },
  actionSubtitle: { color: '#64748b', fontSize: 12, lineHeight: 18 },
  actionCtaRow: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10 },
  actionCtaText: { fontSize: 13, fontWeight: '700' },

  loopCard: {
    backgroundColor: '#1b3a6b', borderRadius: 18, padding: 20, marginBottom: 14,
  },
  loopTitle: { color: '#fff', fontSize: 15, fontWeight: 'bold', marginBottom: 16 },
  loopRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 4, position: 'relative' },
  loopEmoji: { fontSize: 22, width: 34, textAlign: 'center' },
  loopContent: { flex: 1, paddingLeft: 10, paddingBottom: 16 },
  loopStep: { color: '#bfdbfe', fontSize: 11, fontWeight: '700', letterSpacing: 1 },
  loopDesc: { color: '#fff', fontSize: 14, fontWeight: '600', marginTop: 1 },
  loopArrow: { position: 'absolute', left: 14, bottom: -2 },
  loopArrowText: { color: 'rgba(191,219,254,0.5)', fontSize: 18 },

  quickLinks: { flexDirection: 'row', gap: 10 },
  quickLink: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#fff', borderColor: '#e2e8f0', borderWidth: 1,
    borderRadius: 14, paddingVertical: 14, gap: 8,
  },
  quickLinkText: { color: '#1b3a6b', fontSize: 13, fontWeight: '700' },
});
