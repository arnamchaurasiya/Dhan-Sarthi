import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {
  X,
  ShieldCheck,
  CheckCircle2,
  Building2,
  Calendar,
  FileText,
  RefreshCw,
  ExternalLink,
} from 'lucide-react-native';
import { VerifiedEntity } from './rakshakData';

interface EntityDetailsModalProps {
  visible: boolean;
  entity: VerifiedEntity;
  onClose: () => void;
}

export default function EntityDetailsModal({
  visible,
  entity,
  onClose,
}: EntityDetailsModalProps) {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Modal Header */}
          <View style={styles.headerRow}>
            <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
              <ShieldCheck color="#2563eb" size={22} style={{ marginRight: 8 }} />
              <Text style={styles.modalTitle}>Verification Details</Text>
            </View>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <X color="#64748b" size={20} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Entity Header Box */}
            <View style={styles.entityBox}>
              <Text style={styles.entityName}>{entity.name}</Text>
              <Text style={styles.entityCat}>{entity.category}</Text>
            </View>

            {/* Checklist items */}
            <View style={styles.checklistCard}>
              <View style={styles.checkItem}>
                <CheckCircle2 color="#16a34a" size={18} />
                <View style={{ marginLeft: 10, flex: 1 }}>
                  <Text style={styles.checkLabel}>Registration</Text>
                  <Text style={styles.checkValGreen}>✓ Found in SEBI Records</Text>
                </View>
              </View>

              <View style={styles.divider} />

              <View style={styles.checkItem}>
                <CheckCircle2 color="#16a34a" size={18} />
                <View style={{ marginLeft: 10, flex: 1 }}>
                  <Text style={styles.checkLabel}>Regulatory status</Text>
                  <Text style={styles.checkValGreen}>Active</Text>
                </View>
              </View>

              <View style={styles.divider} />

              <View style={styles.checkItem}>
                <Building2 color="#2563eb" size={18} />
                <View style={{ marginLeft: 10, flex: 1 }}>
                  <Text style={styles.checkLabel}>Entity type</Text>
                  <Text style={styles.checkVal}>{entity.entityType}</Text>
                </View>
              </View>

              <View style={styles.divider} />

              <View style={styles.checkItem}>
                <FileText color="#2563eb" size={18} />
                <View style={{ marginLeft: 10, flex: 1 }}>
                  <Text style={styles.checkLabel}>Registration information</Text>
                  <Text style={styles.checkVal}>{entity.regNo}</Text>
                  <Text style={styles.subVal}>Regulated by: {entity.regulatedBy}</Text>
                </View>
              </View>

              <View style={styles.divider} />

              <View style={styles.checkItem}>
                <Calendar color="#64748b" size={18} />
                <View style={{ marginLeft: 10, flex: 1 }}>
                  <Text style={styles.checkLabel}>Last verification</Text>
                  <Text style={styles.checkVal}>{entity.verifiedDate}</Text>
                </View>
              </View>

              <View style={styles.divider} />

              <View style={styles.checkItem}>
                <ShieldCheck color="#16a34a" size={18} />
                <View style={{ marginLeft: 10, flex: 1 }}>
                  <Text style={styles.checkLabel}>Source</Text>
                  <Text style={styles.checkVal}>Regulatory Records (SEBI Portal)</Text>
                </View>
              </View>
            </View>

            {/* SEBI Investor Protection Statement */}
            <View style={styles.sebiNoticeCard}>
              <Text style={styles.noticeHeader}>SEBI Investor Protection Directive</Text>
              <Text style={styles.noticeText}>
                Always verify information through authoritative regulatory sources before transferring funds or making investment decisions.
              </Text>
            </View>

            {/* Modal Actions */}
            <TouchableOpacity
              style={styles.verifyAgainBtn}
              onPress={onClose}
            >
              <RefreshCw color="#ffffff" size={16} style={{ marginRight: 6 }} />
              <Text style={styles.verifyAgainText}>Verify Again</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '85%',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  closeBtn: {
    padding: 4,
  },
  entityBox: {
    backgroundColor: '#eff6ff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
  },
  entityName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e40af',
  },
  entityCat: {
    fontSize: 12,
    color: '#3b82f6',
    marginTop: 2,
  },
  checklistCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 16,
  },
  checkItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 6,
  },
  divider: {
    height: 1,
    backgroundColor: '#f1f5f9',
    marginVertical: 6,
  },
  checkLabel: {
    fontSize: 11,
    color: '#64748b',
  },
  checkVal: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0f172a',
    marginTop: 1,
  },
  checkValGreen: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#16a34a',
    marginTop: 1,
  },
  subVal: {
    fontSize: 11,
    color: '#475569',
    marginTop: 1,
  },
  sebiNoticeCard: {
    backgroundColor: '#f8fafc',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    marginBottom: 20,
  },
  noticeHeader: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 2,
  },
  noticeText: {
    fontSize: 11,
    color: '#475569',
    lineHeight: 15,
  },
  verifyAgainBtn: {
    backgroundColor: '#1b3a6b',
    borderRadius: 10,
    height: 46,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  verifyAgainText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
  },
});
