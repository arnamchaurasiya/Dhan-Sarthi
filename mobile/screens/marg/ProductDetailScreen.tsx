import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import {
  Building2,
  BookOpen,
  HelpCircle,
  AlertTriangle,
  ChevronRight,
  TrendingUp,
  ShieldCheck,
  Landmark,
  Share2,
  Heart,
} from 'lucide-react-native';
import { Product, InvestorProfile } from './margData';

interface Props {
  product: Product;
  profile: InvestorProfile;
  onNavigateToGyaan: (topicId: string) => void;
  onNavigateToWhyMatch: () => void;
  onNavigateToCompare: () => void;
  onProceedToDecision: () => void;
}

export default function ProductDetailScreen({
  product,
  profile,
  onNavigateToGyaan,
  onNavigateToWhyMatch,
  onNavigateToCompare,
  onProceedToDecision,
}: Props) {
  const [activeTab, setActiveTab] = useState<'Overview' | 'Performance' | 'Risks' | 'Fees'>('Overview');
  const IconComp = product.icon;

  return (
    <View style={{ flex: 1, backgroundColor: '#f8fafc' }}>
      <ScrollView style={styles.scrollBody} contentContainerStyle={styles.scrollContent}>
        {/* Product Card Header */}
        <View style={styles.headerCard}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={styles.iconWrap}>
              <IconComp color="#1b3a6b" size={24} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.productName}>{product.name}</Text>
              <Text style={styles.productType}>{product.type}</Text>
            </View>
            <View style={styles.scoreCircle}>
              <Text style={styles.scoreVal}>{product.matchScore}%</Text>
              <Text style={styles.scoreTag}>Suitability</Text>
            </View>
          </View>

          <View style={styles.matchBanner}>
            <Text style={styles.matchTitle}>{product.matchLabel}</Text>
            <Text style={styles.matchSub}>
              This product strongly aligns with your {profile.riskProfile} risk profile and {profile.investmentHorizon} horizon.
            </Text>
          </View>
        </View>

        {/* Core Attributes Grid */}
        <View style={styles.statsGrid}>
          <View style={styles.statCell}>
            <Text style={styles.statLabel}>Exp. Dividend Yield</Text>
            <Text style={styles.statVal}>{product.expectedYield}</Text>
          </View>
          <View style={styles.statCell}>
            <Text style={styles.statLabel}>Min. Investment</Text>
            <Text style={styles.statVal}>{product.minInvest}</Text>
          </View>
          <View style={styles.statCell}>
            <Text style={styles.statLabel}>Risk Category</Text>
            <Text style={[styles.statVal, { color: '#16a34a' }]}>{product.riskLevel}</Text>
          </View>
          <View style={styles.statCell}>
            <Text style={styles.statLabel}>Min. Horizon</Text>
            <Text style={styles.statVal}>{product.horizonReq}</Text>
          </View>
        </View>

        {/* 3 Explicit Navigation CTAs specified in specification */}
        <Text style={styles.sectionHeading}>Dhan Sarthi Decision Options</Text>

        <TouchableOpacity
          style={styles.ctaBridgeCard}
          onPress={() => onNavigateToGyaan(product.gyaanTopicId)}
        >
          <View style={[styles.ctaIconWrap, { backgroundColor: '#fef3c7' }]}>
            <BookOpen color="#d97706" size={20} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.ctaTitle}>Learn what a {product.category.slice(0, 4)} is</Text>
            <Text style={styles.ctaSub}>Go to Dhan Gyaan interactive tutor & lesson</Text>
          </View>
          <ChevronRight color="#64748b" size={18} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.ctaBridgeCard} onPress={onNavigateToWhyMatch}>
          <View style={[styles.ctaIconWrap, { backgroundColor: '#dcfce7' }]}>
            <HelpCircle color="#16a34a" size={20} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.ctaTitle}>See why it matches me</Text>
            <Text style={styles.ctaSub}>Inspect the 5-factor suitability matrix</Text>
          </View>
          <ChevronRight color="#64748b" size={18} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.ctaBridgeCard} onPress={onNavigateToCompare}>
          <View style={[styles.ctaIconWrap, { backgroundColor: '#dbeafe' }]}>
            <TrendingUp color="#2563eb" size={20} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.ctaTitle}>Compare with other suitable assets</Text>
            <Text style={styles.ctaSub}>Side-by-side: REIT vs InvIT vs Corporate Bonds</Text>
          </View>
          <ChevronRight color="#64748b" size={18} />
        </TouchableOpacity>

        {/* Key things to know (Risk disclosures) */}
        <Text style={[styles.sectionHeading, { marginTop: 18 }]}>Key Things to Know (Risks)</Text>
        <View style={styles.risksBox}>
          {product.keyRisks.map((r, i) => (
            <View key={i} style={styles.riskRow}>
              <AlertTriangle color="#d97706" size={16} style={{ marginRight: 8, marginTop: 2 }} />
              <Text style={styles.riskText}>{r}</Text>
            </View>
          ))}
        </View>

        {/* Description Tabs */}
        <View style={styles.tabsRow}>
          {(['Overview', 'Performance', 'Risks', 'Fees'] as const).map((t) => (
            <TouchableOpacity
              key={t}
              style={[styles.tabBtn, activeTab === t && styles.tabBtnActive]}
              onPress={() => setActiveTab(t)}
            >
              <Text style={[styles.tabBtnText, activeTab === t && styles.tabBtnTextActive]}>
                {t}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.tabContentBox}>
          <Text style={styles.aboutText}>{product.about}</Text>
          <Text style={[styles.aboutText, { fontWeight: 'bold', marginTop: 10 }]}>Highlights:</Text>
          {product.keyHighlights.map((h, i) => (
            <Text key={i} style={styles.highlightBullet}>
              • {h}
            </Text>
          ))}
        </View>
      </ScrollView>

      <View style={styles.bottomFixedBar}>
        <TouchableOpacity style={styles.primaryBtn} onPress={onProceedToDecision}>
          <Text style={styles.primaryBtnText}>Review & Continue with {product.name} →</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollBody: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 110 },

  headerCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 14,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#eff6ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  productName: { fontSize: 18, fontWeight: 'bold', color: '#0f172a' },
  productType: { fontSize: 12, color: '#64748b', marginTop: 2 },
  scoreCircle: {
    backgroundColor: '#dcfce7',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    alignItems: 'center',
  },
  scoreVal: { color: '#15803d', fontSize: 16, fontWeight: 'bold' },
  scoreTag: { color: '#166534', fontSize: 9, fontWeight: 'bold' },

  matchBanner: {
    backgroundColor: '#f0fdf4',
    borderRadius: 12,
    padding: 12,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#bbf7d0',
  },
  matchTitle: { fontSize: 13, fontWeight: 'bold', color: '#166534' },
  matchSub: { fontSize: 12, color: '#14532d', marginTop: 2 },

  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: '#ffffff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 16,
  },
  statCell: { width: '50%', padding: 12, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  statLabel: { fontSize: 11, color: '#64748b' },
  statVal: { fontSize: 14, fontWeight: 'bold', color: '#0f172a', marginTop: 2 },

  sectionHeading: { fontSize: 15, fontWeight: 'bold', color: '#0f172a', marginBottom: 10 },

  ctaBridgeCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 10,
  },
  ctaIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  ctaTitle: { fontSize: 14, fontWeight: 'bold', color: '#0f172a' },
  ctaSub: { fontSize: 11, color: '#64748b', marginTop: 2 },

  risksBox: {
    backgroundColor: '#fffbeb',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#fde68a',
    marginBottom: 16,
  },
  riskRow: { flexDirection: 'row', alignItems: 'flex-start', marginVertical: 4 },
  riskText: { fontSize: 12, color: '#92400e', flex: 1, lineHeight: 16 },

  tabsRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#e2e8f0', marginBottom: 10 },
  tabBtn: { paddingVertical: 10, paddingHorizontal: 14, marginRight: 10 },
  tabBtnActive: { borderBottomWidth: 2, borderBottomColor: '#2563eb' },
  tabBtnText: { fontSize: 13, color: '#64748b', fontWeight: '500' },
  tabBtnTextActive: { color: '#2563eb', fontWeight: 'bold' },

  tabContentBox: { backgroundColor: '#ffffff', borderRadius: 14, padding: 14, borderWidth: 1, borderColor: '#e2e8f0' },
  aboutText: { fontSize: 13, color: '#334155', lineHeight: 18 },
  highlightBullet: { fontSize: 12, color: '#475569', marginTop: 4 },

  bottomFixedBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    padding: 16,
  },
  primaryBtn: {
    backgroundColor: '#1b3a6b',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  primaryBtnText: { color: '#ffffff', fontSize: 15, fontWeight: 'bold' },
});
