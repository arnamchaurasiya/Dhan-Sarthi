import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Platform, StatusBar,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ArrowLeft, ChevronRight, ChevronDown, BookOpen, TrendingUp } from 'lucide-react-native';
import { PORTFOLIO_INSIGHTS, DEFAULT_HOLDINGS, SEVERITY_COLORS, PortfolioInsight } from './darpanData';

export default function PortfolioInsights() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const holdings = route.params?.holdings || DEFAULT_HOLDINGS;
  const [expanded, setExpanded] = useState<string | null>('ins_001');

  const navigateInsight = (insight: PortfolioInsight) => {
    if (insight.actionTarget === 'RiskExposure') {
      navigation.navigate('RiskExposure', { holdings });
    } else if (insight.actionTarget === 'Transactions') {
      navigation.navigate('Transactions', {});
    } else if (insight.actionTarget === 'Holdings') {
      navigation.navigate('Holdings', { holdings });
    } else if (insight.actionTarget === 'DiversificationOpportunity') {
      navigation.navigate('DiversificationOpportunity');
    }
  };

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ArrowLeft color="#fff" size={22} />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>AI Portfolio Insights</Text>
          <Text style={styles.headerSub}>Pattern detection across your portfolio</Text>
        </View>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={{ padding: 16, paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        {/* AI header banner */}
        <View style={styles.aiBanner}>
          <Text style={styles.aiBannerEmoji}>🧠</Text>
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={styles.aiBannerTitle}>Dhan Darpan AI Engine</Text>
            <Text style={styles.aiBannerSub}>
              Analysed {holdings.length} holdings, 9 transactions, and 5 risk factors to generate these insights.
            </Text>
          </View>
        </View>

        {/* Insights summary row */}
        <View style={styles.summaryRow}>
          {[
            { label: 'Critical', count: PORTFOLIO_INSIGHTS.filter(i => i.severity === 'HIGH').length, color: '#dc2626' },
            { label: 'Warnings', count: PORTFOLIO_INSIGHTS.filter(i => i.severity === 'MEDIUM').length, color: '#d97706' },
            { label: 'Positive', count: PORTFOLIO_INSIGHTS.filter(i => i.severity === 'LOW').length, color: '#16a34a' },
            { label: 'Informational', count: PORTFOLIO_INSIGHTS.filter(i => i.severity === 'INFO').length, color: '#2563eb' },
          ].map((s, i) => (
            <View key={i} style={styles.summaryBox}>
              <Text style={[styles.summaryCount, { color: s.color }]}>{s.count}</Text>
              <Text style={styles.summaryLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* Insight cards */}
        {PORTFOLIO_INSIGHTS.map((insight) => {
          const sc = SEVERITY_COLORS[insight.severity];
          const isExpanded = expanded === insight.id;
          return (
            <TouchableOpacity
              key={insight.id}
              style={[styles.insightCard, { borderLeftColor: sc.badge, borderLeftWidth: 4 }]}
              onPress={() => setExpanded(isExpanded ? null : insight.id)}
              activeOpacity={0.85}
            >
              <View style={styles.insightTop}>
                <Text style={styles.insightEmoji}>{insight.emoji}</Text>
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <Text style={styles.insightTitle}>{insight.title}</Text>
                    <View style={[styles.insightSeverityBadge, { backgroundColor: sc.bg, borderColor: sc.border, borderWidth: 1 }]}>
                      <Text style={[styles.insightSeverityText, { color: sc.text }]}>{insight.severity}</Text>
                    </View>
                  </View>
                  {!isExpanded && (
                    <Text style={styles.insightPreview} numberOfLines={2}>{insight.description}</Text>
                  )}
                </View>
                {isExpanded ? <ChevronDown color="#94a3b8" size={16} /> : <ChevronRight color="#94a3b8" size={16} />}
              </View>

              {isExpanded && (
                <View style={styles.insightExpanded}>
                  <Text style={styles.insightDesc}>{insight.description}</Text>
                  {insight.action && (
                    <TouchableOpacity
                      style={[styles.insightAction, { backgroundColor: sc.bg, borderColor: sc.border, borderWidth: 1 }]}
                      onPress={() => navigateInsight(insight)}
                    >
                      <Text style={[styles.insightActionText, { color: sc.text }]}>{insight.action} →</Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}
            </TouchableOpacity>
          );
        })}

        {/* Pattern analysis */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Recent Investment Patterns</Text>
          <View style={styles.patternRow}>
            <View style={styles.patternItem}>
              <Text style={styles.patternNum}>72%</Text>
              <Text style={styles.patternLabel}>of last 5 investments were equity</Text>
            </View>
            <View style={styles.patternItem}>
              <Text style={[styles.patternNum, { color: '#16a34a' }]}>+3.2%</Text>
              <Text style={styles.patternLabel}>fixed income growth this month</Text>
            </View>
          </View>
          <View style={styles.equityBar}>
            <View style={[styles.equityFill, { width: '72%' }]} />
            <View style={[styles.otherFill, { flex: 1 }]} />
          </View>
          <View style={styles.equityLegend}>
            <View style={styles.legendItem}><View style={[styles.legendDot, { backgroundColor: '#1b3a6b' }]} /><Text style={styles.legendText}>Equity (72%)</Text></View>
            <View style={styles.legendItem}><View style={[styles.legendDot, { backgroundColor: '#14b8a6' }]} /><Text style={styles.legendText}>Other (28%)</Text></View>
          </View>
        </View>

        {/* CTA to diversification */}
        <TouchableOpacity
          style={styles.diversifyCta}
          onPress={() => navigation.navigate('DiversificationOpportunity')}
        >
          <TrendingUp color="#fff" size={16} />
          <Text style={styles.diversifyCtaText}>Explore Diversification Opportunities</Text>
          <ChevronRight color="#fff" size={16} style={{ marginLeft: 'auto' }} />
        </TouchableOpacity>
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

  aiBanner: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#f5f3ff',
    borderColor: '#ddd6fe', borderWidth: 1, borderRadius: 14, padding: 14, marginBottom: 14,
  },
  aiBannerEmoji: { fontSize: 28 },
  aiBannerTitle: { color: '#6d28d9', fontSize: 14, fontWeight: 'bold' },
  aiBannerSub: { color: '#7c3aed', fontSize: 12, marginTop: 3, lineHeight: 18 },

  summaryRow: {
    flexDirection: 'row', backgroundColor: '#fff', borderRadius: 14,
    padding: 12, marginBottom: 14, gap: 4,
    borderWidth: 1, borderColor: 'rgba(27,58,107,0.08)',
    shadowColor: '#1b3a6b', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 6, elevation: 2,
  },
  summaryBox: { flex: 1, alignItems: 'center' },
  summaryCount: { fontSize: 22, fontWeight: 'bold' },
  summaryLabel: { color: '#94a3b8', fontSize: 10, fontWeight: '600', textAlign: 'center', marginTop: 2 },

  insightCard: {
    backgroundColor: '#fff', borderRadius: 16, padding: 14, marginBottom: 10,
    borderWidth: 1, borderColor: 'rgba(27,58,107,0.08)',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
  },
  insightTop: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  insightEmoji: { fontSize: 22, marginTop: 1 },
  insightTitle: { color: '#1e293b', fontSize: 14, fontWeight: 'bold' },
  insightSeverityBadge: { paddingHorizontal: 7, paddingVertical: 2, borderRadius: 6 },
  insightSeverityText: { fontSize: 9, fontWeight: 'bold' },
  insightPreview: { color: '#64748b', fontSize: 12, marginTop: 3, lineHeight: 18 },
  insightExpanded: { marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#f1f5f9' },
  insightDesc: { color: '#475569', fontSize: 13, lineHeight: 21, marginBottom: 12 },
  insightAction: { paddingHorizontal: 14, paddingVertical: 9, borderRadius: 10, alignSelf: 'flex-start' },
  insightActionText: { fontSize: 13, fontWeight: '700' },

  card: {
    backgroundColor: '#fff', borderRadius: 18, padding: 16, marginBottom: 14,
    borderWidth: 1, borderColor: 'rgba(27,58,107,0.08)',
    shadowColor: '#1b3a6b', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2,
  },
  cardTitle: { color: '#1e293b', fontSize: 15, fontWeight: 'bold', marginBottom: 12 },
  patternRow: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  patternItem: { flex: 1, backgroundColor: '#f8fafc', borderRadius: 12, padding: 12, alignItems: 'center' },
  patternNum: { color: '#1b3a6b', fontSize: 22, fontWeight: 'bold' },
  patternLabel: { color: '#64748b', fontSize: 11, textAlign: 'center', marginTop: 4 },
  equityBar: { flexDirection: 'row', height: 10, borderRadius: 5, overflow: 'hidden', marginBottom: 8 },
  equityFill: { height: '100%', backgroundColor: '#1b3a6b' },
  otherFill: { height: '100%', backgroundColor: '#14b8a6' },
  equityLegend: { flexDirection: 'row', gap: 14 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendText: { color: '#64748b', fontSize: 11 },

  diversifyCta: {
    backgroundColor: '#1b3a6b', borderRadius: 14, paddingVertical: 16,
    paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', gap: 10,
  },
  diversifyCtaText: { color: '#fff', fontSize: 14, fontWeight: '700', flex: 1 },
});
