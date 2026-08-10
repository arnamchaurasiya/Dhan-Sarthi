import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Dimensions, Platform, StatusBar,
} from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop, Circle, Rect, G, Line } from 'react-native-svg';
import { useNavigation, useRoute } from '@react-navigation/native';
import {
  ShieldCheck, TrendingUp, TrendingDown, CheckCircle2, AlertTriangle,
  PieChart, ArrowRight, Wallet, Activity, CreditCard, Brain,
  ChevronRight, RefreshCw, User, LogOut, X,
} from 'lucide-react-native';
import { Modal, Pressable } from 'react-native';

import {
  CHART_DATA_BY_TIMEFRAME, TIME_HORIZONS, getAssetBreakdown,
  DEFAULT_HOLDINGS, CONNECTED_ACCOUNTS,
} from './darpanData';

const { width: SW } = Dimensions.get('window');

export default function DarpanHome() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const holdings = route.params?.holdings || DEFAULT_HOLDINGS;
  const summary = route.params?.summary || {};

  const [selectedHorizon, setSelectedHorizon] = useState('1D');
  const [activePointIdx, setActivePointIdx] = useState(5);
  const [profileVisible, setProfileVisible] = useState(false);

  const timeframeInfo = CHART_DATA_BY_TIMEFRAME[selectedHorizon];
  const chartPoints = timeframeInfo.points;
  const chartDates = timeframeInfo.dates;
  const svgWidth = SW - 64;
  const svgHeight = 110;

  const minP = Math.min(...chartPoints) * 0.97;
  const maxP = Math.max(...chartPoints) * 1.03;
  const pointCoords = chartPoints.map((val, i) => ({
    x: (i / (chartPoints.length - 1)) * svgWidth,
    y: svgHeight - ((val - minP) / (maxP - minP)) * (svgHeight - 30) - 15,
    val, date: chartDates[i],
  }));

  let lineD = `M ${pointCoords[0].x} ${pointCoords[0].y}`;
  for (let i = 0; i < pointCoords.length - 1; i++) {
    const c = pointCoords[i], n = pointCoords[i + 1];
    const mx = (n.x - c.x) / 2;
    lineD += ` C ${c.x + mx} ${c.y}, ${c.x + mx} ${n.y}, ${n.x} ${n.y}`;
  }
  const fillD = `${lineD} L ${svgWidth} ${svgHeight} L 0 ${svgHeight} Z`;
  const active = pointCoords[activePointIdx] || pointCoords[pointCoords.length - 1];

  const handleTouch = (x: number) => {
    const ratio = Math.max(0, Math.min(svgWidth, x)) / svgWidth;
    setActivePointIdx(Math.round(ratio * (chartPoints.length - 1)));
  };

  const assetBreakdown = getAssetBreakdown(holdings);
  const totalValue = summary.totalValue || 793450;
  const totalInvested = summary.totalInvested || 650000;
  const totalReturns = summary.totalReturns || 143450;
  const returnPct = summary.returnPct || 22.1;
  const equityPct = assetBreakdown.find(a => a.key === 'Equity')?.percentage || 48.2;

  const quickActions = [
    { label: 'Holdings', icon: Wallet, color: '#1b3a6b', bg: '#ebf3fa', screen: 'Holdings', params: { holdings } },
    { label: 'Allocation', icon: PieChart, color: '#2563eb', bg: '#eff6ff', screen: 'AssetAllocation', params: { holdings } },
    { label: 'Risk', icon: AlertTriangle, color: '#d97706', bg: '#fffbeb', screen: 'RiskExposure', params: { holdings } },
    { label: 'Transactions', icon: Activity, color: '#8b5cf6', bg: '#f5f3ff', screen: 'Transactions', params: {} },
    { label: 'Accounts', icon: CreditCard, color: '#16a34a', bg: '#f0fdf4', screen: 'ConnectedAccounts', params: {} },
    { label: 'Insights', icon: Brain, color: '#0ea5e9', bg: '#f0f9ff', screen: 'PortfolioInsights', params: { holdings, summary } },
  ];

  const isPositive = !timeframeInfo.gain.startsWith('-');
  const GainIcon = isPositive ? TrendingUp : TrendingDown;
  const gainColor = isPositive ? '#16a34a' : '#dc2626';
  const gainBg = isPositive ? '#f0fdf4' : '#fef2f2';
  const gainBorder = isPositive ? '#bbf7d0' : '#fecaca';

  return (
    <ScrollView style={styles.root} showsVerticalScrollIndicator={false}>
      {/* ── HERO HEADER ── */}
      <View style={styles.hero}>
        <View style={styles.heroTop}>
          <View style={styles.heroBadgeRow}>
            <View style={styles.sebiPill}>
              <ShieldCheck color="#fff" size={11} />
              <Text style={styles.sebiPillText}>SEBI DPI</Text>
            </View>
            <Text style={styles.darpanLabel}> • Dhan Darpan</Text>
          </View>
          <TouchableOpacity style={styles.profileBtn} onPress={() => setProfileVisible(true)}>
            <View style={styles.avatarCircle}><User color="#1b3a6b" size={13} /></View>
            <Text style={styles.profileName}>Arnam</Text>
            <ChevronRight color="rgba(255,255,255,0.7)" size={12} />
          </TouchableOpacity>
        </View>
        <Text style={styles.heroTitle}>Portfolio Mirror</Text>
        <Text style={styles.heroSub}>Unified view across NSDL, CDSL & CAMS via AA</Text>
      </View>

      <View style={styles.content}>
        {/* ── TOTAL VALUE CARD ── */}
        <View style={styles.valueCard}>
          {/* Top Row: Label & AA Verified */}
          <View style={styles.valueTopRow}>
            <Text style={styles.valueLabelSm}>TOTAL PORTFOLIO VALUE</Text>
            <View style={styles.aaChip}>
              <CheckCircle2 color="#16a34a" size={12} />
              <Text style={styles.aaChipText}>AA Verified</Text>
            </View>
          </View>

          {/* Main Price & Horizon Change Pill */}
          <View style={styles.heroAmountRow}>
            <Text style={styles.valueBig}>₹{Math.round(totalValue).toLocaleString('en-IN')}</Text>
            <View style={[styles.gainBadge, { backgroundColor: gainBg, borderColor: gainBorder }]}>
              <GainIcon color={gainColor} size={12} />
              <Text style={[styles.gainText, { color: gainColor }]}>{timeframeInfo.gain} ({timeframeInfo.gainPct})</Text>
              <Text style={styles.gainPeriod}>in {selectedHorizon}</Text>
            </View>
          </View>

          {/* Invested & Total Returns Summary Box */}
          <View style={styles.metaCard}>
            <View style={styles.metaBox}>
              <Text style={styles.metaLabel}>Invested</Text>
              <Text style={styles.metaVal}>₹{Math.round(totalInvested).toLocaleString('en-IN')}</Text>
            </View>
            <View style={styles.metaDivider} />
            <View style={styles.metaBox}>
              <Text style={styles.metaLabel}>Total Returns</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 }}>
                <TrendingUp color="#16a34a" size={12} />
                <Text style={[styles.metaVal, { color: '#16a34a' }]}>
                  +₹{Math.round(totalReturns).toLocaleString('en-IN')} ({returnPct.toFixed(1)}%)
                </Text>
              </View>
            </View>
          </View>

          {/* Time Horizon Pills */}
          <View style={styles.horizonRow}>
            {TIME_HORIZONS.map(h => (
              <TouchableOpacity
                key={h}
                style={[styles.hPill, selectedHorizon === h && styles.hPillActive]}
                onPress={() => { setSelectedHorizon(h); setActivePointIdx(CHART_DATA_BY_TIMEFRAME[h].points.length - 1); }}
                activeOpacity={0.7}
              >
                <Text style={[styles.hPillText, selectedHorizon === h && styles.hPillTextActive]}>{h}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Interactive Chart */}
          <View
            style={styles.chartWrap}
            onStartShouldSetResponder={() => true}
            onMoveShouldSetResponder={() => true}
            onResponderGrant={e => handleTouch(e.nativeEvent.locationX)}
            onResponderMove={e => handleTouch(e.nativeEvent.locationX)}
          >
            <Svg width={svgWidth} height={svgHeight}>
              <Defs>
                <LinearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                  <Stop offset="0%" stopColor="#3b82f6" stopOpacity="0.22" />
                  <Stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
                </LinearGradient>
              </Defs>
              <Rect x={0} y={0} width={svgWidth} height={svgHeight} fill="transparent" />
              {active && <Line x1={active.x} y1={0} x2={active.x} y2={svgHeight} stroke="#3b82f6" strokeWidth={1.5} strokeDasharray="3,3" opacity={0.7} />}
              <Path d={fillD} fill="url(#grad)" />
              <Path d={lineD} fill="none" stroke="#2563eb" strokeWidth={2.5} />
              {pointCoords.map((pt, i) => (
                <G key={i} onPress={() => setActivePointIdx(i)}>
                  <Circle cx={pt.x} cy={pt.y} r={18} fill="transparent" />
                  {i === activePointIdx && <Circle cx={pt.x} cy={pt.y} r={8} fill="#2563eb" fillOpacity={0.2} />}
                  <Circle cx={pt.x} cy={pt.y} r={i === activePointIdx ? 5 : 3} fill={i === activePointIdx ? '#fff' : '#2563eb'} stroke={i === activePointIdx ? '#1b3a6b' : '#2563eb'} strokeWidth={i === activePointIdx ? 2.5 : 1} />
                </G>
              ))}
            </Svg>
            {active && (
              <View pointerEvents="none" style={[styles.tooltip, { left: Math.min(Math.max(active.x - 48, 0), svgWidth - 96), top: Math.max(active.y - 40, 2) }]}>
                <Text style={styles.tooltipVal}>₹{Math.round(active.val).toLocaleString('en-IN')}</Text>
                <Text style={styles.tooltipDate}>{active.date}</Text>
              </View>
            )}
          </View>
        </View>

        {/* ── QUICK ACTION GRID ── */}
        <View style={styles.quickGrid}>
          {quickActions.map((a, i) => (
            <TouchableOpacity
              key={i}
              style={styles.quickItem}
              onPress={() => navigation.navigate(a.screen, a.params)}
              activeOpacity={0.75}
            >
              <View style={[styles.quickIcon, { backgroundColor: a.bg }]}>
                <a.icon color={a.color} size={20} />
              </View>
              <Text style={styles.quickLabel}>{a.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ── ASSET MINI-MAP ── */}
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate('AssetAllocation', { holdings })}
          activeOpacity={0.9}
        >
          <View style={styles.cardHeader}>
            <View style={styles.cardIconBlue}><PieChart color="#2563eb" size={16} /></View>
            <Text style={styles.cardTitle}>Asset Allocation</Text>
            <ChevronRight color="#94a3b8" size={16} style={{ marginLeft: 'auto' }} />
          </View>
          {/* Horizontal stacked bar */}
          <View style={styles.stackBar}>
            {assetBreakdown.filter(a => a.percentage > 0).map((a, i) => (
              <View key={i} style={[styles.stackSegment, { flex: a.percentage, backgroundColor: a.color }]} />
            ))}
          </View>
          <View style={styles.stackLegend}>
            {assetBreakdown.filter(a => a.percentage > 0).map((a, i) => (
              <View key={i} style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: a.color }]} />
                <Text style={styles.legendText}>{a.label} {a.percentage.toFixed(0)}%</Text>
              </View>
            ))}
          </View>
        </TouchableOpacity>

        {/* ── PORTFOLIO HEALTH MINI CARD ── */}
        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('PortfolioHealth')} activeOpacity={0.9}>
          <View style={styles.cardHeader}>
            <View style={[styles.cardIconBlue, { backgroundColor: '#fef3c7' }]}>
              <ShieldCheck color="#d97706" size={16} />
            </View>
            <Text style={styles.cardTitle}>Portfolio Health</Text>
            <ChevronRight color="#94a3b8" size={16} style={{ marginLeft: 'auto' }} />
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 4 }}>
            <Text style={styles.healthBig}>66</Text>
            <Text style={{ color: '#94a3b8', fontSize: 16 }}>/100</Text>
            <View style={styles.healthTag}><Text style={styles.healthTagText}>NEEDS ATTENTION</Text></View>
          </View>
          <View style={styles.healthBar}>
            <View style={[styles.healthFill, { width: `${66}%` }]} />
          </View>
        </TouchableOpacity>

        {/* ── RECENT TRANSACTIONS ── */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={[styles.cardIconBlue, { backgroundColor: '#f5f3ff' }]}>
              <Activity color="#8b5cf6" size={16} />
            </View>
            <Text style={styles.cardTitle}>Recent Transactions</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Transactions', {})} style={{ marginLeft: 'auto' }}>
              <Text style={styles.seeAll}>See all →</Text>
            </TouchableOpacity>
          </View>
          {[
            { type: 'BUY', asset: 'TCS', date: 'Aug 08', amount: '₹20,000', color: '#16a34a' },
            { type: 'BUY', asset: 'Nexus REIT', date: 'Aug 07', amount: '₹10,000', color: '#16a34a' },
            { type: 'BUY', asset: 'InCred Bond', date: 'Aug 05', amount: '₹25,000', color: '#16a34a' },
          ].map((tx, i) => (
            <View key={i} style={styles.txRow}>
              <View style={[styles.txBadge, { backgroundColor: tx.color + '15' }]}>
                <Text style={[styles.txBadgeText, { color: tx.color }]}>{tx.type}</Text>
              </View>
              <Text style={styles.txAsset}>{tx.asset}</Text>
              <Text style={styles.txDate}>{tx.date}</Text>
              <Text style={[styles.txAmount, { color: tx.color }]}>{tx.amount}</Text>
            </View>
          ))}
        </View>

        {/* ── AI INSIGHTS TEASER ── */}
        <TouchableOpacity
          style={[styles.card, { borderColor: '#ddd6fe', borderWidth: 1.5 }]}
          onPress={() => navigation.navigate('PortfolioInsights', { holdings, summary })}
          activeOpacity={0.85}
        >
          <View style={styles.cardHeader}>
            <View style={[styles.cardIconBlue, { backgroundColor: '#f5f3ff' }]}>
              <Brain color="#8b5cf6" size={16} />
            </View>
            <Text style={styles.cardTitle}>AI Portfolio Insights</Text>
            <ChevronRight color="#94a3b8" size={16} style={{ marginLeft: 'auto' }} />
          </View>
          <Text style={styles.insightPreview}>
            🔴 48.2% direct equity concentration  •  🟡 72% of recent buys were equity  •  🔵 REITs underexplored
          </Text>
          <View style={styles.insightCta}>
            <Brain color="#8b5cf6" size={13} />
            <Text style={styles.insightCtaText}>View all insights →</Text>
          </View>
        </TouchableOpacity>

        {/* ── CONNECTED ACCOUNTS FOOTER ── */}
        <TouchableOpacity style={styles.footer} onPress={() => navigation.navigate('ConnectedAccounts')} activeOpacity={0.85}>
          <Text style={styles.footerTitle}>Connected Accounts</Text>
          <View style={styles.footerBadges}>
            {['NSDL', 'CDSL', 'CAMS', 'KFintech'].map((f, i) => (
              <View key={i} style={styles.footerBadge}>
                <CheckCircle2 color="#16a34a" size={11} />
                <Text style={styles.footerBadgeText}>{f}</Text>
              </View>
            ))}
          </View>
          <Text style={styles.footerCta}>Manage accounts →</Text>
        </TouchableOpacity>
      </View>

      {/* ── PROFILE MODAL ── */}
      <Modal visible={profileVisible} transparent animationType="slide" onRequestClose={() => setProfileVisible(false)}>
        <Pressable style={styles.overlay} onPress={() => setProfileVisible(false)}>
          <View style={styles.modal}>
            <View style={styles.modalHead}>
              <View style={styles.modalAvatar}><User color="#1b3a6b" size={22} /></View>
              <View style={{ marginLeft: 12 }}>
                <Text style={styles.modalName}>Arnam Chaurasiya</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 3 }}>
                  <CheckCircle2 color="#16a34a" size={12} />
                  <Text style={styles.modalVerified}> SEBI DPI Verified</Text>
                </View>
              </View>
              <TouchableOpacity onPress={() => setProfileVisible(false)} style={{ marginLeft: 'auto', padding: 4 }}>
                <X color="#64748b" size={20} />
              </TouchableOpacity>
            </View>
            {[
              { label: 'DPI Handle', val: 'DPI-2026-88910' },
              { label: 'Account Aggregator', val: 'Sahamati AA Active' },
              { label: 'eKYC Status', val: 'SEBI KRA Verified' },
              { label: 'Risk Profile', val: 'Aggressive Growth (85/100)' },
              { label: 'Linked FIPs', val: 'Zerodha, CAMS, RBI Direct' },
            ].map((r, i) => (
              <View key={i} style={styles.profileRow}>
                <Text style={styles.profileLabel}>{r.label}</Text>
                <Text style={styles.profileVal}>{r.val}</Text>
              </View>
            ))}
            <View style={{ flexDirection: 'row', gap: 10, marginTop: 16 }}>
              <TouchableOpacity
                style={styles.logoutBtn}
                onPress={() => { setProfileVisible(false); navigation.reset({ index: 0, routes: [{ name: 'Auth' }] }); }}
              >
                <LogOut color="#dc2626" size={15} />
                <Text style={styles.logoutText}>Log Out</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.closeBtn} onPress={() => setProfileVisible(false)}>
                <Text style={styles.closeBtnText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Pressable>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#f4f7fb' },
  hero: {
    backgroundColor: '#1b3a6b',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 12 : 16,
    paddingBottom: 22,
    borderBottomRightRadius: 28,
    borderBottomLeftRadius: 28,
    elevation: 5,
    shadowColor: '#1b3a6b', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.2, shadowRadius: 10,
  },
  heroTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
  heroBadgeRow: { flexDirection: 'row', alignItems: 'center' },
  sebiPill: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.18)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  sebiPillText: { color: '#fff', fontSize: 10, fontWeight: 'bold', marginLeft: 4 },
  darpanLabel: { color: '#bfdbfe', fontSize: 12, fontWeight: '600', marginLeft: 6 },
  profileBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.15)', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)' },
  avatarCircle: { width: 22, height: 22, borderRadius: 11, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', marginRight: 6 },
  profileName: { color: '#fff', fontSize: 12, fontWeight: '600' },
  heroTitle: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
  heroSub: { color: '#cbd5e1', fontSize: 13, marginTop: 4 },

  content: { padding: 16, paddingBottom: 100 },

  alertBanner: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#fffbeb',
    borderColor: '#fde68a', borderWidth: 1.5, borderRadius: 14,
    paddingHorizontal: 14, paddingVertical: 11, marginBottom: 14, gap: 8,
  },
  alertText: { color: '#92400e', fontSize: 13, fontWeight: '600', flex: 1 },

  valueCard: {
    backgroundColor: '#fff', borderRadius: 20, padding: 18, marginBottom: 16,
    borderWidth: 1, borderColor: 'rgba(27,58,107,0.08)',
    shadowColor: '#1b3a6b', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.06, shadowRadius: 12, elevation: 3,
  },
  valueTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  valueLabelSm: { color: '#64748b', fontSize: 11, fontWeight: '700', letterSpacing: 0.5 },
  aaChip: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f0fdf4', borderColor: '#bbf7d0', borderWidth: 1, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 12 },
  aaChipText: { color: '#16a34a', fontSize: 11, fontWeight: '700', marginLeft: 4 },

  heroAmountRow: { flexDirection: 'row', alignItems: 'baseline', flexWrap: 'wrap', gap: 10, marginBottom: 14 },
  valueBig: { color: '#0f172a', fontSize: 30, fontWeight: 'bold' },
  gainBadge: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, gap: 3 },
  gainText: { fontSize: 12, fontWeight: '700' },
  gainPeriod: { color: '#64748b', fontSize: 11, fontWeight: '500', marginLeft: 2 },

  metaCard: {
    flexDirection: 'row', backgroundColor: '#f8fafc', borderRadius: 14,
    paddingHorizontal: 14, paddingVertical: 11, marginBottom: 14,
    borderWidth: 1, borderColor: '#f1f5f9', alignItems: 'center',
  },
  metaBox: { flex: 1 },
  metaDivider: { width: 1, height: 26, backgroundColor: '#e2e8f0', marginHorizontal: 12 },
  metaLabel: { color: '#64748b', fontSize: 11, fontWeight: '600' },
  metaVal: { color: '#0f172a', fontSize: 14, fontWeight: '700', marginTop: 2 },

  horizonRow: { flexDirection: 'row', backgroundColor: '#f1f5f9', borderRadius: 12, padding: 3, marginBottom: 12 },
  hPill: { flex: 1, paddingVertical: 6, alignItems: 'center', borderRadius: 9 },
  hPillActive: { backgroundColor: '#1b3a6b' },
  hPillText: { color: '#64748b', fontSize: 12, fontWeight: '600' },
  hPillTextActive: { color: '#fff', fontWeight: 'bold' },

  chartWrap: { height: 110, position: 'relative', alignItems: 'center', justifyContent: 'center', marginTop: 2 },
  tooltip: {
    position: 'absolute', backgroundColor: '#0f172a', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8, alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15, shadowRadius: 4, elevation: 4,
  },
  tooltipVal: { color: '#fff', fontSize: 11, fontWeight: 'bold' },
  tooltipDate: { color: '#94a3b8', fontSize: 9, marginTop: 1 },

  quickGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 16, rowGap: 14 },
  quickItem: { alignItems: 'center', width: '30%' },
  quickIcon: { width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginBottom: 6 },
  quickLabel: { color: '#475569', fontSize: 11, fontWeight: '600', textAlign: 'center' },

  card: {
    backgroundColor: '#fff', borderRadius: 18, padding: 16, marginBottom: 14,
    borderWidth: 1, borderColor: 'rgba(27,58,107,0.08)',
    shadowColor: '#1b3a6b', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  cardIconBlue: { padding: 6, backgroundColor: '#ebf3fa', borderRadius: 8, marginRight: 8 },
  cardTitle: { color: '#1e293b', fontSize: 15, fontWeight: 'bold' },
  seeAll: { color: '#2563eb', fontSize: 13, fontWeight: '600' },

  stackBar: { flexDirection: 'row', height: 10, borderRadius: 6, overflow: 'hidden', marginBottom: 10 },
  stackSegment: { height: '100%' },
  stackLegend: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  legendItem: { flexDirection: 'row', alignItems: 'center' },
  legendDot: { width: 8, height: 8, borderRadius: 4, marginRight: 4 },
  legendText: { color: '#64748b', fontSize: 11, fontWeight: '500' },

  healthBig: { color: '#d97706', fontSize: 32, fontWeight: 'bold' },
  healthTag: { backgroundColor: '#fef3c7', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  healthTagText: { color: '#92400e', fontSize: 10, fontWeight: 'bold' },
  healthBar: { height: 6, backgroundColor: '#f1f5f9', borderRadius: 4, marginTop: 10, overflow: 'hidden' },
  healthFill: { height: '100%', backgroundColor: '#d97706', borderRadius: 4 },

  txRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, gap: 8, borderBottomWidth: 1, borderBottomColor: '#f8fafc' },
  txBadge: { paddingHorizontal: 7, paddingVertical: 3, borderRadius: 6 },
  txBadgeText: { fontSize: 11, fontWeight: '700' },
  txAsset: { color: '#1e293b', fontSize: 13, fontWeight: '600', flex: 1 },
  txDate: { color: '#94a3b8', fontSize: 12 },
  txAmount: { fontSize: 13, fontWeight: '700' },

  insightPreview: { color: '#64748b', fontSize: 12, lineHeight: 20, marginBottom: 10 },
  insightCta: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  insightCtaText: { color: '#8b5cf6', fontSize: 13, fontWeight: '700' },

  footer: { backgroundColor: '#f1f5f9', borderRadius: 16, padding: 16, alignItems: 'center', borderWidth: 1, borderColor: '#e2e8f0' },
  footerTitle: { color: '#64748b', fontSize: 12, fontWeight: '600', marginBottom: 8 },
  footerBadges: { flexDirection: 'row', gap: 8, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 8 },
  footerBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  footerBadgeText: { color: '#1e293b', fontSize: 11, fontWeight: '600', marginLeft: 3 },
  footerCta: { color: '#2563eb', fontSize: 13, fontWeight: '700' },

  overlay: { flex: 1, backgroundColor: 'rgba(15,23,42,0.6)', justifyContent: 'flex-end' },
  modal: { backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24 },
  modalHead: { flexDirection: 'row', alignItems: 'center', marginBottom: 16, paddingBottom: 14, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  modalAvatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#ebf3fa', alignItems: 'center', justifyContent: 'center' },
  modalName: { color: '#1b3a6b', fontSize: 18, fontWeight: 'bold' },
  modalVerified: { color: '#16a34a', fontSize: 11, fontWeight: '600' },
  profileRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f8fafc' },
  profileLabel: { color: '#64748b', fontSize: 13, fontWeight: '500' },
  profileVal: { color: '#0f172a', fontSize: 13, fontWeight: '700' },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fef2f2', borderColor: '#fecaca', borderWidth: 1, paddingVertical: 13, paddingHorizontal: 16, borderRadius: 12, gap: 6 },
  logoutText: { color: '#dc2626', fontWeight: 'bold', fontSize: 14 },
  closeBtn: { flex: 1, backgroundColor: '#1b3a6b', paddingVertical: 13, borderRadius: 12, alignItems: 'center' },
  closeBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
});
