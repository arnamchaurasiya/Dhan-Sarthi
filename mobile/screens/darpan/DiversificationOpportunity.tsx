import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Platform, StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft, ChevronRight, BookOpen, Compass } from 'lucide-react-native';

const ALTERNATIVES = [
  {
    id: 'reit',
    name: 'REITs',
    fullName: 'Real Estate Investment Trusts',
    emoji: '🏢',
    color: '#f97316',
    bg: '#fff7ed',
    border: '#fed7aa',
    tagline: 'Earn regular income from real estate',
    description: 'REITs allow you to invest in income-generating real estate without directly owning property. They are traded on stock exchanges and distribute 90% of rental income as dividends.',
    benefits: ['Regular quarterly distributions', 'Lower entry point than physical real estate', 'Regulated by SEBI', 'High liquidity vs. direct real estate'],
    riskLevel: 'Moderate',
    minInvestment: '₹1 unit (~₹130)',
    currentYield: '6-8% per year',
    gyaanTopic: 'REITs',
  },
  {
    id: 'invit',
    name: 'InvITs',
    fullName: 'Infrastructure Investment Trusts',
    emoji: '🛣️',
    color: '#8b5cf6',
    bg: '#f5f3ff',
    border: '#ddd6fe',
    tagline: 'Invest in roads, power, and pipelines',
    description: 'InvITs let retail investors participate in India\'s infrastructure growth — toll roads, power transmission lines, and gas pipelines — with regular income distributions.',
    benefits: ['Infrastructure-backed stable income', 'Long-term concession agreements', 'Inflation-linked returns in some cases', 'SEBI-regulated and transparent'],
    riskLevel: 'Moderate',
    minInvestment: '₹100 (SGB-equivalent units)',
    currentYield: '7-10% per year',
    gyaanTopic: 'InvITs',
  },
  {
    id: 'bonds',
    name: 'Bonds',
    fullName: 'Corporate & Government Bonds',
    emoji: '📄',
    color: '#14b8a6',
    bg: '#f0fdfa',
    border: '#99f6e4',
    tagline: 'Fixed income with predictable returns',
    description: 'Bonds are debt instruments that pay a fixed interest rate over a specific period. They provide predictable income and reduce portfolio volatility compared to pure equity.',
    benefits: ['Fixed, predictable income', 'Lower correlation with equity markets', 'Capital preservation', 'Range from government (safest) to corporate'],
    riskLevel: 'Low to Moderate',
    minInvestment: '₹1,000 (govt bonds) to ₹10,000+',
    currentYield: '7-12% depending on rating',
    gyaanTopic: 'Bonds',
  },
];

