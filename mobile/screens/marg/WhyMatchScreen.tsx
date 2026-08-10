import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { CheckCircle2, AlertTriangle, Sparkles, ChevronRight } from 'lucide-react-native';
import { Product, InvestorProfile, getExplainabilityMatrix } from './margData';

interface Props {
  product: Product;
  profile: InvestorProfile;
  onNavigateToCompare: () => void;
  onProceedToDecision: () => void;
}

export default function WhyMatchScreen({
  product,
  profile,
  onNavigateToCompare,
  onProceedToDecision,
}: Props) {
  const matrix = getExplainabilityMatrix(profile, product);

  return (
    <View style={{ flex: 1, backgroundColor: '#f8fafc' }}>
      <ScrollView style={styles.scrollBody} contentContainerStyle={styles.scrollContent}>
        {/* Header Hero */}
        <View style={styles.heroCard}>
          <View style={styles.heroTopRow}>
            <Sparkles color="#16a34a" size={24} style={{ marginRight: 10 }} />
            <View style={{ flex: 1 }}>
              <Text style={styles.heroTitle}>{product.name}</Text>
              <Text style={styles.heroSub}>{product.matchScore}% Suitable for You</Text>
            </View>
          </View>
        </View>

        {/* Explainability Factor Matrix Table */}
        <Text style={styles.sectionHeading}>Suitability Factor Breakdown</Text>

        <View style={styles.tableCard}>
          <View style={styles.tableHeaderRow}>
            <Text style={[styles.tableCellHeader, { width: '22%' }]}>Factor</Text>
            <Text style={[styles.tableCellHeader, { width: '30%' }]}>Your Profile</Text>
            <Text style={[styles.tableCellHeader, { width: '26%' }]}>Product</Text>
            <Text style={[styles.tableCellHeader, { width: '22%', textAlign: 'right' }]}>Result</Text>
          </View>

          {matrix.map((row, idx) => (
            <View
              key={idx}
              style={[
                styles.tableRow,
                idx === matrix.length - 1 && { borderBottomWidth: 0 },
              ]}
            >
              <Text style={[styles.tableCell, { width: '22%', fontWeight: 'bold' }]}>
                {row.factor}
              </Text>
              <Text style={[styles.tableCell, { width: '30%', color: '#475569' }]}>
                {row.yourProfile}
              </Text>
              <Text style={[styles.tableCell, { width: '26%', color: '#475569' }]}>
                {row.productParam}
              </Text>
              <Text
                style={[
                  styles.tableCell,
                  { width: '22%', textAlign: 'right', fontWeight: 'bold', color: '#16a34a' },
                ]}
              >
                ✅ Match
              </Text>
            </View>
          ))}
        </View>

        {/* Rationale Narrative */}
        <Text style={styles.sectionHeading}>Why It Matches Your Portfolio</Text>

        <View style={styles.rationaleCard}>
          <View style={styles.bulletRow}>
            <CheckCircle2 color="#16a34a" size={16} style={{ marginRight: 8, marginTop: 2 }} />
            <Text style={styles.bulletText}>
              <Text style={{ fontWeight: 'bold' }}>Risk Alignment:</Text> Risk level ({product.riskLevel}) aligns with your comfortable drawdown limits.
            </Text>
          </View>

          <View style={styles.bulletRow}>
            <CheckCircle2 color="#16a34a" size={16} style={{ marginRight: 8, marginTop: 2 }} />
            <Text style={styles.bulletText}>
              <Text style={{ fontWeight: 'bold' }}>Horizon Fit:</Text> Required holding period ({product.horizonReq}) fits inside your {profile.investmentHorizon} target.
            </Text>
          </View>

          <View style={styles.bulletRow}>
            <CheckCircle2 color="#16a34a" size={16} style={{ marginRight: 8, marginTop: 2 }} />
            <Text style={styles.bulletText}>
              <Text style={{ fontWeight: 'bold' }}>Portfolio Diversification:</Text> Adds commercial real estate cash flow outside direct equity ({profile.directEquityAllocationPct}% of Darpan portfolio).
            </Text>
          </View>

          <View style={styles.bulletRow}>
            <AlertTriangle color="#d97706" size={16} style={{ marginRight: 8, marginTop: 2 }} />
            <Text style={[styles.bulletText, { color: '#92400e' }]}>
              <Text style={{ fontWeight: 'bold' }}>Trade-off to note:</Text> Liquidity is lower than instant cash savings, requiring stock exchange execution.
            </Text>
          </View>
        </View>

        {/* Next step prompt */}
        <TouchableOpacity style={styles.compareLinkCard} onPress={onNavigateToCompare}>
          <Text style={styles.compareLinkText}>Compare with InvIT & Corporate Bonds →</Text>
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.bottomFixedBar}>
        <TouchableOpacity style={styles.primaryBtn} onPress={onProceedToDecision}>
          <Text style={styles.primaryBtnText}>Review & Continue with {product.name} →</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollBody: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 110 },

  heroCard: {
    backgroundColor: '#f0fdf4',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#bbf7d0',
    marginBottom: 16,
  },
  heroTopRow: { flexDirection: 'row', alignItems: 'center' },
  heroTitle: { fontSize: 18, fontWeight: 'bold', color: '#0f172a' },
  heroSub: { fontSize: 13, color: '#166534', fontWeight: 'bold', marginTop: 2 },

  sectionHeading: { fontSize: 15, fontWeight: 'bold', color: '#0f172a', marginBottom: 10 },

  tableCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    overflow: 'hidden',
    marginBottom: 18,
  },
  tableHeaderRow: {
    flexDirection: 'row',
    backgroundColor: '#f1f5f9',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#cbd5e1',
  },
  tableCellHeader: { fontSize: 11, color: '#475569', fontWeight: 'bold' },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    alignItems: 'center',
  },
  tableCell: { fontSize: 11, color: '#0f172a' },

  rationaleCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 16,
  },
  bulletRow: { flexDirection: 'row', alignItems: 'flex-start', marginVertical: 6 },
  bulletText: { fontSize: 12, color: '#334155', flex: 1, lineHeight: 17 },

  compareLinkCard: {
    backgroundColor: '#eff6ff',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  compareLinkText: { color: '#2563eb', fontSize: 13, fontWeight: 'bold' },

  bottomFixedBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    padding: 16,
  },
  primaryBtn: {
    backgroundColor: '#1b3a6b',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  primaryBtnText: { color: '#ffffff', fontSize: 15, fontWeight: 'bold' },
});
