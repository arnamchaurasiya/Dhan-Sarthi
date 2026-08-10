import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Check, Building2, Download, PieChart, ArrowRight } from 'lucide-react-native';
import { Product } from './margData';

interface Props {
  product: Product;
  amount: number;
  onNavigateToDarpan: () => void;
}

export default function InvestmentConfirmationScreen({
  product,
  amount,
  onNavigateToDarpan,
}: Props) {
  const unitsApprox = Math.max(1, Math.floor(amount / 138.5));

  return (
    <View style={{ flex: 1, backgroundColor: '#f8fafc' }}>
      <ScrollView style={styles.scrollBody} contentContainerStyle={styles.scrollContent}>
        {/* Celebration Visual Hero */}
        <View style={styles.heroBox}>
          <View style={styles.checkCircle}>
            <Check color="#ffffff" size={40} strokeWidth={3.5} />
          </View>
          <Text style={styles.heroTitle}>Investment Submitted!</Text>
          <Text style={styles.heroSub}>
            ₹{amount.toLocaleString('en-IN')} allocated to {product.name}
          </Text>
        </View>

        {/* Details Card */}
        <View style={styles.detailsCard}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.iconWrap}>
              <Building2 color="#1b3a6b" size={20} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.productName}>{product.name}</Text>
              <Text style={styles.productType}>{product.type}</Text>
            </View>
          </View>

          <View style={styles.gridRow}>
            <View style={styles.gridCell}>
              <Text style={styles.gridLabel}>Amount Invested</Text>
              <Text style={styles.gridVal}>₹{amount.toLocaleString('en-IN')}</Text>
            </View>
            <View style={styles.gridCell}>
              <Text style={styles.gridLabel}>Units Allotted</Text>
              <Text style={styles.gridVal}>~ {unitsApprox} Units</Text>
            </View>
          </View>

          <Text style={styles.updateNote}>
            Your portfolio will be updated after confirmation from the investment platform.
          </Text>
        </View>

        {/* Closed Loop Connection to Dhan Darpan */}
        <View style={styles.loopCard}>
          <View style={styles.loopHeaderRow}>
            <PieChart color="#2563eb" size={20} style={{ marginRight: 8 }} />
            <Text style={styles.loopTitle}>Dhan Darpan Closed Loop</Text>
          </View>
          <Text style={styles.loopDesc}>
            See how your new investment has improved portfolio diversification, lowered risk exposure, and updated overall asset weightings in Dhan Darpan.
          </Text>

          <TouchableOpacity style={styles.darpanBtn} onPress={onNavigateToDarpan}>
            <Text style={styles.darpanBtnText}>View Updated Portfolio in Dhan Darpan</Text>
            <ArrowRight color="#ffffff" size={16} style={{ marginLeft: 6 }} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.downloadBtn}>
          <Download color="#475569" size={16} style={{ marginRight: 6 }} />
          <Text style={styles.downloadBtnText}>Download Investment Receipt</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollBody: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 60, alignItems: 'center' },

  heroBox: { alignItems: 'center', marginTop: 10, marginBottom: 20 },
  checkCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#16a34a',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    shadowColor: '#16a34a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  heroTitle: { fontSize: 22, fontWeight: 'bold', color: '#0f172a', textAlign: 'center' },
  heroSub: { fontSize: 14, color: '#64748b', textAlign: 'center', marginTop: 4 },

  detailsCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    width: '100%',
    marginBottom: 16,
  },
  cardHeaderRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  productName: { fontSize: 16, fontWeight: 'bold', color: '#0f172a' },
  productType: { fontSize: 12, color: '#64748b', marginTop: 2 },

  gridRow: {
    flexDirection: 'row',
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 10,
    marginBottom: 12,
  },
  gridCell: { flex: 1 },
  gridLabel: { fontSize: 11, color: '#64748b' },
  gridVal: { fontSize: 14, fontWeight: 'bold', color: '#0f172a', marginTop: 2 },

  updateNote: { fontSize: 12, color: '#64748b', textAlign: 'center', fontStyle: 'italic' },

  loopCard: {
    backgroundColor: '#eff6ff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#bfdbfe',
    width: '100%',
    marginBottom: 16,
  },
  loopHeaderRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  loopTitle: { fontSize: 15, fontWeight: 'bold', color: '#1e40af' },
  loopDesc: { fontSize: 12, color: '#1e3a8a', lineHeight: 17, marginBottom: 14 },

  darpanBtn: {
    backgroundColor: '#1b3a6b',
    borderRadius: 12,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  darpanBtnText: { color: '#ffffff', fontSize: 14, fontWeight: 'bold' },

  downloadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  downloadBtnText: { color: '#475569', fontSize: 13, fontWeight: 'bold' },
});
