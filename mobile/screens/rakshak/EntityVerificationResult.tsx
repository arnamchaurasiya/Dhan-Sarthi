import React, { useState } from 'react';
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
  Building2,
  FileCheck,
  ChevronRight,
  ShieldCheck,
  Info,
  RefreshCw,
  ExternalLink,
} from 'lucide-react-native';
import EntityDetailsModal from './EntityDetailsModal';
import { VerifiedEntity } from './rakshakData';

interface EntityVerificationResultProps {
  entity: VerifiedEntity;
  onBack: () => void;
  onNavigate: (screen: string, params?: any) => void;
}

export default function EntityVerificationResult({
  entity,
  onBack,
  onNavigate,
}: EntityVerificationResultProps) {
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Sub Header */}
      <View style={styles.subHeaderContainer}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <ArrowLeft color="#1b3a6b" size={22} />
        </TouchableOpacity>
        <Text style={styles.subHeaderTitle}>Entity Verification</Text>
        <View style={{ width: 22 }} />
      </View>

      <View style={styles.contentPadding}>
        {/* Verification Status Card */}
        <View style={styles.resultCard}>
          <View style={styles.entityTitleRow}>
            <View style={styles.iconBgGreen}>
              <Building2 color="#16a34a" size={24} />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.entityName}>{entity.name}</Text>
              <Text style={styles.entityCategory}>{entity.category}</Text>
            </View>
          </View>

          {/* Status Badge */}
          <View style={styles.verifiedBanner}>
            <CheckCircle2 color="#16a34a" size={22} style={{ marginRight: 8 }} />
            <Text style={styles.verifiedBannerText}>🟢 Verified</Text>
          </View>

          {/* Table of Verification Metadata */}
          <View style={styles.tableBox}>
            <View style={styles.tableRow}>
              <Text style={styles.tableLabel}>Regulatory status</Text>
              <Text style={styles.tableValueGreen}>Verified</Text>
            </View>

            <View style={styles.tableRow}>
              <Text style={styles.tableLabel}>Registration details</Text>
              <Text style={styles.tableValue}>Available ({entity.regNo})</Text>
            </View>

            <View style={styles.tableRow}>
              <Text style={styles.tableLabel}>Entity type</Text>
              <Text style={styles.tableValue}>{entity.entityType}</Text>
            </View>

            <View style={styles.tableRowNoBorder}>
              <Text style={styles.tableLabel}>Last checked</Text>
              <Text style={styles.tableValue}>{entity.verifiedDate}</Text>
            </View>
          </View>

          {/* What This Means Explanation */}
          <View style={styles.explanationBox}>
            <Text style={styles.expHeader}>What this means</Text>
            <Text style={styles.expBody}>
              The entity information matches the available regulatory records in official databases.
            </Text>
          </View>

          {/* UX Credibility Notice */}
          <View style={styles.credibilityNotice}>
            <ShieldCheck color="#2563eb" size={16} style={{ marginRight: 6 }} />
            <Text style={styles.credibilityText}>
              Verified against available regulatory information.
            </Text>
          </View>

          {/* Actions */}
          <TouchableOpacity
            style={styles.viewDetailsButton}
            activeOpacity={0.85}
            onPress={() => setDetailsModalVisible(true)}
          >
            <FileCheck color="#ffffff" size={18} style={{ marginRight: 6 }} />
            <Text style={styles.viewDetailsBtnText}>View Details</Text>
          </TouchableOpacity>
        </View>

        {/* Secondary Actions */}
        <TouchableOpacity
          style={styles.secondaryBtn}
          onPress={() => onNavigate('entity_search')}
        >
          <RefreshCw color="#1b3a6b" size={16} style={{ marginRight: 6 }} />
          <Text style={styles.secondaryBtnText}>Verify Another Entity</Text>
        </TouchableOpacity>

        {/* Modal for Screen 05 Details */}
        <EntityDetailsModal
          visible={detailsModalVisible}
          entity={entity}
          onClose={() => setDetailsModalVisible(false)}
        />
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
  resultCard: {
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
  entityTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconBgGreen: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#dcfce7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  entityName: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  entityCategory: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  verifiedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0fdf4',
    borderWidth: 1,
    borderColor: '#bbf7d0',
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
  },
  verifiedBannerText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#15803d',
  },
  tableBox: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 16,
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  tableRowNoBorder: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  tableLabel: {
    fontSize: 13,
    color: '#64748b',
  },
  tableValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0f172a',
  },
  tableValueGreen: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#16a34a',
  },
  explanationBox: {
    backgroundColor: '#eff6ff',
    borderRadius: 10,
    padding: 12,
    marginBottom: 14,
  },
  expHeader: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1e40af',
    marginBottom: 2,
  },
  expBody: {
    fontSize: 12,
    color: '#1d4ed8',
    lineHeight: 16,
  },
  credibilityNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    justifyContent: 'center',
  },
  credibilityText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#2563eb',
  },
  viewDetailsButton: {
    backgroundColor: '#1b3a6b',
    borderRadius: 10,
    height: 46,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewDetailsBtnText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  secondaryBtn: {
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
  secondaryBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1b3a6b',
  },
});
