import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { CheckCircle2, XCircle, TrendingUp, ShieldAlert, Target } from 'lucide-react-native';

const API_BASE = 'http://10.169.95.9:8000';
const RISK_SCORE = 85;

const assets = [
  { id: "NIFTY_IDX", name: "Nifty 50 Index Fund", type: "Mutual Fund", risk: "Moderate", return: "12% p.a." },
  { id: "GOI_BOND", name: "RBI Retail Direct Bonds", type: "Govt Bond", risk: "Low", return: "7.1% p.a." },
  { id: "TCS_EQ", name: "TCS Direct Equity", type: "Stock", risk: "High", return: "15% p.a." },
  { id: "CRYPTO_X", name: "Unregulated Tokens", type: "High Risk", risk: "Very High", return: "Unpredictable" }
];

export default function MargScreen() {
  const [selectedAsset, setSelectedAsset] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const checkSuitability = async (assetId: string) => {
    setSelectedAsset(assetId);
    setLoading(true);
    setResult(null);
    try {
      const res = await axios.post(`${API_BASE}/api/v1/ai/invest/suitability`, {
        user_id: "user_123",
        asset_id: assetId,
        risk_score: RISK_SCORE
      });
      setResult(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* SEBI Saarthi Hero Banner */}
      <View style={styles.heroCard}>
        <View style={styles.heroBadgeRow}>
          <Text style={styles.heroBadgeText}>INVESTMENT ROADMAP</Text>
          <Text style={styles.heroBadgeSub}>• Dhan Marg</Text>
        </View>
        <Text style={styles.heroTitle}>Avenue Suitability Guide</Text>
        <Text style={styles.heroSub}>SEBI-aligned risk assessment engine for retail investors</Text>
      </View>

      <View style={styles.contentPadding}>
        <View style={styles.profileCard}>
          <View>
            <Text style={styles.label}>Investor Risk Profile</Text>
            <Text style={styles.profileValue}>Aggressive Growth</Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={styles.label}>Risk Score</Text>
            <Text style={styles.scoreValue}>{RISK_SCORE} / 100</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Explore Investment Avenues</Text>
        {assets.map((asset) => (
          <TouchableOpacity 
            key={asset.id} 
            style={[styles.assetCard, selectedAsset === asset.id && styles.assetCardSelected]}
            onPress={() => checkSuitability(asset.id)}
          >
            <View style={styles.assetHeader}>
              <View>
                <Text style={styles.assetName}>{asset.name}</Text>
                <View style={styles.typeBadge}>
                  <Text style={styles.typeBadgeText}>{asset.type}</Text>
                </View>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <View style={styles.returnRow}>
                  <TrendingUp color="#16a34a" size={14} style={{marginRight: 4}} />
                  <Text style={styles.returnText}>{asset.return}</Text>
                </View>
                <Text style={styles.riskText}>Risk: {asset.risk}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}

        {loading && (
          <View style={[styles.loadingCard, styles.centered]}>
            <ActivityIndicator color="#1b3a6b" size="large" />
            <Text style={styles.loadingText}>Evaluating asset suitability under SEBI rules...</Text>
          </View>
        )}

        {result && !loading && (
          <View style={[styles.resultCard, result.is_suitable ? styles.suitableCard : styles.unsuitableCard]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
              {result.is_suitable ? (
                <CheckCircle2 color="#16a34a" size={24} style={{ marginRight: 8 }} />
              ) : (
                <XCircle color="#dc2626" size={24} style={{ marginRight: 8 }} />
              )}
              <Text style={[styles.resultTitle, result.is_suitable ? { color: '#15803d' } : { color: '#b91c1c' }]}>
                {result.is_suitable ? 'Suitable Investment Match' : 'High Risk - Not Recommended'}
              </Text>
            </View>
            <Text style={styles.reasonText}>{result.reason}</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f7fb' },
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
  profileCard: { backgroundColor: '#ffffff', padding: 18, borderRadius: 16, borderColor: 'rgba(27, 58, 107, 0.08)', borderWidth: 1, marginBottom: 18, flexDirection: 'row', justifyContent: 'space-between', shadowColor: '#1b3a6b', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 },
  label: { color: '#64748b', fontSize: 12, fontWeight: '600', marginBottom: 2 },
  profileValue: { color: '#1b3a6b', fontSize: 16, fontWeight: 'bold' },
  scoreValue: { color: '#2563eb', fontSize: 20, fontWeight: 'bold' },
  sectionTitle: { color: '#1e293b', fontSize: 16, fontWeight: 'bold', marginBottom: 12 },
  assetCard: { backgroundColor: '#ffffff', padding: 16, borderRadius: 14, borderColor: 'rgba(27, 58, 107, 0.08)', borderWidth: 1, marginBottom: 10, shadowColor: '#1b3a6b', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 6, elevation: 1 },
  assetCardSelected: { borderColor: '#2563eb', backgroundColor: '#ebf3fa', borderWidth: 1.5 },
  assetHeader: { flexDirection: 'row', justifyContent: 'space-between' },
  assetName: { color: '#0f172a', fontSize: 15, fontWeight: 'bold', marginBottom: 4 },
  typeBadge: { backgroundColor: '#ebf3fa', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6, alignSelf: 'flex-start' },
  typeBadgeText: { color: '#1d4ed8', fontSize: 11, fontWeight: '600' },
  returnRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 2 },
  returnText: { color: '#16a34a', fontSize: 14, fontWeight: 'bold' },
  riskText: { color: '#64748b', fontSize: 12 },
  loadingCard: { padding: 20, backgroundColor: '#ffffff', borderRadius: 16, borderColor: 'rgba(27, 58, 107, 0.08)', borderWidth: 1, marginTop: 12 },
  centered: { justifyContent: 'center', alignItems: 'center' },
  loadingText: { color: '#64748b', marginTop: 10, fontWeight: '500' },
  resultCard: { padding: 18, borderRadius: 16, borderWidth: 1, marginTop: 14, marginBottom: 30 },
  suitableCard: { backgroundColor: '#dcfce7', borderColor: '#86efac' },
  unsuitableCard: { backgroundColor: '#ffe4e6', borderColor: '#fca5a5' },
  resultTitle: { fontSize: 16, fontWeight: 'bold' },
  reasonText: { color: '#334155', fontSize: 13, lineHeight: 20, marginTop: 4, fontWeight: '500' },
});

