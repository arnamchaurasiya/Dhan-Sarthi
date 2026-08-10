import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  StatusBar,
} from 'react-native';
import {
  ShieldCheck,
  User,
  ChevronRight,
  Target,
  Sparkles,
  Wallet,
  RefreshCw,
  Building2,
  PieChart,
  CheckCircle2,
  TrendingUp,
  Landmark,
} from 'lucide-react-native';
import { InvestorProfile, PRODUCTS_DATA } from './margData';

interface Props {
  profile: InvestorProfile;
  onNavigateToProfile: () => void;
  onExploreSuitable: () => void;
  onSelectProduct: (product: any) => void;
  onNavigateToGoals: () => void;
}

export default function MargHome({
  profile,
  onNavigateToProfile,
  onExploreSuitable,
  onSelectProduct,
  onNavigateToGoals,
}: Props) {
  const suitableOpportunities = PRODUCTS_DATA.slice(0, 3);

  return (
    <ScrollView
      style={styles.scrollBody}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* SEBI Saarthi Hero Banner with Darpan Linkage */}
      <View style={styles.heroCard}>
        <View style={styles.heroTopRow}>
          <View style={styles.heroBadgeRow}>
            <View style={styles.badgePill}>
              <ShieldCheck color="#ffffff" size={12} />
              <Text style={styles.heroBadgeText}>SEBI REGISTERED DPI</Text>
            </View>
            <Text style={styles.heroBadgeSub}>• Dhan Marg</Text>
          </View>

          <TouchableOpacity
            style={styles.userProfileBtn}
            onPress={onNavigateToProfile}
            activeOpacity={0.8}
          >
            <View style={styles.avatarCircle}>
              <User color="#1b3a6b" size={13} />
            </View>
            <Text style={styles.profileNameText}>Arnam</Text>
            <ChevronRight color="rgba(255,255,255,0.7)" size={12} style={{ marginLeft: 2 }} />
          </TouchableOpacity>
        </View>

        <Text style={styles.heroTitle}>Dhan Marg</Text>
        <Text style={styles.heroSub}>
          Decision & Suitability Layer • “What types of investments suit me & why?”
        </Text>
      </View>

      <View style={styles.contentPadding}>
        {/* Connection to Dhan Darpan Portfolio Banner */}
        <View style={styles.darpanConnectionCard}>
          <View style={styles.darpanConnHeader}>
            <PieChart color="#2563eb" size={18} style={{ marginRight: 8 }} />
            <Text style={styles.darpanConnTitle}>Connected to Dhan Darpan</Text>
          </View>
          <Text style={styles.darpanConnText}>
            Based on your current portfolio of <Text style={styles.boldText}>₹7.9L</Text> (48.2% Direct Equity concentration), Dhan Marg recommends adding non-correlated assets.
          </Text>
        </View>

        {/* Snapshot Card */}
        <View style={styles.snapshotCard}>
          <View style={styles.snapshotHeaderRow}>
            <Text style={styles.snapshotHeaderTitle}>Your Investor Profile Snapshot</Text>
            <View style={styles.statusCompletePill}>
              <CheckCircle2 color="#16a34a" size={12} style={{ marginRight: 4 }} />
              <Text style={styles.statusCompleteText}>Profile Complete</Text>
            </View>
          </View>

          <View style={styles.snapshotGrid}>
            <View style={styles.snapshotItem}>
              <View style={styles.snapshotItemIconRow}>
                <ShieldCheck color="#16a34a" size={15} />
                <Text style={styles.snapshotItemLabel}>Risk Profile</Text>
              </View>
              <Text style={[styles.snapshotItemVal, { color: '#16a34a' }]}>
                {profile.riskProfile}
              </Text>
            </View>
            <View style={styles.snapshotItem}>
              <View style={styles.snapshotItemIconRow}>
                <Target color="#2563eb" size={15} />
                <Text style={styles.snapshotItemLabel}>Horizon</Text>
              </View>
              <Text style={styles.snapshotItemVal}>{profile.investmentHorizon}</Text>
            </View>
          </View>

          <View style={[styles.snapshotGrid, { marginTop: 12 }]}>
            <View style={styles.snapshotItem}>
              <View style={styles.snapshotItemIconRow}>
                <Sparkles color="#d97706" size={15} />
                <Text style={styles.snapshotItemLabel}>Primary Goal</Text>
              </View>
              <Text style={styles.snapshotItemVal}>{profile.primaryGoal}</Text>
            </View>
            <View style={styles.snapshotItem}>
              <View style={styles.snapshotItemIconRow}>
                <Wallet color="#4f46e5" size={15} />
                <Text style={styles.snapshotItemLabel}>Liquidity</Text>
              </View>
              <Text style={styles.snapshotItemVal}>{profile.liquidityNeed} Need</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.updateProfileLink} onPress={onNavigateToProfile}>
            <RefreshCw color="#2563eb" size={14} style={{ marginRight: 6 }} />
            <Text style={styles.updateProfileLinkText}>View & Update Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Suitable Opportunities Preview */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionHeadingText}>Your Suitable Opportunities</Text>
          <TouchableOpacity onPress={onExploreSuitable}>
            <Text style={styles.viewAllLinkText}>See All →</Text>
          </TouchableOpacity>
        </View>

        {suitableOpportunities.map((p) => {
          const IconComp = p.icon;
          return (
            <TouchableOpacity
              key={p.id}
              style={styles.oppCard}
              onPress={() => onSelectProduct(p)}
              activeOpacity={0.8}
            >
              <View style={styles.oppCardTop}>
                <View style={styles.oppIconWrap}>
                  <IconComp color="#1b3a6b" size={20} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.oppTitle}>{p.name}</Text>
                  <Text style={styles.oppType}>{p.type}</Text>
                </View>
                <View style={styles.matchPill}>
                  <Text style={styles.matchPillText}>{p.matchScore}% Match</Text>
                </View>
              </View>
              <View style={styles.oppFooter}>
                <Text style={styles.oppFooterYield}>Exp. Yield: {p.expectedYield}</Text>
                <Text style={styles.oppFooterMin}>Min: {p.minInvest}</Text>
              </View>
            </TouchableOpacity>
          );
        })}

        <TouchableOpacity style={styles.primaryExploreBtn} onPress={onExploreSuitable}>
          <Sparkles color="#ffffff" size={18} style={{ marginRight: 8 }} />
          <Text style={styles.primaryExploreBtnText}>Explore Suitable Investments</Text>
        </TouchableOpacity>

        {/* Action Menu Cards */}
        <Text style={[styles.sectionHeadingText, { marginTop: 24 }]}>What would you like to do?</Text>

        <TouchableOpacity style={styles.actionCard} onPress={onNavigateToGoals}>
          <View style={styles.actionIconWrap}>
            <Sparkles color="#2563eb" size={20} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.actionTitle}>Run Suitability Engine</Text>
            <Text style={styles.actionSub}>Re-evaluate goals, risk & horizon</Text>
          </View>
          <ChevronRight color="#64748b" size={20} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionCard} onPress={onExploreSuitable}>
          <View style={styles.actionIconWrap}>
            <Building2 color="#2563eb" size={20} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.actionTitle}>Explore All Products</Text>
            <Text style={styles.actionSub}>REITs, InvITs, Corporate Bonds & MFs</Text>
          </View>
          <ChevronRight color="#64748b" size={20} />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollBody: { flex: 1, backgroundColor: '#f8fafc' },
  scrollContent: { paddingBottom: 110 },
  contentPadding: { padding: 16 },

  heroCard: {
    backgroundColor: '#1b3a6b',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 12 : 16,
    paddingBottom: 22,
    borderBottomRightRadius: 28,
    borderBottomLeftRadius: 28,
    shadowColor: '#1b3a6b',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  heroTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  heroBadgeRow: { flexDirection: 'row', alignItems: 'center', flex: 1, marginRight: 8 },
  badgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  heroBadgeText: { color: '#ffffff', fontSize: 10, fontWeight: 'bold', marginLeft: 4 },
  heroBadgeSub: { color: '#bfdbfe', fontSize: 12, fontWeight: '600', marginLeft: 6 },
  userProfileBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    flexShrink: 0,
  },
  avatarCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },
  profileNameText: { color: '#ffffff', fontSize: 12, fontWeight: '600' },
  heroTitle: { color: '#ffffff', fontSize: 24, fontWeight: 'bold' },
  heroSub: { color: '#cbd5e1', fontSize: 13, marginTop: 4, lineHeight: 18 },

  darpanConnectionCard: {
    backgroundColor: '#eff6ff',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#bfdbfe',
    marginBottom: 16,
  },
  darpanConnHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  darpanConnTitle: { color: '#1e40af', fontSize: 14, fontWeight: 'bold' },
  darpanConnText: { color: '#1e3a8a', fontSize: 12, lineHeight: 17 },
  boldText: { fontWeight: 'bold', color: '#0f172a' },

  snapshotCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 20,
    elevation: 2,
  },
  snapshotHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  snapshotHeaderTitle: { fontSize: 13.5, fontWeight: 'bold', color: '#0f172a', flex: 1, marginRight: 6 },
  statusCompletePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0fdf4',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#bbf7d0',
    flexShrink: 0,
  },
  statusCompleteText: { fontSize: 11, color: '#16a34a', fontWeight: '600' },
  snapshotGrid: { flexDirection: 'row', justifyContent: 'space-between' },
  snapshotItem: { flex: 1 },
  snapshotItemIconRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  snapshotItemLabel: { fontSize: 11, color: '#64748b', fontWeight: '500', marginLeft: 4 },
  snapshotItemVal: { fontSize: 14, fontWeight: 'bold', color: '#0f172a' },
  updateProfileLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 14,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  updateProfileLinkText: { color: '#2563eb', fontSize: 13, fontWeight: 'bold' },

  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionHeadingText: { fontSize: 16, fontWeight: 'bold', color: '#0f172a' },
  viewAllLinkText: { color: '#2563eb', fontSize: 13, fontWeight: '600' },

  oppCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 10,
  },
  oppCardTop: { flexDirection: 'row', alignItems: 'center' },
  oppIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  oppTitle: { fontSize: 15, fontWeight: 'bold', color: '#0f172a' },
  oppType: { fontSize: 12, color: '#64748b', marginTop: 1 },
  matchPill: {
    backgroundColor: '#dcfce7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  matchPillText: { color: '#15803d', fontSize: 11, fontWeight: 'bold' },
  oppFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f8fafc',
  },
  oppFooterYield: { fontSize: 12, color: '#059669', fontWeight: '600' },
  oppFooterMin: { fontSize: 12, color: '#64748b' },

  primaryExploreBtn: {
    backgroundColor: '#1b3a6b',
    borderRadius: 14,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  primaryExploreBtnText: { color: '#ffffff', fontSize: 15, fontWeight: 'bold' },

  actionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginTop: 10,
  },
  actionIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#eff6ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  actionTitle: { fontSize: 15, fontWeight: 'bold', color: '#0f172a' },
  actionSub: { fontSize: 12, color: '#64748b', marginTop: 2 },
});
