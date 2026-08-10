import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import {
  ArrowLeft,
  Sliders,
  TrendingUp,
  Building2,
  Landmark,
  AlertTriangle,
  PieChart,
  Coins,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react-native';

interface FinancialSimulatorsScreenProps {
  onBack: () => void;
  onNavigateToReadiness: () => void;
  initialTab?: 'sip' | 'lumpsum' | 'reit' | 'bond' | 'inflation';
}

export default function FinancialSimulatorsScreen({
  onBack,
  onNavigateToReadiness,
  initialTab = 'sip',
}: FinancialSimulatorsScreenProps) {
  const [activeTab, setActiveTab] = useState<'sip' | 'lumpsum' | 'reit' | 'bond' | 'inflation'>(initialTab);

  // SIP State
  const [sipMonthly, setSipMonthly] = useState('5000');
  const [sipYears, setSipYears] = useState('10');
  const [sipReturn, setSipReturn] = useState('12');

  // Lumpsum State
  const [lumpAmount, setLumpAmount] = useState('100000');
  const [lumpYears, setLumpYears] = useState('10');
  const [lumpReturn, setLumpReturn] = useState('12');

  // REIT State
  const [reitAmount, setReitAmount] = useState('100000');
  const [reitYield, setReitYield] = useState('7.5');
  const [reitAppreciation, setReitAppreciation] = useState('3.5');

  // Bond State
  const [bondAmount, setBondAmount] = useState('100000');
  const [bondYield, setBondYield] = useState('8.5');

  // Inflation State
  const [infAmount, setInfAmount] = useState('1000000');
  const [infRate, setInfRate] = useState('6');
  const [infYears, setInfYears] = useState('15');

  // SIP Calculation
  const calculateSIP = () => {
    const P = parseFloat(sipMonthly) || 0;
    const n = (parseFloat(sipYears) || 0) * 12;
    const i = (parseFloat(sipReturn) || 0) / 12 / 100;
    if (i <= 0 || n <= 0) return { future: 0, invested: 0, gain: 0 };

    const future = P * ((Math.pow(1 + i, n) - 1) / i) * (1 + i);
    const invested = P * n;
    return {
      future: Math.round(future),
      invested: Math.round(invested),
      gain: Math.round(future - invested),
    };
  };

  // Lumpsum Calculation
  const calculateLumpsum = () => {
    const P = parseFloat(lumpAmount) || 0;
    const t = parseFloat(lumpYears) || 0;
    const r = (parseFloat(lumpReturn) || 0) / 100;
    const future = P * Math.pow(1 + r, t);
    return {
      future: Math.round(future),
      invested: Math.round(P),
      gain: Math.round(future - P),
    };
  };

  // REIT Calculation
  const calculateREIT = () => {
    const P = parseFloat(reitAmount) || 0;
    const y = (parseFloat(reitYield) || 0) / 100;
    const a = (parseFloat(reitAppreciation) || 0) / 100;
    const annualDividend = P * y;
    const quarterlyDividend = annualDividend / 4;
    const futureVal3Yr = P * Math.pow(1 + a, 3) + annualDividend * 3;
    return {
      annualDividend: Math.round(annualDividend),
      quarterlyDividend: Math.round(quarterlyDividend),
      futureVal3Yr: Math.round(futureVal3Yr),
    };
  };

  // Bond Calculation
  const calculateBond = () => {
    const P = parseFloat(bondAmount) || 0;
    const y = (parseFloat(bondYield) || 0) / 100;
    const annualPayout = P * y;
    const monthlyPayout = annualPayout / 12;
    const total5YrReturn = P + annualPayout * 5;
    return {
      annualPayout: Math.round(annualPayout),
      monthlyPayout: Math.round(monthlyPayout),
      total5YrReturn: Math.round(total5YrReturn),
    };
  };

  // Inflation Calculation
  const calculateInflation = () => {
    const P = parseFloat(infAmount) || 0;
    const r = (parseFloat(infRate) || 0) / 100;
    const t = parseFloat(infYears) || 0;
    const futurePurchasingPower = P / Math.pow(1 + r, t);
    const requiredCapitalFuture = P * Math.pow(1 + r, t);
    return {
      futurePurchasingPower: Math.round(futurePurchasingPower),
      requiredCapitalFuture: Math.round(requiredCapitalFuture),
    };
  };

  const formatCurrency = (val: number) => {
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)} Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(2)} Lakh`;
    return `₹${val.toLocaleString('en-IN')}`;
  };

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <ArrowLeft size={20} color="#0f172a" />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Financial Simulators</Text>
          <Text style={styles.headerSub}>Experiential Learning & Payout Calculations</Text>
        </View>
        <Sliders size={20} color="#2563eb" />
      </View>

      {/* Mandatory SEBI Protection Warning Banner */}
      <View style={styles.sebiWarningBanner}>
        <AlertTriangle size={16} color="#b45309" />
        <Text style={styles.sebiWarningText}>
          ⚠️ Illustrative projection — returns are assumptions, not guarantees.
        </Text>
      </View>

      {/* Simulator Tabs */}
      <View style={styles.tabBar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, alignItems: 'center' }}>
          {[
            { id: 'sip', label: 'SIP Growth' },
            { id: 'lumpsum', label: 'Lumpsum' },
            { id: 'reit', label: 'REIT Income' },
            { id: 'bond', label: 'Bond Yield' },
            { id: 'inflation', label: 'Inflation' },
          ].map((tab) => (
            <TouchableOpacity
              key={tab.id}
              style={[styles.tabItem, activeTab === tab.id && styles.tabItemActive]}
              onPress={() => setActiveTab(tab.id as any)}
            >
              <Text style={[styles.tabText, activeTab === tab.id && styles.tabTextActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Simulator Body */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* 1. SIP SIMULATOR */}
        {activeTab === 'sip' && (() => {
          const { future, invested, gain } = calculateSIP();
          return (
            <View style={styles.simCard}>
              <Text style={styles.simTitle}>SIP Wealth Compounding Simulator</Text>
              <Text style={styles.simDesc}>
                Simulate how disciplined monthly investments grow over long horizons.
              </Text>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Monthly SIP Amount (₹)</Text>
                <TextInput
                  style={styles.numericInput}
                  keyboardType="numeric"
                  value={sipMonthly}
                  onChangeText={setSipMonthly}
                />
              </View>

              <View style={styles.inputRow}>
                <View style={[styles.inputGroup, { flex: 1 }]}>
                  <Text style={styles.inputLabel}>Duration (Years)</Text>
                  <TextInput
                    style={styles.numericInput}
                    keyboardType="numeric"
                    value={sipYears}
                    onChangeText={setSipYears}
                  />
                </View>

                <View style={[styles.inputGroup, { flex: 1 }]}>
                  <Text style={styles.inputLabel}>Expected Return (% p.a.)</Text>
                  <TextInput
                    style={styles.numericInput}
                    keyboardType="numeric"
                    value={sipReturn}
                    onChangeText={setSipReturn}
                  />
                </View>
              </View>

              {/* Result Summary */}
              <View style={styles.resultBox}>
                <View style={styles.resRow}>
                  <Text style={styles.resLabel}>Invested Amount</Text>
                  <Text style={styles.resVal}>{formatCurrency(invested)}</Text>
                </View>
                <View style={styles.resRow}>
                  <Text style={styles.resLabel}>Est. Wealth Gain</Text>
                  <Text style={[styles.resVal, { color: '#16a34a' }]}>+{formatCurrency(gain)}</Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.resRow}>
                  <Text style={styles.resLabelTotal}>Projected Value</Text>
                  <Text style={styles.resValTotal}>{formatCurrency(future)}</Text>
                </View>

                <View style={styles.barStack}>
                  <View
                    style={[
                      styles.barSegment,
                      {
                        width: `${Math.round((invested / (future || 1)) * 100)}%`,
                        backgroundColor: '#3b82f6',
                      },
                    ]}
                  />
                  <View
                    style={[
                      styles.barSegment,
                      {
                        width: `${Math.round((gain / (future || 1)) * 100)}%`,
                        backgroundColor: '#22c55e',
                      },
                    ]}
                  />
                </View>
              </View>
            </View>
          );
        })()}

        {/* 2. LUMPSUM SIMULATOR */}
        {activeTab === 'lumpsum' && (() => {
          const { future, invested, gain } = calculateLumpsum();
          return (
            <View style={styles.simCard}>
              <Text style={styles.simTitle}>Lumpsum Investment Calculator</Text>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Initial One-Time Investment (₹)</Text>
                <TextInput
                  style={styles.numericInput}
                  keyboardType="numeric"
                  value={lumpAmount}
                  onChangeText={setLumpAmount}
                />
              </View>

              <View style={styles.inputRow}>
                <View style={[styles.inputGroup, { flex: 1 }]}>
                  <Text style={styles.inputLabel}>Investment Horizon (Yrs)</Text>
                  <TextInput
                    style={styles.numericInput}
                    keyboardType="numeric"
                    value={lumpYears}
                    onChangeText={setLumpYears}
                  />
                </View>
                <View style={[styles.inputGroup, { flex: 1 }]}>
                  <Text style={styles.inputLabel}>Assumed CAGR (%)</Text>
                  <TextInput
                    style={styles.numericInput}
                    keyboardType="numeric"
                    value={lumpReturn}
                    onChangeText={setLumpReturn}
                  />
                </View>
              </View>

              <View style={styles.resultBox}>
                <View style={styles.resRow}>
                  <Text style={styles.resLabelTotal}>Projected Lumpsum Value</Text>
                  <Text style={styles.resValTotal}>{formatCurrency(future)}</Text>
                </View>
                <View style={styles.resRow}>
                  <Text style={styles.resLabel}>Wealth Gain</Text>
                  <Text style={[styles.resVal, { color: '#16a34a' }]}>+{formatCurrency(gain)}</Text>
                </View>
              </View>
            </View>
          );
        })()}

        {/* 3. REIT INCOME SIMULATOR */}
        {activeTab === 'reit' && (() => {
          const { annualDividend, quarterlyDividend, futureVal3Yr } = calculateREIT();
          return (
            <View style={styles.simCard}>
              <Text style={styles.simTitle}>REIT Quarterly Income Simulator</Text>
              <Text style={styles.simDesc}>
                Estimate your 90% NDCF rental dividend distribution under SEBI rules.
              </Text>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Investment Capital in REIT (₹)</Text>
                <TextInput
                  style={styles.numericInput}
                  keyboardType="numeric"
                  value={reitAmount}
                  onChangeText={setReitAmount}
                />
              </View>

              <View style={styles.inputRow}>
                <View style={[styles.inputGroup, { flex: 1 }]}>
                  <Text style={styles.inputLabel}>Est. Dividend Yield (%)</Text>
                  <TextInput
                    style={styles.numericInput}
                    keyboardType="numeric"
                    value={reitYield}
                    onChangeText={setReitYield}
                  />
                </View>
                <View style={[styles.inputGroup, { flex: 1 }]}>
                  <Text style={styles.inputLabel}>Property Growth (% p.a.)</Text>
                  <TextInput
                    style={styles.numericInput}
                    keyboardType="numeric"
                    value={reitAppreciation}
                    onChangeText={setReitAppreciation}
                  />
                </View>
              </View>

              <View style={styles.resultBox}>
                <View style={styles.resRow}>
                  <Text style={styles.resLabel}>Est. Quarterly Dividend Payout</Text>
                  <Text style={[styles.resVal, { color: '#0284c7' }]}>
                    {formatCurrency(quarterlyDividend)} / Qtr
                  </Text>
                </View>
                <View style={styles.resRow}>
                  <Text style={styles.resLabel}>Est. Annual Rental Payout</Text>
                  <Text style={[styles.resVal, { color: '#16a34a' }]}>
                    {formatCurrency(annualDividend)} / Yr
                  </Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.resRow}>
                  <Text style={styles.resLabelTotal}>3-Year Total Return (Yield + Growth)</Text>
                  <Text style={styles.resValTotal}>{formatCurrency(futureVal3Yr)}</Text>
                </View>
              </View>
            </View>
          );
        })()}

        {/* 4. BOND YIELD SIMULATOR */}
        {activeTab === 'bond' && (() => {
          const { annualPayout, monthlyPayout, total5YrReturn } = calculateBond();
          return (
            <View style={styles.simCard}>
              <Text style={styles.simTitle}>Corporate Bond Yield Simulator</Text>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Bond Principal Investment (₹)</Text>
                <TextInput
                  style={styles.numericInput}
                  keyboardType="numeric"
                  value={bondAmount}
                  onChangeText={setBondAmount}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Fixed Coupon Yield (% p.a.)</Text>
                <TextInput
                  style={styles.numericInput}
                  keyboardType="numeric"
                  value={bondYield}
                  onChangeText={setBondYield}
                />
              </View>

              <View style={styles.resultBox}>
                <View style={styles.resRow}>
                  <Text style={styles.resLabel}>Monthly Interest Income</Text>
                  <Text style={[styles.resVal, { color: '#d97706' }]}>
                    {formatCurrency(monthlyPayout)} / mo
                  </Text>
                </View>
                <View style={styles.resRow}>
                  <Text style={styles.resLabel}>Annual Interest Payout</Text>
                  <Text style={[styles.resVal, { color: '#16a34a' }]}>
                    {formatCurrency(annualPayout)} / yr
                  </Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.resRow}>
                  <Text style={styles.resLabelTotal}>5-Yr Maturity Return (Principal + Interest)</Text>
                  <Text style={styles.resValTotal}>{formatCurrency(total5YrReturn)}</Text>
                </View>
              </View>
            </View>
          );
        })()}

        {/* 5. INFLATION SIMULATOR */}
        {activeTab === 'inflation' && (() => {
          const { futurePurchasingPower, requiredCapitalFuture } = calculateInflation();
          return (
            <View style={styles.simCard}>
              <Text style={styles.simTitle}>Inflation Purchasing Power Decay</Text>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Target Capital Today (₹)</Text>
                <TextInput
                  style={styles.numericInput}
                  keyboardType="numeric"
                  value={infAmount}
                  onChangeText={setInfAmount}
                />
              </View>

              <View style={styles.inputRow}>
                <View style={[styles.inputGroup, { flex: 1 }]}>
                  <Text style={styles.inputLabel}>Inflation Rate (%)</Text>
                  <TextInput
                    style={styles.numericInput}
                    keyboardType="numeric"
                    value={infRate}
                    onChangeText={setInfRate}
                  />
                </View>
                <View style={[styles.inputGroup, { flex: 1 }]}>
                  <Text style={styles.inputLabel}>Years Horizon</Text>
                  <TextInput
                    style={styles.numericInput}
                    keyboardType="numeric"
                    value={infYears}
                    onChangeText={setInfYears}
                  />
                </View>
              </View>

              <View style={styles.resultBox}>
                <View style={styles.resRow}>
                  <Text style={styles.resLabel}>Eroded Purchasing Power in {infYears} Yrs</Text>
                  <Text style={[styles.resVal, { color: '#dc2626' }]}>
                    {formatCurrency(futurePurchasingPower)}
                  </Text>
                </View>
                <View style={styles.resRow}>
                  <Text style={styles.resLabelTotal}>Capital Required to Match Today's Value</Text>
                  <Text style={styles.resValTotal}>{formatCurrency(requiredCapitalFuture)}</Text>
                </View>
              </View>
            </View>
          );
        })()}

        {/* Next Step Bridge to Before You Invest */}
        <TouchableOpacity
          style={styles.readinessBridgeBtn}
          onPress={onNavigateToReadiness}
        >
          <ShieldCheck size={20} color="#ffffff" />
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={styles.readinessBridgeTitle}>Now Check Investment Readiness</Text>
            <Text style={styles.readinessBridgeSub}>
              Verify mandatory learning before making real asset allocations
            </Text>
          </View>
          <ArrowRight size={18} color="#ffffff" />
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
  },
  headerSub: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 2,
  },
  sebiWarningBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#fffbe3',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#fde047',
  },
  sebiWarningText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#92400e',
  },
  tabBar: {
    backgroundColor: '#ffffff',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    flexGrow: 0,
  },
  tabItem: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#f1f5f9',
    marginRight: 8,
    height: 34,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabItemActive: {
    backgroundColor: '#2563eb',
  },
  tabText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
  },
  tabTextActive: {
    color: '#ffffff',
  },
  scrollContent: {
    padding: 16,
  },
  simCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  simTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0f172a',
  },
  simDesc: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 4,
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 12,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 12,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 6,
  },
  numericInput: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a',
  },
  resultBox: {
    backgroundColor: '#f0f6ff',
    borderRadius: 14,
    padding: 14,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  resRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  resLabel: {
    fontSize: 13,
    color: '#475569',
    fontWeight: '500',
    flex: 1,
    marginRight: 8,
  },
  resVal: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
    flexShrink: 0,
  },
  divider: {
    height: 1,
    backgroundColor: '#cbd5e1',
    marginVertical: 8,
  },
  resLabelTotal: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1e40af',
    flex: 1,
    marginRight: 8,
  },
  resValTotal: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1e40af',
    flexShrink: 0,
  },
  barStack: {
    flexDirection: 'row',
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    marginTop: 12,
  },
  barSegment: {
    height: '100%',
  },
  readinessBridgeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0284c7',
    padding: 16,
    borderRadius: 14,
    marginTop: 20,
  },
  readinessBridgeTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#ffffff',
  },
  readinessBridgeSub: {
    fontSize: 11,
    color: '#e0f2fe',
    marginTop: 2,
  },
});
