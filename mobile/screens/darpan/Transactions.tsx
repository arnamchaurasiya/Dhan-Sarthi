import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Platform, StatusBar,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ArrowLeft, ChevronRight } from 'lucide-react-native';
import { TX_TYPE_COLORS, Transaction } from './darpanData';
import { portfolioStore } from '../../services/portfolioStore';

const FILTERS = ['All', 'BUY', 'SELL', 'DIVIDEND', 'INTEREST', 'SIP'];

export default function Transactions() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const [txns, setTxns] = useState<Transaction[]>(portfolioStore.getTransactions());
  const [activeFilter, setActiveFilter] = useState(route.params?.initialFilter || 'All');

  useEffect(() => {
    const unsubscribe = portfolioStore.subscribe(() => {
      setTxns([...portfolioStore.getTransactions()]);
    });
    return unsubscribe;
  }, []);

  const filtered: Transaction[] = activeFilter === 'All'
    ? txns
    : txns.filter(t => t.type === activeFilter);

  // Group by month
  const byMonth: Record<string, Transaction[]> = {};
  filtered.forEach(tx => {
    if (!byMonth[tx.month]) byMonth[tx.month] = [];
    byMonth[tx.month].push(tx);
  });

  const totalBuys = txns.filter(t => t.type === 'BUY' || t.type === 'SIP').reduce((a, t) => a + t.amount, 0);
  const totalDivs = txns.filter(t => t.type === 'DIVIDEND' || t.type === 'INTEREST').reduce((a, t) => a + t.amount, 0);

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ArrowLeft color="#fff" size={22} />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Transactions</Text>
          <Text style={styles.headerSub}>Unified transaction intelligence</Text>
        </View>
      </View>

      {/* Summary bar */}
      <View style={styles.summaryBar}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Total Invested</Text>
          <Text style={styles.summaryVal}>₹{totalBuys.toLocaleString('en-IN')}</Text>
        </View>
        <View style={[styles.divider]} />
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Income Received</Text>
          <Text style={[styles.summaryVal, { color: '#16a34a' }]}>₹{totalDivs.toLocaleString('en-IN')}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Total Transactions</Text>
          <Text style={styles.summaryVal}>{txns.length}</Text>
        </View>
      </View>

      {/* Filters */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll} contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 8, alignItems: 'center' }}>
        {FILTERS.map(f => (
          <TouchableOpacity
            key={f}
            style={[styles.filterTab, activeFilter === f && styles.filterTabActive]}
            onPress={() => setActiveFilter(f)}
          >
            <Text style={[styles.filterTabText, activeFilter === f && styles.filterTabTextActive]}>{f}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Transaction feed */}
      <ScrollView style={styles.scroll} contentContainerStyle={{ padding: 16, paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        {Object.entries(byMonth).map(([month, txns]) => (
          <View key={month}>
            <Text style={styles.monthHeader}>{month}</Text>
            {txns.map((tx, i) => {
              const tc = TX_TYPE_COLORS[tx.type] || TX_TYPE_COLORS['OTHER'];
              const isBuy = tx.type === 'BUY' || tx.type === 'SIP';
              const isSell = tx.type === 'SELL';
              return (
                <TouchableOpacity
                  key={tx.id}
                  style={styles.txCard}
                  onPress={() => navigation.navigate('TransactionDetail', { transaction: tx })}
                  activeOpacity={0.78}
                >
                  <View style={styles.txLeft}>
                    <View style={[styles.txTypeBadge, { backgroundColor: tc.bg, borderColor: tc.border, borderWidth: 1 }]}>
                      <Text style={[styles.txTypeBadgeText, { color: tc.text }]}>{tx.type}</Text>
                    </View>
                    <View style={styles.txMeta}>
                      <Text style={styles.txAsset}>{tx.asset}</Text>
                      <Text style={styles.txName} numberOfLines={1}>{tx.asset_name}</Text>
                      <Text style={styles.txPlatform}>{tx.platform} • {tx.date}</Text>
                    </View>
                  </View>
                  <View style={styles.txRight}>
                    <Text style={[styles.txAmount, {
                      color: isBuy ? '#16a34a' : isSell ? '#dc2626' : '#2563eb'
                    }]}>
                      {isBuy ? '+' : isSell ? '-' : ''}₹{tx.amount.toLocaleString('en-IN')}
                    </Text>
                    <ChevronRight color="#cbd5e1" size={14} />
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        ))}

        {filtered.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No {activeFilter} transactions</Text>
            <Text style={styles.emptySub}>Try selecting a different filter</Text>
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
  summaryBar: {
    flexDirection: 'row', backgroundColor: '#fff', paddingHorizontal: 20, paddingVertical: 14,
    borderBottomWidth: 1, borderBottomColor: '#f1f5f9', alignItems: 'center',
  },
  summaryItem: { flex: 1, alignItems: 'center' },
  summaryLabel: { color: '#94a3b8', fontSize: 11, fontWeight: '500' },
  summaryVal: { color: '#1e293b', fontSize: 14, fontWeight: 'bold', marginTop: 2 },
  divider: { width: 1, height: 32, backgroundColor: '#e2e8f0' },
  filterScroll: { backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#f1f5f9', flexGrow: 0 },
  filterTab: { backgroundColor: '#f8fafc', borderColor: '#e2e8f0', borderWidth: 1, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, marginRight: 8, height: 36, justifyContent: 'center', alignItems: 'center' },
  filterTabActive: { backgroundColor: '#1b3a6b', borderColor: '#1b3a6b' },
  filterTabText: { color: '#64748b', fontSize: 13, fontWeight: '600' },
  filterTabTextActive: { color: '#fff', fontWeight: '700' },
  scroll: { flex: 1 },
  monthHeader: { color: '#64748b', fontSize: 13, fontWeight: '700', marginBottom: 8, marginTop: 4, textTransform: 'uppercase', letterSpacing: 0.5 },
  txCard: {
    backgroundColor: '#fff', borderRadius: 14, padding: 14, marginBottom: 8,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    borderWidth: 1, borderColor: 'rgba(27,58,107,0.07)',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.03, shadowRadius: 3, elevation: 1,
  },
  txLeft: { flexDirection: 'row', alignItems: 'center', flex: 1, gap: 10 },
  txTypeBadge: { paddingHorizontal: 9, paddingVertical: 5, borderRadius: 8 },
  txTypeBadgeText: { fontSize: 11, fontWeight: 'bold' },
  txMeta: { flex: 1 },
  txAsset: { color: '#0f172a', fontSize: 14, fontWeight: 'bold' },
  txName: { color: '#64748b', fontSize: 11, marginTop: 1 },
  txPlatform: { color: '#94a3b8', fontSize: 11, marginTop: 2 },
  txRight: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  txAmount: { fontSize: 14, fontWeight: 'bold' },
  emptyState: { padding: 40, alignItems: 'center' },
  emptyTitle: { color: '#1e293b', fontSize: 16, fontWeight: 'bold' },
  emptySub: { color: '#94a3b8', fontSize: 13, marginTop: 6, textAlign: 'center' },
});
