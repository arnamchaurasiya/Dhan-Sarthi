import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {
  ArrowLeft,
  CheckCircle2,
  ShieldCheck,
  Building2,
  FileCheck,
  ChevronRight,
  Info,
  Lock,
} from 'lucide-react-native';

interface SafetyCheckBeforeInvestmentProps {
  productName?: string;
  onBack: () => void;
  onConfirmInvestment: () => void;
}

export default function SafetyCheckBeforeInvestment({
  productName = 'Nexus Select Trust',
  onBack,
  onConfirmInvestment,
}: SafetyCheckBeforeInvestmentProps) {
  const checklist = [
    { label: 'Product information reviewed', desc: 'Key features, yield structure & tenure verified', done: true },
    { label: 'Key risks displayed', desc: 'Market price & cash flow risk disclosures acknowledged', done: true },
    { label: 'Entity verified', desc: 'Issuer verified against SEBI registry (IN/REIT/19-20/0007)', done: true },
    { label: 'Suitability assessment completed', desc: 'Matches Moderate risk profile (Suitability Score: 92%)', done: true },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.subHeaderContainer}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <ArrowLeft color="#1b3a6b" size={22} />
        </TouchableOpacity>
        <Text style={styles.subHeaderTitle}>Investment Safety Check</Text>
        <View style={{ width: 22 }} />
      </View>

      <View style={styles.contentPadding}>
        {/* Safety Check Card */}
        <View style={styles.checkCard}>
          <View style={styles.topRow}>
            <View style={styles.shieldIconBg}>
              <ShieldCheck color="#16a34a" size={26} />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.cardHeaderTag}>FINAL SAFETY CHECKPOINT</Text>
              <Text style={styles.cardTitle}>Verified Protection Status</Text>
              <Text style={styles.cardProduct}>{productName}</Text>
            </View>
          </View>

          {/* 4 Checklist Items */}
          <View style={styles.checklistGroup}>
            {checklist.map((item, idx) => (
              <View key={idx} style={styles.checkItem}>
                <CheckCircle2 color="#16a34a" size={20} style={{ marginRight: 10, marginTop: 2 }} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.itemLabel}>✓ {item.label}</Text>
                  <Text style={styles.itemDesc}>{item.desc}</Text>
                </View>
              </View>
            ))}
          </View>

          {/* Protective Notice */}
          <View style={styles.noticeBox}>
            <Info color="#2563eb" size={16} style={{ marginRight: 6 }} />
            <Text style={styles.noticeText}>
              Before continuing: Make sure you understand the product, potential return variability, and associated investment risks.
            </Text>
          </View>

          {/* Final Buy / Invest Execution Button */}
          <TouchableOpacity
            style={styles.confirmBtn}
            activeOpacity={0.85}
            onPress={onConfirmInvestment}
          >
            <Lock color="#ffffff" size={16} style={{ marginRight: 6 }} />
            <Text style={styles.confirmBtnText}>Continue to Investment Execution</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  subHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  backButton: {
    padding: 4,
  },
  subHeaderTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#1b3a6b',
  },
  contentPadding: {
    padding: 16,
  },
  checkCard: {
    backgroundColor: '#f0fdf4',
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: '#bbf7d0',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  shieldIconBg: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#dcfce7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardHeaderTag: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#16a34a',
    letterSpacing: 0.5,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#14532d',
  },
  cardProduct: {
    fontSize: 12,
    color: '#166534',
  },
  checklistGroup: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#dcfce7',
    marginBottom: 16,
  },
  checkItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0fdf4',
  },
  itemLabel: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#14532d',
  },
  itemDesc: {
    fontSize: 11,
    color: '#166534',
    marginTop: 2,
  },
  noticeBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#eff6ff',
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
  },
  noticeText: {
    fontSize: 11,
    color: '#1e40af',
    flex: 1,
    lineHeight: 15,
  },
  confirmBtn: {
    backgroundColor: '#16a34a',
    borderRadius: 10,
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmBtnText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
  },
});
