import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Landmark, ShieldCheck, CheckCircle2, ChevronRight } from 'lucide-react-native';
import { Product } from './margData';

interface Props {
  product: Product;
  amount: number;
  onContinueToFinalReview: (selectedAccount: string) => void;
}

export default function AccountAccessScreen({
  product,
  amount,
  onContinueToFinalReview,
}: Props) {
  const [selectedAccount, setSelectedAccount] = useState<string>('HDFC Securities');

  const accounts = [
    {
      id: 'HDFC Securities',
      name: 'HDFC Securities',
      desc: 'Linked Demat • Client ID: 884129',
      status: 'Connected (Sahamati AA)',
    },
    {
      id: 'Zerodha Kite',
      name: 'Zerodha Kite (CDSL)',
      desc: 'Linked Demat • Client ID: ZK9012',
      status: 'Connected (Sahamati AA)',
    },
    {
      id: 'Direct AMC',
      name: 'Direct Depository Participant',
      desc: 'Direct AMC execution via BSE Star / MF Utility',
      status: 'Instant Access',
    },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: '#f8fafc' }}>
      <ScrollView style={styles.scrollBody} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.headerSubCaption}>
          Step 14 • Seamless multi-asset investment access route
        </Text>

        {/* Investment summary pill */}
        <View style={styles.summaryPill}>
          <Text style={styles.summaryPillText}>
            Investing <Text style={{ fontWeight: 'bold' }}>₹{amount.toLocaleString('en-IN')}</Text> in {product.name}
          </Text>
        </View>

        <Text style={styles.questionTitle}>Select Execution Account / Broker</Text>

        {accounts.map((acc) => {
          const isSelected = selectedAccount === acc.id;
          return (
            <TouchableOpacity
              key={acc.id}
              style={[styles.accountCard, isSelected && styles.accountCardSelected]}
              onPress={() => setSelectedAccount(acc.id)}
              activeOpacity={0.8}
            >
              <View style={[styles.iconWrap, isSelected && styles.iconWrapSelected]}>
                <Landmark color={isSelected ? '#16a34a' : '#64748b'} size={20} />
              </View>

              <View style={{ flex: 1 }}>
                <Text style={[styles.accName, isSelected && styles.accNameSelected]}>
                  {acc.name}
                </Text>
                <Text style={styles.accDesc}>{acc.desc}</Text>
                <Text style={styles.accStatus}>{acc.status}</Text>
              </View>

              <View style={[styles.circleOuter, isSelected && styles.circleOuterSelected]}>
                {isSelected && <View style={styles.circleInner} />}
              </View>
            </TouchableOpacity>
          );
        })}

        {/* Prototype Regulatory Note */}
        <View style={styles.protoNoteBox}>
          <ShieldCheck color="#2563eb" size={18} style={{ marginRight: 8 }} />
          <Text style={styles.protoNoteText}>
            Dhan Sarthi acts as a decision & suitability layer. Execution orders are routed seamlessly via SEBI registered stock exchange (BSE/NSE) brokers.
          </Text>
        </View>

        {/* Action Button */}
        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={() => onContinueToFinalReview(selectedAccount)}
          activeOpacity={0.85}
        >
          <Text style={styles.primaryBtnText} numberOfLines={2}>Proceed to Final Review →</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollBody: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 110 },
  headerSubCaption: { color: '#64748b', fontSize: 13, marginBottom: 12 },

  summaryPill: {
    backgroundColor: '#eff6ff',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#bfdbfe',
    marginBottom: 16,
  },
  summaryPillText: { color: '#1e3a8a', fontSize: 13 },

  questionTitle: { fontSize: 18, fontWeight: 'bold', color: '#0f172a', marginBottom: 14 },

  accountCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    marginBottom: 12,
  },
  accountCardSelected: { borderColor: '#16a34a', backgroundColor: '#f0fdf4' },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  iconWrapSelected: { backgroundColor: '#dcfce7' },
  accName: { fontSize: 15, fontWeight: '600', color: '#0f172a' },
  accNameSelected: { color: '#16a34a', fontWeight: 'bold' },
  accDesc: { fontSize: 12, color: '#64748b', marginTop: 2 },
  accStatus: { fontSize: 11, color: '#16a34a', fontWeight: 'bold', marginTop: 4 },

  circleOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#cbd5e1',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  circleOuterSelected: { borderColor: '#16a34a' },
  circleInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#16a34a' },

  protoNoteBox: {
    backgroundColor: '#eff6ff',
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#bfdbfe',
    marginTop: 10,
  },
  protoNoteText: { fontSize: 11, color: '#1e3a8a', flex: 1, lineHeight: 16 },

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
