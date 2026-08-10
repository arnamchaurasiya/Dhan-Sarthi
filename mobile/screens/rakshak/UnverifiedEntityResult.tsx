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
  Building2,
  ShieldAlert,
  FileCheck,
  ChevronRight,
  Info,
  Lock,
  Ban,
  ArrowLeftRight,
} from 'lucide-react-native';

interface UnverifiedEntityResultProps {
  entityName: string;
  onBack: () => void;
  onNavigate: (screen: string, params?: any) => void;
}

export default function UnverifiedEntityResult({
  entityName,
  onBack,
  onNavigate,
}: UnverifiedEntityResultProps) {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.subHeaderContainer}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <ArrowLeft color="#1b3a6b" size={22} />
        </TouchableOpacity>
        <Text style={styles.subHeaderTitle}>Entity Verification Result</Text>
        <View style={{ width: 22 }} />
      </View>

      <View style={styles.contentPadding}>
        {/* Unverified Warning Card */}
        <View style={styles.warningCard}>
          <View style={styles.entityTitleRow}>
            <View style={styles.iconBgRed}>
              <AlertTriangle color="#dc2626" size={24} />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.entityName}>{entityName || 'ABC Wealth Group'}</Text>
              <Text style={styles.entityCategory}>Unverified Entity</Text>
            </View>
          </View>

          {/* Warning Banner */}
          <View style={styles.unverifiedBanner}>
            <AlertTriangle color="#dc2626" size={22} style={{ marginRight: 8 }} />
            <Text style={styles.unverifiedBannerText}>⚠️ Unable to Verify</Text>
          </View>

          <Text style={styles.warningMessageText}>
            We couldn't find sufficient regulatory information for this entity in the SEBI registrar directory.
          </Text>

          {/* Before Proceeding Safety Precautions */}
          <View style={styles.precautionsCard}>
            <Text style={styles.precautionHeader}>Before proceeding:</Text>

            <View style={styles.precautionRow}>
              <Text style={styles.warnEmoji}>⚠️</Text>
              <Text style={styles.precautionText}>
                <Text style={{ fontWeight: 'bold' }}>Do not share sensitive information</Text> (OTP, passwords, KYC documents).
              </Text>
            </View>

            <View style={styles.precautionRow}>
              <Text style={styles.warnEmoji}>⚠️</Text>
              <Text style={styles.precautionText}>
                <Text style={{ fontWeight: 'bold' }}>Do not transfer funds</Text> to personal bank accounts or unverified UPI IDs.
              </Text>
            </View>

            <View style={styles.precautionRowNoBorder}>
              <Text style={styles.warnEmoji}>⚠️</Text>
              <Text style={styles.precautionText}>
                <Text style={{ fontWeight: 'bold' }}>Verify registration independently</Text> via the official SEBI SCORES portal.
              </Text>
            </View>
          </View>

          {/* Responsible UX explanation */}
          <View style={styles.responsibleUxBox}>
            <Info color="#0284c7" size={16} style={{ marginRight: 6 }} />
            <Text style={styles.responsibleUxText}>
              Dhan Rakshak does not make unsupported accusations. We alert you when regulatory matching data is absent.
            </Text>
          </View>

          {/* Primary Action: Check Regulatory Status */}
          <TouchableOpacity
            style={styles.regCheckButton}
            activeOpacity={0.85}
            onPress={() => onNavigate('regulatory_select')}
          >
            <FileCheck color="#ffffff" size={18} style={{ marginRight: 6 }} />
            <Text style={styles.regCheckBtnText}>Check Regulatory Status</Text>
          </TouchableOpacity>
        </View>

        {/* Go Back Button */}
        <TouchableOpacity
          style={styles.goBackBtn}
          activeOpacity={0.85}
          onPress={onBack}
        >
          <ArrowLeft color="#1b3a6b" size={16} style={{ marginRight: 6 }} />
          <Text style={styles.goBackBtnText}>Go Back to Search</Text>
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
    backgroundColor: '#fffcfc',
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: '#fca5a5',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  entityTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconBgRed: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#fee2e2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  entityName: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#991b1b',
  },
  entityCategory: {
    fontSize: 12,
    color: '#b91c1c',
    marginTop: 2,
  },
  unverifiedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fee2e2',
    borderWidth: 1,
    borderColor: '#fca5a5',
    borderRadius: 10,
    padding: 12,
    marginBottom: 14,
  },
  unverifiedBannerText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#991b1b',
  },
  warningMessageText: {
    fontSize: 13,
    color: '#7f1d1d',
    lineHeight: 18,
    marginBottom: 16,
  },
  precautionsCard: {
    backgroundColor: '#fef2f2',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#fecaca',
    marginBottom: 16,
  },
  precautionHeader: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#991b1b',
    marginBottom: 8,
  },
  precautionRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#fee2e2',
  },
  precautionRowNoBorder: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 6,
  },
  warnEmoji: {
    fontSize: 13,
    marginRight: 8,
  },
  precautionText: {
    fontSize: 12,
    color: '#7f1d1d',
    flex: 1,
    lineHeight: 16,
  },
  responsibleUxBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f9ff',
    borderRadius: 10,
    padding: 10,
    marginBottom: 16,
  },
  responsibleUxText: {
    fontSize: 11,
    color: '#0369a1',
    flex: 1,
    lineHeight: 15,
  },
  regCheckButton: {
    backgroundColor: '#1b3a6b',
    borderRadius: 10,
    height: 46,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  regCheckBtnText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  goBackBtn: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    height: 46,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  goBackBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1b3a6b',
  },
});
