import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import axios from 'axios';

import { DEFAULT_HOLDINGS, getPortfolioSummary } from './darpanData';

// Import all 14 screens
import DarpanHome from './DarpanHome';
import Holdings from './Holdings';
import HoldingDetail from './HoldingDetail';
import AssetAllocation from './AssetAllocation';
import RiskExposure from './RiskExposure';
import RiskDetail from './RiskDetail';
import Transactions from './Transactions';
import TransactionDetail from './TransactionDetail';
import PortfolioInsights from './PortfolioInsights';
import DiversificationOpportunity from './DiversificationOpportunity';
import ConnectedAccounts from './ConnectedAccounts';
import AddAccount from './AddAccount';
import PortfolioHealth from './PortfolioHealth';
import ActionCenter from './ActionCenter';

export type DarpanStackParamList = {
  DarpanHome: { holdings: any[]; summary: any };
  Holdings: { holdings: any[]; initialCategory?: string };
  HoldingDetail: { holding: any; portfolioTotal: number };
  AssetAllocation: { holdings: any[] };
  RiskExposure: { holdings: any[] };
  RiskDetail: { driverIndex: number };
  Transactions: { initialFilter?: string };
  TransactionDetail: { transaction: any };
  PortfolioInsights: { holdings: any[]; summary: any };
  DiversificationOpportunity: undefined;
  ConnectedAccounts: undefined;
  AddAccount: undefined;
  PortfolioHealth: undefined;
  ActionCenter: { holdings: any[]; summary: any };
};

const Stack = createNativeStackNavigator<DarpanStackParamList>();
const API_BASE = 'https://dhan-sarthi.onrender.com';

export default function DarpanNavigator() {
  const [holdings, setHoldings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.post(`${API_BASE}/api/v1/mock-dpi/aa/consent`, {
      user_id: 'user_123',
      fip_ids: ['fip_zerodha', 'fip_cams'],
    })
      .then(res => {
        const handle = res.data.consent_handle;
        return axios.get(`${API_BASE}/api/v1/mock-dpi/aa/fetch-holdings/${handle}`);
      })
      .then(res => {
        if (res.data?.data?.holdings) {
          setHoldings(res.data.data.holdings);
        } else {
          setHoldings(DEFAULT_HOLDINGS);
        }
        setLoading(false);
      })
      .catch(() => {
        setHoldings(DEFAULT_HOLDINGS);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1b3a6b" />
        <Text style={styles.loadingText}>Fetching unified portfolio via Sahamati AA...</Text>
      </View>
    );
  }

  const summary = getPortfolioSummary(holdings);

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        contentStyle: { backgroundColor: '#f4f7fb' },
      }}
    >
      <Stack.Screen
        name="DarpanHome"
        component={DarpanHome}
        initialParams={{ holdings, summary }}
      />
      <Stack.Screen name="Holdings" component={Holdings} initialParams={{ holdings }} />
      <Stack.Screen name="HoldingDetail" component={HoldingDetail} />
      <Stack.Screen name="AssetAllocation" component={AssetAllocation} initialParams={{ holdings }} />
      <Stack.Screen name="RiskExposure" component={RiskExposure} initialParams={{ holdings }} />
      <Stack.Screen name="RiskDetail" component={RiskDetail} />
      <Stack.Screen name="Transactions" component={Transactions} />
      <Stack.Screen name="TransactionDetail" component={TransactionDetail} />
      <Stack.Screen name="PortfolioInsights" component={PortfolioInsights} initialParams={{ holdings, summary }} />
      <Stack.Screen name="DiversificationOpportunity" component={DiversificationOpportunity} />
      <Stack.Screen name="ConnectedAccounts" component={ConnectedAccounts} />
      <Stack.Screen name="AddAccount" component={AddAccount} />
      <Stack.Screen name="PortfolioHealth" component={PortfolioHealth} />
      <Stack.Screen name="ActionCenter" component={ActionCenter} initialParams={{ holdings, summary }} />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: '#f4f7fb',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  loadingText: {
    color: '#64748b',
    marginTop: 16,
    fontWeight: '500',
    textAlign: 'center',
    fontSize: 14,
  },
});
