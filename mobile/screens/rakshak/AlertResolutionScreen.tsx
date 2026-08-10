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
  AlertTriangle,
  ShieldCheck,
  Search,
  ChevronRight,
  Info,
  Compass,
} from 'lucide-react-native';
import { SafetyAlert } from './rakshakData';

interface AlertResolutionScreenProps {
  alert: SafetyAlert;
  onBack: () => void;
  onNavigateTarget: (targetView: string) => void;
}

export default function AlertResolutionScreen({
  alert,
  onBack,
  onNavigateTarget,
}: AlertResolutionScreenProps) {
  const isResolved = alert.status === 'Resolved' || alert.status === 'Reviewed';

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.subHeaderContainer}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <ArrowLeft color="#1b3a6b" size={22} />
        </TouchableOpacity>
        <Text style={styles.subHeaderTitle}>Alert Resolution Details</Text>
        <View style={{ width: 22 }} />
      </View>

      <View style={styles.contentPadding}>
        {/* Main Resolution Card */}
        <View style={styles.card}>
          <View style={styles.topRow}>
            <View style={[styles.iconBg, isResolved ? { backgroundColor: '#dcfce7' } : { backgroundColor: '#fee2e2' }]}>
              {isResolved ? (
                <CheckCircle2 color="#16a34a" size={24} />
              ) : (
                <AlertTriangle color="#dc2626" size={24} />
              )}
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.categoryTag}>{alert.category} Alert</Text>
              <Text style={styles.alertTitle}>{alert.title}</Text>
              <Text style={styles.timestamp}>{alert.timestamp}</Text>
            </View>
          </View>

          {/* Status Badge */}
          <View
            style={[
              styles.statusBanner,
              isResolved ? { backgroundColor: '#f0fdf4', borderColor: '#bbf7d0' } : { backgroundColor: '#fef2f2', borderColor: '#fca5a5' },
            ]}
          >
            <Text style={[styles.statusText, isResolved ? { color: '#15803d' } : { color: '#991b1b' }]}>
              Status: {alert.status}
            </Text>
          </View>

          {/* Alert Overview */}
          <View style={styles.infoBox}>
            <Text style={styles.infoLabel}>Alert Summary</Text>
            <Text style={styles.infoBody}>{alert.summary}</Text>
          </View>

          {isResolved ? (
            /* Resolved State Details */
            <View style={styles.resolutionBox}>
              <Text style={styles.resHeader}>Action Taken & Result</Text>
              <View style={styles.resRow}>
                <Text style={styles.resBullet}>• Action:</Text>
                <Text style={styles.resVal}>{alert.actionTaken || 'Verified against regulatory database'}</Text>
              </View>
              <View style={styles.resRow}>
                <Text style={styles.resBullet}>• Result:</Text>
                <Text style={styles.resVal}>{alert.resultMessage || 'No further action required.'}</Text>
              </View>
            </View>
          ) : (
            /* Needs Attention State - Actionable Recommendation */
            <View style={styles.actionBox}>
              <Text style={styles.actionHeader}>Recommended Safe Action</Text>
              <Text style={styles.actionBody}>
                {alert.recommendedAction || 'Verify entity registration before transferring funds or making investment commitments.'}
              </Text>

              <TouchableOpacity
                style={styles.actionBtn}
                activeOpacity={0.85}
                onPress={() => onNavigateTarget(alert.targetView || 'entity_search')}
              >
                <ShieldCheck color="#ffffff" size={18} style={{ marginRight: 6 }} />
                <Text style={styles.actionBtnText}>Take Recommended Action</Text>
                <ChevronRight color="#ffffff" size={16} />
              </TouchableOpacity>
            </View>
          )}

          {/* Alert -> Action -> Resolution UX Principle Note */}
          <View style={styles.uxPrincipleBox}>
            <Info color="#2563eb" size={16} style={{ marginRight: 6 }} />
            <Text style={styles.uxPrincipleText}>
              Every Dhan Rakshak alert provides a clear resolution path: Alert → Action → Resolution.
            </Text>
          </View>
        </View>

        {/* Back Button */}
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <Text style={styles.backBtnText}>Back to Alert Center</Text>
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
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 16,
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
  iconBg: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryTag: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#64748b',
    textTransform: 'uppercase',
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  timestamp: {
    fontSize: 11,
    color: '#94a3b8',
  },
  statusBanner: {
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    marginBottom: 14,
  },
  statusText: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  infoBox: {
    backgroundColor: '#f8fafc',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    marginBottom: 14,
  },
  infoLabel: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#64748b',
    marginBottom: 2,
  },
  infoBody: {
    fontSize: 13,
    color: '#0f172a',
    lineHeight: 18,
  },
  resolutionBox: {
    backgroundColor: '#f0fdf4',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#bbf7d0',
    marginBottom: 14,
  },
  resHeader: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#15803d',
    marginBottom: 6,
  },
  resRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  resBullet: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#166534',
    marginRight: 6,
  },
  resVal: {
    fontSize: 12,
    color: '#14532d',
    flex: 1,
    lineHeight: 16,
  },
  actionBox: {
    backgroundColor: '#fff7ed',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#fed7aa',
    marginBottom: 14,
  },
  actionHeader: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#9a3412',
    marginBottom: 4,
  },
  actionBody: {
    fontSize: 12,
    color: '#7c2d12',
    lineHeight: 16,
    marginBottom: 10,
  },
  actionBtn: {
    backgroundColor: '#1b3a6b',
    borderRadius: 8,
    height: 42,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionBtnText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#ffffff',
    marginRight: 4,
  },
  uxPrincipleBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eff6ff',
    borderRadius: 10,
    padding: 10,
  },
  uxPrincipleText: {
    fontSize: 11,
    color: '#1e40af',
    flex: 1,
    lineHeight: 15,
  },
  backBtn: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    height: 46,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  backBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1b3a6b',
  },
});
