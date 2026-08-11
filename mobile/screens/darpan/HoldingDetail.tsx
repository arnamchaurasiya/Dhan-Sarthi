import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Platform, StatusBar,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import {
  ArrowLeft, TrendingUp, TrendingDown, ShieldCheck,
  Info,
} from 'lucide-react-native';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';

export default function HoldingDetail() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { holding, portfolioTotal } = route.params;

  const invested = holding.avg_price * holding.quantity;
  const returns = holding.total_value - invested;
  const returnPct = invested > 0 ? (returns / invested * 100) : 0;
  const isPos = returns >= 0;
  const portfolioWeight = portfolioTotal > 0 ? ((holding.total_value / portfolioTotal) * 100) : (holding.portfolio_weight || 0);

  const riskMap: Record<string, { label: string; color: string; bg: string }> = {
    'Equity': { label: 'High', color: '#dc2626', bg: '#fef2f2' },
    'Mutual Funds': { label: 'Moderate-High', color: '#d97706', bg: '#fffbeb' },
    'Fixed Income': { label: 'Low-Moderate', color: '#16a34a', bg: '#f0fdf4' },
    'Gold': { label: 'Moderate', color: '#d97706', bg: '#fffbeb' },
    'REITs': { label: 'Moderate', color: '#d97706', bg: '#fffbeb' },
  };
  const riskInfo = riskMap[holding.asset_class] || { label: 'Moderate', color: '#d97706', bg: '#fffbeb' };

  // Mini performance chart data (synthetic)
  const miniPoints = holding.sparkline || [holding.avg_price, holding.current_price];
  const svgW = 240, svgH = 80;
  const minV = Math.min(...miniPoints) * 0.97;
  const maxV = Math.max(...miniPoints) * 1.03;
  const coords = miniPoints.map((v: number, i: number) => ({
    x: (i / (miniPoints.length - 1)) * svgW,
    y: svgH - ((v - minV) / (maxV - minV)) * (svgH - 20) - 10,
  }));
  let lineD = `M ${coords[0].x} ${coords[0].y}`;
  for (let i = 0; i < coords.length - 1; i++) {
    const mx = (coords[i + 1].x - coords[i].x) / 2;
    lineD += ` C ${coords[i].x + mx} ${coords[i].y}, ${coords[i].x + mx} ${coords[i + 1].y}, ${coords[i + 1].x} ${coords[i + 1].y}`;
  }
  const fillD = `${lineD} L ${svgW} ${svgH} L 0 ${svgH} Z`;

  const stats = [
    { label: 'Invested Amount', val: `₹${invested.toLocaleString('en-IN')}` },
    { label: 'Current Value', val: `₹${holding.total_value.toLocaleString('en-IN')}` },
    { label: 'Total Returns', val: `${isPos ? '+' : ''}₹${Math.abs(returns).toLocaleString('en-IN')}`, color: isPos ? '#16a34a' : '#dc2626' },
    { label: 'Return %', val: `${isPos ? '+' : ''}${returnPct.toFixed(2)}%`, color: isPos ? '#16a34a' : '#dc2626' },
    { label: 'Portfolio Weight', val: `${portfolioWeight.toFixed(1)}%` },
    { label: 'Quantity / Units', val: `${holding.quantity}` },
    { label: 'Avg Buy Price', val: `₹${holding.avg_price.toLocaleString('en-IN')}` },
    { label: 'Current Price', val: `₹${holding.current_price.toLocaleString('en-IN')}` },
  ];

  return (
    <View style={styles.root}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ArrowLeft color="#fff" size={22} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerSymbol}>{holding.symbol}</Text>
          <Text style={styles.headerName} numberOfLines={1}>{holding.name}</Text>
        </View>
        <View style={[styles.assetBadge, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
          <Text style={styles.assetBadgeText}>{holding.asset_class}</Text>
        </View>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={{ padding: 16, paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
        {/* Value hero */}
        <View style={styles.heroCard}>
          <View style={styles.heroRow}>
            <View>
              <Text style={styles.heroLabel}>Current Value</Text>
              <Text style={styles.heroValue}>₹{holding.total_value.toLocaleString('en-IN')}</Text>
            </View>
            <View style={[styles.returnBadge, { backgroundColor: isPos ? '#dcfce7' : '#fef2f2' }]}>
              {isPos ? <TrendingUp color="#16a34a" size={16} /> : <TrendingDown color="#dc2626" size={16} />}
              <Text style={[styles.returnBadgeText, { color: isPos ? '#16a34a' : '#dc2626' }]}>
                {isPos ? '+' : ''}{returnPct.toFixed(2)}%
              </Text>
            </View>
          </View>

          {/* Returns bar */}
          <View style={styles.returnsCompare}>
            <View>
              <Text style={styles.returnsLabel}>Invested</Text>
              <Text style={styles.returnsVal}>₹{invested.toLocaleString('en-IN')}</Text>
            </View>
            <View style={{ alignItems: 'center', flex: 1 }}>
              <Text style={[styles.returnsGain, { color: isPos ? '#16a34a' : '#dc2626' }]}>
                {isPos ? '▲' : '▼'} ₹{Math.abs(returns).toLocaleString('en-IN')}
              </Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.returnsLabel}>Current</Text>
              <Text style={styles.returnsVal}>₹{holding.total_value.toLocaleString('en-IN')}</Text>
            </View>
          </View>

          {/* Performance chart */}
          <View style={{ alignItems: 'center', marginTop: 8 }}>
            <Svg width={svgW} height={svgH}>
              <Defs>
                <LinearGradient id="hg" x1="0" y1="0" x2="0" y2="1">
                  <Stop offset="0%" stopColor={isPos ? '#16a34a' : '#dc2626'} stopOpacity="0.25" />
                  <Stop offset="100%" stopColor={isPos ? '#16a34a' : '#dc2626'} stopOpacity="0" />
                </LinearGradient>
              </Defs>
              <Path d={fillD} fill="url(#hg)" />
              <Path d={lineD} fill="none" stroke={isPos ? '#16a34a' : '#dc2626'} strokeWidth={2} />
            </Svg>
          </View>
        </View>

        {/* Meta chips row */}
        <View style={styles.metaChips}>
          <View style={[styles.metaChip, { backgroundColor: riskInfo.bg }]}>
            <Text style={[styles.metaChipLabel, { color: riskInfo.color }]}>Risk: {riskInfo.label}</Text>
          </View>
          <View style={styles.metaChip}>
            <ShieldCheck color="#16a34a" size={11} />
            <Text style={styles.metaChipLabel}>{holding.broker}</Text>
          </View>
          <View style={styles.metaChip}>
            <Text style={styles.metaChipLabel}>ISIN: {holding.isin}</Text>
          </View>
        </View>

        {/* Portfolio contribution */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Portfolio Contribution</Text>
          <View style={{ marginTop: 10 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
              <Text style={styles.statLabel}>Weight in Portfolio</Text>
              <Text style={styles.statValBold}>{portfolioWeight.toFixed(1)}%</Text>
            </View>
            <View style={styles.weightBar}>
              <View style={[styles.weightFill, { width: `${Math.min(portfolioWeight, 100)}%` }]} />
            </View>
            {portfolioWeight > 30 && (
              <View style={styles.warnRow}>
                <Info color="#d97706" size={13} />
                <Text style={styles.warnText}>This holding is over 30% of your portfolio — high concentration.</Text>
              </View>
            )}
          </View>
        </View>

        {/* Detailed stats grid */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Detailed Metrics</Text>
          <View style={styles.statsGrid}>
            {stats.map((s, i) => (
              <View key={i} style={styles.statBox}>
                <Text style={styles.statLabel}>{s.label}</Text>
                <Text style={[styles.statVal, s.color ? { color: s.color } : {}]}>{s.val}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Sector info */}
        {holding.sector && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Sector & Classification</Text>
            <View style={styles.sectorRow}>
              <View style={styles.sectorBadge}><Text style={styles.sectorBadgeText}>{holding.sector}</Text></View>
              <View style={styles.sectorBadge}><Text style={styles.sectorBadgeText}>{holding.asset_class}</Text></View>
            </View>
          </View>
        )}


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
  headerSymbol: { color: '#fff', fontSize: 22, fontWeight: 'bold' },
  headerName: { color: '#bfdbfe', fontSize: 12, marginTop: 1 },
  assetBadge: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10 },
  assetBadgeText: { color: '#fff', fontSize: 11, fontWeight: '700' },

  scroll: { flex: 1 },

  heroCard: {
    backgroundColor: '#fff', borderRadius: 20, padding: 20, marginBottom: 12,
    borderWidth: 1, borderColor: 'rgba(27,58,107,0.08)',
    shadowColor: '#1b3a6b', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.06, shadowRadius: 12, elevation: 3,
  },
  heroRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  heroLabel: { color: '#64748b', fontSize: 12, fontWeight: '600' },
  heroValue: { color: '#1b3a6b', fontSize: 28, fontWeight: 'bold', marginTop: 2 },
  returnBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10, gap: 4 },
  returnBadgeText: { fontSize: 14, fontWeight: 'bold' },
  returnsCompare: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f8fafc', padding: 12, borderRadius: 12, marginBottom: 8 },
  returnsLabel: { color: '#94a3b8', fontSize: 11, fontWeight: '500' },
  returnsVal: { color: '#1e293b', fontSize: 14, fontWeight: '700', marginTop: 2 },
  returnsGain: { fontSize: 15, fontWeight: 'bold' },

  metaChips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
  metaChip: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f8fafc', borderColor: '#e2e8f0', borderWidth: 1, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10, gap: 5 },
  metaChipLabel: { color: '#475569', fontSize: 11, fontWeight: '600' },

  card: {
    backgroundColor: '#fff', borderRadius: 18, padding: 16, marginBottom: 12,
    borderWidth: 1, borderColor: 'rgba(27,58,107,0.08)',
    shadowColor: '#1b3a6b', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2,
  },
  cardTitle: { color: '#1e293b', fontSize: 15, fontWeight: 'bold', marginBottom: 8 },

  weightBar: { height: 8, backgroundColor: '#f1f5f9', borderRadius: 4, overflow: 'hidden' },
  weightFill: { height: '100%', backgroundColor: '#1b3a6b', borderRadius: 4 },
  warnRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 6, marginTop: 8 },
  warnText: { color: '#92400e', fontSize: 12, flex: 1 },

  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 8 },
  statBox: { width: '47%', backgroundColor: '#f8fafc', borderColor: '#e2e8f0', borderWidth: 1, padding: 11, borderRadius: 10 },
  statLabel: { color: '#64748b', fontSize: 11, fontWeight: '500' },
  statVal: { color: '#0f172a', fontSize: 14, fontWeight: 'bold', marginTop: 3 },
  statValBold: { color: '#1b3a6b', fontSize: 14, fontWeight: 'bold' },

  sectorRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap', marginTop: 6 },
  sectorBadge: { backgroundColor: '#ebf3fa', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10 },
  sectorBadgeText: { color: '#1b3a6b', fontSize: 12, fontWeight: '700' },

});
