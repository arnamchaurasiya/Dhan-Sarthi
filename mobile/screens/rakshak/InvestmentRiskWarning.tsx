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
  ShieldAlert,
  AlertTriangle,
  Building2,
  ChevronRight,
  Info,
  CheckCircle2,
} from 'lucide-react-native';

interface InvestmentRiskWarningProps {
  productName?: string;
  onBack: () => void;
  onProceed: () => void;
}

export default function InvestmentRiskWarning({
  productName = 'Nexus Select Trust',
  onBack,
  onProceed,
}: InvestmentRiskWarningProps) {
  const warnings = [
    'Market price may fluctuate based on supply & demand',
    'Quarterly distribution payouts are subject to cash flow and not guaranteed',
    'Real-estate asset class exposure carries commercial vacancy risk',
    'Liquidity on stock exchanges may vary during periods of high volatility',
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Sub Header */}
      <View style={styles.subHeaderContainer}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <ArrowLeft color="#1b3a6b" size={22} />
        </TouchableOpacity>
        <Text style={styles.subHeaderTitle}>Pre-Investment Warning</Text>
        <View style={{ width: 22 }} />
      </View>

      <View style={styles.contentPadding}>
        {/* Intervention Card */}
        <View style={styles.warningCard}>
          <View style={styles.topHeaderRow}>
            <View style={styles.iconBgOrange}>
              <ShieldAlert color="#d97706" size={26} />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.preTag}>DHAN RAKSHAK PROTECTION LAYER</Text>
              <Text style={styles.productTitle}>Before You Invest</Text>
              <Text style={styles.productName}>{productName}</Text>
            </View>
          </View>

          {/* Risk Level Badge */}
          <View style={styles.riskBadgeRow}>
            <Text style={styles.badgeLabel}>Assessed Risk Level:</Text>
            <View style={styles.moderatePill}>
              <Text style={styles.moderatePillText}>Moderate Risk</Text>
            </View>
          </View>

          {/* Key Risk Disclosures */}
          <Text style={styles.disclosuresTitle}>Please consider before subscribing:</Text>
          <View style={styles.warningList}>
            {warnings.map((item, idx) => (
              <View key={idx} style={styles.warningItem}>
                <AlertTriangle color="#d97706" size={16} style={{ marginRight: 8, marginTop: 2 }} />
                <Text style={styles.warningText}>{item}</Text>
              </View>
            ))}
          </View>

          {/* SEBI Compliance Footnote */}
          <View style={styles.sebiFootnoteBox}>
            <Info color="#2563eb" size={16} style={{ marginRight: 6 }} />
            <Text style={styles.sebiFootnoteText}>
              SEBI Investor Protection Mandate: All registered intermediaries must present key risk disclosures prior to trade execution.
            </Text>
          </View>

          {/* Actions */}
          <TouchableOpacity
            style={styles.continueBtn}
            activeOpacity={0.85}
            onPress={onProceed}
          >
            <Text style={styles.continueBtnText}>Continue to Safety Check</Text>
            <ChevronRight color="#ffffff" size={18} />
          </TouchableOpacity>
        </View>

        {/* Back Button */}
        <TouchableOpacity style={styles.reviewBtn} onPress={onBack}>
          <Text style={styles.reviewBtnText}>Review Product Details</Text>
        </TouchableOpacity>
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
  warningCard: {
    backgroundColor: '#fff7ed',
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: '#fed7aa',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  topHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  iconBgOrange: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#fef3c7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  preTag: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#d97706',
    letterSpacing: 0.5,
  },
  productTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#9a3412',
  },
  productName: {
    fontSize: 13,
    color: '#7c2d12',
  },
  riskBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ffedd5',
    marginBottom: 14,
  },
  badgeLabel: {
    fontSize: 12,
    color: '#7c2d12',
  },
  moderatePill: {
    backgroundColor: '#fde68a',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  moderatePillText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#92400e',
  },
  disclosuresTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 8,
  },
  warningList: {
    marginBottom: 16,
  },
  warningItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#ffffff',
    padding: 10,
    borderRadius: 8,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: '#fed7aa',
  },
  warningText: {
    fontSize: 12,
    color: '#7c2d12',
    flex: 1,
    lineHeight: 16,
  },
  sebiFootnoteBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eff6ff',
    borderRadius: 10,
    padding: 10,
    marginBottom: 16,
  },
  sebiFootnoteText: {
    fontSize: 11,
    color: '#1e40af',
    flex: 1,
    lineHeight: 15,
  },
  continueBtn: {
    backgroundColor: '#1b3a6b',
    borderRadius: 10,
    height: 46,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueBtnText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
    marginRight: 4,
  },
  reviewBtn: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    height: 46,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  reviewBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1b3a6b',
  },
});
