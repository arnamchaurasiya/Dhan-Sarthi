import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { TrendingUp, AlertTriangle, ShieldCheck, Wallet, CheckCircle2 } from 'lucide-react-native';

const API_BASE = 'http://10.169.95.9:8000';

export default function DarpanScreen() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.post(`${API_BASE}/api/v1/mock-dpi/aa/consent`, {
      user_id: "user_123",
      fip_ids: ["fip_zerodha", "fip_cams"]
    }).then(res => {
      const handle = res.data.consent_handle;
      return axios.get(`${API_BASE}/api/v1/mock-dpi/aa/fetch-holdings/${handle}`);
    }).then(res => {
      setData(res.data.data);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#1b3a6b" />
        <Text style={styles.loadingText}>Fetching unified portfolio via Sahamati AA...</Text>
      </View>
    );
  }

  if (!data) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.errorText}>Failed to load portfolio. Ensure backend server is running.</Text>
      </View>
    );
  }

  const { summary, holdings } = data;

  return (
    <ScrollView style={styles.container}>
      {/* SEBI Saarthi Hero Card */}
      <View style={styles.heroCard}>
        <View style={styles.heroBadgeRow}>
          <Text style={styles.heroBadgeText}>SEBI REGISTERED</Text>
          <Text style={styles.heroBadgeSub}>• Dhan Darpan</Text>
        </View>
        <Text style={styles.heroTitle}>Unified Portfolio Mirror</Text>
        <Text style={styles.heroSub}>Consolidated holdings from NSDL, CDSL & CAMS</Text>
      </View>

      <View style={styles.contentPadding}>
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.cardIconWrap}>
              <Wallet color="#1b3a6b" size={18} />
            </View>
            <Text style={styles.label}>Consolidated Net Worth</Text>
          </View>
          <Text style={styles.netWorth}>₹{summary.total_net_worth.toLocaleString('en-IN')}</Text>
          <View style={styles.gainBox}>
            <TrendingUp color="#16a34a" size={16} />
            <Text style={styles.gainText}>
              {' '} +₹{summary.todays_gain.toLocaleString('en-IN')} (+{summary.todays_gain_percentage}%) today
            </Text>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.cardIconWrapAmber}>
              <CheckCircle2 color="#d97706" size={18} />
            </View>
            <Text style={styles.label}>Portfolio Health Score</Text>
          </View>
          <Text style={styles.healthScore}>78 / 100</Text>
          <View style={styles.warningBox}>
            <AlertTriangle color="#d97706" size={16} />
            <Text style={styles.warningText}> High concentration in Direct Equity. Consider rebalancing into Debt/SGBs.</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Verified Multi-Asset Holdings</Text>
        {holdings.map((h: any, idx: number) => (
          <View key={idx} style={styles.holdingItem}>
            <View style={styles.holdingLeft}>
              <Text style={styles.holdingSymbol}>{h.symbol}</Text>
              <Text style={styles.holdingClass}>{h.asset_class} • {h.broker}</Text>
            </View>
            <View style={styles.holdingRight}>
              <Text style={styles.holdingValue}>₹{h.total_value.toLocaleString('en-IN')}</Text>
              <Text style={styles.holdingQty}>Qty: {h.quantity}</Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f7fb',
  },
  centered: {
    padding: 32,
    justify: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#64748b',
    marginTop: 16,
    fontWeight: '500',
  },
  errorText: {
    color: '#dc2626',
    fontWeight: '600',
  },
  heroCard: {
    backgroundColor: '#1b3a6b',
    padding: 24,
    borderBottomRightRadius: 36,
  },
  heroBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  heroBadgeText: {
    color: '#ffffff',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    fontSize: 10,
    fontWeight: 'bold',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  heroBadgeSub: {
    color: '#bfdbfe',
    fontSize: 11,
    fontWeight: '600',
    marginLeft: 6,
  },
  heroTitle: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  heroSub: {
    color: '#e2e8f0',
    fontSize: 13,
    marginTop: 4,
  },
  contentPadding: {
    padding: 16,
  },
  card: {
    backgroundColor: '#ffffff',
    borderColor: 'rgba(27, 58, 107, 0.08)',
    borderWidth: 1,
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    shadowColor: '#1b3a6b',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardIconWrap: {
    padding: 6,
    backgroundColor: '#ebf3fa',
    borderRadius: 8,
    marginRight: 8,
  },
  cardIconWrapAmber: {
    padding: 6,
    backgroundColor: '#fef3c7',
    borderRadius: 8,
    marginRight: 8,
  },
  label: {
    color: '#64748b',
    fontSize: 13,
    fontWeight: '600',
  },
  netWorth: {
    color: '#1b3a6b',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  gainBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#dcfce7',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  gainText: {
    color: '#16a34a',
    fontSize: 13,
    fontWeight: '700',
  },
  healthScore: {
    color: '#d97706',
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  warningBox: {
    flexDirection: 'row',
    backgroundColor: '#fffbeb',
    borderColor: '#fde68a',
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  warningText: {
    color: '#92400e',
    fontSize: 12,
    marginLeft: 6,
    flex: 1,
    fontWeight: '500',
  },
  sectionTitle: {
    color: '#1e293b',
    fontSize: 17,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 12,
  },
  holdingItem: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 14,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderColor: 'rgba(27, 58, 107, 0.08)',
    borderWidth: 1,
  },
  holdingLeft: {
    flex: 1,
  },
  holdingSymbol: {
    color: '#0f172a',
    fontSize: 15,
    fontWeight: 'bold',
  },
  holdingClass: {
    color: '#64748b',
    fontSize: 12,
    marginTop: 2,
  },
  holdingRight: {
    alignItems: 'flex-end',
  },
  holdingValue: {
    color: '#1b3a6b',
    fontSize: 15,
    fontWeight: 'bold',
  },
  holdingQty: {
    color: '#64748b',
    fontSize: 12,
    marginTop: 2,
  }
});

