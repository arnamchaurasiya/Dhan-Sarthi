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
  Compass,
  PieChart,
  ShieldAlert,
  ChevronRight,
  Info,
  CheckCircle2,
} from 'lucide-react-native';

interface RiskAlertDetailsProps {
  onBack: () => void;
  onNavigateMarg: () => void;
}

export default function RiskAlertDetails({
  onBack,
  onNavigateMarg,
}: RiskAlertDetailsProps) {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.subHeaderContainer}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <ArrowLeft color="#1b3a6b" size={22} />
        </TouchableOpacity>
        <Text style={styles.subHeaderTitle}>Portfolio Concentration Risk</Text>
        <View style={{ width: 22 }} />
      </View>

      <View style={styles.contentPadding}>
        {/* Detail Breakdown Banner */}
        <View style={styles.detailCard}>
          <View style={styles.titleRow}>
            <View style={styles.pieIconBg}>
              <PieChart color="#2563eb" size={24} />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.detailTitle}>Portfolio Concentration Risk</Text>
              <Text style={styles.detailSub}>48.2% allocated to direct equity</Text>
            </View>
          </View>

          {/* Allocation Breakdown Comparison */}
          <View style={styles.allocationBox}>
            <Text style={styles.allocHeader}>Your Current Exposure</Text>
            
            <View style={styles.exposureRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.expLabel}>Direct Equity</Text>
                <View style={styles.barBg}>
                  <View style={[styles.barFill, { width: '48.2%', backgroundColor: '#2563eb' }]} />
                </View>
              </View>
              <Text style={styles.expVal}>48.2%</Text>
            </View>

            <View style={styles.exposureRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.expLabel}>Other Assets (MFs, Debt, REITs, Gold)</Text>
                <View style={styles.barBg}>
                  <View style={[styles.barFill, { width: '51.8%', backgroundColor: '#38bdf8' }]} />
                </View>
              </View>
              <Text style={styles.expVal}>51.8%</Text>
            </View>
          </View>

          {/* Why This Matters Section */}
          <View style={styles.whyMattersBox}>
            <Text style={styles.whyHeader}>Why this matters</Text>
            <Text style={styles.whyBody}>
              A concentrated portfolio may experience greater impact from movements in one asset category.
              Diversifying into lower-volatility or recurring income assets (like REITs or debt funds) buffers overall equity drawdowns.
            </Text>
          </View>

          {/* Recommended Next Step Box */}
          <View style={styles.recommendBox}>
            <Text style={styles.recHeader}>Recommended Next Step</Text>
            <Text style={styles.recBody}>
              Explore diversification options tailored specifically to your investor profile and horizon in Dhan Marg.
            </Text>

            <TouchableOpacity
              style={styles.exploreMargBtn}
              activeOpacity={0.85}
              onPress={onNavigateMarg}
            >
              <Compass color="#ffffff" size={18} style={{ marginRight: 6 }} />
              <Text style={styles.exploreMargBtnText}>Explore with Dhan Marg</Text>
              <ChevronRight color="#ffffff" size={16} />
            </TouchableOpacity>
          </View>
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
  detailCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  pieIconBg: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#eff6ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  detailSub: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  allocationBox: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 16,
  },
  allocHeader: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 12,
  },
  exposureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  expLabel: {
    fontSize: 12,
    color: '#475569',
    marginBottom: 4,
  },
  expVal: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0f172a',
    marginLeft: 12,
  },
  barBg: {
    height: 8,
    backgroundColor: '#e2e8f0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 4,
  },
  whyMattersBox: {
    backgroundColor: '#eff6ff',
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
  },
  whyHeader: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#1e40af',
    marginBottom: 4,
  },
  whyBody: {
    fontSize: 12,
    color: '#1d4ed8',
    lineHeight: 17,
  },
  recommendBox: {
    backgroundColor: '#f0fdf4',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#bbf7d0',
  },
  recHeader: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#15803d',
    marginBottom: 4,
  },
  recBody: {
    fontSize: 12,
    color: '#166534',
    lineHeight: 17,
    marginBottom: 12,
  },
  exploreMargBtn: {
    backgroundColor: '#16a34a',
    borderRadius: 10,
    height: 46,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  exploreMargBtnText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
    marginRight: 4,
  },
});
