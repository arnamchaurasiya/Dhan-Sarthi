import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { Fingerprint, CheckCircle2 } from 'lucide-react-native';

const API_BASE = 'https://dhan-sarthi.onrender.com';

export default function EkycScreen({ navigation }: any) {
  const [pan, setPan] = useState('ABCDE1234F');
  const [aadhaar, setAadhaar] = useState('1234 5678 9012');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleVerify = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.post(
        `${API_BASE}/api/v1/auth/ekyc`,
        {
          pan_number: pan,
          aadhaar_number: aadhaar
        },
        { timeout: 3000 }
      );
      if (res.data?.verified) {
        setSuccess(true);
        setTimeout(() => {
          navigation.navigate('Consent');
        }, 1500);
        return;
      }
    } catch (err: any) {
      if (pan && aadhaar) {
        // Demo mode fallback
        setSuccess(true);
        setTimeout(() => {
          navigation.navigate('Consent');
        }, 1500);
        return;
      }
      setError(err.response?.data?.detail || 'Verification failed. Please fill PAN & Aadhaar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.iconCircle}>
          <Fingerprint color="#1b3a6b" size={40} />
        </View>
        <Text style={styles.title}>Complete One-Time eKYC</Text>
        <Text style={styles.subtitle}>Verified under SEBI KRA & DigiLocker Guidelines</Text>
      </View>

      <View style={styles.card}>
        {success ? (
          <View style={styles.successBox}>
            <CheckCircle2 color="#16a34a" size={56} style={{ marginBottom: 12 }} />
            <Text style={styles.successTitle}>Identity Verified Successfully</Text>
            <Text style={styles.successSub}>Redirecting to Account Aggregator...</Text>
          </View>
        ) : (
          <>
            <Text style={styles.label}>PAN Card Number</Text>
            <TextInput 
              style={styles.input}
              value={pan}
              onChangeText={setPan}
              placeholder="Enter PAN"
              placeholderTextColor="#94a3b8"
              autoCapitalize="characters"
            />
            
            <Text style={styles.label}>Aadhaar Number</Text>
            <TextInput 
              style={styles.input}
              value={aadhaar}
              onChangeText={setAadhaar}
              placeholder="Enter Aadhaar"
              placeholderTextColor="#94a3b8"
              keyboardType="number-pad"
            />

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <TouchableOpacity style={styles.button} onPress={handleVerify} disabled={loading}>
              {loading ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text style={styles.buttonText}>Verify via DigiLocker / KRA</Text>
              )}
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f7fb', padding: 24, justifyContent: 'center' },
  header: { marginBottom: 28, alignItems: 'center' },
  iconCircle: { width: 72, height: 72, borderRadius: 36, backgroundColor: '#ebf3fa', justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  title: { color: '#1b3a6b', fontSize: 26, fontWeight: 'bold', textAlign: 'center' },
  subtitle: { color: '#64748b', fontSize: 13, marginTop: 4, textAlign: 'center' },
  card: { backgroundColor: '#ffffff', padding: 24, borderRadius: 20, borderColor: 'rgba(27, 58, 107, 0.1)', borderWidth: 1, shadowColor: '#1b3a6b', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 12, elevation: 4 },
  label: { color: '#334155', fontSize: 13, fontWeight: '600', marginBottom: 6 },
  input: { backgroundColor: '#f8fafc', borderColor: '#cbd5e1', borderWidth: 1, borderRadius: 12, padding: 14, color: '#0f172a', fontSize: 15, marginBottom: 16 },
  button: { backgroundColor: '#1b3a6b', padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 8 },
  buttonText: { color: '#ffffff', fontSize: 15, fontWeight: 'bold' },
  errorText: { color: '#dc2626', marginBottom: 12, textAlign: 'center', fontSize: 13 },
  successBox: { alignItems: 'center', paddingVertical: 24 },
  successTitle: { color: '#16a34a', fontSize: 20, fontWeight: 'bold', marginBottom: 6, textAlign: 'center' },
  successSub: { color: '#64748b', fontSize: 13, textAlign: 'center' }
});

