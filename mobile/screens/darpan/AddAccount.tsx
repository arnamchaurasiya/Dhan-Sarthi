import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Platform, StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft, CheckCircle2, ChevronRight } from 'lucide-react-native';

const ACCOUNT_TYPES = [
  { id: 'demat', name: 'Demat Account', icon: '📊', desc: 'Equity, ETF, REIT holdings via CDSL/NSDL', providers: ['Zerodha', 'Groww', 'Angel One', 'HDFC Securities', 'ICICI Direct'] },
  { id: 'mf', name: 'Mutual Fund Portfolio', icon: '💼', desc: 'All MF holdings via CAMS or KFintech RTA', providers: ['Groww', 'Kuvera', 'Coin by Zerodha', 'MFCentral'] },
  { id: 'govt', name: 'Government Bonds / SGB', icon: '🏛️', desc: 'Sovereign Gold Bonds and G-Sec holdings', providers: ['RBI Retail Direct', 'NSE goBID'] },
  { id: 'bond', name: 'Bond / NCD Platform', icon: '📄', desc: 'Corporate bonds, NCDs and debentures', providers: ['Dhan Sarthi', 'TheFixedIncome', 'Bondskart'] },
  { id: 'other', name: 'Other Investment Account', icon: '🔗', desc: 'Any other SEBI-regulated investment account', providers: ['EPF', 'PPF', 'NPS'] },
];

type Step = 'select' | 'consent' | 'auth' | 'done';

