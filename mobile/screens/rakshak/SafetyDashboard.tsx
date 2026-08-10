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
  AlertTriangle,
  FileCheck,
  ShieldAlert,
  Info,
  ChevronRight,
  TrendingUp,
  Sliders,
} from 'lucide-react-native';

interface SafetyDashboardProps {
  onBack: () => void;
  onNavigate: (screen: string, params?: any) => void;
}

export default function SafetyDashboard({ onBack, onNavigate }: SafetyDashboardProps) {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Sub Header */}
      <View style={styles.subHeaderContainer}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <ArrowLeft color="#1b3a6b" size={22} />
        </TouchableOpacity>
        <Text style={styles.subHeaderTitle}>Safety Dashboard</Text>
        <TouchableOpacity style={styles.infoButton}>
          <Info color="#64748b" size={20} />
        </TouchableOpacity>
      </View>

      <View style={styles.contentPadding}>
        {/* Protection Banner */}
        <View style={styles.summaryHeroCard}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={styles.heroShieldBadge}>
              <ShieldCheck color="#ffffff" size={28} />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.heroTitle}>Your Safety Overview</Text>
              <Text style={styles.heroSub}>SEBI-aligned Trust & Risk Metrics</Text>
            </View>
          </View>
          <View style={styles.explainabilityBanner}>
            <Info color="#2563eb" size={16} style={{ marginRight: 6 }} />
            <Text style={styles.explainText}>
              Indicators are derived from verifiable regulatory records and portfolio analytics, not arbitrary scores.
            </Text>
          </View>
        </View>

        {/* 5 Primary Safety Indicators */}
        <Text style={styles.sectionTitle}>Explainable Safety Indicators</Text>
        <Text style={styles.sectionSub}>5 key protection touchpoints monitored continuously</Text>

        {/* Indicator 1: Portfolio Risk */}
        <TouchableOpacity
          style={styles.indicatorTile}
          activeOpacity={0.85}
          onPress={() => onNavigate('portfolio_risk_alert')}
        >
          <View style={[styles.tileIconBg, { backgroundColor: '#f0fdf4' }]}>
            <CheckCircle2 color="#16a34a" size={22} />
          </View>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.tileTitle}>Portfolio Safety</Text>
            <Text style={styles.tileStatusGreen}>✓ No critical risks</Text>
            <Text style={styles.tileDesc}>1 medium concentration alert active</Text>
          </View>
          <ChevronRight color="#94a3b8" size={20} />
        </TouchableOpacity>

        {/* Indicator 2: Verified Entities */}
        <TouchableOpacity
          style={styles.indicatorTile}
          activeOpacity={0.85}
          onPress={() => onNavigate('entity_search')}
        >
          <View style={[styles.tileIconBg, { backgroundColor: '#eff6ff' }]}>
            <ShieldCheck color="#2563eb" size={22} />
          </View>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.tileTitle}>Verified Entities</Text>
            <Text style={styles.tileStatusBlue}>4 / 4 verified</Text>
            <Text style={styles.tileDesc}>All connected brokers & REITs registered with SEBI</Text>
          </View>
          <ChevronRight color="#94a3b8" size={20} />
        </TouchableOpacity>

        {/* Indicator 3: Suspicious Content */}
        <TouchableOpacity
          style={styles.indicatorTile}
          activeOpacity={0.85}
          onPress={() => onNavigate('content_scanner')}
        >
          <View style={[styles.tileIconBg, { backgroundColor: '#fdf2f8' }]}>
            <ShieldAlert color="#db2777" size={22} />
          </View>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.tileTitle}>Suspicious Content</Text>
            <Text style={styles.tileStatusGreen}>0 active threats</Text>
            <Text style={styles.tileDesc}>1 previous scam message flagged & resolved</Text>
          </View>
          <ChevronRight color="#94a3b8" size={20} />
        </TouchableOpacity>

        {/* Indicator 4: Regulatory Checks */}
        <TouchableOpacity
          style={styles.indicatorTile}
          activeOpacity={0.85}
          onPress={() => onNavigate('regulatory_select')}
        >
          <View style={[styles.tileIconBg, { backgroundColor: '#f0f9ff' }]}>
            <FileCheck color="#0284c7" size={22} />
          </View>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.tileTitle}>Regulatory Checks</Text>
            <Text style={styles.tileStatusBlue}>3 completed</Text>
            <Text style={styles.tileDesc}>Cross-referenced with SEBI master database</Text>
          </View>
          <ChevronRight color="#94a3b8" size={20} />
        </TouchableOpacity>

        {/* Indicator 5: Alerts Requiring Attention */}
        <TouchableOpacity
          style={styles.indicatorTile}
          activeOpacity={0.85}
          onPress={() => onNavigate('alert_center')}
        >
          <View style={[styles.tileIconBg, { backgroundColor: '#fff7ed' }]}>
            <AlertTriangle color="#d97706" size={22} />
          </View>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.tileTitle}>Safety Alerts</Text>
            <Text style={styles.tileStatusOrange}>1 requires attention</Text>
            <Text style={styles.tileDesc}>Portfolio concentration rebalancing recommendation</Text>
          </View>
          <ChevronRight color="#94a3b8" size={20} />
        </TouchableOpacity>

        {/* Protection Philosophy Box */}
        <View style={styles.philosophyCard}>
          <Text style={styles.philHeader}>🛡️ Why No "87%" Safety Score?</Text>
          <Text style={styles.philBody}>
            Under SEBI investor protection principles, arbitrary percentage scores obscure specific risks.
            Dhan Rakshak provides clear, granular, and explainable safety indicators so you can make informed decisions.
          </Text>
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
  infoButton: {
    padding: 4,
  },
  contentPadding: {
    padding: 16,
  },
  summaryHeroCard: {
    backgroundColor: '#1b3a6b',
    borderRadius: 14,
    padding: 16,
    marginBottom: 20,
  },
  heroShieldBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#2563eb',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  heroSub: {
    fontSize: 12,
    color: '#93c5fd',
    marginTop: 2,
  },
  explainabilityBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#eff6ff',
    borderRadius: 10,
    padding: 10,
    marginTop: 14,
  },
  explainText: {
    fontSize: 11,
    color: '#1e40af',
    flex: 1,
    lineHeight: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  sectionSub: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 12,
  },
  indicatorTile: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  tileIconBg: {
    width: 42,
    height: 42,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tileTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  tileStatusGreen: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#16a34a',
    marginTop: 1,
  },
  tileStatusBlue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#2563eb',
    marginTop: 1,
  },
  tileStatusOrange: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#d97706',
    marginTop: 1,
  },
  tileDesc: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 2,
  },
  philosophyCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 14,
    marginTop: 10,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#cbd5e1',
  },
  philHeader: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 4,
  },
  philBody: {
    fontSize: 12,
    color: '#475569',
    lineHeight: 17,
  },
});
