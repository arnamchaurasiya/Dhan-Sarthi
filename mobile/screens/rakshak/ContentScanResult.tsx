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
  AlertOctagon,
  ShieldAlert,
  Search,
  BookOpen,
  HelpCircle,
  ChevronRight,
  Info,
  Sparkles,
} from 'lucide-react-native';
import AIExplanationSheet from './AIExplanationSheet';

interface ContentScanResultProps {
  scannedText: string;
  onBack: () => void;
  onNavigate: (screen: string, params?: any) => void;
}

export default function ContentScanResult({
  scannedText,
  onBack,
  onNavigate,
}: ContentScanResultProps) {
  const [aiModalVisible, setAiModalVisible] = useState(false);

  const flaggedIndicators = [
    { title: 'Guaranteed return claim', desc: 'Promises 30% guaranteed profit in 30 days.' },
    { title: 'Urgency / limited-time pressure', desc: 'Uses pressure line "before slots close at 5 PM today".' },
    { title: 'Unverified entity', desc: 'No SEBI registration found for promoter name.' },
    { title: 'Request for direct payment', desc: 'Asks to transfer money directly to a UPI account.' },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.subHeaderContainer}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <ArrowLeft color="#1b3a6b" size={22} />
        </TouchableOpacity>
        <Text style={styles.subHeaderTitle}>Content Scan Result</Text>
        <View style={{ width: 22 }} />
      </View>

      <View style={styles.contentPadding}>
        {/* High Risk Banner */}
        <View style={styles.riskCard}>
          <View style={styles.riskTopRow}>
            <View style={styles.octagonBg}>
              <AlertOctagon color="#ffffff" size={26} />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.riskTag}>⚠️ HIGH RISK</Text>
              <Text style={styles.riskTitle}>Investment Message Flagged</Text>
              <Text style={styles.riskSub}>Risk indicators detected: 4</Text>
            </View>
          </View>

          {/* Assessment pill */}
          <View style={styles.assessmentBox}>
            <Text style={styles.assessmentLabel}>Overall assessment:</Text>
            <Text style={styles.assessmentVal}>High Risk Scam Potential</Text>
          </View>

          {/* List of Detected Risk Indicators */}
          <Text style={styles.indicatorsTitle}>Detected Risk Indicators:</Text>
          <View style={styles.indicatorList}>
            {flaggedIndicators.map((item, idx) => (
              <View key={idx} style={styles.indicatorItem}>
                <Text style={styles.warningEmoji}>⚠</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.indTitle}>{item.title}</Text>
                  <Text style={styles.indDesc}>{item.desc}</Text>
                </View>
              </View>
            ))}
          </View>

          {/* Why Was This Flagged Section */}
          <View style={styles.whyFlaggedCard}>
            <Text style={styles.whyTitle}>Why was this flagged?</Text>
            <Text style={styles.whyBullet}>1. Promises unusually high returns that violate SEBI norms</Text>
            <Text style={styles.whyBullet}>2. Uses artificial urgency to encourage immediate payment</Text>
            <Text style={styles.whyBullet}>3. Entity promoting the offer could not be verified</Text>
            <Text style={styles.whyBullet}>4. Requests payment outside a verified clearing house channel</Text>
          </View>

          {/* Button: AI Explanation Sheet (Screen 09) */}
          <TouchableOpacity
            style={styles.aiExplainBtn}
            activeOpacity={0.85}
            onPress={() => setAiModalVisible(true)}
          >
            <Sparkles color="#ffffff" size={18} style={{ marginRight: 6 }} />
            <Text style={styles.aiExplainBtnText}>Why Was This Flagged? (AI Breakdown)</Text>
          </TouchableOpacity>
        </View>

        {/* Next Actions */}
        <Text style={styles.sectionTitle}>Recommended Next Steps</Text>
        <Text style={styles.sectionSub}>Protect your funds and learn to spot scam red flags</Text>

        <TouchableOpacity
          style={styles.actionTile}
          activeOpacity={0.85}
          onPress={() => onNavigate('entity_search')}
        >
          <View style={[styles.tileIconBg, { backgroundColor: '#eff6ff' }]}>
            <Search color="#2563eb" size={20} />
          </View>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.tileTitle}>Verify Entity Name</Text>
            <Text style={styles.tileSub}>Check if the promoter is registered with SEBI</Text>
          </View>
          <ChevronRight color="#94a3b8" size={20} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionTile}
          activeOpacity={0.85}
          onPress={() => onNavigate('safety_education')}
        >
          <View style={[styles.tileIconBg, { backgroundColor: '#f0fdf4' }]}>
            <BookOpen color="#16a34a" size={20} />
          </View>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.tileTitle}>Learn How Investment Scams Work</Text>
            <Text style={styles.tileSub}>Read Dhan Gyaan guides on scam prevention</Text>
          </View>
          <ChevronRight color="#94a3b8" size={20} />
        </TouchableOpacity>

        {/* Modal for Screen 09 AI Explanation */}
        <AIExplanationSheet
          visible={aiModalVisible}
          scannedText={scannedText}
          onClose={() => setAiModalVisible(false)}
          onNavigateGyaan={() => {
            setAiModalVisible(false);
            onNavigate('safety_education');
          }}
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
  riskCard: {
    backgroundColor: '#fffcfc',
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: '#fca5a5',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  riskTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  octagonBg: {
    width: 46,
    height: 46,
    borderRadius: 12,
    backgroundColor: '#dc2626',
    alignItems: 'center',
    justifyContent: 'center',
  },
  riskTag: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#dc2626',
  },
  riskTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#991b1b',
  },
  riskSub: {
    fontSize: 12,
    color: '#b91c1c',
  },
  assessmentBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fee2e2',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 14,
  },
  assessmentLabel: {
    fontSize: 12,
    color: '#991b1b',
  },
  assessmentVal: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#991b1b',
  },
  indicatorsTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 8,
  },
  indicatorList: {
    marginBottom: 14,
  },
  indicatorItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#fff5f5',
    padding: 10,
    borderRadius: 8,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  warningEmoji: {
    fontSize: 14,
    color: '#dc2626',
    marginRight: 8,
  },
  indTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#991b1b',
  },
  indDesc: {
    fontSize: 11,
    color: '#7f1d1d',
    marginTop: 1,
  },
  whyFlaggedCard: {
    backgroundColor: '#f8fafc',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    marginBottom: 16,
  },
  whyTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 6,
  },
  whyBullet: {
    fontSize: 12,
    color: '#475569',
    marginBottom: 4,
    lineHeight: 16,
  },
  aiExplainBtn: {
    backgroundColor: '#1b3a6b',
    borderRadius: 10,
    height: 46,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  aiExplainBtnText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
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
  actionTile: {
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
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tileTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  tileSub: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
});
