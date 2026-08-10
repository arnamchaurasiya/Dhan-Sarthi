import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { ShieldCheck, AlertTriangle, Check, BookOpen } from 'lucide-react-native';
import { Product, InvestorProfile } from './margData';

interface Props {
  product: Product;
  profile: InvestorProfile;
  onNavigateToGyaan: (topicId: string) => void;
  onContinueToAmount: () => void;
}

export default function DecisionReviewScreen({
  product,
  profile,
  onNavigateToGyaan,
  onContinueToAmount,
}: Props) {
  const [risksAcknowledged, setRisksAcknowledged] = useState<boolean>(false);

  return (
    <View style={{ flex: 1, backgroundColor: '#f8fafc' }}>
      <ScrollView style={styles.scrollBody} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.headerSubCaption}>
          SEBI Investor Protection • Cooling step before investment execution
        </Text>

        {/* Product Card */}
        <View style={styles.summaryCard}>
          <Text style={styles.cardHeaderTitle}>Review Selected Product</Text>
          <Text style={styles.productName}>{product.name}</Text>
          <Text style={styles.productType}>{product.type}</Text>

          <View style={styles.metricsGrid}>
            <View style={styles.metricCell}>
              <Text style={styles.metricLabel}>Your Suitability</Text>
              <Text style={[styles.metricVal, { color: '#16a34a' }]}>{product.matchScore}% Match</Text>
            </View>
            <View style={styles.metricCell}>
              <Text style={styles.metricLabel}>Your Risk Profile</Text>
              <Text style={styles.metricVal}>{profile.riskProfile}</Text>
            </View>
            <View style={styles.metricCell}>
              <Text style={styles.metricLabel}>Expected Yield</Text>
              <Text style={styles.metricVal}>{product.expectedYield}</Text>
            </View>
            <View style={styles.metricCell}>
              <Text style={styles.metricLabel}>Target Horizon</Text>
              <Text style={styles.metricVal}>{profile.investmentHorizon}</Text>
            </View>
          </View>
        </View>

        {/* Key Risks Warning Box */}
        <Text style={styles.sectionHeading}>Mandatory Risk Disclosures</Text>

        <View style={styles.risksBox}>
          {product.keyRisks.map((riskStr, idx) => (
            <View key={idx} style={styles.riskRow}>
              <AlertTriangle color="#d97706" size={16} style={{ marginRight: 8, marginTop: 2 }} />
              <Text style={styles.riskText}>{riskStr}</Text>
            </View>
          ))}
        </View>

        {/* Gyaan Education Nudge */}
        <TouchableOpacity
          style={styles.gyaanLinkCard}
          onPress={() => onNavigateToGyaan(product.gyaanTopicId)}
        >
          <BookOpen color="#2563eb" size={18} style={{ marginRight: 10 }} />
          <View style={{ flex: 1 }}>
            <Text style={styles.gyaanLinkTitle}>Need more clarity on risks?</Text>
            <Text style={styles.gyaanLinkSub}>Read SEBI investor guide in Dhan Gyaan</Text>
          </View>
        </TouchableOpacity>

        {/* Mandatory Checkbox */}
        <TouchableOpacity
          style={styles.checkRow}
          onPress={() => setRisksAcknowledged(!risksAcknowledged)}
          activeOpacity={0.8}
        >
          <View style={[styles.checkboxOuter, risksAcknowledged && styles.checkboxOuterChecked]}>
            {risksAcknowledged && <Check color="#ffffff" size={14} strokeWidth={3} />}
          </View>
          <Text style={styles.checkText}>
            I confirm that I have reviewed the product suitability, investment horizon requirements, and key risk disclosures.
          </Text>
        </TouchableOpacity>

        {/* Primary CTA */}
        <TouchableOpacity
          style={[styles.primaryBtn, !risksAcknowledged && { opacity: 0.5 }]}
          disabled={!risksAcknowledged}
          onPress={onContinueToAmount}
          activeOpacity={0.85}
        >
          <Text style={styles.primaryBtnText} numberOfLines={2}>
            Continue to Investment Amount →
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollBody: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 110 },
  headerSubCaption: { color: '#64748b', fontSize: 13, marginBottom: 12 },

  summaryCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 16,
  },
  cardHeaderTitle: { fontSize: 12, color: '#64748b', textTransform: 'uppercase', fontWeight: 'bold' },
  productName: { fontSize: 20, fontWeight: 'bold', color: '#0f172a', marginTop: 4 },
  productType: { fontSize: 13, color: '#64748b', marginTop: 2, marginBottom: 14 },

  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 8,
  },
  metricCell: { width: '50%', padding: 8 },
  metricLabel: { fontSize: 11, color: '#64748b' },
  metricVal: { fontSize: 13, fontWeight: 'bold', color: '#0f172a', marginTop: 2 },

  sectionHeading: { fontSize: 15, fontWeight: 'bold', color: '#0f172a', marginBottom: 10 },

  risksBox: {
    backgroundColor: '#fffbeb',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#fde68a',
    marginBottom: 14,
  },
  riskRow: { flexDirection: 'row', alignItems: 'flex-start', marginVertical: 4 },
  riskText: { fontSize: 12, color: '#92400e', flex: 1, lineHeight: 17 },

  gyaanLinkCard: {
    backgroundColor: '#eff6ff',
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#bfdbfe',
    marginBottom: 18,
  },
  gyaanLinkTitle: { fontSize: 13, fontWeight: 'bold', color: '#1e40af' },
  gyaanLinkSub: { fontSize: 11, color: '#1e3a8a', marginTop: 1 },

  checkRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1.5,
    borderColor: '#cbd5e1',
  },
  checkboxOuter: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#cbd5e1',
    marginRight: 10,
    marginTop: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxOuterChecked: { backgroundColor: '#16a34a', borderColor: '#16a34a' },
  checkText: { fontSize: 12, color: '#334155', flex: 1, lineHeight: 17 },

  primaryBtn: {
    backgroundColor: '#1b3a6b',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  primaryBtnText: { color: '#ffffff', fontSize: 15, fontWeight: 'bold', textAlign: 'center' },
});
