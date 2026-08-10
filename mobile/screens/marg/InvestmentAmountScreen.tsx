import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { PieChart, Landmark, ArrowRight, ShieldCheck } from 'lucide-react-native';
import { Product, InvestorProfile, calculatePortfolioImpact } from './margData';

interface Props {
  product: Product;
  profile: InvestorProfile;
  onContinueToAccount: (amount: number) => void;
}

export default function InvestmentAmountScreen({
  product,
  profile,
  onContinueToAccount,
}: Props) {
  const [amount, setAmount] = useState<number>(25000);

  const impact = calculatePortfolioImpact(
    profile.portfolioValue,
    profile.directEquityAllocationPct,
    profile.reitAllocationPct,
    amount
  );

  const isValidAmount = amount >= product.minInvestValue;

  const handleNext = () => {
    if (isValidAmount) {
      onContinueToAccount(amount);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#f8fafc' }}>
      <ScrollView style={styles.scrollBody} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.headerSubCaption}>
          Step 13 • Specify investment capital and check Dhan Darpan portfolio impact
        </Text>

        {/* Selected Product Snippet */}
        <View style={styles.productSnippetCard}>
          <Text style={styles.snippetTitle}>{product.name}</Text>
          <Text style={styles.snippetSub}>{product.type} • Exp. Yield: {product.expectedYield}</Text>
          <Text style={styles.snippetMin}>Min. Required: {product.minInvest}</Text>
        </View>

        {/* Amount Input */}
        <Text style={styles.fieldLabel}>Enter Investment Amount</Text>
        <View style={[styles.amountInputWrap, !isValidAmount && styles.inputError]}>
          <Text style={styles.currencySymbol}>₹</Text>
          <TextInput
            style={styles.amountInputText}
            keyboardType="numeric"
            value={amount ? amount.toString() : ''}
            onChangeText={(txt) => {
              const clean = txt.replace(/[^0-9]/g, '');
              setAmount(clean ? parseInt(clean, 10) : 0);
            }}
          />
        </View>
        {!isValidAmount && (
          <Text style={styles.errorText}>
            Minimum investment required for {product.name} is {product.minInvest}
          </Text>
        )}

        {/* Quick Add Pills */}
        <View style={styles.quickPillsRow}>
          {[10000, 25000, 50000].map((add) => (
            <TouchableOpacity
              key={add}
              style={styles.quickPillBtn}
              onPress={() => setAmount((prev) => prev + add)}
            >
              <Text style={styles.quickPillBtnText}>+ ₹{add.toLocaleString('en-IN')}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Dhan Darpan ↔ Dhan Marg Connection: Portfolio Impact Visualization */}
        <Text style={[styles.sectionHeading, { marginTop: 22 }]}>
          Dhan Darpan Portfolio Impact Visualization
        </Text>

        <View style={styles.impactCard}>
          <View style={styles.impactHeaderRow}>
            <PieChart color="#2563eb" size={18} style={{ marginRight: 8 }} />
            <Text style={styles.impactHeaderTitle}>Estimated Asset Allocation Shift</Text>
          </View>

          {/* Allocation rows */}
          <View style={styles.allocationRow}>
            <Text style={styles.allocLabel}>REIT Asset Allocation</Text>
            <View style={styles.allocValGroup}>
              <Text style={styles.allocOldVal}>{impact.oldReitPct}%</Text>
              <ArrowRight color="#64748b" size={14} style={{ marginHorizontal: 6 }} />
              <Text style={[styles.allocNewVal, { color: '#16a34a' }]}>{impact.newReitPct}%</Text>
            </View>
          </View>

          <View style={styles.allocationRow}>
            <Text style={styles.allocLabel}>Direct Equity Concentration</Text>
            <View style={styles.allocValGroup}>
              <Text style={styles.allocOldVal}>{impact.oldEquityPct}%</Text>
              <ArrowRight color="#64748b" size={14} style={{ marginHorizontal: 6 }} />
              <Text style={[styles.allocNewVal, { color: '#2563eb' }]}>{impact.newEquityPct}%</Text>
            </View>
          </View>

          <View style={styles.unitEstimateRow}>
            <Text style={styles.unitEstimateText}>
              Estimated Allotment: <Text style={{ fontWeight: 'bold' }}>~ {impact.unitsApprox} Units</Text>
            </Text>
          </View>
        </View>

        {/* Action Button */}
        <TouchableOpacity
          style={[styles.primaryBtn, !isValidAmount && { opacity: 0.5 }]}
          disabled={!isValidAmount}
          onPress={handleNext}
          activeOpacity={0.85}
        >
          <Text style={styles.primaryBtnText} numberOfLines={2}>Select Investment Account →</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollBody: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 110 },
  headerSubCaption: { color: '#64748b', fontSize: 13, marginBottom: 12 },

  productSnippetCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 16,
  },
  snippetTitle: { fontSize: 16, fontWeight: 'bold', color: '#0f172a' },
  snippetSub: { fontSize: 12, color: '#64748b', marginTop: 2 },
  snippetMin: { fontSize: 11, color: '#2563eb', fontWeight: 'bold', marginTop: 4 },

  fieldLabel: { fontSize: 14, fontWeight: 'bold', color: '#0f172a', marginBottom: 8 },
  amountInputWrap: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#2563eb',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 56,
  },
  inputError: { borderColor: '#ef4444' },
  currencySymbol: { fontSize: 22, fontWeight: 'bold', color: '#0f172a', marginRight: 8 },
  amountInputText: { flex: 1, fontSize: 22, fontWeight: 'bold', color: '#0f172a' },
  errorText: { color: '#ef4444', fontSize: 12, marginTop: 4 },

  quickPillsRow: { flexDirection: 'row', gap: 8, marginTop: 12, marginBottom: 10 },
  quickPillBtn: {
    flex: 1,
    backgroundColor: '#eff6ff',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  quickPillBtnText: { color: '#2563eb', fontSize: 12, fontWeight: 'bold' },

  sectionHeading: { fontSize: 15, fontWeight: 'bold', color: '#0f172a', marginBottom: 10 },

  impactCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  impactHeaderRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  impactHeaderTitle: { fontSize: 14, fontWeight: 'bold', color: '#0f172a' },

  allocationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  allocLabel: { fontSize: 13, color: '#475569' },
  allocValGroup: { flexDirection: 'row', alignItems: 'center' },
  allocOldVal: { fontSize: 13, color: '#64748b', textDecorationLine: 'line-through' },
  allocNewVal: { fontSize: 14, fontWeight: 'bold' },

  unitEstimateRow: {
    backgroundColor: '#f8fafc',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    marginTop: 12,
  },
  unitEstimateText: { fontSize: 12, color: '#334155' },

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
