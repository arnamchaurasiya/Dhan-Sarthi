import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Platform, StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft, ChevronRight, Info } from 'lucide-react-native';
import { HEALTH_FACTORS, OVERALL_HEALTH_SCORE } from './darpanData';

export default function PortfolioHealth() {
  const navigation = useNavigation<any>();
  const [expandedFactor, setExpandedFactor] = useState<string | null>(null);

  const getScoreLabel = (score: number) => {
    if (score >= 75) return { label: 'Good', color: '#16a34a', bg: '#f0fdf4' };
    if (score >= 50) return { label: 'Moderate', color: '#d97706', bg: '#fffbeb' };
    return { label: 'Needs Attention', color: '#dc2626', bg: '#fef2f2' };
  };

  const overall = getScoreLabel(OVERALL_HEALTH_SCORE);

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ArrowLeft color="#fff" size={22} />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Portfolio Health</Text>
          <Text style={styles.headerSub}>Holistic portfolio assessment</Text>
        </View>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={{ padding: 16, paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        {/* Overall score */}
        <View style={styles.overallCard}>
          <View style={styles.overallTop}>
            <View>
              <Text style={styles.overallLabel}>Overall Health Score</Text>
              <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 4, marginTop: 4 }}>
                <Text style={[styles.overallScore, { color: overall.color }]}>{OVERALL_HEALTH_SCORE}</Text>
                <Text style={styles.overallMax}>/100</Text>
                <View style={[styles.overallBadge, { backgroundColor: overall.bg }]}>
                  <Text style={[styles.overallBadgeText, { color: overall.color }]}>{overall.label.toUpperCase()}</Text>
                </View>
              </View>
            </View>

            {/* Circular arc visual */}
            <View style={styles.scoreCircle}>
              <Text style={[styles.scoreCircleNum, { color: overall.color }]}>{OVERALL_HEALTH_SCORE}</Text>
            </View>
          </View>

          {/* Score bar */}
          <View style={styles.scoreMeter}>
            <View style={[styles.scoreFill, { width: `${OVERALL_HEALTH_SCORE}%`, backgroundColor: overall.color }]} />
          </View>

          {/* Transparency note */}
          <View style={styles.transparencyNote}>
            <Info color="#2563eb" size={13} />
            <Text style={styles.transparencyText}>
              Your score is based on 5 factors: Diversification, Risk Balance, Liquidity, Concentration, and Asset Variety.
            </Text>
          </View>
        </View>

        {/* Factor cards */}
        <Text style={styles.sectionTitle}>Score Breakdown</Text>
        {HEALTH_FACTORS.map((factor, i) => {
          const fl = getScoreLabel(factor.score);
          const isExp = expandedFactor === factor.label;
          return (
            <TouchableOpacity
              key={i}
              style={styles.factorCard}
              onPress={() => setExpandedFactor(isExp ? null : factor.label)}
              activeOpacity={0.85}
            >
              <View style={styles.factorTop}>
                <View style={styles.factorLeft}>
                  <Text style={styles.factorLabel}>{factor.label}</Text>
                  <View style={styles.factorBarBg}>
                    <View style={[styles.factorBarFill, { width: `${factor.score}%`, backgroundColor: factor.color }]} />
                  </View>
                </View>
                <View style={[styles.factorScoreBadge, { backgroundColor: fl.bg }]}>
                  <Text style={[styles.factorScoreNum, { color: fl.color }]}>{factor.score}</Text>
                  <Text style={[styles.factorScoreMax, { color: fl.color }]}>/100</Text>
                </View>
                <ChevronRight
                  color="#94a3b8"
                  size={16}
                  style={{ transform: [{ rotate: isExp ? '90deg' : '0deg' }] }}
                />
              </View>

              {isExp && (
                <View style={styles.factorExpanded}>
                  <Text style={styles.factorDesc}>{factor.description}</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}

        {/* Comparison */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Portfolio vs Benchmark</Text>
          <Text style={styles.cardSub}>Compared to a balanced moderate-risk portfolio</Text>
          {[
            { metric: 'Equity Exposure', yours: '48.2%', benchmark: '35%', worse: true },
            { metric: 'Fixed Income', yours: '10%', benchmark: '15-20%', worse: true },
            { metric: 'Asset Classes', yours: '5', benchmark: '5+', worse: false },
            { metric: 'Geographic Div.', yours: 'India only', benchmark: 'India + Global', worse: true },
            { metric: 'Liquidity', yours: 'High', benchmark: 'High', worse: false },
          ].map((row, i) => (
            <View key={i} style={styles.compareRow}>
              <Text style={styles.compareMetric}>{row.metric}</Text>
              <Text style={[styles.compareYours, { color: row.worse ? '#dc2626' : '#16a34a' }]}>{row.yours}</Text>
              <Text style={styles.compareBench}>{row.benchmark}</Text>
            </View>
          ))}
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#f4f7fb' },
  header: {
    backgroundColor: '#1b3a6b', flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 12 : 16,
    paddingBottom: 20, gap: 12,
  },
  backBtn: { width: 36, height: 36, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  headerSub: { color: '#bfdbfe', fontSize: 12 },
  scroll: { flex: 1 },

  overallCard: {
    backgroundColor: '#fff', borderRadius: 20, padding: 20, marginBottom: 16,
    borderWidth: 1, borderColor: 'rgba(27,58,107,0.08)',
    shadowColor: '#1b3a6b', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.06, shadowRadius: 12, elevation: 3,
  },
  overallTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  overallLabel: { color: '#64748b', fontSize: 13, fontWeight: '600' },
  overallScore: { fontSize: 42, fontWeight: 'bold' },
  overallMax: { color: '#94a3b8', fontSize: 18, marginBottom: 4 },
  overallBadge: { paddingHorizontal: 9, paddingVertical: 3, borderRadius: 8 },
  overallBadgeText: { fontSize: 10, fontWeight: 'bold' },
  scoreCircle: {
    width: 72, height: 72, borderRadius: 36,
    borderWidth: 5, borderColor: '#f1f5f9',
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#fff',
  },
  scoreCircleNum: { fontSize: 22, fontWeight: 'bold' },
  scoreMeter: { height: 10, backgroundColor: '#f1f5f9', borderRadius: 5, overflow: 'hidden', marginBottom: 14 },
  scoreFill: { height: '100%', borderRadius: 5 },
  transparencyNote: { flexDirection: 'row', alignItems: 'flex-start', gap: 7, backgroundColor: '#eff6ff', padding: 10, borderRadius: 10 },
  transparencyText: { color: '#1d4ed8', fontSize: 12, flex: 1, lineHeight: 18 },

  sectionTitle: { color: '#1e293b', fontSize: 17, fontWeight: 'bold', marginBottom: 10 },

  factorCard: {
    backgroundColor: '#fff', borderRadius: 16, padding: 14, marginBottom: 10,
    borderWidth: 1, borderColor: 'rgba(27,58,107,0.08)',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.03, shadowRadius: 4, elevation: 1,
    position: 'relative',
  },
  factorTop: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  factorLeft: { flex: 1 },
  factorLabel: { color: '#1e293b', fontSize: 14, fontWeight: 'bold', marginBottom: 6 },
  factorBarBg: { height: 6, backgroundColor: '#f1f5f9', borderRadius: 3, overflow: 'hidden' },
  factorBarFill: { height: '100%', borderRadius: 3 },
  factorScoreBadge: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10, alignItems: 'center', minWidth: 56 },
  factorScoreNum: { fontSize: 18, fontWeight: 'bold' },
  factorScoreMax: { fontSize: 10, fontWeight: '600' },
  factorExpanded: { marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#f1f5f9' },
  factorDesc: { color: '#475569', fontSize: 13, lineHeight: 21 },


  card: {
    backgroundColor: '#fff', borderRadius: 18, padding: 16, marginBottom: 14,
    borderWidth: 1, borderColor: 'rgba(27,58,107,0.08)',
    shadowColor: '#1b3a6b', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2,
  },
  cardTitle: { color: '#1e293b', fontSize: 15, fontWeight: 'bold', marginBottom: 4 },
  cardSub: { color: '#94a3b8', fontSize: 12, marginBottom: 12 },

  compareRow: { flexDirection: 'row', paddingVertical: 9, borderBottomWidth: 1, borderBottomColor: '#f8fafc', alignItems: 'center' },
  compareMetric: { flex: 2, color: '#475569', fontSize: 12, fontWeight: '500' },
  compareYours: { flex: 1, fontSize: 12, fontWeight: '700', textAlign: 'center' },
  compareBench: { flex: 1, color: '#64748b', fontSize: 12, textAlign: 'right' },
});
