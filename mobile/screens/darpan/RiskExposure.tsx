import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Platform, StatusBar,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ArrowLeft, AlertTriangle, ChevronRight, Shield, TrendingUp } from 'lucide-react-native';
import { RISK_DRIVERS, SEVERITY_COLORS, DEFAULT_HOLDINGS } from './darpanData';

export default function RiskExposure() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const holdings = route.params?.holdings || DEFAULT_HOLDINGS;

  const overallRisk = 'Moderate-High';
  const riskScore = 62;

  const getRiskColor = (score: number) => {
    if (score >= 70) return '#dc2626';
    if (score >= 45) return '#d97706';
    return '#16a34a';
  };

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ArrowLeft color="#fff" size={22} />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Risk & Exposure</Text>
          <Text style={styles.headerSub}>Portfolio risk analysis</Text>
        </View>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={{ padding: 16, paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        {/* Overall risk score */}
        <View style={styles.riskScoreCard}>
          <View style={styles.riskScoreTop}>
            <View>
              <Text style={styles.riskScoreLabel}>Portfolio Risk Level</Text>
              <Text style={[styles.riskScoreText, { color: getRiskColor(riskScore) }]}>{overallRisk}</Text>
            </View>
            <View style={styles.riskGauge}>
              <Text style={[styles.riskGaugeNum, { color: getRiskColor(riskScore) }]}>{riskScore}</Text>
              <Text style={styles.riskGaugeSub}>/100</Text>
            </View>
          </View>

          {/* Risk meter bar */}
          <View style={styles.meterContainer}>
            <View style={[styles.meterGreen, { flex: 35 }]} />
            <View style={[styles.meterAmber, { flex: 35 }]} />
            <View style={[styles.meterRed, { flex: 30 }]} />
            <View style={[styles.meterPointer, { left: `${riskScore}%` as any }]} />
          </View>
          <View style={styles.meterLabels}>
            <Text style={styles.meterLabel}>Low</Text>
            <Text style={styles.meterLabel}>Moderate</Text>
            <Text style={styles.meterLabel}>High</Text>
          </View>

          <Text style={styles.riskSub}>
            Your portfolio carries elevated risk primarily due to high direct equity concentration.
          </Text>
        </View>

        {/* Concentration alert */}
        <View style={styles.concentrationAlert}>
          <AlertTriangle color="#d97706" size={20} />
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={styles.alertTitle}>Concentration Alert</Text>
            <Text style={styles.alertDesc}>
              31% of your equity allocation is concentrated in one sector (IT & Banking). This creates correlated drawdown risk.
            </Text>
          </View>
        </View>

        {/* Risk Drivers */}
        <Text style={styles.sectionTitle}>Risk Drivers</Text>
        {RISK_DRIVERS.map((driver, i) => {
          const sc = SEVERITY_COLORS[driver.severity];
          return (
            <TouchableOpacity
              key={i}
              style={styles.driverCard}
              onPress={() => navigation.navigate('RiskDetail', { driverIndex: i })}
              activeOpacity={0.8}
            >
              <View style={styles.driverTop}>
                <View style={styles.driverLeft}>
                  <Text style={styles.driverLabel}>{driver.label}</Text>
                  <Text style={styles.driverDesc} numberOfLines={2}>{driver.description}</Text>
                </View>
                <View style={[styles.severityBadge, { backgroundColor: sc.bg, borderColor: sc.border, borderWidth: 1 }]}>
                  <Text style={[styles.severityText, { color: sc.text }]}>{driver.severity}</Text>
                </View>
              </View>

              {/* Progress bar */}
              <View style={styles.driverBarBg}>
                <View style={[styles.driverBarFill, {
                  width: `${Math.min(driver.value, 100)}%`,
                  backgroundColor: sc.badge,
                }]} />
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 }}>
                <Text style={[styles.driverVal, { color: sc.text }]}>{driver.value}%</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
                  <Text style={styles.drillText}>Why? →</Text>
                  <ChevronRight color="#94a3b8" size={13} />
                </View>
              </View>
            </TouchableOpacity>
          );
        })}

        {/* What this means */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>What This Means For You</Text>
          {[
            { icon: '📉', text: 'A 10% equity market correction could reduce your portfolio by ~4.8%.' },
            { icon: '🔄', text: 'Sector concentration in IT & Banking means correlated drops during sector downturns.' },
            { icon: '💡', text: 'Adding REITs, InvITs or Bonds could reduce portfolio volatility by ~14%.' },
          ].map((pt, i) => (
            <View key={i} style={styles.impactRow}>
              <Text style={styles.impactEmoji}>{pt.icon}</Text>
              <Text style={styles.impactText}>{pt.text}</Text>
            </View>
          ))}
        </View>

        {/* CTAs */}
        <TouchableOpacity
          style={styles.ctaPrimary}
          onPress={() => navigation.navigate('DiversificationOpportunity')}
        >
          <TrendingUp color="#fff" size={16} />
          <Text style={styles.ctaPrimaryText}>Explore Diversification Opportunities</Text>
          <ChevronRight color="#fff" size={16} style={{ marginLeft: 'auto' }} />
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
  headerTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  headerSub: { color: '#bfdbfe', fontSize: 12 },
  scroll: { flex: 1 },

  riskScoreCard: {
    backgroundColor: '#fff', borderRadius: 20, padding: 20, marginBottom: 14,
    borderWidth: 1, borderColor: 'rgba(27,58,107,0.08)',
    shadowColor: '#1b3a6b', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.06, shadowRadius: 12, elevation: 3,
  },
  riskScoreTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  riskScoreLabel: { color: '#64748b', fontSize: 12, fontWeight: '600' },
  riskScoreText: { fontSize: 24, fontWeight: 'bold', marginTop: 3 },
  riskGauge: { flexDirection: 'row', alignItems: 'baseline' },
  riskGaugeNum: { fontSize: 38, fontWeight: 'bold' },
  riskGaugeSub: { color: '#94a3b8', fontSize: 16, marginLeft: 2 },
  meterContainer: { flexDirection: 'row', height: 10, borderRadius: 6, overflow: 'hidden', marginBottom: 4, position: 'relative' },
  meterGreen: { backgroundColor: '#16a34a' },
  meterAmber: { backgroundColor: '#d97706' },
  meterRed: { backgroundColor: '#dc2626' },
  meterPointer: { position: 'absolute', top: -3, width: 16, height: 16, borderRadius: 8, backgroundColor: '#fff', borderWidth: 3, borderColor: '#1b3a6b', marginLeft: -8 },
  meterLabels: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  meterLabel: { color: '#94a3b8', fontSize: 10, fontWeight: '500' },
  riskSub: { color: '#64748b', fontSize: 13, lineHeight: 20 },

  concentrationAlert: {
    flexDirection: 'row', alignItems: 'flex-start',
    backgroundColor: '#fffbeb', borderColor: '#fde68a', borderWidth: 1.5,
    borderRadius: 14, padding: 14, marginBottom: 14,
  },
  alertTitle: { color: '#92400e', fontSize: 14, fontWeight: 'bold', marginBottom: 4 },
  alertDesc: { color: '#92400e', fontSize: 12, lineHeight: 18 },

  sectionTitle: { color: '#1e293b', fontSize: 17, fontWeight: 'bold', marginBottom: 10 },

  driverCard: {
    backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 10,
    borderWidth: 1, borderColor: 'rgba(27,58,107,0.08)',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
  },
  driverTop: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 10, gap: 10 },
  driverLeft: { flex: 1 },
  driverLabel: { color: '#1e293b', fontSize: 14, fontWeight: 'bold', marginBottom: 3 },
  driverDesc: { color: '#64748b', fontSize: 12, lineHeight: 18 },
  severityBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, minWidth: 64, alignItems: 'center' },
  severityText: { fontSize: 11, fontWeight: 'bold' },
  driverBarBg: { height: 7, backgroundColor: '#f1f5f9', borderRadius: 4, overflow: 'hidden' },
  driverBarFill: { height: '100%', borderRadius: 4 },
  driverVal: { fontSize: 12, fontWeight: 'bold' },
  drillText: { color: '#94a3b8', fontSize: 12 },

  card: {
    backgroundColor: '#fff', borderRadius: 18, padding: 16, marginBottom: 14,
    borderWidth: 1, borderColor: 'rgba(27,58,107,0.08)',
    shadowColor: '#1b3a6b', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2,
  },
  cardTitle: { color: '#1e293b', fontSize: 15, fontWeight: 'bold', marginBottom: 12 },
  impactRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 10, gap: 10 },
  impactEmoji: { fontSize: 20 },
  impactText: { color: '#475569', fontSize: 13, lineHeight: 20, flex: 1 },

  ctaPrimary: {
    backgroundColor: '#1b3a6b', borderRadius: 14, paddingVertical: 16,
    paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', gap: 10,
  },
  ctaPrimaryText: { color: '#fff', fontSize: 14, fontWeight: '700', flex: 1 },
});
