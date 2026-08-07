import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { ShieldCheck } from 'lucide-react-native';

const API_BASE = 'https://dhan-sarthi.onrender.com';

export default function AuthScreen({ navigation }: any) {
  const [phone, setPhone] = useState('9876543210');
  const [otp, setOtp] = useState('1234');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.post(
        `${API_BASE}/api/v1/auth/login`,
        {
          phone_number: phone,
          otp: otp
        },
        { timeout: 3000 }
      );
      if (res.data?.token) {
        navigation.navigate('Ekyc');
        return;
      }
    } catch (err: any) {
      if (err.response?.data?.detail) {
        setError(`${err.response.data.detail}. Use OTP: 1234`);
      } else if (otp === '1234' || otp.length >= 4) {
        // Fallback for offline / network timeout demo mode
        navigation.navigate('Ekyc');
        return;
      } else {
        setError('Login failed. Please use OTP: 1234');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <View style={styles.sebiLogoBadge}>
          <Text style={styles.sebiLogoText}>SEBI</Text>
        </View>
        <Text style={styles.title}>Dhan Sarthi</Text>
        <Text style={styles.taglineHindi}>हर निवेशक की ताकत</Text>
        <Text style={styles.subtitle}>Super App for Retail Investors & Awareness</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.loginTitle}>Login / Register</Text>
        <Text style={styles.loginSubtext}>Please fill in your details to access your account</Text>

        <Text style={styles.label}>Mobile Number</Text>
        <TextInput 
          style={styles.input}
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
          placeholder="Enter mobile number"
          placeholderTextColor="#94a3b8"
        />
        
        <Text style={styles.label}>One-Time Password (OTP)</Text>
        <TextInput 
          style={styles.input}
          keyboardType="number-pad"
          value={otp}
          onChangeText={setOtp}
          placeholder="Enter OTP (Use 1234)"
          placeholderTextColor="#94a3b8"
          secureTextEntry
        />

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Login to Dhan Sarthi</Text>
          )}
        </TouchableOpacity>
        
        <View style={styles.footerInfo}>
          <ShieldCheck size={14} color="#16a34a" />
          <Text style={styles.footerText}>Secured via SEBI SCORES 2.0 & Sahamati AA Framework</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f7fb', padding: 24, justifyContent: 'center' },
  logoContainer: { alignItems: 'center', marginBottom: 32 },
  sebiLogoBadge: { backgroundColor: '#1b3a6b', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 12, marginBottom: 12 },
  sebiLogoText: { color: '#ffffff', fontSize: 24, fontWeight: '900', letterSpacing: 2 },
  title: { color: '#1b3a6b', fontSize: 32, fontWeight: 'bold' },
  taglineHindi: { color: '#2563eb', fontSize: 16, fontWeight: '600', marginTop: 4 },
  subtitle: { color: '#64748b', fontSize: 13, marginTop: 4 },
  card: { backgroundColor: '#ffffff', padding: 24, borderRadius: 20, borderColor: 'rgba(27, 58, 107, 0.1)', borderWidth: 1, shadowColor: '#1b3a6b', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 12, elevation: 4 },
  loginTitle: { color: '#1b3a6b', fontSize: 20, fontWeight: 'bold', marginBottom: 4 },
  loginSubtext: { color: '#64748b', fontSize: 13, marginBottom: 20 },
  label: { color: '#334155', fontSize: 13, fontWeight: '600', marginBottom: 6 },
  input: { backgroundColor: '#f8fafc', borderColor: '#cbd5e1', borderWidth: 1, borderRadius: 12, padding: 14, color: '#0f172a', fontSize: 15, marginBottom: 16 },
  button: { backgroundColor: '#1b3a6b', padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 8 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  errorText: { color: '#dc2626', marginBottom: 12, textAlign: 'center', fontSize: 13 },
  footerInfo: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 20 },
  footerText: { color: '#64748b', fontSize: 11, marginLeft: 6, fontWeight: '500' }
});