export default function DiversificationOpportunity() {
  const navigation = useNavigation<any>();
  const [expanded, setExpanded] = useState<string>('reit');

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ArrowLeft color="#fff" size={22} />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Diversification</Text>
          <Text style={styles.headerSub}>Explore alternate asset classes</Text>
        </View>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={{ padding: 16, paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
        {/* Context card */}
        <View style={styles.contextCard}>
          <Text style={styles.contextTitle}>Your Current Portfolio</Text>
          <Text style={styles.contextDesc}>
            Your portfolio has <Text style={styles.highlight}>48.2% direct equity exposure</Text>, which is above the recommended range for a balanced portfolio.
          </Text>
          <Text style={styles.contextDesc2}>
            You may want to understand how other asset classes could help diversify your portfolio and potentially reduce volatility.
          </Text>
          <View style={styles.currentBar}>
            <View style={[styles.currentSegment, { flex: 48, backgroundColor: '#1b3a6b' }]} />
            <View style={[styles.currentSegment, { flex: 25, backgroundColor: '#2563eb' }]} />
            <View style={[styles.currentSegment, { flex: 10, backgroundColor: '#14b8a6' }]} />
            <View style={[styles.currentSegment, { flex: 7, backgroundColor: '#eab308' }]} />
            <View style={[styles.currentSegment, { flex: 10, backgroundColor: '#e2e8f0' }]} />
          </View>
          <View style={styles.currentLegend}>
            {[
              { label: 'Equity 48%', color: '#1b3a6b' },
              { label: 'MF 25%', color: '#2563eb' },
              { label: 'Bonds 10%', color: '#14b8a6' },
              { label: 'REIT 3%', color: '#f97316' },
              { label: 'Other 14%', color: '#e2e8f0' },
            ].map((l, i) => (
              <View key={i} style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: l.color }]} />
                <Text style={styles.legendText}>{l.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Important disclaimer */}
        <View style={styles.disclaimer}>
          <Text style={styles.disclaimerText}>
            ℹ️ This section is for <Text style={{ fontWeight: 'bold' }}>educational purposes only</Text>. We are showing you what these asset classes are — not recommending you invest in them. Always consult a SEBI-registered advisor.
          </Text>
        </View>

        {/* Alternatives */}
        <Text style={styles.sectionTitle}>Asset Classes to Explore</Text>
        {ALTERNATIVES.map(alt => {
          const isExp = expanded === alt.id;
          return (
            <View key={alt.id} style={[styles.altCard, { borderLeftColor: alt.color, borderLeftWidth: 4 }]}>
              <TouchableOpacity
                style={styles.altHeader}
                onPress={() => setExpanded(isExp ? '' : alt.id)}
                activeOpacity={0.8}
              >
                <Text style={styles.altEmoji}>{alt.emoji}</Text>
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <Text style={styles.altName}>{alt.name}</Text>
                    <View style={[styles.riskBadge, { backgroundColor: alt.bg, borderColor: alt.border, borderWidth: 1 }]}>
                      <Text style={[styles.riskBadgeText, { color: alt.color }]}>Risk: {alt.riskLevel}</Text>
                    </View>
                  </View>
                  <Text style={styles.altFullName}>{alt.fullName}</Text>
                  <Text style={styles.altTagline}>{alt.tagline}</Text>
                </View>
                <ChevronRight color="#94a3b8" size={16} style={{ transform: [{ rotate: isExp ? '90deg' : '0deg' }] }} />
              </TouchableOpacity>

              {isExp && (
                <View style={styles.altExpanded}>
                  <Text style={styles.altDesc}>{alt.description}</Text>

                  <View style={styles.altMeta}>
                    <View style={styles.altMetaItem}>
                      <Text style={styles.altMetaLabel}>Min. Investment</Text>
                      <Text style={styles.altMetaVal}>{alt.minInvestment}</Text>
                    </View>
                    <View style={styles.altMetaItem}>
                      <Text style={styles.altMetaLabel}>Typical Yield</Text>
                      <Text style={[styles.altMetaVal, { color: '#16a34a' }]}>{alt.currentYield}</Text>
                    </View>
                  </View>

                  <Text style={styles.benefitsTitle}>Key Benefits</Text>
                  {alt.benefits.map((b, i) => (
                    <View key={i} style={styles.benefitRow}>
                      <Text style={[styles.benefitBullet, { color: alt.color }]}>✓</Text>
                      <Text style={styles.benefitText}>{b}</Text>
                    </View>
                  ))}

                  <TouchableOpacity
                    style={[styles.gyaanBtn, { backgroundColor: alt.bg, borderColor: alt.border, borderWidth: 1 }]}
                    onPress={() => navigation.navigate('Gyaan')}
                  >
                    <BookOpen color={alt.color} size={15} />
                    <Text style={[styles.gyaanBtnText, { color: alt.color }]}>
                      Learn about {alt.name} in Dhan Gyaan →
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.margBtn, { backgroundColor: alt.color }]}
                    onPress={() => navigation.navigate('Marg')}
                  >
                    <Compass color="#fff" size={15} />
                    <Text style={styles.margBtnText}>
                      Assess {alt.name} Suitability in Dhan Marg →
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          );
        })}

        {/* Final note */}
        <View style={styles.finalNote}>
          <Text style={styles.finalNoteTitle}>The Dhan Sarthi Approach</Text>
          <Text style={styles.finalNoteText}>
            Dhan Sarthi follows the investor-first principle. We help you <Text style={{ fontWeight: 'bold' }}>understand</Text> before you invest.
            The goal is informed, not impulsive, investing.
          </Text>
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

  contextCard: {
    backgroundColor: '#fff', borderRadius: 18, padding: 16, marginBottom: 12,
    borderWidth: 1, borderColor: 'rgba(27,58,107,0.08)',
    shadowColor: '#1b3a6b', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2,
  },
  contextTitle: { color: '#1e293b', fontSize: 15, fontWeight: 'bold', marginBottom: 8 },
  contextDesc: { color: '#475569', fontSize: 13, lineHeight: 21, marginBottom: 6 },
  contextDesc2: { color: '#64748b', fontSize: 13, lineHeight: 21, marginBottom: 12 },
  highlight: { color: '#dc2626', fontWeight: 'bold' },
  currentBar: { flexDirection: 'row', height: 12, borderRadius: 6, overflow: 'hidden', marginBottom: 10 },
  currentSegment: { height: '100%' },
  currentLegend: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendText: { color: '#64748b', fontSize: 11 },

  disclaimer: {
    backgroundColor: '#eff6ff', borderColor: '#bfdbfe', borderWidth: 1,
    borderRadius: 12, padding: 12, marginBottom: 16,
  },
  disclaimerText: { color: '#1d4ed8', fontSize: 12, lineHeight: 20 },

  sectionTitle: { color: '#1e293b', fontSize: 17, fontWeight: 'bold', marginBottom: 10 },

  altCard: {
    backgroundColor: '#fff', borderRadius: 16, marginBottom: 12,
    borderWidth: 1, borderColor: 'rgba(27,58,107,0.08)',
    overflow: 'hidden',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
  },
  altHeader: { flexDirection: 'row', alignItems: 'flex-start', padding: 14, gap: 10 },
  altEmoji: { fontSize: 26, marginTop: 2 },
  altName: { color: '#0f172a', fontSize: 17, fontWeight: 'bold' },
  altFullName: { color: '#64748b', fontSize: 11, marginTop: 1 },
  altTagline: { color: '#475569', fontSize: 12, marginTop: 4, fontStyle: 'italic' },
  riskBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  riskBadgeText: { fontSize: 10, fontWeight: '700' },

  altExpanded: { paddingHorizontal: 14, paddingBottom: 14, borderTopWidth: 1, borderTopColor: '#f1f5f9' },
  altDesc: { color: '#475569', fontSize: 13, lineHeight: 21, marginTop: 12, marginBottom: 12 },
  altMeta: { flexDirection: 'row', gap: 12, marginBottom: 14 },
  altMetaItem: { flex: 1, backgroundColor: '#f8fafc', borderRadius: 10, padding: 11 },
  altMetaLabel: { color: '#94a3b8', fontSize: 11, fontWeight: '500' },
  altMetaVal: { color: '#1e293b', fontSize: 14, fontWeight: 'bold', marginTop: 3 },
  benefitsTitle: { color: '#1e293b', fontSize: 13, fontWeight: 'bold', marginBottom: 8 },
  benefitRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, marginBottom: 6 },
  benefitBullet: { fontSize: 14, fontWeight: 'bold', marginTop: 1 },
  benefitText: { color: '#475569', fontSize: 13, flex: 1, lineHeight: 20 },
  gyaanBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 12, borderRadius: 12, marginTop: 14, marginBottom: 8 },
  gyaanBtnText: { fontSize: 13, fontWeight: '700' },
  margBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 12, borderRadius: 12 },
  margBtnText: { color: '#fff', fontSize: 13, fontWeight: '700' },

  finalNote: {
    backgroundColor: '#1b3a6b', borderRadius: 16, padding: 18, marginTop: 4,
  },
  finalNoteTitle: { color: '#fff', fontSize: 15, fontWeight: 'bold', marginBottom: 8 },
  finalNoteText: { color: '#bfdbfe', fontSize: 13, lineHeight: 22 },
});
