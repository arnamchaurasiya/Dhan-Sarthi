import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Platform, StatusBar,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ArrowLeft, BookOpen, ChevronRight } from 'lucide-react-native';
import { RISK_DRIVERS, SEVERITY_COLORS } from './darpanData';

export default function RiskDetail() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const driverIndex = route.params?.driverIndex ?? 0;
  const driver = RISK_DRIVERS[driverIndex];
  const sc = SEVERITY_COLORS[driver.severity];

  const totalHoldings = driver.holdings.reduce((a, h) => a + h.pct, 0);

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ArrowLeft color="#fff" size={22} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle} numberOfLines={2}>{driver.label}</Text>
          <Text style={styles.headerSub}>Risk Detail Analysis</Text>
        </View>
        <View style={[styles.severityBadge, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
          <Text style={styles.severityText}>{driver.severity}</Text>
        </View>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={{ padding: 16, paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
        {/* Why is this a concern? */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Why Is This a Concern?</Text>
          <View style={[styles.alertBox, { backgroundColor: sc.bg, borderColor: sc.border, borderWidth: 1 }]}>
            <Text style={[styles.alertText, { color: sc.text }]}>{driver.description}</Text>
          </View>

          {/* Risk score gauge */}
          <View style={{ marginTop: 16 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
              <Text style={styles.statLabel}>Exposure Level</Text>
              <Text style={[styles.statValBold, { color: sc.badge }]}>{driver.value}%</Text>
            </View>
            <View style={styles.barBg}>
              <View style={[styles.barFill, { width: `${Math.min(driver.value, 100)}%`, backgroundColor: sc.badge }]} />
            </View>
          </View>
        </View>

        {/* Contributing holdings */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Contributing Holdings</Text>
          <Text style={styles.cardSub}>These holdings are the primary contributors to this risk factor</Text>
          {driver.holdings.map((h, i) => (
            <View key={i} style={styles.holdingRow}>
              <View style={styles.holdingRowLeft}>
                <View style={styles.holdingAvatar}>
                  <Text style={styles.holdingAvatarText}>{h.name.slice(0, 2).toUpperCase()}</Text>
                </View>
                <Text style={styles.holdingName}>{h.name}</Text>
              </View>
              <View style={styles.holdingRowRight}>
                <View style={styles.holdingBarBg}>
                  <View style={[styles.holdingBarFill, {
                    width: `${h.pct}%`,
                    backgroundColor: sc.badge,
                  }]} />
                </View>
                <Text style={[styles.holdingPct, { color: sc.badge }]}>{h.pct}%</Text>
              </View>
            </View>
          ))}

          {/* Divider + Total */}
          <View style={styles.divider} />
          <View style={[styles.holdingRow, { marginBottom: 0 }]}>
            <Text style={styles.totalLabel}>Total {driver.label}</Text>
            <Text style={[styles.totalPct, { color: sc.badge }]}>{driver.value}%</Text>
          </View>
        </View>

        {/* Concentration visualization */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Concentration Visualization</Text>
          <View style={styles.concBar}>
            {driver.holdings.map((h, i) => (
              <View
                key={i}
                style={[styles.concSegment, {
                  flex: h.pct,
                  backgroundColor: i === 0 ? sc.badge : `${sc.badge}88`,
                  borderRightWidth: i < driver.holdings.length - 1 ? 2 : 0,
                  borderRightColor: '#fff',
                }]}
              />
            ))}
            <View style={[styles.concSegment, { flex: 100 - totalHoldings, backgroundColor: '#f1f5f9' }]} />
          </View>
          <View style={styles.concLegend}>
            {driver.holdings.map((h, i) => (
              <View key={i} style={styles.concLegendItem}>
                <View style={[styles.concDot, { backgroundColor: i === 0 ? sc.badge : `${sc.badge}88` }]} />
                <Text style={styles.concLabel}>{h.name}: {h.pct}%</Text>
              </View>
            ))}
            <View style={styles.concLegendItem}>
              <View style={[styles.concDot, { backgroundColor: '#e2e8f0' }]} />
              <Text style={styles.concLabel}>Other: {100 - totalHoldings}%</Text>
            </View>
          </View>
        </View>

        {/* Potential impact */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Potential Impact</Text>
          {[
            `A 15% market correction in the ${driver.label.toLowerCase()} area could impact ₹${Math.round(driver.value * 7934)} of your portfolio.`,
            'Diversifying across additional asset classes can reduce this specific risk by 30-40%.',
            'SEBI guidelines recommend maintaining balanced exposure across multiple asset classes.',
          ].map((pt, i) => (
            <View key={i} style={styles.impactRow}>
              <Text style={styles.impactBullet}>{i + 1}</Text>
              <Text style={styles.impactText}>{pt}</Text>
            </View>
          ))}
        </View>

        {/* CTAs */}
        <TouchableOpacity
          style={styles.ctaGyaan}
          onPress={() => navigation.navigate('Gyaan')}
          activeOpacity={0.85}
        >
          <BookOpen color="#1b3a6b" size={16} />
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={styles.ctaTitle}>Learn About Diversification</Text>
            <Text style={styles.ctaSub}>Understand how to reduce this risk via Dhan Gyaan</Text>
          </View>
          <ChevronRight color="#1b3a6b" size={16} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.ctaDiversify}
          onPress={() => navigation.navigate('DiversificationOpportunity')}
          activeOpacity={0.85}
        >
          <Text style={styles.ctaDiversifyText}>Explore Diversification Opportunities</Text>
          <ChevronRight color="#fff" size={16} />
        </TouchableOpacity>
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
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  headerSub: { color: '#bfdbfe', fontSize: 12 },
  severityBadge: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8 },
  severityText: { color: '#fff', fontSize: 11, fontWeight: 'bold' },

  scroll: { flex: 1 },

  card: {
    backgroundColor: '#fff', borderRadius: 18, padding: 16, marginBottom: 14,
    borderWidth: 1, borderColor: 'rgba(27,58,107,0.08)',
    shadowColor: '#1b3a6b', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2,
  },
  cardTitle: { color: '#1e293b', fontSize: 15, fontWeight: 'bold', marginBottom: 10 },
  cardSub: { color: '#94a3b8', fontSize: 12, marginBottom: 12 },

  alertBox: { padding: 14, borderRadius: 12, marginBottom: 4 },
  alertText: { fontSize: 14, lineHeight: 22, fontWeight: '500' },
  statLabel: { color: '#64748b', fontSize: 13, fontWeight: '500' },
  statValBold: { fontSize: 14, fontWeight: 'bold' },
  barBg: { height: 8, backgroundColor: '#f1f5f9', borderRadius: 4, overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 4 },

  holdingRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 10 },
  holdingRowLeft: { flexDirection: 'row', alignItems: 'center', flex: 1, gap: 10 },
  holdingAvatar: { width: 34, height: 34, borderRadius: 10, backgroundColor: '#ebf3fa', alignItems: 'center', justifyContent: 'center' },
  holdingAvatarText: { color: '#1b3a6b', fontSize: 12, fontWeight: 'bold' },
  holdingName: { color: '#1e293b', fontSize: 13, fontWeight: '600' },
  holdingRowRight: { flexDirection: 'row', alignItems: 'center', gap: 8, width: 130 },
  holdingBarBg: { flex: 1, height: 6, backgroundColor: '#f1f5f9', borderRadius: 3, overflow: 'hidden' },
  holdingBarFill: { height: '100%', borderRadius: 3 },
  holdingPct: { fontSize: 12, fontWeight: 'bold', width: 35, textAlign: 'right' },

  divider: { height: 1, backgroundColor: '#f1f5f9', marginVertical: 10 },
  totalLabel: { flex: 1, color: '#1e293b', fontSize: 14, fontWeight: 'bold' },
  totalPct: { fontSize: 16, fontWeight: 'bold' },

  concBar: { flexDirection: 'row', height: 24, borderRadius: 8, overflow: 'hidden', marginBottom: 12 },
  concSegment: { height: '100%' },
  concLegend: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  concLegendItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  concDot: { width: 10, height: 10, borderRadius: 5 },
  concLabel: { color: '#64748b', fontSize: 11, fontWeight: '500' },

  impactRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 10 },
  impactBullet: { color: '#1b3a6b', fontSize: 13, fontWeight: 'bold', width: 20, marginTop: 1 },
  impactText: { color: '#475569', fontSize: 13, lineHeight: 20, flex: 1 },

  ctaGyaan: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#ebf3fa',
    borderColor: '#bfdbfe', borderWidth: 1, borderRadius: 14,
    paddingVertical: 15, paddingHorizontal: 16, marginBottom: 10,
  },
  ctaTitle: { color: '#1b3a6b', fontSize: 14, fontWeight: '700' },
  ctaSub: { color: '#64748b', fontSize: 12, marginTop: 2 },
  ctaDiversify: {
    backgroundColor: '#1b3a6b', borderRadius: 14, paddingVertical: 16,
    paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  },
  ctaDiversifyText: { color: '#fff', fontSize: 14, fontWeight: '700' },
});
