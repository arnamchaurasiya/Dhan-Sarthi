import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { FINANCIAL_GOALS_LIST, InvestorProfile } from './margData';

interface Props {
  profile: InvestorProfile;
  onContinue: (selectedGoal: string, targetAmount: number, timeframeYears: number) => void;
}

export default function FinancialGoalsScreen({ profile, onContinue }: Props) {
  const [selectedGoal, setSelectedGoal] = useState<string>(profile.primaryGoal);
  const [targetAmount, setTargetAmount] = useState<string>(profile.targetAmount.toString());
  const [timeframe, setTimeframe] = useState<string>(profile.targetTimeframeYears.toString());

  const handleNext = () => {
    const amt = parseInt(targetAmount.replace(/[^0-9]/g, ''), 10) || 2500000;
    const yrs = parseInt(timeframe, 10) || 8;
    onContinue(selectedGoal, amt, yrs);
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#f8fafc' }}>
      <ScrollView style={styles.scrollBody} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.headerSubCaption}>Step 1 of 4 • Define your primary investment objective</Text>

        <Text style={styles.questionTitle}>What is your primary financial goal?</Text>

        {FINANCIAL_GOALS_LIST.map((g) => {
          const isSelected = selectedGoal === g.id;
          const IconComp = g.icon;
          return (
            <TouchableOpacity
              key={g.id}
              style={[styles.radioCard, isSelected && styles.radioCardSelected]}
              onPress={() => setSelectedGoal(g.id as any)}
              activeOpacity={0.8}
            >
              <View style={[styles.iconWrap, isSelected && styles.iconWrapSelected]}>
                <IconComp color={isSelected ? '#16a34a' : '#64748b'} size={20} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.cardTitle, isSelected && styles.cardTitleSelected]}>
                  {g.title}
                </Text>
                <Text style={styles.cardDesc}>{g.desc}</Text>
              </View>
              <View style={[styles.circleOuter, isSelected && styles.circleOuterSelected]}>
                {isSelected && <View style={styles.circleInner} />}
              </View>
            </TouchableOpacity>
          );
        })}

        {/* Inputs */}
        <Text style={[styles.fieldLabel, { marginTop: 16 }]}>Target Corpus (₹)</Text>
        <View style={styles.inputWrap}>
          <Text style={styles.currencyPrefix}>₹</Text>
          <TextInput
            style={styles.inputText}
            keyboardType="numeric"
            value={targetAmount}
            onChangeText={setTargetAmount}
          />
        </View>

        <Text style={[styles.fieldLabel, { marginTop: 14 }]}>Target Timeframe (Years)</Text>
        <View style={styles.inputWrap}>
          <TextInput
            style={styles.inputText}
            keyboardType="numeric"
            value={timeframe}
            onChangeText={setTimeframe}
          />
          <Text style={styles.inputSuffix}>Years</Text>
        </View>
      </ScrollView>

      <View style={styles.bottomFixedBar}>
        <TouchableOpacity style={styles.primaryBtn} onPress={handleNext}>
          <Text style={styles.primaryBtnText}>Continue to Horizon →</Text>
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
  radioCardSelected: { borderColor: '#16a34a', backgroundColor: '#f0fdf4' },
  iconWrap: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  iconWrapSelected: { backgroundColor: '#dcfce7' },
  cardTitle: { fontSize: 15, fontWeight: '600', color: '#0f172a' },
  cardTitleSelected: { color: '#16a34a', fontWeight: 'bold' },
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
  circleOuterSelected: { borderColor: '#16a34a' },
  circleInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#16a34a' },

  fieldLabel: { fontSize: 13, fontWeight: 'bold', color: '#0f172a', marginBottom: 6 },
  inputWrap: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    height: 48,
  },
  currencyPrefix: { fontSize: 16, fontWeight: 'bold', color: '#64748b', marginRight: 6 },
  inputText: { flex: 1, fontSize: 16, fontWeight: 'bold', color: '#0f172a' },
  inputSuffix: { fontSize: 14, color: '#64748b', fontWeight: '500' },

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
