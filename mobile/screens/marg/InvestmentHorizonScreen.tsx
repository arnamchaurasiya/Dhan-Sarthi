import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Clock, HelpCircle } from 'lucide-react-native';
import { InvestorProfile } from './margData';

interface Props {
  profile: InvestorProfile;
  onContinue: (horizon: InvestorProfile['investmentHorizon']) => void;
}

export default function InvestmentHorizonScreen({ profile, onContinue }: Props) {
  const [selectedHorizon, setSelectedHorizon] = useState<InvestorProfile['investmentHorizon']>(
    profile.investmentHorizon
  );

  const horizonOptions: { id: InvestorProfile['investmentHorizon']; title: string; desc: string }[] = [
    {
      id: '< 1 year',
      title: '< 1 Year (Short-term)',
      desc: 'Liquid & ultra short-term debt preference',
    },
    {
      id: '1–3 years',
      title: '1–3 Years (Medium-term)',
      desc: 'Fixed income, arbitrage & low risk debt',
    },
    {
      id: '3–5 years',
      title: '3–5 Years (Medium to Long-term)',
      desc: 'Corporate bonds, balanced funds & hybrid assets',
    },
    {
      id: '5–10 years',
      title: '5–10 Years (Long-term)',
      desc: 'REITs, InvITs, equity index & growth funds',
    },
    {
      id: '10+ years',
      title: '10+ Years (Very Long-term)',
      desc: 'Aggressive equity compounding & long-term assets',
    },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: '#f8fafc' }}>
      <ScrollView style={styles.scrollBody} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.headerSubCaption}>
          Step 2 of 4 • Determine how long you expect to stay invested
        </Text>

        <Text style={styles.questionTitle}>How long can you keep this money invested?</Text>

        {horizonOptions.map((opt) => {
          const isSelected = selectedHorizon === opt.id;
          return (
            <TouchableOpacity
              key={opt.id}
              style={[styles.radioCard, isSelected && styles.radioCardSelected]}
              onPress={() => setSelectedHorizon(opt.id)}
              activeOpacity={0.8}
            >
              <View style={[styles.iconWrap, isSelected && styles.iconWrapSelected]}>
                <Clock color={isSelected ? '#2563eb' : '#64748b'} size={20} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.cardTitle, isSelected && styles.cardTitleSelected]}>
                  {opt.title}
                </Text>
                <Text style={styles.cardDesc}>{opt.desc}</Text>
              </View>
              <View style={[styles.circleOuter, isSelected && styles.circleOuterSelected]}>
                {isSelected && <View style={styles.circleInner} />}
              </View>
            </TouchableOpacity>
          );
        })}

        {/* Educational Callout */}
        <View style={styles.guidanceBox}>
          <View style={styles.guidanceIconWrap}>
            <HelpCircle color="#d97706" size={20} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.guidanceTitle}>Why Horizon Matters</Text>
            <Text style={styles.guidanceText}>
              Longer investment horizons allow you to consider a broader range of investment products (like REITs, InvITs, and Equity) because short-term market volatility smooths out over 5+ years.
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomFixedBar}>
        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={() => onContinue(selectedHorizon)}
        >
          <Text style={styles.primaryBtnText}>Continue to Risk Assessment →</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollBody: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 110 },
  headerSubCaption: { color: '#64748b', fontSize: 13, marginBottom: 12 },
  questionTitle: { fontSize: 18, fontWeight: 'bold', color: '#0f172a', marginBottom: 16 },

  radioCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    marginBottom: 10,
  },
  radioCardSelected: { borderColor: '#2563eb', backgroundColor: '#eff6ff' },
  iconWrap: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  iconWrapSelected: { backgroundColor: '#dbeafe' },
  cardTitle: { fontSize: 15, fontWeight: '600', color: '#0f172a' },
  cardTitleSelected: { color: '#2563eb', fontWeight: 'bold' },
  cardDesc: { fontSize: 12, color: '#64748b', marginTop: 2 },

  circleOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#cbd5e1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleOuterSelected: { borderColor: '#2563eb' },
  circleInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#2563eb' },

  guidanceBox: {
    backgroundColor: '#fffbeb',
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: '#fde68a',
    marginTop: 12,
  },
  guidanceIconWrap: { marginRight: 10, marginTop: 2 },
  guidanceTitle: { fontSize: 13, fontWeight: 'bold', color: '#b45309' },
  guidanceText: { fontSize: 12, color: '#92400e', marginTop: 2, lineHeight: 17 },

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
