import React, { useState } from 'react';
import { View, StyleSheet, Alert, BackHandler } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

import RakshakHome from './RakshakHome';
import SafetyDashboard from './SafetyDashboard';
import EntityVerificationSearch from './EntityVerificationSearch';
import EntityVerificationResult from './EntityVerificationResult';
import UnverifiedEntityResult from './UnverifiedEntityResult';
import ContentScanner from './ContentScanner';
import ContentScanResult from './ContentScanResult';
import RegulatoryCheckSelect from './RegulatoryCheckSelect';
import RegulatoryResult from './RegulatoryResult';
import PortfolioRiskAlert from './PortfolioRiskAlert';
import RiskAlertDetails from './RiskAlertDetails';
import InvestmentRiskWarning from './InvestmentRiskWarning';
import SafetyCheckBeforeInvestment from './SafetyCheckBeforeInvestment';
import SafetyAlertCenter from './SafetyAlertCenter';
import AlertResolutionScreen from './AlertResolutionScreen';
import TrustSafetyEducation from './TrustSafetyEducation';

import { INITIAL_VERIFIED_ENTITIES, INITIAL_SAFETY_ALERTS, VerifiedEntity, SafetyAlert } from './rakshakData';

export type RakshakScreenState =
  | 'home'
  | 'safety_dashboard'
  | 'entity_search'
  | 'entity_result'
  | 'unverified_result'
  | 'content_scanner'
  | 'content_scan_result'
  | 'regulatory_select'
  | 'regulatory_result'
  | 'portfolio_risk_alert'
  | 'risk_alert_details'
  | 'investment_warning'
  | 'safety_check'
  | 'alert_center'
  | 'alert_resolution'
  | 'safety_education';

