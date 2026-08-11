import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Platform, StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft, CheckCircle2, AlertCircle, RefreshCw, Plus, ChevronRight } from 'lucide-react-native';
import { CONNECTED_ACCOUNTS } from './darpanData';

const STATUS_CONFIG = {
  connected: { color: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0', icon: CheckCircle2, label: 'Connected' },
  syncing: { color: '#d97706', bg: '#fffbeb', border: '#fde68a', icon: RefreshCw, label: 'Syncing' },
  error: { color: '#dc2626', bg: '#fef2f2', border: '#fecaca', icon: AlertCircle, label: 'Error' },
};

export default function ConnectedAccounts() {
  const navigation = useNavigation<any>();

  const connectedCount = CONNECTED_ACCOUNTS.filter(a => a.status === 'connected').length;
  const totalHoldings = CONNECTED_ACCOUNTS.reduce((a, c) => a + c.holdings, 0);

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ArrowLeft color="#fff" size={22} />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Connected Accounts</Text>
          <Text style={styles.headerSub}>Your data sources & consent</Text>
        </View>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={{ padding: 16, paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
        {/* Summary */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <CheckCircle2 color="#16a34a" size={20} />
              <Text style={styles.summaryCount}>{connectedCount}</Text>
              <Text style={styles.summaryLabel}>Connected Sources</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <Text style={styles.summaryCount}>{totalHoldings}</Text>
              <Text style={styles.summaryLabel}>Total Holdings</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <Text style={styles.summaryCount}>AA</Text>
              <Text style={styles.summaryLabel}>Sahamati Active</Text>
            </View>
          </View>
        </View>



        {/* Connected accounts list */}
        <Text style={styles.sectionTitle}>Connected Sources</Text>
        {CONNECTED_ACCOUNTS.map((acc) => {
          const sc = STATUS_CONFIG[acc.status];
          const StatusIcon = sc.icon;
          return (
            <View key={acc.id} style={styles.accountCard}>
              <View style={styles.accountTop}>
                <View style={styles.accountAvatar}>
                  <Text style={styles.accountAvatarText}>{acc.icon}</Text>
                </View>
                <View style={styles.accountMeta}>
                  <Text style={styles.accountName}>{acc.name}</Text>
                  <Text style={styles.accountType}>{acc.type}</Text>
                  <Text style={styles.accountSync}>Last synced: {acc.lastSynced}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: sc.bg, borderColor: sc.border, borderWidth: 1 }]}>
                  <StatusIcon color={sc.color} size={12} />
                  <Text style={[styles.statusText, { color: sc.color }]}>{sc.label}</Text>
                </View>
              </View>

              <View style={styles.accountFooter}>
                <View style={styles.holdingsChip}>
                  <Text style={styles.holdingsChipText}>{acc.holdings} holding{acc.holdings !== 1 ? 's' : ''}</Text>
                </View>
                {acc.dataTypes.map((dt, i) => (
                  <View key={i} style={styles.dataTypeChip}>
                    <Text style={styles.dataTypeText}>{dt}</Text>
                  </View>
                ))}
              </View>
            </View>
          );
        })}

        {/* Add account CTA */}
        <TouchableOpacity
          style={styles.addAccountBtn}
          onPress={() => navigation.navigate('AddAccount')}
          activeOpacity={0.85}
        >
          <View style={styles.addIcon}><Plus color="#1b3a6b" size={20} /></View>
          <View style={{ flex: 1 }}>
            <Text style={styles.addTitle}>Add New Account</Text>
            <Text style={styles.addSub}>Connect more data sources for a complete picture</Text>
          </View>
          <ChevronRight color="#1b3a6b" size={16} />
        </TouchableOpacity>

        {/* What data is accessed */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>What Data Is Accessed?</Text>
          {[
            { type: 'Holdings', desc: 'Your investment positions and quantities' },
            { type: 'Transaction History', desc: 'Buy/sell/SIP history for insights' },
            { type: 'Portfolio Valuation', desc: 'Current market value of holdings' },
          ].map((d, i) => (
            <View key={i} style={styles.dataRow}>
              <CheckCircle2 color="#16a34a" size={14} />
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.dataType}>{d.type}</Text>
                <Text style={styles.dataDesc}>{d.desc}</Text>
              </View>
            </View>
          ))}
          <View style={styles.notAccessedBox}>
            <Text style={styles.notAccessedTitle}>❌ What We Never Access</Text>
            <Text style={styles.notAccessedText}>Bank account details • Passwords • PIN or OTP • Payment instruments</Text>
          </View>
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

  summaryCard: {
    backgroundColor: '#fff', borderRadius: 18, padding: 16, marginBottom: 14,
    borderWidth: 1, borderColor: 'rgba(27,58,107,0.08)',
    shadowColor: '#1b3a6b', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2,
  },
  summaryRow: { flexDirection: 'row', alignItems: 'center' },
  summaryItem: { flex: 1, alignItems: 'center', gap: 4 },
  summaryCount: { color: '#1b3a6b', fontSize: 22, fontWeight: 'bold' },
  summaryLabel: { color: '#94a3b8', fontSize: 11, textAlign: 'center' },
  summaryDivider: { width: 1, height: 40, backgroundColor: '#e2e8f0' },


  sectionTitle: { color: '#1e293b', fontSize: 17, fontWeight: 'bold', marginBottom: 10 },

  accountCard: {
    backgroundColor: '#fff', borderRadius: 16, padding: 14, marginBottom: 10,
    borderWidth: 1, borderColor: 'rgba(27,58,107,0.08)',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.03, shadowRadius: 4, elevation: 1,
  },
  accountTop: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 10 },
  accountAvatar: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#ebf3fa', alignItems: 'center', justifyContent: 'center' },
  accountAvatarText: { color: '#1b3a6b', fontSize: 16, fontWeight: 'bold' },
  accountMeta: { flex: 1 },
  accountName: { color: '#0f172a', fontSize: 14, fontWeight: 'bold' },
  accountType: { color: '#64748b', fontSize: 12, marginTop: 1 },
  accountSync: { color: '#94a3b8', fontSize: 11, marginTop: 2 },
  statusBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 9, paddingVertical: 4, borderRadius: 8 },
  statusText: { fontSize: 11, fontWeight: '700' },
  accountFooter: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  holdingsChip: { backgroundColor: '#ebf3fa', paddingHorizontal: 9, paddingVertical: 4, borderRadius: 8 },
  holdingsChipText: { color: '#1b3a6b', fontSize: 11, fontWeight: '700' },
  dataTypeChip: { backgroundColor: '#f8fafc', borderColor: '#e2e8f0', borderWidth: 1, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 7 },
  dataTypeText: { color: '#64748b', fontSize: 10, fontWeight: '500' },

  addAccountBtn: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff',
    borderColor: '#1b3a6b', borderWidth: 1.5, borderRadius: 16, padding: 16, marginBottom: 14,
    gap: 12,
  },
  addIcon: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#ebf3fa', alignItems: 'center', justifyContent: 'center' },
  addTitle: { color: '#1b3a6b', fontSize: 14, fontWeight: 'bold' },
  addSub: { color: '#64748b', fontSize: 12, marginTop: 2 },

  card: {
    backgroundColor: '#fff', borderRadius: 18, padding: 16, marginBottom: 14,
    borderWidth: 1, borderColor: 'rgba(27,58,107,0.08)',
  },
  cardTitle: { color: '#1e293b', fontSize: 15, fontWeight: 'bold', marginBottom: 12 },
  dataRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12 },
  dataType: { color: '#1e293b', fontSize: 13, fontWeight: '600' },
  dataDesc: { color: '#64748b', fontSize: 12, marginTop: 2 },
  notAccessedBox: { backgroundColor: '#fef2f2', borderRadius: 10, padding: 12, marginTop: 8 },
  notAccessedTitle: { color: '#dc2626', fontSize: 13, fontWeight: 'bold', marginBottom: 4 },
  notAccessedText: { color: '#dc2626', fontSize: 12, lineHeight: 18 },
});
