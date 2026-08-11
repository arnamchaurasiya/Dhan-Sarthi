import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Platform, StatusBar, Dimensions,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ArrowLeft } from 'lucide-react-native';
import Svg, { Path, Circle, G } from 'react-native-svg';
import { DEFAULT_HOLDINGS, getAssetBreakdown, TARGET_CATEGORIES, mapAssetCategory } from './darpanData';

const { width: SW } = Dimensions.get('window');

export default function AssetAllocation() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const holdings = route.params?.holdings || DEFAULT_HOLDINGS;
  const [selected, setSelected] = useState<string | null>(null);

  const breakdown = getAssetBreakdown(holdings);
  const totalValue = holdings.reduce((a: number, h: any) => a + h.total_value, 0);

  // Filtered holdings for selected category
  const filteredHoldings = selected
    ? holdings.filter((h: any) => mapAssetCategory(h) === selected)
    : holdings;

  // Donut chart
  const cx = 100, cy = 100, outerR = 85, innerR = 52;
  const totalPct = breakdown.reduce((s, a) => s + a.percentage, 0) || 100;
  let angle = -Math.PI / 2;
  const slices = breakdown.map(item => {
    if (item.percentage <= 0) return null;
    const ratio = item.percentage / totalPct;
    const sliceAngle = ratio * 2 * Math.PI;
    const start = angle, end = angle + sliceAngle;
    angle = end;
    const gap = 0.02;
    const x1 = (cx + outerR * Math.cos(start + gap)).toFixed(2);
    const y1 = (cy + outerR * Math.sin(start + gap)).toFixed(2);
    const x2 = (cx + outerR * Math.cos(end - gap)).toFixed(2);
    const y2 = (cy + outerR * Math.sin(end - gap)).toFixed(2);
    const x3 = (cx + innerR * Math.cos(end - gap)).toFixed(2);
    const y3 = (cy + innerR * Math.sin(end - gap)).toFixed(2);
    const x4 = (cx + innerR * Math.cos(start + gap)).toFixed(2);
    const y4 = (cy + innerR * Math.sin(start + gap)).toFixed(2);
    const large = sliceAngle > Math.PI ? 1 : 0;
    const d = `M ${x1} ${y1} A ${outerR} ${outerR} 0 ${large} 1 ${x2} ${y2} L ${x3} ${y3} A ${innerR} ${innerR} 0 ${large} 0 ${x4} ${y4} Z`;
    return { ...item, d, ratio };
  }).filter(Boolean);

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ArrowLeft color="#fff" size={22} />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Asset Allocation</Text>
          <Text style={styles.headerSub}>Where is my money?</Text>
        </View>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={{ padding: 16, paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        {/* Donut + Legend */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Portfolio Distribution</Text>
          <View style={styles.donutCol}>
            {/* Donut Pie Chart (Top Centered) */}
            <View style={{ width: 200, height: 200, alignItems: 'center', justifyContent: 'center', marginVertical: 8 }}>
              <Svg width={200} height={200}>
                {slices.map((sl, i) => sl && (
                  <G key={i} onPress={() => setSelected(selected === sl.key ? null : sl.key)}>
                    <Path
                      d={sl.d}
                      fill={sl.color}
                      opacity={selected === null || selected === sl.key ? 1 : 0.3}
                      strokeWidth={selected === sl.key ? 2 : 0}
                      stroke="#fff"
                    />
                  </G>
                ))}
              </Svg>
              {/* Center text */}
              <View style={styles.donutCenter}>
                <Text style={styles.donutCenterVal}>
                  {selected ? `${breakdown.find(a => a.key === selected)?.percentage.toFixed(0)}%` : `₹${(totalValue / 100000).toFixed(1)}L`}
                </Text>
                <Text style={styles.donutCenterLabel}>
                  {selected || 'Total Portfolio'}
                </Text>
              </View>
            </View>

            {/* Breakdown Description List (Bottom Full Width) */}
            <View style={styles.legendListVertical}>
              {breakdown.map((item, i) => (
                <TouchableOpacity
                  key={i}
                  style={[styles.legendRow, selected === item.key && styles.legendRowActive]}
                  onPress={() => setSelected(selected === item.key ? null : item.key)}
                  activeOpacity={0.8}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={[styles.legendDot, { backgroundColor: item.color }]} />
                    <Text style={styles.legendLabel}>{item.label}</Text>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={styles.legendVal}>₹{item.value.toLocaleString('en-IN')}</Text>
                    <View style={[styles.legendPctBadge, { backgroundColor: item.color + '18' }]}>
                      <Text style={[styles.legendPct, { color: item.color }]}>{item.percentage.toFixed(0)}%</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Target vs Actual */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Actual vs Target Allocation</Text>
          <Text style={styles.cardSub}>Ideal allocation for moderate-risk investor</Text>
          {breakdown.map((item, i) => {
            const diff = item.percentage - item.targetPct;
            const isOver = diff > 0;
            return (
              <View key={i} style={styles.allocationRow}>
                <View style={[styles.alloDot, { backgroundColor: item.color }]} />
                <Text style={styles.alloLabel}>{item.label}</Text>
                <View style={styles.alloBars}>
                  <View style={styles.alloBarBg}>
                    <View style={[styles.alloBarFill, { width: `${Math.min(item.percentage, 100)}%`, backgroundColor: item.color }]} />
                  </View>
                  <Text style={[styles.alloPct, { color: item.color }]}>{item.percentage.toFixed(0)}%</Text>
                  <Text style={[styles.alloDiff, { color: isOver ? '#dc2626' : '#16a34a' }]}>
                    {isOver ? '+' : ''}{diff.toFixed(0)}% vs target ({item.targetPct}%)
                  </Text>
                </View>
              </View>
            );
          })}
        </View>

        {/* Holdings in selected category */}
        {selected && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{selected} Holdings</Text>
            {filteredHoldings.map((h: any, i: number) => (
              <TouchableOpacity
                key={i}
                style={styles.holdingMiniRow}
                onPress={() => navigation.navigate('HoldingDetail', { holding: h, portfolioTotal: totalValue })}
              >
                <View style={styles.holdingMiniLeft}>
                  <View style={styles.holdingMiniAvatar}>
                    <Text style={styles.holdingMiniAvatarText}>{h.symbol.slice(0, 2)}</Text>
                  </View>
                  <View>
                    <Text style={styles.holdingMiniSymbol}>{h.symbol}</Text>
                    <Text style={styles.holdingMiniName} numberOfLines={1}>{h.name}</Text>
                  </View>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={styles.holdingMiniVal}>₹{h.total_value.toLocaleString('en-IN')}</Text>
                  <Text style={styles.holdingMiniWt}>{((h.total_value / totalValue) * 100).toFixed(1)}% of portfolio</Text>
                </View>
              </TouchableOpacity>
            ))}
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
  headerTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  headerSub: { color: '#bfdbfe', fontSize: 12 },
  scroll: { flex: 1 },
  card: {
    backgroundColor: '#fff', borderRadius: 18, padding: 16, marginBottom: 14,
    borderWidth: 1, borderColor: 'rgba(27,58,107,0.08)',
    shadowColor: '#1b3a6b', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2,
  },
  cardTitle: { color: '#1e293b', fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
  cardSub: { color: '#94a3b8', fontSize: 12, marginBottom: 12 },
  donutCol: { alignItems: 'center', marginTop: 4 },
  donutCenter: { position: 'absolute', alignItems: 'center', justifyContent: 'center' },
  donutCenterVal: { color: '#1b3a6b', fontSize: 20, fontWeight: 'bold' },
  donutCenterLabel: { color: '#64748b', fontSize: 11, fontWeight: '600', marginTop: 2, textAlign: 'center' },
  legendListVertical: { width: '100%', marginTop: 12 },
  legendRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingVertical: 10, paddingHorizontal: 12, borderRadius: 12, marginBottom: 8,
    backgroundColor: '#f8fafc', borderWidth: 1, borderColor: '#e2e8f0',
  },
  legendRowActive: { backgroundColor: '#f0f9ff', borderColor: '#1b3a6b' },
  legendDot: { width: 10, height: 10, borderRadius: 5, marginRight: 8 },
  legendLabel: { color: '#1e293b', fontSize: 13, fontWeight: '600' },
  legendVal: { color: '#64748b', fontSize: 12, fontWeight: '600' },
  legendPctBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, marginLeft: 10 },
  legendPct: { fontSize: 12, fontWeight: 'bold' },

  allocationRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12 },
  alloDot: { width: 8, height: 8, borderRadius: 4, marginRight: 8, marginTop: 4 },
  alloLabel: { color: '#1e293b', fontSize: 12, fontWeight: '600', width: 88 },
  alloBars: { flex: 1 },
  alloBarBg: { height: 7, backgroundColor: '#f1f5f9', borderRadius: 4, overflow: 'hidden', marginBottom: 3 },
  alloBarFill: { height: '100%', borderRadius: 4 },
  alloPct: { fontSize: 11, fontWeight: 'bold' },
  alloDiff: { fontSize: 10, marginTop: 2 },

  holdingMiniRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#f8fafc' },
  holdingMiniLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  holdingMiniAvatar: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#ebf3fa', alignItems: 'center', justifyContent: 'center' },
  holdingMiniAvatarText: { color: '#1b3a6b', fontSize: 13, fontWeight: 'bold' },
  holdingMiniSymbol: { color: '#0f172a', fontSize: 13, fontWeight: 'bold' },
  holdingMiniName: { color: '#64748b', fontSize: 11, maxWidth: SW * 0.3 },
  holdingMiniVal: { color: '#1b3a6b', fontSize: 13, fontWeight: 'bold' },
  holdingMiniWt: { color: '#94a3b8', fontSize: 11, marginTop: 2 },

});
