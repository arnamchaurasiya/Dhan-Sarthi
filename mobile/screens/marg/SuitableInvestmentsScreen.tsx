import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Sparkles, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react-native';
import { Product, PRODUCTS_DATA, InvestorProfile } from './margData';

interface Props {
  profile: InvestorProfile;
  onSelectProduct: (product: Product) => void;
  onViewWhyMatch: (product: Product) => void;
  onCompare: (product: Product) => void;
}

export default function SuitableInvestmentsScreen({
  profile,
  onSelectProduct,
  onViewWhyMatch,
  onCompare,
}: Props) {
  const [selectedFilter, setSelectedFilter] = useState<string>('All');

  const filters = ['All', 'REITs/InvITs', 'Debt', 'Equity'];

  const filteredProducts =
    selectedFilter === 'All'
      ? PRODUCTS_DATA
      : PRODUCTS_DATA.filter((p) => p.category === selectedFilter);

  return (
    <View style={{ flex: 1, backgroundColor: '#f8fafc' }}>
      <ScrollView style={styles.scrollBody} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.headerSubCaption}>
          Investments suitable for your profile & Dhan Darpan portfolio
        </Text>

        {/* Filters */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll} contentContainerStyle={{ alignItems: 'center' }}>
          {filters.map((f) => {
            const active = selectedFilter === f;
            return (
              <TouchableOpacity
                key={f}
                style={[styles.filterPill, active && styles.filterPillActive]}
                onPress={() => setSelectedFilter(f)}
              >
                <Text style={[styles.filterPillText, active && styles.filterPillTextActive]}>
                  {f}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* AI Suitability Banner */}
        <View style={styles.aiBanner}>
          <Sparkles color="#16a34a" size={18} style={{ marginRight: 8 }} />
          <Text style={styles.aiBannerText}>
            Suitability engine ranked by risk, horizon ({profile.investmentHorizon}), and diversification value.
          </Text>
        </View>

        {/* Product Cards */}
        {filteredProducts.map((p) => {
          const IconComp = p.icon;
          return (
            <View key={p.id} style={styles.productCard}>
              {/* Header */}
              <TouchableOpacity style={styles.cardHeaderRow} onPress={() => onSelectProduct(p)}>
                <View style={styles.iconWrap}>
                  <IconComp color="#1b3a6b" size={22} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.productName}>{p.name}</Text>
                  <Text style={styles.productType}>{p.type}</Text>
                </View>
                <View style={styles.scoreBadge}>
                  <Text style={styles.scoreText}>{p.matchScore}%</Text>
                  <Text style={styles.scoreTag}>Suitability</Text>
                </View>
              </TouchableOpacity>

              {/* Rationale Bullet Tags */}
              <View style={styles.tagsContainer}>
                <View style={styles.tagRow}>
                  <CheckCircle2 color="#16a34a" size={14} style={{ marginRight: 6 }} />
                  <Text style={styles.tagText}>Moderate risk match aligns with your profile</Text>
                </View>
                <View style={styles.tagRow}>
                  <CheckCircle2 color="#16a34a" size={14} style={{ marginRight: 6 }} />
                  <Text style={styles.tagText}>Fits {profile.investmentHorizon} timeframe</Text>
                </View>
                <View style={styles.tagRow}>
                  <CheckCircle2 color="#16a34a" size={14} style={{ marginRight: 6 }} />
                  <Text style={styles.tagText}>Diversifies direct equity exposure</Text>
                </View>
                <View style={styles.tagRow}>
                  <AlertTriangle color="#d97706" size={14} style={{ marginRight: 6 }} />
                  <Text style={[styles.tagText, { color: '#92400e' }]}>
                    Medium liquidity (Traded on BSE/NSE)
                  </Text>
                </View>
              </View>

              {/* Action Buttons */}
              <View style={styles.actionButtonsRow}>
                <TouchableOpacity
                  style={styles.whyMatchBtn}
                  onPress={() => onViewWhyMatch(p)}
                >
                  <Text style={styles.whyMatchBtnText}>Why Match</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.compareBtn}
                  onPress={() => onCompare(p)}
                >
                  <Text style={styles.compareBtnText}>Compare</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.viewDetailBtn}
                  onPress={() => onSelectProduct(p)}
                >
                  <Text style={styles.viewDetailBtnText}>View Product →</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollBody: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 110 },
  headerSubCaption: { color: '#64748b', fontSize: 13, marginBottom: 12 },

  filterScroll: { marginBottom: 14, flexGrow: 0 },
  filterPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    marginRight: 8,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterPillActive: { backgroundColor: '#1b3a6b', borderColor: '#1b3a6b' },
  filterPillText: { fontSize: 13, color: '#475569', fontWeight: '500' },
  filterPillTextActive: { color: '#ffffff', fontWeight: 'bold' },

  aiBanner: {
    backgroundColor: '#f0fdf4',
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#bbf7d0',
    marginBottom: 16,
  },
  aiBannerText: { color: '#166534', fontSize: 12, flex: 1, fontWeight: '500' },

  productCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 14,
    elevation: 2,
  },
  cardHeaderRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  iconWrap: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#eff6ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  productName: { fontSize: 16, fontWeight: 'bold', color: '#0f172a' },
  productType: { fontSize: 12, color: '#64748b', marginTop: 2 },
  scoreBadge: {
    backgroundColor: '#dcfce7',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    alignItems: 'center',
  },
  scoreText: { color: '#15803d', fontSize: 15, fontWeight: 'bold' },
  scoreTag: { color: '#166534', fontSize: 9, fontWeight: 'bold' },

  tagsContainer: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 10,
    marginBottom: 14,
  },
  tagRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 3 },
  tagText: { fontSize: 12, color: '#334155', fontWeight: '500' },

  actionButtonsRow: { flexDirection: 'row', gap: 8 },
  whyMatchBtn: {
    flex: 1,
    backgroundColor: '#eff6ff',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  whyMatchBtnText: { color: '#2563eb', fontSize: 12, fontWeight: 'bold' },
  compareBtn: {
    flex: 1,
    backgroundColor: '#f1f5f9',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  compareBtnText: { color: '#475569', fontSize: 12, fontWeight: 'bold' },
  viewDetailBtn: {
    flex: 1.2,
    backgroundColor: '#1b3a6b',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  viewDetailBtnText: { color: '#ffffff', fontSize: 12, fontWeight: 'bold' },
});
