import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { ShieldCheck, RefreshCw, CheckCircle2, ChevronRight, PieChart } from 'lucide-react-native';
import { InvestorProfile } from './margData';

interface Props {
  profile: InvestorProfile;
  onUpdateProfile: () => void;
  onRunEngine: () => void;
}

export default function InvestorProfileScreen({ profile, onUpdateProfile, onRunEngine }: Props) {
  return (
    <ScrollView style={styles.scrollBody} contentContainerStyle={styles.scrollContent}>
      {/* User Header Profile Card */}
      <View style={styles.userHeaderCard}>
        <Image source={require('../../assets/passport size photo.jpg')} style={styles.userAvatarImage} />
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={styles.userName}>Arnam Chaurasiya</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
            <CheckCircle2 color="#16a34a" size={13} />
            <Text style={styles.userBadgeText}> Verified Investor • SEBI DPI</Text>
          </View>
        </View>
      </View>

      <Text style={styles.headerSubCaption}>
        Core inputs required by SEBI-compliant suitability evaluation
      </Text>

      {/* Main Profile Summary Card */}
      <View style={styles.profileCard}>
        <View style={styles.badgeHeader}>
          <View style={styles.badgeIconWrap}>
            <ShieldCheck color="#16a34a" size={24} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.profileLabel}>Investor Classification</Text>
            <Text style={styles.riskTitle}>{profile.riskProfile} Investor</Text>
          </View>
          <TouchableOpacity style={styles.updatePill} onPress={onUpdateProfile}>
            <RefreshCw color="#2563eb" size={12} style={{ marginRight: 4 }} />
            <Text style={styles.updatePillText}>Update</Text>
          </TouchableOpacity>
        </View>

        {/* Spectrum Visual */}
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

        {/* Details Table */}
        <View style={styles.detailsBox}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Risk Tolerance</Text>
            <Text style={styles.detailVal}>{profile.riskProfile}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Investment Horizon</Text>
            <Text style={styles.detailVal}>{profile.investmentHorizon}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Primary Financial Goal</Text>
            <Text style={styles.detailVal}>{profile.primaryGoal}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Target Corpus</Text>
            <Text style={styles.detailVal}>₹{(profile.targetAmount / 100000).toFixed(1)} Lakhs</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Liquidity Requirement</Text>
            <Text style={styles.detailVal}>{profile.liquidityNeed}</Text>
          </View>
          <View style={[styles.detailRow, { borderBottomWidth: 0 }]}>
            <Text style={styles.detailLabel}>Existing Darpan Portfolio</Text>
            <Text style={styles.detailVal}>₹{(profile.portfolioValue / 100000).toFixed(1)} Lakhs</Text>
          </View>
        </View>
      </View>

      {/* Portfolio Darpan Sync Card */}
      <View style={styles.darpanCard}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
          <PieChart color="#2563eb" size={18} style={{ marginRight: 8 }} />
          <Text style={styles.darpanTitle}>Dhan Darpan Integration Active</Text>
        </View>
        <Text style={styles.darpanDesc}>
          Existing asset weights ({profile.directEquityAllocationPct}% Equity, {profile.reitAllocationPct}% REIT, {profile.debtAllocationPct}% Debt) are synced directly from Sahamati Account Aggregator.
        </Text>
      </View>

      <TouchableOpacity style={styles.primaryBtn} onPress={onRunEngine}>
        <Text style={styles.primaryBtnText}>Run Suitability Engine →</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollBody: { flex: 1, backgroundColor: '#f8fafc' },
  scrollContent: { padding: 16, paddingBottom: 110 },
  userHeaderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 12,
  },
  userAvatarImage: { width: 50, height: 50, borderRadius: 25, borderWidth: 2, borderColor: '#2563eb', overflow: 'hidden', transform: [{ translateY: 4 }, { scale: 1.08 }] },
  userName: { fontSize: 16, fontWeight: 'bold', color: '#1b3a6b' },
  userBadgeText: { fontSize: 12, fontWeight: '600', color: '#16a34a' },
  headerSubCaption: { color: '#64748b', fontSize: 13, marginBottom: 16 },

  profileCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 16,
  },
  badgeHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  badgeIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#dcfce7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  profileLabel: { fontSize: 12, color: '#64748b' },
  riskTitle: { fontSize: 20, fontWeight: 'bold', color: '#16a34a' },
  updatePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eff6ff',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  updatePillText: { fontSize: 12, color: '#2563eb', fontWeight: '600' },

  spectrumBox: { marginBottom: 16 },
  spectrumBar: {
    height: 8,
    borderRadius: 4,
    flexDirection: 'row',
    position: 'relative',
  },
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

  detailsBox: { borderTopWidth: 1, borderTopColor: '#f1f5f9', paddingTop: 10 },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f8fafc',
  },
  detailLabel: { fontSize: 13, color: '#64748b' },
  detailVal: { fontSize: 13, fontWeight: 'bold', color: '#0f172a' },

  darpanCard: {
    backgroundColor: '#eff6ff',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#bfdbfe',
    marginBottom: 20,
  },
  darpanTitle: { fontSize: 14, fontWeight: 'bold', color: '#1e40af' },
  darpanDesc: { fontSize: 12, color: '#1e3a8a', lineHeight: 17 },

  primaryBtn: {
    backgroundColor: '#1b3a6b',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  primaryBtnText: { color: '#ffffff', fontSize: 15, fontWeight: 'bold' },
});
