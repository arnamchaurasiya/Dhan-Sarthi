import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { ShieldCheck, ShieldAlert, AlertTriangle, ScanSearch, CheckCircle2, QrCode, Keyboard, Building2, Search, Check } from 'lucide-react-native';

const API_BASE = 'http://10.169.95.9:8000';

export default function RakshakScreen() {
  // Entity Verification State
  const [entityName, setEntityName] = useState('Zerodha Broking Ltd.');
  const [entityLoading, setEntityLoading] = useState(false);
  const [entityResult, setEntityResult] = useState<any>({
    found: true,
    name: 'Zerodha Broking Ltd.',
    reg_no: 'INZ000031633',
    category: 'Stock Broker / Depository Participant',
    status: 'Registered'
  });

  // Scam / Deepfake Detection State
  const [scamText, setScamText] = useState('');
  const [scamLoading, setScamLoading] = useState(false);
  const [scamResult, setScamResult] = useState<any>(null);

  // SEBI Check Tab State ('qr' | 'type' | 'account')
  const [sebiCheckTab, setSebiCheckTab] = useState<'qr' | 'type' | 'account'>('type');

  // UPI State
  const [upiId, setUpiId] = useState('');
  const [upiLoading, setUpiLoading] = useState(false);
  const [upiResult, setUpiResult] = useState<any>(null);

  // Bank Account State
  const [ifscCode, setIfscCode] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accLoading, setAccLoading] = useState(false);
  const [accResult, setAccResult] = useState<any>(null);

  // QR Scanning Simulation
  const [qrScanning, setQrScanning] = useState(false);

  // 1. Entity Verification
  const verifyEntity = async () => {
    if (!entityName) return;
    setEntityLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/api/v1/ai/security/verify-entity`, { name: entityName });
      setEntityResult(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setEntityLoading(false);
    }
  };

  // 2. Scam Detection
  const checkScam = async () => {
    if (!scamText) return;
    setScamLoading(true);
    setScamResult(null);
    try {
      const res = await axios.post(`${API_BASE}/api/v1/ai/security/check-scam`, { text: scamText });
      setScamResult(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setScamLoading(false);
    }
  };

  // 3. Manual UPI Verification
  const verifyUpi = async (customHandle?: string) => {
    const handleToTest = customHandle || upiId;
    if (!handleToTest) return;
    setUpiLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/api/v1/ai/security/verify-upi`, { upi_id: handleToTest });
      setUpiResult(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setUpiLoading(false);
    }
  };

  // 4. Bank Account Verification
  const verifyAccount = async () => {
    if (!ifscCode || !accountNumber) return;
    setAccLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/api/v1/ai/security/verify-account`, {
        ifsc: ifscCode,
        account_number: accountNumber
      });
      setAccResult(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setAccLoading(false);
    }
  };

  // Simulate QR Code scan
  const handleSimulateQrScan = () => {
    setQrScanning(true);
    setTimeout(() => {
      setQrScanning(false);
      setSebiCheckTab('type');
      setUpiId('zerodha@dfc');
      verifyUpi('zerodha@dfc');
    }, 1500);
  };

  return (
    <ScrollView style={styles.container}>
      {/* Hero Banner */}
      <View style={styles.heroCard}>
        <View style={styles.heroBadgeRow}>
          <Text style={styles.heroBadgeText}>SEBI SCORES 2.0</Text>
          <Text style={styles.heroBadgeSub}>• Dhan Rakshak</Text>
        </View>
        <Text style={styles.heroTitle}>Spot A Scam & SEBI Check</Text>
        <Text style={styles.heroSub}>Verify authenticity of stock tips, Telegram groups & UPI handles</Text>
      </View>

      <View style={styles.contentPadding}>

        {/* Feature 1: SEBI Entity Verification */}
        <View style={styles.whiteCard}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.iconBadgeBlue}>
              <ShieldCheck color="#2563eb" size={20} />
            </View>
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={styles.cardTitle}>SEBI Entity Verification</Text>
              <Text style={styles.cardSub}>Verify before you invest</Text>
            </View>
          </View>

          <View style={styles.searchRow}>
            <TextInput
              style={styles.lightInput}
              placeholder="Enter broker or advisor name..."
              placeholderTextColor="#94a3b8"
              value={entityName}
              onChangeText={setEntityName}
            />
            <TouchableOpacity style={styles.checkButton} onPress={verifyEntity} disabled={entityLoading}>
              {entityLoading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.checkButtonText}>Check</Text>
              )}
            </TouchableOpacity>
          </View>

          {entityResult && (
            <View style={styles.entityResultRow}>
              <Text style={styles.entityNameText}>{entityResult.name}</Text>
              <View style={[styles.statusBadge, entityResult.found ? styles.badgeSuccess : styles.badgeDanger]}>
                <Text style={[styles.statusBadgeText, entityResult.found ? styles.textSuccess : styles.textDanger]}>
                  {entityResult.found ? 'Registered ✓' : 'Unregistered ✕'}
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* Feature 2: Deepfake / Scam Detection */}
        <View style={styles.whiteCard}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.iconBadgePurple}>
              <ScanSearch color="#9333ea" size={20} />
            </View>
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={styles.cardTitle}>Deepfake / Scam Detection</Text>
              <Text style={styles.cardSub}>Paste suspicious WhatsApp tips here</Text>
            </View>
          </View>

          <TextInput
            style={styles.lightTextArea}
            placeholder="Paste message..."
            placeholderTextColor="#94a3b8"
            multiline
            numberOfLines={3}
            value={scamText}
            onChangeText={setScamText}
          />

          <View style={styles.scamActionRow}>
            <Text style={styles.scoresDbTag}>Integrated with SEBI SCORES DB</Text>
            <TouchableOpacity style={styles.scanButton} onPress={checkScam} disabled={scamLoading || !scamText}>
              {scamLoading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.scanButtonText}>Scan</Text>
              )}
            </TouchableOpacity>
          </View>

          {scamResult && (
            <View style={[styles.resultCard, scamResult.is_scam ? styles.scamCard : styles.safeCard]}>
              <View style={styles.resultHeader}>
                {scamResult.is_scam ? (
                  <AlertTriangle color="#dc2626" size={24} />
                ) : (
                  <CheckCircle2 color="#16a34a" size={24} />
                )}
                <View style={{ marginLeft: 8, flex: 1 }}>
                  <Text style={[styles.resultTitle, scamResult.is_scam ? { color: '#991b1b' } : { color: '#166534' }]}>
                    {scamResult.is_scam ? 'SEBI Alert: High Risk Scam' : 'SEBI Verification: Safe'}
                  </Text>
                  <Text style={styles.warningText}>{scamResult.warning}</Text>
                </View>
              </View>

              <View style={styles.probBox}>
                <Text style={styles.probLabel}>Scam Anomaly Score</Text>
                <Text style={[styles.probValue, scamResult.is_scam ? { color: '#dc2626' } : { color: '#16a34a' }]}>
                  {Math.round(scamResult.scam_probability * 100)}%
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* Feature 3: SEBI Check Banner & Verification */}
        <View style={styles.whiteCard}>
          <View style={styles.sebiCheckBanner}>
            <View style={styles.sebiCheckHeaderRow}>
              <View style={styles.triangleBadge}>
                <Check color="#16a34a" size={18} />
              </View>
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.sebiCheckTitle}>SEBI Check</Text>
                <Text style={styles.sebiCheckSub}>
                  Verify the Authenticity of UPI Payment Channels with SEBI Check.
                </Text>
              </View>
            </View>

            {/* 3 Sub Tabs: Scan QR | Type | Account */}
            <View style={styles.tabBar}>
              <TouchableOpacity
                style={[styles.tabItem, sebiCheckTab === 'qr' && styles.tabItemActive]}
                onPress={() => setSebiCheckTab('qr')}
              >
                <QrCode size={20} color={sebiCheckTab === 'qr' ? '#1b3a6b' : '#64748b'} />
                <Text style={[styles.tabText, sebiCheckTab === 'qr' && styles.tabTextActive]}>Scan QR</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.tabItem, sebiCheckTab === 'type' && styles.tabItemActive]}
                onPress={() => setSebiCheckTab('type')}
              >
                <Keyboard size={20} color={sebiCheckTab === 'type' ? '#1b3a6b' : '#64748b'} />
                <Text style={[styles.tabText, sebiCheckTab === 'type' && styles.tabTextActive]}>Type</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.tabItem, sebiCheckTab === 'account' && styles.tabItemActive]}
                onPress={() => setSebiCheckTab('account')}
              >
                <Building2 size={20} color={sebiCheckTab === 'account' ? '#1b3a6b' : '#64748b'} />
                <Text style={[styles.tabText, sebiCheckTab === 'account' && styles.tabTextActive]}>Account</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Sub-Tab 1: Scan QR */}
          {sebiCheckTab === 'qr' && (
            <View style={styles.tabContent}>
              <Text style={styles.sectionHeader}>Scan Payment QR Code</Text>
              <View style={styles.qrScanBox}>
                <QrCode size={64} color="#1b3a6b" />
                <Text style={styles.qrInstructions}>
                  Align payment QR code within frame or tap below to test scan
                </Text>
                <TouchableOpacity style={styles.primaryBtn} onPress={handleSimulateQrScan} disabled={qrScanning}>
                  {qrScanning ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.primaryBtnText}>Simulate Camera Scan</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Sub-Tab 2: Manual UPI Verification ("Type") */}
          {sebiCheckTab === 'type' && (
            <View style={styles.tabContent}>
              <Text style={styles.brandTitle}>SEBI CHECK</Text>
              <Text style={styles.sectionHeader}>Manual UPI ID Verification</Text>

              <Text style={styles.fieldLabel}>
                * Enter UPI ID <Text style={{ color: '#dc2626' }}>(required)</Text>
              </Text>
              <TextInput
                style={styles.textInput}
                placeholder="username@bank"
                placeholderTextColor="#94a3b8"
                value={upiId}
                onChangeText={setUpiId}
                autoCapitalize="none"
              />

              <TouchableOpacity style={styles.secondaryBtn} onPress={() => verifyUpi()} disabled={upiLoading}>
                {upiLoading ? (
                  <ActivityIndicator color="#1b3a6b" />
                ) : (
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Search size={18} color="#1b3a6b" style={{ marginRight: 6 }} />
                    <Text style={styles.secondaryBtnText}>Check UPI ID</Text>
                  </View>
                )}
              </TouchableOpacity>

              <View style={[styles.infoBox, upiResult && (upiResult.valid ? styles.infoSuccess : styles.infoDanger)]}>
                <Text style={styles.infoBoxText}>
                  {upiResult ? upiResult.message : 'Enter a valid UPI ID to enable verification.'}
                </Text>
              </View>
            </View>
          )}

          {/* Sub-Tab 3: Bank Account Details Verification ("Account") */}
          {sebiCheckTab === 'account' && (
            <View style={styles.tabContent}>
              <Text style={styles.brandTitle}>SEBI CHECK</Text>
              <Text style={styles.sectionHeader}>Account Details Verification</Text>

              <Text style={styles.fieldLabel}>
                * Enter IFSC Code <Text style={{ color: '#dc2626' }}>(required)</Text>
              </Text>
              <TextInput
                style={styles.textInput}
                placeholder="SBIN0001234"
                placeholderTextColor="#94a3b8"
                value={ifscCode}
                onChangeText={setIfscCode}
                autoCapitalize="characters"
              />

              <Text style={[styles.fieldLabel, { marginTop: 12 }]}>
                * Enter Account Number <Text style={{ color: '#dc2626' }}>(required)</Text>
              </Text>
              <TextInput
                style={styles.textInput}
                placeholder="Enter account number"
                placeholderTextColor="#94a3b8"
                value={accountNumber}
                onChangeText={setAccountNumber}
                keyboardType="numeric"
              />

              <TouchableOpacity style={styles.secondaryBtn} onPress={verifyAccount} disabled={accLoading}>
                {accLoading ? (
                  <ActivityIndicator color="#1b3a6b" />
                ) : (
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Building2 size={18} color="#1b3a6b" style={{ marginRight: 6 }} />
                    <Text style={styles.secondaryBtnText}>Check Account Details</Text>
                  </View>
                )}
              </TouchableOpacity>

              <View style={[styles.infoBox, accResult && (accResult.valid ? styles.infoSuccess : styles.infoDanger)]}>
                <Text style={styles.infoBoxText}>
                  {accResult ? accResult.message : 'Enter valid IFSC and Account Number to enable verification.'}
                </Text>
              </View>
            </View>
          )}
        </View>

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
  // Icon Badges & Headers (for Entity & Scam Scanner)
  iconBadgeBlue: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#eff6ff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  iconBadgePurple: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#faf5ff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e9d5ff',
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  cardTitle: {
    color: '#1b3a6b',
    fontSize: 18,
    fontWeight: 'bold',
  },
  cardSub: {
    color: '#64748b',
    fontSize: 12,
    marginTop: 2,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  lightInput: {
    flex: 1,
    backgroundColor: '#f8fafc',
    borderRadius: 10,
    borderColor: '#cbd5e1',
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#0f172a',
    fontSize: 14,
    marginRight: 8,
  },
  checkButton: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 18,
    paddingVertical: 11,
    borderRadius: 10,
  },
  checkButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  entityResultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  entityNameText: {
    color: '#0f172a',
    fontWeight: 'bold',
    fontSize: 14,
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeSuccess: { backgroundColor: '#dcfce7' },
  badgeDanger: { backgroundColor: '#fee2e2' },
  statusBadgeText: { fontWeight: 'bold', fontSize: 12 },
  textSuccess: { color: '#15803d' },
  textDanger: { color: '#b91c1c' },

  // Scam Scanner Light Card
  lightTextArea: {
    backgroundColor: '#f8fafc',
    borderRadius: 10,
    borderColor: '#cbd5e1',
    borderWidth: 1,
    padding: 12,
    color: '#0f172a',
    fontSize: 14,
    textAlignVertical: 'top',
    height: 70,
    marginBottom: 10,
  },
  scamActionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  scoresDbTag: {
    color: '#64748b',
    fontSize: 11,
  },
  scanButton: {
    backgroundColor: '#8b5cf6',
    paddingHorizontal: 20,
    paddingVertical: 9,
    borderRadius: 10,
  },
  scanButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 14,
  },

  // Results
  resultCard: { padding: 14, borderRadius: 12, borderWidth: 1, marginTop: 12 },
  scamCard: { backgroundColor: '#fff1f2', borderColor: '#fecdd3' },
  safeCard: { backgroundColor: '#dcfce7', borderColor: '#86efac' },
  resultHeader: { flexDirection: 'row', alignItems: 'flex-start' },
  resultTitle: { fontSize: 15, fontWeight: 'bold', marginBottom: 2 },
  warningText: { color: '#334155', fontSize: 12 },
  probBox: { marginTop: 8, alignItems: 'flex-end' },
  probLabel: { color: '#64748b', fontSize: 10, fontWeight: '600' },
  probValue: { fontSize: 18, fontWeight: 'bold' },

  // SEBI Check Section
  whiteCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(27, 58, 107, 0.1)',
    shadowColor: '#1b3a6b',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    marginBottom: 30,
  },
  sebiCheckBanner: {
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    paddingBottom: 14,
  },
  sebiCheckHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  triangleBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#dcfce7',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#86efac',
  },
  sebiCheckTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1b3a6b',
  },
  sebiCheckSub: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 12,
  },
  tabItemActive: {
    backgroundColor: '#eff6ff',
  },
  tabText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
    marginTop: 4,
  },
  tabTextActive: {
    color: '#1b3a6b',
    fontWeight: 'bold',
  },

  tabContent: {
    marginTop: 16,
  },
  brandTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#1b3a6b',
    textAlign: 'center',
    letterSpacing: 2,
  },
  sectionHeader: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1b3a6b',
    textAlign: 'center',
    marginBottom: 16,
    marginTop: 2,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 6,
  },
  textInput: {
    backgroundColor: '#f8fafc',
    borderColor: '#cbd5e1',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: '#0f172a',
    marginBottom: 14,
  },
  secondaryBtn: {
    backgroundColor: '#bfdbfe',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  secondaryBtnText: {
    color: '#1b3a6b',
    fontWeight: 'bold',
    fontSize: 15,
  },
  infoBox: {
    backgroundColor: '#e0f2fe',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  infoSuccess: {
    backgroundColor: '#dcfce7',
    borderWidth: 1,
    borderColor: '#86efac',
  },
  infoDanger: {
    backgroundColor: '#ffe4e6',
    borderWidth: 1,
    borderColor: '#fca5a5',
  },
  infoBoxText: {
    color: '#1e3a8a',
    fontSize: 13,
    textAlign: 'center',
    fontWeight: '500',
  },

  qrScanBox: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  qrInstructions: {
    color: '#64748b',
    fontSize: 13,
    textAlign: 'center',
    marginVertical: 14,
  },
  primaryBtn: {
    backgroundColor: '#1b3a6b',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  primaryBtnText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});


