import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {
  ShieldCheck,
  ShieldAlert,
  Search,
  ScanSearch,
  CheckCircle2,
  FileCheck,
  ChevronRight,
  AlertTriangle,
  Info,
  Bell,
  ArrowUpRight,
  Sparkles,
} from 'lucide-react-native';

interface RakshakHomeProps {
  onNavigate: (screen: string, params?: any) => void;
}

export default function RakshakHome({ onNavigate }: RakshakHomeProps) {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Top Header Banner */}
      <View style={styles.headerCard}>
        <View style={styles.headerRow}>
          <View style={styles.headerIconBg}>
            <ShieldCheck color="#1b3a6b" size={28} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>Dhan Rakshak</Text>
            <Text style={styles.headerSubtitle}>Your Trust & Safety Layer</Text>
          </View>
          <TouchableOpacity style={styles.bellBtn} onPress={() => onNavigate('alert_center')}>
            <Bell color="#1b3a6b" size={20} />
            <View style={styles.bellBadge} />
          </TouchableOpacity>
        </View>

        {/* Protection Status Badge */}
        <View style={styles.protectedBadgeContainer}>
          <View style={styles.protectedRow}>
            <View style={styles.shieldPulseIcon}>
              <ShieldCheck color="#ffffff" size={20} />
            </View>
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={styles.protectedTitle}>🛡️ You're protected</Text>
              <Text style={styles.protectedSub}>Active SEBI-aligned trust & risk monitoring</Text>
            </View>
            <TouchableOpacity style={styles.overviewLinkBtn} onPress={() => onNavigate('safety_dashboard')}>
              <Text style={styles.overviewLinkText}>Overview</Text>
              <ChevronRight color="#2563eb" size={14} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Protection Indicators Bar */}
        <View style={styles.indicatorsRow}>
          <View style={styles.indicatorCard}>
            <CheckCircle2 color="#16a34a" size={16} />
            <View style={{ marginLeft: 6 }}>
              <Text style={styles.indicatorLabel}>Portfolio Safety</Text>
              <Text style={styles.indicatorValue}>✓ No critical alerts</Text>
            </View>
          </View>

          <View style={styles.indicatorDivider} />

          <View style={styles.indicatorCard}>
            <ShieldCheck color="#2563eb" size={16} />
            <View style={{ marginLeft: 6 }}>
              <Text style={styles.indicatorLabel}>Entity Verification</Text>
              <Text style={styles.indicatorValue}>✓ 4 verified entities</Text>
            </View>
          </View>

          <View style={styles.indicatorDivider} />

          <View style={styles.indicatorCard}>
            <FileCheck color="#0284c7" size={16} />
            <View style={{ marginLeft: 6 }}>
              <Text style={styles.indicatorLabel}>Recent Checks</Text>
              <Text style={styles.indicatorValue}>3 completed</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.contentPadding}>
        {/* Primary Action Section */}
        <Text style={styles.sectionHeaderTitle}>What would you like to check?</Text>
        <Text style={styles.sectionHeaderSub}>Intervene before you invest or transfer funds</Text>

        <View style={styles.actionGrid}>
          {/* Card 1: Verify Entity */}
          <TouchableOpacity
            style={[styles.actionCard, { borderLeftColor: '#2563eb' }]}
            activeOpacity={0.85}
            onPress={() => onNavigate('entity_search')}
          >
            <View style={[styles.actionIconBg, { backgroundColor: '#eff6ff' }]}>
              <Search color="#2563eb" size={22} />
            </View>
            <View style={{ flex: 1, marginLeft: 14 }}>
              <Text style={styles.actionCardTitle}>Verify an Entity</Text>
              <Text style={styles.actionCardDesc}>
                Check if a company, advisor, platform, or broker is SEBI registered
              </Text>
            </View>
            <ChevronRight color="#94a3b8" size={20} />
          </TouchableOpacity>

          {/* Card 2: Scan Investment Content */}
          <TouchableOpacity
            style={[styles.actionCard, { borderLeftColor: '#dc2626' }]}
            activeOpacity={0.85}
            onPress={() => onNavigate('content_scanner')}
          >
            <View style={[styles.actionIconBg, { backgroundColor: '#fef2f2' }]}>
              <ScanSearch color="#dc2626" size={22} />
            </View>
            <View style={{ flex: 1, marginLeft: 14 }}>
              <Text style={styles.actionCardTitle}>Scan Investment Content</Text>
              <Text style={styles.actionCardDesc}>
                Detect scam signals, guaranteed return claims & pressure tactics in messages
              </Text>
            </View>
            <ChevronRight color="#94a3b8" size={20} />
          </TouchableOpacity>

          {/* Card 3: Check Regulatory Status */}
          <TouchableOpacity
            style={[styles.actionCard, { borderLeftColor: '#0284c7' }]}
            activeOpacity={0.85}
            onPress={() => onNavigate('regulatory_select')}
          >
            <View style={[styles.actionIconBg, { backgroundColor: '#f0f9ff' }]}>
              <FileCheck color="#0284c7" size={22} />
            </View>
            <View style={{ flex: 1, marginLeft: 14 }}>
              <Text style={styles.actionCardTitle}>Check Regulatory Status</Text>
              <Text style={styles.actionCardDesc}>
                Directly cross-reference registration details against SEBI records
              </Text>
            </View>
            <ChevronRight color="#94a3b8" size={20} />
          </TouchableOpacity>
        </View>

        {/* Recent Safety Alerts Section */}
        <View style={styles.alertsHeaderRow}>
          <Text style={styles.sectionHeaderTitle}>Recent Safety Alerts</Text>
          <TouchableOpacity onPress={() => onNavigate('alert_center')}>
            <Text style={styles.viewAllText}>View All (4)</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.alertCard}
          activeOpacity={0.88}
          onPress={() => onNavigate('portfolio_risk_alert')}
        >
          <View style={styles.alertBadgeMedium}>
            <AlertTriangle color="#d97706" size={18} />
          </View>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <Text style={styles.alertTitle}>Portfolio Concentration Alert</Text>
              <View style={styles.mediumPill}>
                <Text style={styles.mediumPillText}>Medium Risk</Text>
              </View>
            </View>
            <Text style={styles.alertDesc}>
              Direct Equity accounts for 48.2% of your portfolio holdings.
            </Text>
            <View style={styles.alertFooterRow}>
              <Text style={styles.alertTime}>Today, 10:32 AM</Text>
              <Text style={styles.alertActionLink}>Understand Risk →</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Pre-Investment Safety Callout */}
        <TouchableOpacity
          style={styles.preInvestCallout}
          activeOpacity={0.88}
          onPress={() => onNavigate('investment_warning', { productId: 'nexus_reit' })}
        >
          <View style={styles.sparkleBg}>
            <Sparkles color="#2563eb" size={20} />
          </View>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.calloutTitle}>Simulate Pre-Investment Check</Text>
            <Text style={styles.calloutSub}>
              See how Rakshak verifies REIT suitability & disclosures before buying in Dhan Marg.
            </Text>
          </View>
          <ArrowUpRight color="#2563eb" size={18} />
        </TouchableOpacity>

        {/* Dhan Gyaan Safety Bridge Banner */}
        <TouchableOpacity
          style={styles.educationBridgeCard}
          activeOpacity={0.88}
          onPress={() => onNavigate('safety_education')}
        >
          <View style={{ flex: 1 }}>
            <Text style={styles.eduBridgeTag}>STAY SAFE WHILE INVESTING</Text>
            <Text style={styles.eduBridgeTitle}>Learn How Investment Scams Work</Text>
            <Text style={styles.eduBridgeSub}>
              Understand fake advisor groups, guaranteed return traps & SEBI protection rights.
            </Text>
          </View>
          <View style={styles.eduBridgeBadge}>
            <ShieldAlert color="#1b3a6b" size={24} />
          </View>
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
  headerCard: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  headerIconBg: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#eff6ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#64748b',
  },
  bellBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  bellBadge: {
    position: 'absolute',
    top: 8,
    right: 9,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ef4444',
  },
  protectedBadgeContainer: {
    backgroundColor: '#1b3a6b',
    borderRadius: 14,
    padding: 14,
    marginBottom: 14,
  },
  protectedRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  shieldPulseIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#2563eb',
    alignItems: 'center',
    justifyContent: 'center',
  },
  protectedTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  protectedSub: {
    fontSize: 11,
    color: '#93c5fd',
    marginTop: 1,
  },
  overviewLinkBtn: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  overviewLinkText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2563eb',
    marginRight: 2,
  },
  indicatorsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  indicatorCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  indicatorLabel: {
    fontSize: 10,
    color: '#64748b',
    fontWeight: '500',
  },
  indicatorValue: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  indicatorDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#cbd5e1',
    marginHorizontal: 4,
  },
  contentPadding: {
    padding: 16,
  },
  sectionHeaderTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  sectionHeaderSub: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 12,
  },
  actionGrid: {
    marginBottom: 20,
  },
  actionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    borderLeftWidth: 4,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  actionIconBg: {
    width: 42,
    height: 42,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionCardTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  actionCardDesc: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  alertsHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  viewAllText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2563eb',
  },
  alertCard: {
    backgroundColor: '#fff7ed',
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: '#fed7aa',
    marginBottom: 14,
  },
  alertBadgeMedium: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#fef3c7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  alertTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#9a3412',
  },
  mediumPill: {
    backgroundColor: '#fde68a',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  mediumPillText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#92400e',
  },
  alertDesc: {
    fontSize: 12,
    color: '#7c2d12',
    marginTop: 4,
    lineHeight: 16,
  },
  alertFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  alertTime: {
    fontSize: 11,
    color: '#a16207',
  },
  alertActionLink: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#d97706',
  },
  preInvestCallout: {
    backgroundColor: '#eff6ff',
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#bfdbfe',
    marginBottom: 14,
  },
  sparkleBg: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#dbeafe',
    alignItems: 'center',
    justifyContent: 'center',
  },
  calloutTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1e40af',
  },
  calloutSub: {
    fontSize: 11,
    color: '#3b82f6',
    marginTop: 2,
  },
  educationBridgeCard: {
    backgroundColor: '#1b3a6b',
    borderRadius: 14,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  eduBridgeTag: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#93c5fd',
    letterSpacing: 0.5,
  },
  eduBridgeTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: 4,
  },
  eduBridgeSub: {
    fontSize: 11,
    color: '#cbd5e1',
    marginTop: 4,
    lineHeight: 16,
  },
  eduBridgeBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
});
