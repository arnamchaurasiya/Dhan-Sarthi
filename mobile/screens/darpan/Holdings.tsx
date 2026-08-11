import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Platform, StatusBar,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import {
  ArrowLeft, ShieldCheck, TrendingUp, TrendingDown,
  Filter, ChevronRight,
} from 'lucide-react-native';
import Svg, { Path } from 'react-native-svg';

import { mapAssetCategory, Holding } from './darpanData';
import { portfolioStore } from '../../services/portfolioStore';

const FILTER_CATS = ['All', 'Equity', 'Mutual Funds', 'REIT', 'InvIT', 'Bonds', 'Other'];

export default function Holdings() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const [holdings, setHoldings] = useState<Holding[]>(portfolioStore.getHoldings());
  const [selectedCat, setSelectedCat] = useState(route.params?.initialCategory || 'All');

  useEffect(() => {
    const unsubscribe = portfolioStore.subscribe(() => {
      setHoldings([...portfolioStore.getHoldings()]);
    });
    return unsubscribe;
  }, []);

  const filtered = selectedCat === 'All'
    ? holdings
    : holdings.filter(h => mapAssetCategory(h) === selectedCat);

  const totalValue = filtered.reduce((a, h) => a + h.total_value, 0);

  const defaultChanges: Record<string, number> = {
    'TCS': -2.4, 'HDFCBANK': -1.8, 'PPFCF': 0.9,
    'UTINIFTY': 0.6, 'INCREDBOND': 0.2, 'NEXUSREIT': 1.2, 'SGB2030': 0.8,
  };

  return (
    <View style={styles.root}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ArrowLeft color="#fff" size={22} />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>My Holdings</Text>
          <Text style={styles.headerSub}>Unified across all platforms</Text>
        </View>
        <View style={styles.headerBadge}>
          <ShieldCheck color="#fff" size={12} />
          <Text style={styles.headerBadgeText}>AA</Text>
        </View>
      </View>

      {/* Summary bar */}
      <View style={styles.summaryBar}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>{filtered.length} Assets</Text>
          <Text style={styles.summaryVal}>₹{totalValue.toLocaleString('en-IN')}</Text>
        </View>
        <View style={[styles.summaryItem, { alignItems: 'flex-end' }]}>
          <Text style={styles.summaryLabel}>Showing</Text>
          <Text style={[styles.summaryVal, { color: '#2563eb' }]}>{selectedCat}</Text>
        </View>
      </View>

      {/* Filter tabs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll} contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 8, alignItems: 'center' }}>
        {FILTER_CATS.map(cat => (
          <TouchableOpacity
            key={cat}
            style={[styles.filterTab, selectedCat === cat && styles.filterTabActive]}
            onPress={() => setSelectedCat(cat)}
          >
            <Text style={[styles.filterTabText, selectedCat === cat && styles.filterTabTextActive]}>{cat}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Holdings list */}
      <ScrollView style={styles.list} contentContainerStyle={{ padding: 16, paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        {filtered.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No holdings in this category</Text>
            <Text style={styles.emptySub}>Select a different filter to see your investments</Text>
          </View>
        )}
        {filtered.map((h, idx) => {
          const rawChange = typeof h.day_change === 'number' ? h.day_change : (defaultChanges[h.symbol] ?? 0);
          const isPos = rawChange >= 0;
          const changeAbs = Math.abs(rawChange).toFixed(1);
          const invested = h.avg_price * h.quantity;
          const returns = h.total_value - invested;
          const returnPct = invested > 0 ? (returns / invested * 100) : 0;

          return (
            <TouchableOpacity
              key={idx}
              style={styles.holdingCard}
              onPress={() => navigation.navigate('HoldingDetail', { holding: h, portfolioTotal: totalValue })}
              activeOpacity={0.75}
            >
              <View style={styles.holdingLeft}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{h.symbol.slice(0, 2)}</Text>
                </View>
                <View style={styles.holdingMeta}>
                  <Text style={styles.holdingSymbol}>{h.symbol}</Text>
                  <Text style={styles.holdingName} numberOfLines={1}>{h.name}</Text>
                  <View style={styles.sourceRow}>
                    <ShieldCheck color="#16a34a" size={10} />
                    <Text style={styles.sourceText}>{h.broker}</Text>
                  </View>
                </View>
              </View>

              <View style={styles.holdingRight}>
                <Text style={styles.holdingValue}>₹{h.total_value.toLocaleString('en-IN')}</Text>
                <View style={styles.returnRow}>
                  {isPos ? <TrendingUp color="#16a34a" size={12} /> : <TrendingDown color="#dc2626" size={12} />}
                  <Text style={[styles.returnText, { color: isPos ? '#16a34a' : '#dc2626' }]}>
                    {' '}{isPos ? '+' : '-'}{changeAbs}%
                  </Text>
                </View>
                <View style={styles.sparkWrap}>
                  <Svg width={54} height={18}>
                    <Path
                      d={isPos
                        ? 'M 0 14 C 10 14, 16 10, 24 9 C 32 8, 40 4, 54 2'
                        : 'M 0 2 C 10 2, 16 6, 24 8 C 32 10, 40 14, 54 16'}
                      fill="none"
                      stroke={isPos ? '#16a34a' : '#dc2626'}
                      strokeWidth="2.2"
                    />
                  </Svg>
                </View>
                <View style={[styles.totalReturnBadge, { backgroundColor: isPos ? '#f0fdf4' : '#fef2f2' }]}>
                  <Text style={[styles.totalReturnText, { color: isPos ? '#16a34a' : '#dc2626' }]}>
                    {isPos ? '+' : ''}{returnPct.toFixed(1)}% total
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#f4f7fb' },
  header: {
    backgroundColor: '#1b3a6b',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 12 : 16,
    paddingBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backBtn: { width: 36, height: 36, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  headerSub: { color: '#bfdbfe', fontSize: 12 },
  headerBadge: { marginLeft: 'auto', flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  headerBadgeText: { color: '#fff', fontSize: 11, fontWeight: 'bold', marginLeft: 3 },

  summaryBar: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#fff', paddingHorizontal: 20, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  summaryItem: {},
  summaryLabel: { color: '#94a3b8', fontSize: 12, fontWeight: '500' },
  summaryVal: { color: '#1e293b', fontSize: 16, fontWeight: 'bold', marginTop: 2 },

  filterScroll: { backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#f1f5f9', flexGrow: 0 },
  filterTab: { backgroundColor: '#f8fafc', borderColor: '#e2e8f0', borderWidth: 1, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, marginRight: 8, height: 36, justifyContent: 'center', alignItems: 'center' },
  filterTabActive: { backgroundColor: '#1b3a6b', borderColor: '#1b3a6b' },
  filterTabText: { color: '#64748b', fontSize: 13, fontWeight: '600' },
  filterTabTextActive: { color: '#fff', fontWeight: '700' },

  list: { flex: 1 },

  holdingCard: {
    backgroundColor: '#fff', borderRadius: 16, padding: 14, marginBottom: 10,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    borderWidth: 1, borderColor: 'rgba(27,58,107,0.08)',
    shadowColor: '#1b3a6b', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.03, shadowRadius: 4, elevation: 1,
  },
  holdingLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  avatar: { width: 40, height: 40, borderRadius: 13, backgroundColor: '#ebf3fa', alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  avatarText: { color: '#1b3a6b', fontSize: 14, fontWeight: 'bold' },
  holdingMeta: { flex: 1 },
  holdingSymbol: { color: '#0f172a', fontSize: 15, fontWeight: 'bold' },
  holdingName: { color: '#64748b', fontSize: 11, marginTop: 1 },
  sourceRow: { flexDirection: 'row', alignItems: 'center', marginTop: 3 },
  sourceText: { color: '#16a34a', fontSize: 10, fontWeight: '600', marginLeft: 3 },

  holdingRight: { alignItems: 'flex-end' },
  holdingValue: { color: '#1b3a6b', fontSize: 15, fontWeight: 'bold' },
  returnRow: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
  returnText: { fontSize: 11, fontWeight: '700' },
  sparkWrap: { marginTop: 3 },
  totalReturnBadge: { paddingHorizontal: 7, paddingVertical: 2, borderRadius: 6, marginTop: 4 },
  totalReturnText: { fontSize: 10, fontWeight: '700' },

  emptyState: { padding: 40, alignItems: 'center' },
  emptyTitle: { color: '#1e293b', fontSize: 16, fontWeight: 'bold' },
  emptySub: { color: '#94a3b8', fontSize: 13, marginTop: 6, textAlign: 'center' },
});
