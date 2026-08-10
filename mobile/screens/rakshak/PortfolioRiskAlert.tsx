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
  AlertTriangle,
  LayoutDashboard,
  Compass,
  ChevronRight,
  PieChart as PieIcon,
  Info,
  ShieldAlert,
} from 'lucide-react-native';

interface PortfolioRiskAlertProps {
  onBack: () => void;
  onNavigate: (screen: string, params?: any) => void;
}

export default function PortfolioRiskAlert({
  onBack,
  onNavigate,
}: PortfolioRiskAlertProps) {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.subHeaderContainer}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <ArrowLeft color="#1b3a6b" size={22} />
        </TouchableOpacity>
        <Text style={styles.subHeaderTitle}>Portfolio Risk Alert</Text>
        <View style={{ width: 22 }} />
      </View>

      <View style={styles.contentPadding}>
        {/* Alert Hero Banner */}
        <View style={styles.alertCard}>
          <View style={styles.topRow}>
            <View style={styles.alertIconCircle}>
              <AlertTriangle color="#d97706" size={26} />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.alertCategoryTag}>PORTFOLIO SAFETY ALERT</Text>
              <Text style={styles.alertTitle}>Concentration Risk Detected</Text>
              <Text style={styles.alertTime}>Triggered by Dhan Darpan Analytics</Text>
            </View>
          </View>

          {/* Metric Highlight Box */}
          <View style={styles.metricBox}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <Text style={styles.assetLabel}>Direct Equity Exposure</Text>
              <Text style={styles.assetPercent}>48.2%</Text>
            </View>

            <View style={styles.progressBg}>
              <View style={[styles.progressFill, { width: '48.2%' }]} />
            </View>

            <Text style={styles.metricSub}>
              Direct equity represents a significant portion (48.2%) of your total portfolio holdings.
            </Text>
          </View>

          {/* Action Buttons */}
          <TouchableOpacity
            style={styles.understandBtn}
            activeOpacity={0.85}
            onPress={() => onNavigate('risk_alert_details')}
          >
            <Text style={styles.understandBtnText}>Understand Risk Details</Text>
            <ChevronRight color="#ffffff" size={16} />
          </TouchableOpacity>
        </View>

        {/* Cross-Product Navigation Section */}
        <Text style={styles.sectionTitle}>Take Safe Action Across Dhan Sarthi</Text>

        <TouchableOpacity
          style={styles.navCard}
          activeOpacity={0.85}
          onPress={() => onNavigate('darpan_view')}
        >
          <View style={[styles.navIconBg, { backgroundColor: '#eff6ff' }]}>
            <LayoutDashboard color="#2563eb" size={22} />
          </View>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.navTitle}>View in Dhan Darpan</Text>
            <Text style={styles.navSub}>Analyze full holding breakdown & asset allocation</Text>
          </View>
          <ChevronRight color="#94a3b8" size={20} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navCard}
          activeOpacity={0.85}
          onPress={() => onNavigate('marg_view')}
        >
          <View style={[styles.navIconBg, { backgroundColor: '#f0fdf4' }]}>
            <Compass color="#16a34a" size={22} />
          </View>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.navTitle}>Explore Diversification in Dhan Marg</Text>
            <Text style={styles.navSub}>Find suitable REITs, Mutual Funds, or Debt instruments</Text>
          </View>
          <ChevronRight color="#94a3b8" size={20} />
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
  alertCard: {
    backgroundColor: '#fff7ed',
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: '#fed7aa',
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
    marginBottom: 14,
  },
  alertIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#fef3c7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  alertCategoryTag: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#d97706',
    letterSpacing: 0.5,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#9a3412',
  },
  alertTime: {
    fontSize: 11,
    color: '#b45309',
  },
  metricBox: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#ffedd5',
    marginBottom: 16,
  },
  assetLabel: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  assetPercent: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#d97706',
  },
  progressBg: {
    height: 10,
    backgroundColor: '#ffedd5',
    borderRadius: 5,
    marginVertical: 10,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#d97706',
    borderRadius: 5,
  },
  metricSub: {
    fontSize: 12,
    color: '#7c2d12',
    lineHeight: 16,
  },
  understandBtn: {
    backgroundColor: '#d97706',
    borderRadius: 10,
    height: 46,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  understandBtnText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
    marginRight: 4,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 12,
  },
  navCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  navIconBg: {
    width: 42,
    height: 42,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  navSub: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 2,
  },
});
