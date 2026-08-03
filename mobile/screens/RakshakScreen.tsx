import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { ShieldCheck, ShieldAlert, AlertTriangle, ScanSearch, CheckCircle2 } from 'lucide-react-native';

const API_BASE = 'http://10.169.95.9:8000';

export default function RakshakScreen() {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const checkScam = async () => {
    if (!text) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await axios.post(`${API_BASE}/api/v1/ai/security/check-scam`, {
        text: text
      });
      setResult(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* SEBI Saarthi / SCORES Hero Banner */}
      <View style={styles.heroCard}>
        <View style={styles.heroBadgeRow}>
          <Text style={styles.heroBadgeText}>SEBI SCORES 2.0</Text>
          <Text style={styles.heroBadgeSub}>• Dhan Rakshak</Text>
        </View>
        <Text style={styles.heroTitle}>Spot A Scam & SEBI Check</Text>
        <Text style={styles.heroSub}>Verify authenticity of stock tips, Telegram groups & UPI handles</Text>
      </View>

      <View style={styles.contentPadding}>
        <View style={styles.inputCard}>
          <View style={styles.labelRow}>
            <ScanSearch color="#1b3a6b" size={18} style={{ marginRight: 6 }} />
            <Text style={styles.label}>Paste suspicious offer, tip, or SMS:</Text>
          </View>
          <TextInput
            style={styles.input}
            placeholder="e.g. Guaranteed 100% returns on this multi-bagger stock!"
            placeholderTextColor="#94a3b8"
            multiline
            numberOfLines={4}
            value={text}
            onChangeText={setText}
          />
          <TouchableOpacity style={styles.button} onPress={checkScam} disabled={loading || !text}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Run SEBI Fraud Check</Text>
            )}
          </TouchableOpacity>
        </View>

        {result && (
          <View style={[styles.resultCard, result.is_scam ? styles.scamCard : styles.safeCard]}>
            <View style={styles.resultHeader}>
              {result.is_scam ? (
                <AlertTriangle color="#dc2626" size={28} />
              ) : (
                <CheckCircle2 color="#16a34a" size={28} />
              )}
              <View style={{ marginLeft: 10, flex: 1 }}>
                <Text style={[styles.resultTitle, result.is_scam ? { color: '#991b1b' } : { color: '#166534' }]}>
                  {result.is_scam ? 'SEBI Alert: High Risk Scam' : 'SEBI Verification: Authenticated'}
                </Text>
                <Text style={styles.warningText}>
                  <Text style={{ fontWeight: 'bold' }}>Recommendation: </Text>
                  {result.warning}
                </Text>
              </View>
            </View>
            
            <View style={styles.probBox}>
              <Text style={styles.probLabel}>Scam Risk Score</Text>
              <Text style={[styles.probValue, result.is_scam ? { color: '#dc2626' } : { color: '#16a34a' }]}>
                {Math.round(result.scam_probability * 100)}%
              </Text>
            </View>
            
            {result.is_scam && (
              <View style={styles.actionBox}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                  <ShieldAlert color="#991b1b" size={16} />
                  <Text style={styles.actionTitle}> What to do next?</Text>
                </View>
                <Text style={styles.actionText}>• Do not click any links or join social groups.</Text>
                <Text style={styles.actionText}>• Do not share OTPs, passwords, or UPI PINs.</Text>
                <Text style={styles.actionText}>• Report directly to SEBI SCORES 2.0 portal.</Text>
              </View>
            )}
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f7fb' },
  heroCard: {
    backgroundColor: '#1b3a6b',
    padding: 24,
    borderBottomRightRadius: 36,
  },
  heroBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  heroBadgeText: {
    color: '#ffffff',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    fontSize: 10,
    fontWeight: 'bold',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  heroBadgeSub: {
    color: '#bfdbfe',
    fontSize: 11,
    fontWeight: '600',
    marginLeft: 6,
  },
  heroTitle: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  heroSub: {
    color: '#e2e8f0',
    fontSize: 13,
    marginTop: 4,
  },
  contentPadding: {
    padding: 16,
  },
  inputCard: { backgroundColor: '#ffffff', padding: 18, borderRadius: 16, borderColor: 'rgba(27, 58, 107, 0.08)', borderWidth: 1, marginBottom: 16, shadowColor: '#1b3a6b', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 },
  labelRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  label: { color: '#1b3a6b', fontSize: 15, fontWeight: 'bold' },
  input: { backgroundColor: '#f8fafc', borderColor: '#cbd5e1', borderWidth: 1, borderRadius: 12, padding: 14, color: '#0f172a', height: 96, textAlignVertical: 'top', fontSize: 14, marginBottom: 14 },
  button: { backgroundColor: '#1b3a6b', justifyContent: 'center', alignItems: 'center', paddingVertical: 14, borderRadius: 12 },
  buttonText: { color: '#ffffff', fontWeight: 'bold', fontSize: 15 },
  resultCard: { padding: 18, borderRadius: 16, borderWidth: 1, marginBottom: 30 },
  scamCard: { backgroundColor: '#fff1f2', borderColor: '#fecdd3' },
  safeCard: { backgroundColor: '#dcfce7', borderColor: '#86efac' },
  resultHeader: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 14 },
  resultTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
  warningText: { color: '#334155', fontSize: 13, lineHeight: 19, fontWeight: '500' },
  probBox: { backgroundColor: '#ffffff', padding: 12, borderRadius: 12, borderColor: 'rgba(27, 58, 107, 0.08)', borderWidth: 1, alignItems: 'center', marginBottom: 14 },
  probLabel: { color: '#64748b', fontSize: 12, fontWeight: '600', marginBottom: 2 },
  probValue: { fontSize: 22, fontWeight: 'bold' },
  actionBox: { backgroundColor: '#ffe4e6', padding: 12, borderRadius: 12, borderColor: '#fca5a5', borderWidth: 1 },
  actionTitle: { color: '#991b1b', fontWeight: 'bold', fontSize: 13 },
  actionText: { color: '#881337', fontSize: 12, marginTop: 4, fontWeight: '500' },
});

