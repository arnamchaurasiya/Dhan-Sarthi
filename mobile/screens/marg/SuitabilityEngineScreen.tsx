import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Sparkles, CheckCircle2, ShieldCheck, Target, Clock, PieChart } from 'lucide-react-native';
import { InvestorProfile } from './margData';

interface Props {
  profile: InvestorProfile;
  onAnalysisComplete: () => void;
}

export default function SuitabilityEngineScreen({ profile, onAnalysisComplete }: Props) {
  const [step1Done, setStep1Done] = useState(false);
  const [step2Done, setStep2Done] = useState(false);
  const [step3Done, setStep3Done] = useState(false);
  const [step4Done, setStep4Done] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setStep1Done(true), 400);
    const t2 = setTimeout(() => setStep2Done(true), 800);
    const t3 = setTimeout(() => setStep3Done(true), 1200);
    const t4 = setTimeout(() => {
      setStep4Done(true);
    }, 1600);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.iconHero}>
        <Sparkles color="#2563eb" size={48} />
      </View>

      <Text style={styles.title}>Evaluating Investment Suitability</Text>
      <Text style={styles.sub}>
        Combining your profile with Dhan Darpan portfolio data...
      </Text>

      <View style={styles.stepsCard}>
        {/* Step 1 */}
        <View style={styles.stepRow}>
          {step1Done ? (
            <CheckCircle2 color="#16a34a" size={20} style={{ marginRight: 12 }} />
          ) : (
            <ActivityIndicator size="small" color="#2563eb" style={{ marginRight: 12 }} />
          )}
          <View style={{ flex: 1 }}>
            <Text style={styles.stepTitle}>Risk Profile & Capacity Check</Text>
            <Text style={styles.stepSub}>Mapped to {profile.riskProfile} spectrum</Text>
          </View>
        </View>

        {/* Step 2 */}
        <View style={styles.stepRow}>
          {step2Done ? (
            <CheckCircle2 color="#16a34a" size={20} style={{ marginRight: 12 }} />
          ) : (
            <ActivityIndicator size="small" color="#2563eb" style={{ marginRight: 12 }} />
          )}
          <View style={{ flex: 1 }}>
            <Text style={styles.stepTitle}>Investment Horizon & Liquidity Fit</Text>
            <Text style={styles.stepSub}>Validated for {profile.investmentHorizon} timeframe</Text>
          </View>
        </View>

        {/* Step 3 */}
        <View style={styles.stepRow}>
          {step3Done ? (
            <CheckCircle2 color="#16a34a" size={20} style={{ marginRight: 12 }} />
          ) : (
            <ActivityIndicator size="small" color="#2563eb" style={{ marginRight: 12 }} />
          )}
          <View style={{ flex: 1 }}>
            <Text style={styles.stepTitle}>Goal Alignment Optimization</Text>
            <Text style={styles.stepSub}>Targeted for {profile.primaryGoal}</Text>
          </View>
        </View>

        {/* Step 4 */}
        <View style={[styles.stepRow, { borderBottomWidth: 0 }]}>
          {step4Done ? (
            <CheckCircle2 color="#16a34a" size={20} style={{ marginRight: 12 }} />
          ) : (
            <ActivityIndicator size="small" color="#2563eb" style={{ marginRight: 12 }} />
          )}
          <View style={{ flex: 1 }}>
            <Text style={styles.stepTitle}>Dhan Darpan Diversification Check</Text>
            <Text style={styles.stepSub}>Addressing 48.2% Direct Equity concentration</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.primaryBtn, !step4Done && { opacity: 0.6 }]}
        disabled={!step4Done}
        onPress={onAnalysisComplete}
      >
        <Text style={styles.primaryBtnText}>View Suitable Investments →</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconHero: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#eff6ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  title: { fontSize: 22, fontWeight: 'bold', color: '#0f172a', textAlign: 'center' },
  sub: { fontSize: 13, color: '#64748b', textAlign: 'center', marginTop: 6, marginBottom: 24 },

  stepsCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    width: '100%',
    marginBottom: 28,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  stepTitle: { fontSize: 14, fontWeight: 'bold', color: '#0f172a' },
  stepSub: { fontSize: 12, color: '#64748b', marginTop: 2 },

  primaryBtn: {
    backgroundColor: '#1b3a6b',
    borderRadius: 14,
    paddingVertical: 16,
    width: '100%',
    alignItems: 'center',
  },
  primaryBtnText: { color: '#ffffff', fontSize: 15, fontWeight: 'bold' },
});
