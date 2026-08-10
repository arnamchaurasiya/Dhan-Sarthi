import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { ShieldCheck, CheckCircle2, AlertTriangle } from 'lucide-react-native';
import { InvestorProfile } from './margData';

interface Props {
  riskProfile: InvestorProfile['riskProfile'];
  onConfirm: () => void;
}

export default function RiskResultScreen({ riskProfile, onConfirm }: Props) {
  return (
    <View style={{ flex: 1, backgroundColor: '#f8fafc' }}>
      <ScrollView style={styles.scrollBody} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.headerSubCaption}>
          Step 4 of 4 • Your risk evaluation score is calculated
        </Text>

        {/* Hero Result Card */}
        <View style={styles.resultCard}>
          <View style={styles.badgeHeader}>
            <View style={styles.badgeIconWrap}>
              <ShieldCheck color="#16a34a" size={26} />
            </View>
            <View>
              <Text style={styles.profileLabel}>Assessed Profile</Text>
              <Text style={styles.riskTitle}>{riskProfile} Investor</Text>
            </View>
          </View>

          <Text style={styles.resultExplanation}>
            You are comfortable with some market fluctuations but prefer a balanced level of risk with steady growth and cash distribution.
          </Text>

          {/* Metrics */}
          <View style={styles.metricsRow}>
            <View style={styles.metricCell}>
              <Text style={styles.metricLabel}>Risk Capacity</Text>
              <Text style={styles.metricVal}>Medium</Text>
            </View>
            <View style={[styles.metricCell, { borderLeftWidth: 1, borderLeftColor: '#f1f5f9' }]}>
              <Text style={styles.metricLabel}>Risk Tolerance</Text>
              <Text style={styles.metricVal}>Medium</Text>
            </View>
          </View>

          {/* Visual Gauge */}
          <View style={styles.spectrumBox}>
            <View style={styles.spectrumBar}>
              <View style={[styles.spectrumSegment, { backgroundColor: '#86efac' }]} />
              <View style={[styles.spectrumSegment, { backgroundColor: '#fde047' }]} />
              <View style={[styles.spectrumSegment, { backgroundColor: '#fca5a5' }]} />
              <View style={styles.spectrumPointer} />
            </View>
            <View style={styles.spectrumLabels}>
              <Text style={styles.spectrumLabelText}>Conservative</Text>
              <Text style={styles.spectrumLabelText}>Moderate</Text>
              <Text style={styles.spectrumLabelText}>Aggressive</Text>
            </View>
          </View>
        </View>

        {/* What this means Section */}
        <Text style={styles.sectionTitle}>What this means for your investments</Text>

        {/* Suitable Types */}
        <View style={styles.suitableCard}>
          <Text style={styles.suitableCardTitle}>More Suitable for You:</Text>
          <View style={styles.bulletRow}>
            <CheckCircle2 color="#16a34a" size={16} style={{ marginRight: 8 }} />
            <Text style={styles.bulletText}>Moderate-risk hybrid products (REITs, InvITs, AAA Bonds)</Text>
          </View>
          <View style={styles.bulletRow}>
            <CheckCircle2 color="#16a34a" size={16} style={{ marginRight: 8 }} />
            <Text style={styles.bulletText}>Diversified asset allocation smoothing equity dips</Text>
          </View>
          <View style={styles.bulletRow}>
            <CheckCircle2 color="#16a34a" size={16} style={{ marginRight: 8 }} />
            <Text style={styles.bulletText}>Medium to long-term investment horizon (5–10 years)</Text>
          </View>
        </View>

        {/* Caution Types */}
        <View style={styles.cautionCard}>
          <Text style={styles.cautionCardTitle}>Needs Careful Consideration:</Text>
          <View style={styles.bulletRow}>
            <AlertTriangle color="#d97706" size={16} style={{ marginRight: 8 }} />
            <Text style={styles.bulletText}>Highly volatile single-stock bets or crypto derivatives</Text>
          </View>
          <View style={styles.bulletRow}>
            <AlertTriangle color="#d97706" size={16} style={{ marginRight: 8 }} />
            <Text style={styles.bulletText}>Highly concentrated equity exposure without income cover</Text>
          </View>
        </View>

        {/* Action Button */}
        <TouchableOpacity style={styles.primaryBtn} onPress={onConfirm} activeOpacity={0.85}>
          <Text style={styles.primaryBtnText} numberOfLines={2}>Launch Suitability Engine →</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollBody: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 110 },
  headerSubCaption: { color: '#64748b', fontSize: 13, marginBottom: 12 },

  resultCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 20,
  },
  badgeHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  badgeIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#dcfce7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  profileLabel: { fontSize: 12, color: '#64748b' },
  riskTitle: { fontSize: 22, fontWeight: 'bold', color: '#16a34a' },
  resultExplanation: { fontSize: 13, color: '#475569', lineHeight: 18, marginBottom: 14 },

  metricsRow: {
    flexDirection: 'row',
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    paddingVertical: 10,
    marginBottom: 14,
  },
  metricCell: { flex: 1, alignItems: 'center' },
  metricLabel: { fontSize: 11, color: '#64748b', fontWeight: '500' },
  metricVal: { fontSize: 15, fontWeight: 'bold', color: '#0f172a', marginTop: 2 },

  spectrumBox: { marginTop: 4 },
  spectrumBar: { height: 8, borderRadius: 4, flexDirection: 'row', position: 'relative' },
  spectrumSegment: { flex: 1, height: '100%', borderRadius: 2 },
  spectrumPointer: {
    position: 'absolute',
    left: '50%',
    top: -4,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#1b3a6b',
    borderWidth: 3,
    borderColor: '#ffffff',
    marginLeft: -8,
  },
  spectrumLabels: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 },
  spectrumLabelText: { fontSize: 10, color: '#94a3b8', fontWeight: '500' },

  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#0f172a', marginBottom: 12 },

  suitableCard: {
    backgroundColor: '#f0fdf4',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#bbf7d0',
    marginBottom: 12,
  },
  suitableCardTitle: { fontSize: 14, fontWeight: 'bold', color: '#166534', marginBottom: 8 },

  cautionCard: {
    backgroundColor: '#fffbeb',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#fde68a',
    marginBottom: 16,
  },
  cautionCardTitle: { fontSize: 14, fontWeight: 'bold', color: '#92400e', marginBottom: 8 },

  bulletRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  bulletText: { fontSize: 12, color: '#334155', flex: 1, lineHeight: 16 },

  primaryBtn: {
    backgroundColor: '#1b3a6b',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  primaryBtnText: { color: '#ffffff', fontSize: 15, fontWeight: 'bold', textAlign: 'center' },
});
