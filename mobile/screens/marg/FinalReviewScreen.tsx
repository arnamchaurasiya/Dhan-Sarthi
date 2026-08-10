import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { ShieldCheck, Lock, CheckCircle2 } from 'lucide-react-native';
import { Product, InvestorProfile } from './margData';

interface Props {
  product: Product;
  profile: InvestorProfile;
  amount: number;
  selectedAccount: string;
  onConfirmInvestment: () => void;
}

export default function FinalReviewScreen({
  product,
  profile,
  amount,
  selectedAccount,
  onConfirmInvestment,
}: Props) {
  return (
    <View style={{ flex: 1, backgroundColor: '#f8fafc' }}>
      <ScrollView style={styles.scrollBody} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.headerSubCaption}>
          Step 15 • Final review of suitability, risk & execution parameters
        </Text>

        {/* Verification Summary Card */}
        <View style={styles.reviewCard}>
          <Text style={styles.cardHeaderTitle}>Final Order Breakdown</Text>
          <Text style={styles.productName}>{product.name}</Text>
          <Text style={styles.productType}>{product.type}</Text>

          <View style={styles.divider} />

          <View style={styles.reviewRow}>
            <Text style={styles.reviewLabel}>Investment Amount</Text>
            <Text style={styles.reviewValBold}>₹{amount.toLocaleString('en-IN')}</Text>
          </View>

          <View style={styles.reviewRow}>
            <Text style={styles.reviewLabel}>Suitability Score</Text>
            <Text style={[styles.reviewValBold, { color: '#16a34a' }]}>{product.matchScore}% Match</Text>
          </View>

          <View style={styles.reviewRow}>
            <Text style={styles.reviewLabel}>Investor Risk Profile</Text>
            <Text style={styles.reviewVal}>{profile.riskProfile}</Text>
          </View>

          <View style={styles.reviewRow}>
            <Text style={styles.reviewLabel}>Target Horizon</Text>
            <Text style={styles.reviewVal}>{profile.investmentHorizon}</Text>
          </View>

          <View style={styles.reviewRow}>
            <Text style={styles.reviewLabel}>Execution Account</Text>
            <Text style={styles.reviewVal}>{selectedAccount}</Text>
          </View>

          <View style={styles.reviewRow}>
            <Text style={styles.reviewLabel}>Portfolio Impact</Text>
            <Text style={[styles.reviewVal, { color: '#2563eb', fontWeight: 'bold' }]}>
              +3.2% REIT Allocation
            </Text>
          </View>

          <View style={[styles.reviewRow, { borderBottomWidth: 0 }]}>
            <Text style={styles.reviewLabel}>Risk Disclosure Status</Text>
            <Text style={[styles.reviewVal, { color: '#16a34a', fontWeight: 'bold' }]}>
              ✓ Acknowledged
            </Text>
          </View>
        </View>

        {/* SEBI Compliance Security Pill */}
        <View style={styles.secPill}>
          <Lock color="#16a34a" size={16} style={{ marginRight: 8 }} />
          <Text style={styles.secPillText}>
            Secured SEBI DPI Suitability Verification Complete
          </Text>
        </View>
      </ScrollView>

      <View style={styles.bottomFixedBar}>
        <TouchableOpacity style={styles.primaryBtn} onPress={onConfirmInvestment}>
          <Lock color="#ffffff" size={16} style={{ marginRight: 8 }} />
          <Text style={styles.primaryBtnText}>Confirm Investment →</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollBody: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 110 },
  headerSubCaption: { color: '#64748b', fontSize: 13, marginBottom: 12 },

  reviewCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 16,
  },
  cardHeaderTitle: { fontSize: 11, color: '#64748b', textTransform: 'uppercase', fontWeight: 'bold' },
  productName: { fontSize: 18, fontWeight: 'bold', color: '#0f172a', marginTop: 4 },
  productType: { fontSize: 12, color: '#64748b', marginTop: 2 },

  divider: { height: 1, backgroundColor: '#f1f5f9', marginVertical: 12 },

  reviewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f8fafc',
  },
  reviewLabel: { fontSize: 13, color: '#64748b' },
  reviewVal: { fontSize: 13, color: '#0f172a' },
  reviewValBold: { fontSize: 14, fontWeight: 'bold', color: '#0f172a' },

  secPill: {
    backgroundColor: '#f0fdf4',
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#bbf7d0',
  },
  secPillText: { color: '#166534', fontSize: 12, fontWeight: 'bold' },

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
    backgroundColor: '#16a34a',
    borderRadius: 14,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBtnText: { color: '#ffffff', fontSize: 15, fontWeight: 'bold' },
});