export default function AddAccount() {
  const navigation = useNavigation<any>();
  const [step, setStep] = useState<Step>('select');
  const [selectedType, setSelectedType] = useState<typeof ACCOUNT_TYPES[0] | null>(null);
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);
  const [consentGiven, setConsentGiven] = useState(false);

  if (step === 'done') {
    return (
      <View style={styles.root}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <ArrowLeft color="#fff" size={22} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Account Connected</Text>
        </View>
        <View style={styles.successContainer}>
          <View style={styles.successCircle}>
            <CheckCircle2 color="#16a34a" size={52} />
          </View>
          <Text style={styles.successTitle}>Account Connected!</Text>
          <Text style={styles.successSub}>
            {selectedProvider} has been successfully connected. Your Dhan Darpan will now include holdings from this source.
          </Text>
          <View style={styles.successInfo}>
            <Text style={styles.successInfoTitle}>What happens next?</Text>
            <Text style={styles.successInfoText}>• Holdings are being normalised and validated{'\n'}• Your portfolio metrics will be updated{'\n'}• AI insights will be recalculated</Text>
          </View>
          <TouchableOpacity style={styles.backToDarpanBtn} onPress={() => navigation.navigate('DarpanHome', {})}>
            <Text style={styles.backToDarpanText}>Back to Dhan Darpan →</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => step === 'select' ? navigation.goBack() : setStep('select')} style={styles.backBtn}>
          <ArrowLeft color="#fff" size={22} />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Add Account</Text>
          <Text style={styles.headerSub}>
            {step === 'select' ? 'Step 1 of 3 — Select account type' :
              step === 'consent' ? 'Step 2 of 3 — Review & consent' :
              'Step 3 of 3 — Authenticate'}
          </Text>
        </View>
      </View>

      {/* Step indicator */}
      <View style={styles.stepRow}>
        {[1, 2, 3].map(s => {
          const stepIdx = step === 'select' ? 1 : step === 'consent' ? 2 : 3;
          return (
            <View key={s} style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
              <View style={[styles.stepDot, s <= stepIdx && styles.stepDotActive]}>
                <Text style={[styles.stepDotText, s <= stepIdx && styles.stepDotTextActive]}>{s}</Text>
              </View>
              {s < 3 && <View style={[styles.stepLine, s < stepIdx && styles.stepLineActive]} />}
            </View>
          );
        })}
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={{ padding: 16, paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
        {/* STEP 1: Select type */}
        {step === 'select' && (
          <>
            <Text style={styles.stepTitle}>What type of account would you like to connect?</Text>
            {ACCOUNT_TYPES.map(type => (
              <TouchableOpacity
                key={type.id}
                style={[styles.typeCard, selectedType?.id === type.id && styles.typeCardActive]}
                onPress={() => setSelectedType(type)}
                activeOpacity={0.8}
              >
                <Text style={styles.typeEmoji}>{type.icon}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.typeName}>{type.name}</Text>
                  <Text style={styles.typeDesc}>{type.desc}</Text>
                </View>
                <View style={[styles.radio, selectedType?.id === type.id && styles.radioActive]}>
                  {selectedType?.id === type.id && <View style={styles.radioDot} />}
                </View>
              </TouchableOpacity>
            ))}
            {selectedType && (
              <TouchableOpacity style={styles.nextBtn} onPress={() => setStep('consent')}>
                <Text style={styles.nextBtnText}>Continue: Review Consent →</Text>
              </TouchableOpacity>
            )}
          </>
        )}

        {/* STEP 2: Consent */}
        {step === 'consent' && selectedType && (
          <>
            <Text style={styles.stepTitle}>What data will be accessed?</Text>
            <View style={styles.consentCard}>
              <Text style={styles.consentCardTitle}>{selectedType.icon} {selectedType.name}</Text>
              <Text style={styles.consentCardDesc}>{selectedType.desc}</Text>
              <View style={styles.divider} />
              <Text style={styles.consentSubTitle}>Data that will be shared with Dhan Sarthi:</Text>
              {['Current investment holdings', 'Transaction history (last 12 months)', 'Portfolio valuation data'].map((d, i) => (
                <View key={i} style={styles.consentItem}>
                  <CheckCircle2 color="#16a34a" size={14} />
                  <Text style={styles.consentItemText}>{d}</Text>
                </View>
              ))}
              <View style={styles.notShared}>
                <Text style={styles.notSharedTitle}>❌ What will NOT be shared:</Text>
                <Text style={styles.notSharedText}>Bank account numbers • Passwords • PINs • OTPs • Payment information</Text>
              </View>
            </View>

            <Text style={styles.stepTitle}>Select your provider</Text>
            {selectedType.providers.map(p => (
              <TouchableOpacity
                key={p}
                style={[styles.providerChip, selectedProvider === p && styles.providerChipActive]}
                onPress={() => setSelectedProvider(p)}
              >
                <Text style={[styles.providerText, selectedProvider === p && styles.providerTextActive]}>{p}</Text>
                {selectedProvider === p && <CheckCircle2 color="#16a34a" size={14} />}
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              style={[styles.consentToggle, consentGiven && styles.consentToggleActive]}
              onPress={() => setConsentGiven(!consentGiven)}
            >
              <View style={[styles.toggleBox, consentGiven && styles.toggleBoxActive]}>
                {consentGiven && <CheckCircle2 color="#fff" size={16} />}
              </View>
              <Text style={styles.consentToggleText}>
                I consent to sharing the above data with Dhan Sarthi for portfolio analysis purposes. I understand I can revoke this at any time.
              </Text>
            </TouchableOpacity>

            {consentGiven && selectedProvider && (
              <TouchableOpacity style={styles.nextBtn} onPress={() => setStep('auth')}>
                <Text style={styles.nextBtnText}>Proceed to Authenticate →</Text>
              </TouchableOpacity>
            )}
          </>
        )}

        {/* STEP 3: Auth */}
        {step === 'auth' && selectedProvider && (
          <>
            <Text style={styles.stepTitle}>Authenticate with {selectedProvider}</Text>
            <View style={styles.authCard}>
              <Text style={styles.authEmoji}>🔐</Text>
              <Text style={styles.authTitle}>Secure Authentication</Text>
              <Text style={styles.authDesc}>
                You will be securely redirected to {selectedProvider} to verify your identity. No credentials are shared with Dhan Sarthi.
              </Text>
              <View style={styles.authInfo}>
                {['256-bit SSL encryption', 'Sahamati AA compliant', 'Zero-knowledge architecture'].map((t, i) => (
                  <View key={i} style={styles.authInfoItem}>
                    <CheckCircle2 color="#16a34a" size={13} />
                    <Text style={styles.authInfoText}>{t}</Text>
                  </View>
                ))}
              </View>
            </View>
            <TouchableOpacity style={styles.authBtn} onPress={() => setStep('done')}>
              <Text style={styles.authBtnText}>Authenticate with {selectedProvider} →</Text>
            </TouchableOpacity>
          </>
        )}
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

  stepRow: { flexDirection: 'row', backgroundColor: '#fff', paddingHorizontal: 20, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f1f5f9', alignItems: 'center' },
  stepDot: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#e2e8f0', alignItems: 'center', justifyContent: 'center' },
  stepDotActive: { backgroundColor: '#1b3a6b' },
  stepDotText: { color: '#94a3b8', fontSize: 12, fontWeight: 'bold' },
  stepDotTextActive: { color: '#fff' },
  stepLine: { flex: 1, height: 2, backgroundColor: '#e2e8f0', marginHorizontal: 4 },
  stepLineActive: { backgroundColor: '#1b3a6b' },

  scroll: { flex: 1 },
  stepTitle: { color: '#1e293b', fontSize: 16, fontWeight: 'bold', marginBottom: 14, marginTop: 4 },

  typeCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff',
    borderColor: '#e2e8f0', borderWidth: 1.5, borderRadius: 14, padding: 14,
    marginBottom: 10, gap: 12,
  },
  typeCardActive: { borderColor: '#1b3a6b', backgroundColor: '#f0f9ff' },
  typeEmoji: { fontSize: 28 },
  typeName: { color: '#0f172a', fontSize: 14, fontWeight: 'bold' },
  typeDesc: { color: '#64748b', fontSize: 12, marginTop: 2 },
  radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: '#cbd5e1', alignItems: 'center', justifyContent: 'center' },
  radioActive: { borderColor: '#1b3a6b' },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#1b3a6b' },

  nextBtn: { backgroundColor: '#1b3a6b', borderRadius: 14, paddingVertical: 16, alignItems: 'center', marginTop: 8 },
  nextBtnText: { color: '#fff', fontSize: 15, fontWeight: 'bold' },

  consentCard: {
    backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 16,
    borderWidth: 1, borderColor: '#e2e8f0',
  },
  consentCardTitle: { color: '#1e293b', fontSize: 15, fontWeight: 'bold', marginBottom: 4 },
  consentCardDesc: { color: '#64748b', fontSize: 13, marginBottom: 14 },
  divider: { height: 1, backgroundColor: '#f1f5f9', marginBottom: 12 },
  consentSubTitle: { color: '#1e293b', fontSize: 13, fontWeight: '600', marginBottom: 8 },
  consentItem: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 7 },
  consentItemText: { color: '#475569', fontSize: 13 },
  notShared: { backgroundColor: '#fef2f2', borderRadius: 10, padding: 10, marginTop: 10 },
  notSharedTitle: { color: '#dc2626', fontSize: 12, fontWeight: 'bold', marginBottom: 4 },
  notSharedText: { color: '#dc2626', fontSize: 11, lineHeight: 18 },

  providerChip: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: '#fff', borderColor: '#e2e8f0', borderWidth: 1,
    borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12, marginBottom: 8,
  },
  providerChipActive: { borderColor: '#16a34a', backgroundColor: '#f0fdf4' },
  providerText: { color: '#475569', fontSize: 14, fontWeight: '600' },
  providerTextActive: { color: '#15803d', fontWeight: '700' },

  consentToggle: {
    flexDirection: 'row', alignItems: 'flex-start', backgroundColor: '#fff',
    borderColor: '#e2e8f0', borderWidth: 1, borderRadius: 14,
    padding: 14, marginVertical: 12, gap: 12,
  },
  consentToggleActive: { borderColor: '#16a34a', backgroundColor: '#f0fdf4' },
  toggleBox: { width: 24, height: 24, borderRadius: 6, borderWidth: 2, borderColor: '#cbd5e1', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', marginTop: 1, flexShrink: 0 },
  toggleBoxActive: { backgroundColor: '#16a34a', borderColor: '#16a34a' },
  consentToggleText: { color: '#475569', fontSize: 13, lineHeight: 21, flex: 1 },

  authCard: {
    backgroundColor: '#fff', borderRadius: 20, padding: 24, marginBottom: 16,
    alignItems: 'center', borderWidth: 1, borderColor: '#e2e8f0',
  },
  authEmoji: { fontSize: 48, marginBottom: 12 },
  authTitle: { color: '#1e293b', fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
  authDesc: { color: '#64748b', fontSize: 14, textAlign: 'center', lineHeight: 22, marginBottom: 16 },
  authInfo: { width: '100%' },
  authInfoItem: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  authInfoText: { color: '#475569', fontSize: 13 },
  authBtn: { backgroundColor: '#16a34a', borderRadius: 14, paddingVertical: 16, alignItems: 'center' },
  authBtnText: { color: '#fff', fontSize: 15, fontWeight: 'bold' },

  successContainer: { flex: 1, padding: 24, alignItems: 'center', justifyContent: 'center' },
  successCircle: { width: 88, height: 88, borderRadius: 44, backgroundColor: '#f0fdf4', alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  successTitle: { color: '#1e293b', fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  successSub: { color: '#64748b', fontSize: 14, textAlign: 'center', lineHeight: 22, marginBottom: 24 },
  successInfo: { backgroundColor: '#f8fafc', borderRadius: 14, padding: 16, width: '100%', marginBottom: 24 },
  successInfoTitle: { color: '#1e293b', fontSize: 14, fontWeight: 'bold', marginBottom: 8 },
  successInfoText: { color: '#64748b', fontSize: 13, lineHeight: 22 },
  backToDarpanBtn: { backgroundColor: '#1b3a6b', borderRadius: 14, paddingVertical: 16, paddingHorizontal: 32 },
  backToDarpanText: { color: '#fff', fontSize: 15, fontWeight: 'bold' },
});
