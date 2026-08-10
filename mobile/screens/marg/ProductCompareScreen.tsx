import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { ShieldCheck, CheckCircle2 } from 'lucide-react-native';
import { COMPARISON_MATRIX_ROWS, PRODUCTS_DATA, Product } from './margData';

interface Props {
  onSelectProductToReview: (product: Product) => void;
}

export default function ProductCompareScreen({ onSelectProductToReview }: Props) {
  const [selectedProductIdx, setSelectedProductIdx] = useState<number>(0);

  const products = [PRODUCTS_DATA[0], PRODUCTS_DATA[2], PRODUCTS_DATA[1]]; // REIT, InvIT, Corp Bond

  const handleChooseToReview = () => {
    onSelectProductToReview(products[selectedProductIdx]);
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#f8fafc' }}>
      <ScrollView style={styles.scrollBody} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.headerSubCaption}>
          Which asset type fits your profile requirements better?
        </Text>

        {/* Nudge Banner */}
        <View style={styles.nudgeBanner}>
          <ShieldCheck color="#2563eb" size={20} style={{ marginRight: 10 }} />
          <Text style={styles.nudgeText}>
            REIT currently has the highest suitability match (<Text style={{ fontWeight: 'bold' }}>92%</Text>) based on your Moderate risk profile and Wealth Creation goal.
          </Text>
        </View>

        {/* Comparison Table */}
        <View style={styles.tableCard}>
          {/* Header Row */}
          <View style={styles.tableHeaderRow}>
            <Text style={[styles.colHeader, { width: '28%' }]}>Metric</Text>
            <TouchableOpacity
              style={[styles.colHeaderBtn, selectedProductIdx === 0 && styles.colHeaderActive]}
              onPress={() => setSelectedProductIdx(0)}
            >
              <Text style={[styles.colHeaderText, selectedProductIdx === 0 && styles.colTextActive]}>
                REIT
              </Text>

            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.colHeaderBtn, selectedProductIdx === 1 && styles.colHeaderActive]}
              onPress={() => setSelectedProductIdx(1)}
            >
              <Text style={[styles.colHeaderText, selectedProductIdx === 1 && styles.colTextActive]}>
                InvIT
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.colHeaderBtn, selectedProductIdx === 2 && styles.colHeaderActive]}
              onPress={() => setSelectedProductIdx(2)}
            >
              <Text style={[styles.colHeaderText, selectedProductIdx === 2 && styles.colTextActive]}>
                Bond
              </Text>
            </TouchableOpacity>
          </View>

          {/* Rows */}
          {COMPARISON_MATRIX_ROWS.map((row, idx) => (
            <View
              key={idx}
              style={[
                styles.tableRow,
                idx === COMPARISON_MATRIX_ROWS.length - 1 && { borderBottomWidth: 0 },
              ]}
            >
              <Text style={[styles.cellMetric, { width: '28%' }]}>{row.metric}</Text>
              <Text
                style={[
                  styles.cellVal,
                  { width: '24%' },
                  selectedProductIdx === 0 && styles.cellActive,
                ]}
              >
                {row.reit}
              </Text>
              <Text
                style={[
                  styles.cellVal,
                  { width: '24%' },
                  selectedProductIdx === 1 && styles.cellActive,
                ]}
              >
                {row.invit}
              </Text>
              <Text
                style={[
                  styles.cellVal,
                  { width: '24%' },
                  selectedProductIdx === 2 && styles.cellActive,
                ]}
              >
                {row.bond}
              </Text>
            </View>
          ))}
        </View>

        {/* Selected Product Recommendation Nudge */}
        <View style={styles.selectedDetailCard}>
          <Text style={styles.selectedDetailTitle}>
            Selected for Review: {products[selectedProductIdx].name}
          </Text>
          <Text style={styles.selectedDetailSub}>
            Suitability score: {products[selectedProductIdx].matchScore}% • SEBI regulatory compliant evaluation.
          </Text>
        </View>

        {/* Action Button */}
        <TouchableOpacity style={styles.primaryBtn} onPress={handleChooseToReview} activeOpacity={0.85}>
          <Text style={styles.primaryBtnText} numberOfLines={2}>
            Review {products[selectedProductIdx].name} →
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollBody: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 110 },
  headerSubCaption: { color: '#64748b', fontSize: 13, marginBottom: 12 },

  nudgeBanner: {
    backgroundColor: '#eff6ff',
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#bfdbfe',
    marginBottom: 16,
  },
  nudgeText: { color: '#1e3a8a', fontSize: 12, flex: 1, lineHeight: 17 },

  tableCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    overflow: 'hidden',
    marginBottom: 16,
  },
  tableHeaderRow: {
    flexDirection: 'row',
    backgroundColor: '#f1f5f9',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#cbd5e1',
    alignItems: 'center',
  },
  colHeader: { fontSize: 11, color: '#475569', fontWeight: 'bold' },
  colHeaderBtn: { width: '24%', paddingVertical: 6, alignItems: 'center', borderRadius: 8 },
  colHeaderActive: { backgroundColor: '#1b3a6b' },
  colHeaderText: { fontSize: 11, fontWeight: 'bold', color: '#334155' },
  colTextActive: { color: '#ffffff' },

  tableRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    alignItems: 'center',
  },
  cellMetric: { fontSize: 11, fontWeight: 'bold', color: '#0f172a' },
  cellVal: { fontSize: 10, color: '#475569', textAlign: 'center' },
  cellActive: { fontWeight: 'bold', color: '#16a34a' },

  selectedDetailCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  selectedDetailTitle: { fontSize: 14, fontWeight: 'bold', color: '#0f172a' },
  selectedDetailSub: { fontSize: 12, color: '#64748b', marginTop: 2 },

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
