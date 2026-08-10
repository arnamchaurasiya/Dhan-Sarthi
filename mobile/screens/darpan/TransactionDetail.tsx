import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Platform, StatusBar,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ArrowLeft, Info } from 'lucide-react-native';
import { TX_TYPE_COLORS } from './darpanData';

export default function TransactionDetail() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { transaction: tx } = route.params;
  const tc = TX_TYPE_COLORS[tx.type] || TX_TYPE_COLORS['OTHER'];
  const isBuy = tx.type === 'BUY' || tx.type === 'SIP';
  const isSell = tx.type === 'SELL';

  const details = [
    { label: 'Transaction Type', val: tx.type },
    { label: 'Asset', val: tx.asset },
    { label: 'Full Name', val: tx.asset_name },
    { label: 'Platform', val: tx.platform },
    { label: 'Date', val: tx.date },
    { label: 'Asset Class', val: tx.asset_class },
    tx.units != null ? { label: 'Units / Qty', val: `${Math.abs(tx.units)}` } : null,
    tx.price != null ? { label: 'Price per Unit', val: `₹${tx.price.toLocaleString('en-IN')}` } : null,
    tx.fees != null ? { label: 'Transaction Fees', val: tx.fees > 0 ? `₹${tx.fees}` : 'Nil' } : null,
  ].filter(Boolean);

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ArrowLeft color="#fff" size={22} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerSymbol}>{tx.asset}</Text>
          <Text style={styles.headerSub}>{tx.asset_name}</Text>
        </View>
        <View style={[styles.typeBadge, { backgroundColor: tc.bg, borderColor: tc.border, borderWidth: 1 }]}>
          <Text style={[styles.typeBadgeText, { color: tc.text }]}>{tx.type}</Text>
        </View>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={{ padding: 16, paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
        {/* Amount hero */}
        <View style={styles.amountCard}>
          <Text style={styles.amountLabel}>Transaction Amount</Text>
          <Text style={[styles.amountVal, {
            color: isBuy ? '#16a34a' : isSell ? '#dc2626' : '#2563eb'
          }]}>
            {isBuy ? '+' : isSell ? '-' : ''}₹{tx.amount.toLocaleString('en-IN')}
          </Text>
          <Text style={styles.amountDate}>{tx.month} • {tx.date}</Text>
        </View>

        {/* Details grid */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Transaction Details</Text>
          {details.map((d: any, i) => (
            <View key={i} style={[styles.detailRow, i < details.length - 1 && { borderBottomWidth: 1, borderBottomColor: '#f8fafc' }]}>
              <Text style={styles.detailLabel}>{d.label}</Text>
              <Text style={styles.detailVal}>{d.val}</Text>
            </View>
          ))}
        </View>

        {/* Portfolio Impact (the key insight!) */}
        {tx.impact && (
          <View style={styles.impactCard}>
            <View style={styles.impactHeader}>
              <Info color="#2563eb" size={16} />
              <Text style={styles.impactTitle}>Portfolio Impact</Text>
            </View>
            <Text style={styles.impactText}>{tx.impact}</Text>
          </View>
        )}

        {/* Context section */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Why This Transaction Matters</Text>
          {tx.type === 'BUY' || tx.type === 'SIP' ? (
            <>
              <Text style={styles.contextText}>
                This purchase increased your exposure to {tx.asset_class}. Consistent investing across market cycles helps build long-term wealth.
              </Text>
              {tx.asset_class === 'Equity' && (
                <View style={styles.contextWarn}>
                  <Info color="#d97706" size={13} />
                  <Text style={styles.contextWarnText}>
                    This adds to your existing equity concentration. Consider balancing with other asset classes.
                  </Text>
                </View>
              )}
            </>
          ) : tx.type === 'SELL' ? (
            <Text style={styles.contextText}>
              This sale reduced your {tx.asset_class} exposure. Proceeds can be reinvested in other asset classes to improve diversification.
            </Text>
          ) : tx.type === 'DIVIDEND' || tx.type === 'INTEREST' ? (
            <Text style={styles.contextText}>
              Income received from your investment. This contributes to your overall portfolio yield and demonstrates the power of income-generating assets.
            </Text>
          ) : (
            <Text style={styles.contextText}>This transaction has been recorded in your unified portfolio history.</Text>
          )}
        </View>

        {/* Action row */}
        <TouchableOpacity
          style={styles.viewHoldingBtn}
          onPress={() => navigation.navigate('Holdings', {})}
        >
          <Text style={styles.viewHoldingText}>View in Holdings →</Text>
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
  headerSymbol: { color: '#fff', fontSize: 22, fontWeight: 'bold' },
  headerSub: { color: '#bfdbfe', fontSize: 12, marginTop: 1 },
  typeBadge: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8 },
  typeBadgeText: { fontSize: 12, fontWeight: 'bold' },

  scroll: { flex: 1 },

  amountCard: {
    backgroundColor: '#fff', borderRadius: 20, padding: 24, marginBottom: 14,
    alignItems: 'center', borderWidth: 1, borderColor: 'rgba(27,58,107,0.08)',
    shadowColor: '#1b3a6b', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.06, shadowRadius: 12, elevation: 3,
  },
  amountLabel: { color: '#94a3b8', fontSize: 13, fontWeight: '500', marginBottom: 8 },
  amountVal: { fontSize: 38, fontWeight: 'bold' },
  amountDate: { color: '#94a3b8', fontSize: 13, marginTop: 8 },

  card: {
    backgroundColor: '#fff', borderRadius: 18, padding: 16, marginBottom: 14,
    borderWidth: 1, borderColor: 'rgba(27,58,107,0.08)',
    shadowColor: '#1b3a6b', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2,
  },
  cardTitle: { color: '#1e293b', fontSize: 15, fontWeight: 'bold', marginBottom: 12 },

  detailRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 11 },
  detailLabel: { color: '#64748b', fontSize: 13, fontWeight: '500' },
  detailVal: { color: '#0f172a', fontSize: 13, fontWeight: '700', maxWidth: '55%', textAlign: 'right' },

  impactCard: {
    backgroundColor: '#eff6ff', borderColor: '#bfdbfe', borderWidth: 1.5,
    borderRadius: 16, padding: 16, marginBottom: 14,
  },
  impactHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  impactTitle: { color: '#1d4ed8', fontSize: 14, fontWeight: 'bold' },
  impactText: { color: '#1d4ed8', fontSize: 14, lineHeight: 22, fontWeight: '500' },

  contextText: { color: '#475569', fontSize: 13, lineHeight: 21 },
  contextWarn: { flexDirection: 'row', alignItems: 'flex-start', gap: 7, marginTop: 10, backgroundColor: '#fffbeb', padding: 10, borderRadius: 10 },
  contextWarnText: { color: '#92400e', fontSize: 12, flex: 1, lineHeight: 18 },

  viewHoldingBtn: {
    backgroundColor: '#fff', borderColor: '#e2e8f0', borderWidth: 1,
    borderRadius: 14, paddingVertical: 15, alignItems: 'center',
  },
  viewHoldingText: { color: '#2563eb', fontSize: 14, fontWeight: '700' },
});
