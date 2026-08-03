import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { Link, Database, ShieldCheck } from 'lucide-react-native';

export default function ConsentScreen({ navigation }: any) {
  const [loading, setLoading] = useState(false);

  const handleGrantConsent = () => {
    setLoading(true);
    // Simulate AA redirect and consent granting
    setTimeout(() => {
      setLoading(false);
      // Navigate to the Main Tabs (Darpan)
      navigation.replace('MainTabs');
    }, 2000);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <View style={styles.iconCircle}>
          <Database color="#1b3a6b" size={36} />
        </View>
        <Text style={styles.title}>Sahamati Account Aggregator</Text>
        <Text style={styles.subtitle}>Link your multi-asset depository accounts securely</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Dhan Sarthi is requesting read-only consent for:</Text>
        
        <View style={styles.accountRow}>
          <View style={styles.bullet} />
          <Text style={styles.accountText}>Zerodha Broking Ltd. (Equities & F&O)</Text>
        </View>
        <View style={styles.accountRow}>
          <View style={styles.bullet} />
          <Text style={styles.accountText}>CAMS / Groww (Mutual Funds Folios)</Text>
        </View>
        <View style={styles.accountRow}>
          <View style={styles.bullet} />
          <Text style={styles.accountText}>NSDL / CDSL (Demats & SGBs)</Text>
        </View>
        <View style={styles.accountRow}>
          <View style={styles.bullet} />
          <Text style={styles.accountText}>RBI Retail Direct (Govt Bonds)</Text>
        </View>

        <View style={styles.infoBox}>
          <ShieldCheck color="#2563eb" size={20} style={{ marginRight: 8, marginTop: 2 }} />
          <Text style={styles.infoText}>
            Data is fetched via Sahamati RBI-regulated Account Aggregator network. Read-only, end-to-end encrypted, and revocable at any time.
          </Text>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleGrantConsent} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Approve & Sync Unified Portfolio</Text>
          )}
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.cancelButton} disabled={loading}>
          <Text style={styles.cancelText}>Deny Access</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: '#f4f7fb', padding: 24, justifyContent: 'center' },
  header: { marginBottom: 28, alignItems: 'center' },
  iconCircle: { width: 72, height: 72, borderRadius: 36, backgroundColor: '#ebf3fa', justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  title: { color: '#1b3a6b', fontSize: 24, fontWeight: 'bold', textAlign: 'center' },
  subtitle: { color: '#64748b', fontSize: 13, marginTop: 4, textAlign: 'center' },
  card: { backgroundColor: '#ffffff', padding: 24, borderRadius: 20, borderColor: 'rgba(27, 58, 107, 0.1)', borderWidth: 1, shadowColor: '#1b3a6b', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 12, elevation: 4 },
  cardTitle: { color: '#1e293b', fontSize: 15, fontWeight: 'bold', marginBottom: 16 },
  accountRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  bullet: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#2563eb', marginRight: 12 },
  accountText: { color: '#334155', fontSize: 14, fontWeight: '500' },
  infoBox: { flexDirection: 'row', backgroundColor: '#ebf3fa', borderColor: '#bfdbfe', borderWidth: 1, padding: 14, borderRadius: 12, marginTop: 16, marginBottom: 24 },
  infoText: { color: '#1e3a8a', fontSize: 12, flex: 1, lineHeight: 18, fontWeight: '500' },
  button: { backgroundColor: '#1b3a6b', padding: 16, borderRadius: 12, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 15, fontWeight: 'bold' },
  cancelButton: { padding: 14, alignItems: 'center', marginTop: 8 },
  cancelText: { color: '#64748b', fontSize: 13, fontWeight: '600' }
});

