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
  Sparkles,
  AlertTriangle,
  BookOpen,
  Info,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react-native';

interface AIExplanationSheetProps {
  visible: boolean;
  scannedText: string;
  onClose: () => void;
  onNavigateGyaan: () => void;
}

export default function AIExplanationSheet({
  visible,
  scannedText,
  onClose,
  onNavigateGyaan,
}: AIExplanationSheetProps) {
  const snippets = [
    {
      phrase: '"Guaranteed 30% returns in 30 days!"',
      reason:
        'This language indicates a potentially misleading return claim. Under SEBI regulations, market-linked investment returns cannot be guaranteed merely because an advertisement claims so.',
    },
    {
      phrase: '"Transfer Rs 25,000 now to our official UPI account... before 5 PM today!"',
      reason:
        'Artificial urgency combined with direct payment to individual UPI handles is a classic pressure tactic used to prevent investors from verifying registration independently.',
    },
    {
      phrase: '"VIP insider stock tips channel"',
      reason:
        'Unsolicited insider stock tip groups on messaging apps frequently operate pump-and-dump schemes without SEBI Research Analyst (RA) registration.',
    },
  ];

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.headerRow}>
            <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
              <Sparkles color="#2563eb" size={22} style={{ marginRight: 8 }} />
              <Text style={styles.modalTitle}>AI Risk Explanation</Text>
            </View>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <X color="#64748b" size={20} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.subTitle}>Why was this content flagged?</Text>
            <Text style={styles.subDesc}>
              Dhan Rakshak uses explainable AI rules mapped against SEBI investor protection guidelines.
            </Text>

            {/* Snippet Explanations */}
            {snippets.map((item, idx) => (
              <View key={idx} style={styles.snippetCard}>
                <View style={styles.snippetHeaderRow}>
                  <AlertTriangle color="#dc2626" size={16} style={{ marginRight: 6 }} />
                  <Text style={styles.snippetPhrase}>{item.phrase}</Text>
                </View>
                <Text style={styles.snippetReason}>{item.reason}</Text>
              </View>
            ))}

            {/* SEBI Investor Education Link */}
            <View style={styles.gyaanLinkCard}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                <BookOpen color="#15803d" size={18} style={{ marginRight: 6 }} />
                <Text style={styles.gyaanTitle}>Connected to Dhan Gyaan</Text>
              </View>
              <Text style={styles.gyaanBody}>
                Learn about guaranteed return traps, fake advisors, and regulatory verification steps in Dhan Gyaan.
              </Text>

              <TouchableOpacity
                style={styles.learnMoreBtn}
                activeOpacity={0.85}
                onPress={onNavigateGyaan}
              >
                <Text style={styles.learnMoreText}>Learn More in Dhan Gyaan</Text>
                <ChevronRight color="#ffffff" size={16} />
              </TouchableOpacity>
            </View>

            {/* Close Button */}
            <TouchableOpacity style={styles.closeModalBtn} onPress={onClose}>
              <Text style={styles.closeModalBtnText}>Got it, Close</Text>
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
    marginBottom: 12,
    paddingBottom: 10,
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
  subTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  subDesc: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
    marginBottom: 14,
    lineHeight: 16,
  },
  snippetCard: {
    backgroundColor: '#fff5f5',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  snippetHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  snippetPhrase: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#991b1b',
    flex: 1,
  },
  snippetReason: {
    fontSize: 12,
    color: '#7f1d1d',
    lineHeight: 16,
  },
  gyaanLinkCard: {
    backgroundColor: '#f0fdf4',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#bbf7d0',
    marginTop: 6,
    marginBottom: 16,
  },
  gyaanTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#15803d',
  },
  gyaanBody: {
    fontSize: 12,
    color: '#166534',
    lineHeight: 16,
    marginBottom: 10,
  },
  learnMoreBtn: {
    backgroundColor: '#16a34a',
    borderRadius: 8,
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  learnMoreText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#ffffff',
    marginRight: 4,
  },
  closeModalBtn: {
    backgroundColor: '#f1f5f9',
    borderRadius: 10,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  closeModalBtnText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#334155',
  },
});