export default function RakshakNavigator() {
  const navigation = useNavigation<any>();

  // Current view state inside Rakshak module
  const [currentScreen, setCurrentScreen] = useState<RakshakScreenState>('home');

  // Dynamic parameters for views
  const [selectedEntity, setSelectedEntity] = useState<VerifiedEntity>(INITIAL_VERIFIED_ENTITIES.abc_investment);
  const [unverifiedName, setUnverifiedName] = useState('ABC Wealth Group');
  const [scannedContent, setScannedContent] = useState('');
  const [regQueryName, setRegQueryName] = useState('ABC Investment Services');
  const [selectedAlert, setSelectedAlert] = useState<SafetyAlert>(INITIAL_SAFETY_ALERTS[0]);

  // Master view switcher
  const handleNavigate = (screen: string, params?: any) => {
    if (screen === 'darpan_view') {
      navigation.navigate('Darpan');
      return;
    }
    if (screen === 'gyaan_view') {
      navigation.navigate('Gyaan');
      return;
    }
    if (screen === 'marg_view') {
      navigation.navigate('Marg');
      return;
    }

    if (params) {
      if (params.entity) setSelectedEntity(params.entity);
      if (params.scannedText) setScannedContent(params.scannedText);
      if (params.queryName) setRegQueryName(params.queryName);
      if (params.alert) setSelectedAlert(params.alert);
    }

    setCurrentScreen(screen as RakshakScreenState);
  };

  const handleRakshakBack = React.useCallback(() => {
    switch (currentScreen) {
      case 'safety_dashboard':
      case 'entity_search':
      case 'content_scanner':
      case 'regulatory_select':
      case 'portfolio_risk_alert':
      case 'investment_warning':
      case 'alert_center':
      case 'safety_education':
        setCurrentScreen('home');
        return true;
      case 'entity_result':
      case 'unverified_result':
        setCurrentScreen('entity_search');
        return true;
      case 'content_scan_result':
        setCurrentScreen('content_scanner');
        return true;
      case 'regulatory_result':
        setCurrentScreen('regulatory_select');
        return true;
      case 'risk_alert_details':
        setCurrentScreen('portfolio_risk_alert');
        return true;
      case 'safety_check':
        setCurrentScreen('investment_warning');
        return true;
      case 'alert_resolution':
        setCurrentScreen('alert_center');
        return true;
      default:
        return false;
    }
  }, [currentScreen]);

  // Hardware Back Button Handler for Android
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        if (currentScreen !== 'home') {
          handleRakshakBack();
          return true;
        }
        return false;
      };

      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => subscription.remove();
    }, [currentScreen, handleRakshakBack])
  );

  // Entity selection logic (Search -> Result or Unverified)
  const handleSelectEntityByQuery = (query: string) => {
    const lower = query.toLowerCase();
    if (lower.includes('wealth') || lower.includes('unverified') || lower.includes('fake')) {
      setUnverifiedName(query);
      setCurrentScreen('unverified_result');
    } else if (lower.includes('zerodha')) {
      setSelectedEntity(INITIAL_VERIFIED_ENTITIES.zerodha);
      setCurrentScreen('entity_result');
    } else if (lower.includes('nexus') || lower.includes('reit')) {
      setSelectedEntity(INITIAL_VERIFIED_ENTITIES.nexus_reit);
      setCurrentScreen('entity_result');
    } else if (lower.includes('xyz')) {
      setSelectedEntity(INITIAL_VERIFIED_ENTITIES.xyz_advisor);
      setCurrentScreen('entity_result');
    } else {
      setSelectedEntity({
        ...INITIAL_VERIFIED_ENTITIES.abc_investment,
        name: query,
      });
      setCurrentScreen('entity_result');
    }
  };

  // Content scan handler
  const handleContentScanComplete = (text: string) => {
    setScannedContent(text);
    setCurrentScreen('content_scan_result');
  };

  // Regulatory check selection handler
  const handleRegulatoryProceed = (type: string, query: string) => {
    setRegQueryName(query);
    setCurrentScreen('regulatory_result');
  };

  // Investment execution complete simulation
  const handleConfirmInvestmentComplete = () => {
    Alert.alert(
      '🛡️ Investment Safety Check Passed',
      'Suitability verified & risk disclosures acknowledged. Proceeding to order placement.',
      [
        {
          text: 'Go to Dhan Darpan Portfolio',
          onPress: () => navigation.navigate('Darpan'),
        },
        {
          text: 'Return to Dhan Rakshak',
          onPress: () => setCurrentScreen('home'),
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {currentScreen === 'home' && (
        <RakshakHome onNavigate={handleNavigate} />
      )}

      {currentScreen === 'safety_dashboard' && (
        <SafetyDashboard
          onBack={() => setCurrentScreen('home')}
          onNavigate={handleNavigate}
        />
      )}

      {currentScreen === 'entity_search' && (
        <EntityVerificationSearch
          onBack={() => setCurrentScreen('home')}
          onSelectEntity={handleSelectEntityByQuery}
        />
      )}

      {currentScreen === 'entity_result' && (
        <EntityVerificationResult
          entity={selectedEntity}
          onBack={() => setCurrentScreen('entity_search')}
          onNavigate={handleNavigate}
        />
      )}

      {currentScreen === 'unverified_result' && (
        <UnverifiedEntityResult
          entityName={unverifiedName}
          onBack={() => setCurrentScreen('entity_search')}
          onNavigate={handleNavigate}
        />
      )}

      {currentScreen === 'content_scanner' && (
        <ContentScanner
          onBack={() => setCurrentScreen('home')}
          onScanComplete={handleContentScanComplete}
        />
      )}

      {currentScreen === 'content_scan_result' && (
        <ContentScanResult
          scannedText={scannedContent}
          onBack={() => setCurrentScreen('content_scanner')}
          onNavigate={handleNavigate}
        />
      )}

      {currentScreen === 'regulatory_select' && (
        <RegulatoryCheckSelect
          onBack={() => setCurrentScreen('home')}
          onProceed={handleRegulatoryProceed}
        />
      )}

      {currentScreen === 'regulatory_result' && (
        <RegulatoryResult
          queryName={regQueryName}
          onBack={() => setCurrentScreen('regulatory_select')}
          onNavigateHome={() => setCurrentScreen('home')}
        />
      )}

      {currentScreen === 'portfolio_risk_alert' && (
        <PortfolioRiskAlert
          onBack={() => setCurrentScreen('home')}
          onNavigate={handleNavigate}
        />
      )}

      {currentScreen === 'risk_alert_details' && (
        <RiskAlertDetails
          onBack={() => setCurrentScreen('portfolio_risk_alert')}
          onNavigateMarg={() => navigation.navigate('Marg')}
        />
      )}

      {currentScreen === 'investment_warning' && (
        <InvestmentRiskWarning
          productName="Nexus Select Trust (REIT)"
          onBack={() => setCurrentScreen('home')}
          onProceed={() => setCurrentScreen('safety_check')}
        />
      )}

      {currentScreen === 'safety_check' && (
        <SafetyCheckBeforeInvestment
          productName="Nexus Select Trust (REIT)"
          onBack={() => setCurrentScreen('investment_warning')}
          onConfirmInvestment={handleConfirmInvestmentComplete}
        />
      )}

      {currentScreen === 'alert_center' && (
        <SafetyAlertCenter
          onBack={() => setCurrentScreen('home')}
          onSelectAlert={(alert) => {
            setSelectedAlert(alert);
            setCurrentScreen('alert_resolution');
          }}
        />
      )}

      {currentScreen === 'alert_resolution' && (
        <AlertResolutionScreen
          alert={selectedAlert}
          onBack={() => setCurrentScreen('alert_center')}
          onNavigateTarget={(target) => handleNavigate(target)}
        />
      )}

      {currentScreen === 'safety_education' && (
        <TrustSafetyEducation
          onBack={() => setCurrentScreen('home')}
          onNavigateGyaanTopic={() => navigation.navigate('Gyaan')}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
});
