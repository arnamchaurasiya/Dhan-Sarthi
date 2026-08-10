import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import {
  ArrowLeft,
  CheckCircle2,
  FileCheck,
  Building2,
  ShieldCheck,
  Info,
  ExternalLink,
  ChevronRight,
} from 'lucide-react-native';

interface RegulatoryResultProps {
  queryName: string;
  onBack: () => void;
  onNavigateHome: () => void;
}

export default function RegulatoryResult({
  queryName,
  onBack,
  onNavigateHome,
}: RegulatoryResultProps) {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.subHeaderContainer}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <ArrowLeft color="#1b3a6b" size={22} />
        </TouchableOpacity>
        <Text style={styles.subHeaderTitle}>Regulatory Result</Text>
        <View style={{ width: 22 }} />
      </View>

      <View style={styles.contentPadding}>
        {/* Verification Record Card */}
        <View style={styles.recordCard}>
          <View style={styles.topRow}>
            <View style={styles.iconBgBlue}>
              <FileCheck color="#2563eb" size={24} />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.labelSub}>Entity Query</Text>
              <Text style={styles.entityTitle}>{queryName || 'ABC Investment Services'}</Text>
            </View>
          </View>

          {/* Status Row */}
          <View style={styles.statusBox}>
            <CheckCircle2 color="#16a34a" size={20} style={{ marginRight: 8 }} />
            <Text style={styles.statusText}>✓ Registration information found</Text>
          </View>

          {/* Table Data */}
          <View style={styles.tableBox}>
            <View style={styles.tableRow}>
              <Text style={styles.tableLabel}>Entity Name</Text>
              <Text style={styles.tableValue}>{queryName || 'ABC Investment Services'}</Text>
            </View>

            <View style={styles.tableRow}>
              <Text style={styles.tableLabel}>SEBI Registration No</Text>
              <Text style={styles.tableValueCode}>INA000012345</Text>
            </View>

            <View style={styles.tableRow}>
              <Text style={styles.tableLabel}>Entity Type</Text>
              <Text style={styles.tableValue}>Investment Intermediary</Text>
            </View>

            <View style={styles.tableRow}>
              <Text style={styles.tableLabel}>Registration Status</Text>
              <Text style={styles.tableValueActive}>Active</Text>
            </View>

            <View style={styles.tableRowNoBorder}>
              <Text style={styles.tableLabel}>Last Checked</Text>
              <Text style={styles.tableValue}>Today, 10:45 AM</Text>
            </View>
          </View>

          {/* SEBI Role Disclaimer Box */}
          <View style={styles.disclaimerBox}>
            <Info color="#0284c7" size={16} style={{ marginRight: 6 }} />
            <Text style={styles.disclaimerText}>
              Always verify information through authoritative regulatory sources (such as the official SEBI SCORES portal) before making an investment decision.
            </Text>
          </View>

          {/* Actions */}
          <TouchableOpacity
            style={styles.doneBtn}
            activeOpacity={0.85}
            onPress={onNavigateHome}
          >
            <Text style={styles.doneBtnText}>Return to Dhan Rakshak Home</Text>
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
  recordCard: {
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
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  iconBgBlue: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#eff6ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  labelSub: {
    fontSize: 11,
    color: '#64748b',
  },
  entityTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  statusBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0fdf4',
    borderWidth: 1,
    borderColor: '#bbf7d0',
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
  },
  statusText: {
    fontSize: 14,
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
  tableValueCode: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#2563eb',
    fontFamily: Platform.OS === 'android' ? 'monospace' : 'Courier',
  },
  tableValueActive: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#16a34a',
  },
  disclaimerBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#f0f9ff',
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
  },
  disclaimerText: {
    fontSize: 11,
    color: '#0369a1',
    flex: 1,
    lineHeight: 15,
  },
  doneBtn: {
    backgroundColor: '#1b3a6b',
    borderRadius: 10,
    height: 46,
    alignItems: 'center',
    justifyContent: 'center',
  },
  doneBtnText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
  },
});
