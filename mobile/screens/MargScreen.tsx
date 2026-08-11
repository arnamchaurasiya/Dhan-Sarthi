import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  StatusBar,
  BackHandler,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft } from 'lucide-react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

// Import Shared Data Layer & All 16 Dhan Marg Subcomponents
import {
  InvestorProfile,
  Product,
  DEFAULT_INVESTOR_PROFILE,
  PRODUCTS_DATA,
} from './marg/margData';

import MargHome from './marg/MargHome';
import InvestorProfileScreen from './marg/InvestorProfileScreen';
import FinancialGoalsScreen from './marg/FinancialGoalsScreen';
import InvestmentHorizonScreen from './marg/InvestmentHorizonScreen';
import RiskAssessmentScreen from './marg/RiskAssessmentScreen';
import RiskResultScreen from './marg/RiskResultScreen';
import SuitabilityEngineScreen from './marg/SuitabilityEngineScreen';
import SuitableInvestmentsScreen from './marg/SuitableInvestmentsScreen';
import ProductDetailScreen from './marg/ProductDetailScreen';
import WhyMatchScreen from './marg/WhyMatchScreen';
import ProductCompareScreen from './marg/ProductCompareScreen';
import DecisionReviewScreen from './marg/DecisionReviewScreen';
import InvestmentAmountScreen from './marg/InvestmentAmountScreen';
import AccountAccessScreen from './marg/AccountAccessScreen';
import FinalReviewScreen from './marg/FinalReviewScreen';
import InvestmentConfirmationScreen from './marg/InvestmentConfirmationScreen';

type MargStep =
  | '01_HOME'
  | '02_PROFILE'
  | '03_GOALS'
  | '04_HORIZON'
  | '05_RISK_ASSESSMENT'
  | '06_RISK_RESULT'
  | '07_SUITABILITY_ENGINE'
  | '08_SUITABLE_INVESTMENTS'
  | '09_PRODUCT_DETAIL'
  | '10_WHY_MATCH'
  | '11_PRODUCT_COMPARE'
  | '12_DECISION_REVIEW'
  | '13_INVESTMENT_AMOUNT'
  | '14_ACCOUNT_ACCESS'
  | '15_FINAL_REVIEW'
  | '16_CONFIRMATION';

export default function MargScreen() {
  const navigation = useNavigation<any>();

  // State Management
  const [step, setStep] = useState<MargStep>('01_HOME');
  const [profile, setProfile] = useState<InvestorProfile>(DEFAULT_INVESTOR_PROFILE);
  const [selectedProduct, setSelectedProduct] = useState<Product>(PRODUCTS_DATA[0]);
  const [investAmount, setInvestAmount] = useState<number>(25000);
  const [selectedAccount, setSelectedAccount] = useState<string>('HDFC Securities');

  // Back Button Navigation Logic
  const handleBack = React.useCallback(() => {
    switch (step) {
      case '02_PROFILE':
        setStep('01_HOME');
        break;
      case '03_GOALS':
        setStep('02_PROFILE');
        break;
      case '04_HORIZON':
        setStep('03_GOALS');
        break;
      case '05_RISK_ASSESSMENT':
        setStep('04_HORIZON');
        break;
      case '06_RISK_RESULT':
        setStep('05_RISK_ASSESSMENT');
        break;
      case '07_SUITABILITY_ENGINE':
        setStep('06_RISK_RESULT');
        break;
      case '08_SUITABLE_INVESTMENTS':
        setStep('01_HOME');
        break;
      case '09_PRODUCT_DETAIL':
        setStep('08_SUITABLE_INVESTMENTS');
        break;
      case '10_WHY_MATCH':
        setStep('09_PRODUCT_DETAIL');
        break;
      case '11_PRODUCT_COMPARE':
        setStep('10_WHY_MATCH');
        break;
      case '12_DECISION_REVIEW':
        setStep('09_PRODUCT_DETAIL');
        break;
      case '13_INVESTMENT_AMOUNT':
        setStep('12_DECISION_REVIEW');
        break;
      case '14_ACCOUNT_ACCESS':
        setStep('13_INVESTMENT_AMOUNT');
        break;
      case '15_FINAL_REVIEW':
        setStep('14_ACCOUNT_ACCESS');
        break;
      case '16_CONFIRMATION':
        setStep('01_HOME');
        break;
      default:
        setStep('01_HOME');
    }
  }, [step]);

  // Hardware Back Button Handler for Android
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        if (step !== '01_HOME') {
          handleBack();
          return true;
        }
        return false;
      };

      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => subscription.remove();
    }, [step, handleBack])
  );

  // Cross-Tab Navigation Handlers
  const handleNavigateToGyaan = (topicId: string) => {
    navigation.navigate('Gyaan', { topicId });
  };

  const handleNavigateToDarpan = () => {
    // Screen 17 Closed Loop: Update Darpan portfolio state and navigate back to Dhan Darpan
    navigation.navigate('Darpan', {
      screen: 'DarpanHome',
      params: {
        updatedAsset: selectedProduct.name,
        addedAmount: investAmount,
      },
    });
  };

  // Header Title Helper
  const getHeaderTitle = (): string => {
    switch (step) {
      case '01_HOME':
        return 'Dhan Marg';
      case '02_PROFILE':
        return 'Investor Profile';
      case '03_GOALS':
        return 'Financial Goals';
      case '04_HORIZON':
        return 'Investment Horizon';
      case '05_RISK_ASSESSMENT':
        return 'Risk Assessment';
      case '06_RISK_RESULT':
        return 'Risk Profile Result';
      case '07_SUITABILITY_ENGINE':
        return 'Suitability Engine';
      case '08_SUITABLE_INVESTMENTS':
        return 'Suitable Investments';
      case '09_PRODUCT_DETAIL':
        return selectedProduct.name;
      case '10_WHY_MATCH':
        return 'Why This Matches Me';
      case '11_PRODUCT_COMPARE':
        return 'Product Comparison';
      case '12_DECISION_REVIEW':
        return 'Decision Review';
      case '13_INVESTMENT_AMOUNT':
        return 'Investment Amount';
      case '14_ACCOUNT_ACCESS':
        return 'Account & Broker Access';
      case '15_FINAL_REVIEW':
        return 'Final Order Review';
      case '16_CONFIRMATION':
        return 'Investment Submitted';
      default:
        return 'Dhan Marg';
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['left', 'right']}>
      <StatusBar barStyle="light-content" backgroundColor="#1b3a6b" />
      <View style={styles.container}>
        {/* Navigation Header for Sub-screens */}
        {step !== '01_HOME' && (
          <View style={styles.header}>
            <TouchableOpacity style={styles.backBtn} onPress={handleBack}>
              <ArrowLeft color="#0f172a" size={22} />
            </TouchableOpacity>
            <Text style={styles.headerTitle} numberOfLines={1}>
              {getHeaderTitle()}
            </Text>
            <View style={{ width: 36 }} />
          </View>
        )}

        {/* Dynamic Screen Renderer */}
        {step === '01_HOME' && (
          <MargHome
            profile={profile}
            onNavigateToProfile={() => setStep('02_PROFILE')}
            onExploreSuitable={() => setStep('08_SUITABLE_INVESTMENTS')}
            onSelectProduct={(p) => {
              setSelectedProduct(p);
              setStep('09_PRODUCT_DETAIL');
            }}
            onNavigateToGoals={() => setStep('03_GOALS')}
          />
        )}

        {step === '02_PROFILE' && (
          <InvestorProfileScreen
            profile={profile}
            onUpdateProfile={() => setStep('03_GOALS')}
            onRunEngine={() => setStep('07_SUITABILITY_ENGINE')}
          />
        )}

        {step === '03_GOALS' && (
          <FinancialGoalsScreen
            profile={profile}
            onContinue={(goal, targetAmt, timeframeYrs) => {
              setProfile((prev) => ({
                ...prev,
                primaryGoal: goal as any,
                targetAmount: targetAmt,
                targetTimeframeYears: timeframeYrs,
              }));
              setStep('04_HORIZON');
            }}
          />
        )}

        {step === '04_HORIZON' && (
          <InvestmentHorizonScreen
            profile={profile}
            onContinue={(horizon) => {
              setProfile((prev) => ({ ...prev, investmentHorizon: horizon }));
              setStep('05_RISK_ASSESSMENT');
            }}
          />
        )}

        {step === '05_RISK_ASSESSMENT' && (
          <RiskAssessmentScreen
            onCompleteRiskAssessment={(risk) => {
              setProfile((prev) => ({ ...prev, riskProfile: risk }));
              setStep('06_RISK_RESULT');
            }}
          />
        )}

        {step === '06_RISK_RESULT' && (
          <RiskResultScreen
            riskProfile={profile.riskProfile}
            onConfirm={() => setStep('07_SUITABILITY_ENGINE')}
          />
        )}

        {step === '07_SUITABILITY_ENGINE' && (
          <SuitabilityEngineScreen
            profile={profile}
            onAnalysisComplete={() => setStep('08_SUITABLE_INVESTMENTS')}
          />
        )}

        {step === '08_SUITABLE_INVESTMENTS' && (
          <SuitableInvestmentsScreen
            profile={profile}
            onSelectProduct={(p) => {
              setSelectedProduct(p);
              setStep('09_PRODUCT_DETAIL');
            }}
            onViewWhyMatch={(p) => {
              setSelectedProduct(p);
              setStep('10_WHY_MATCH');
            }}
            onCompare={(p) => {
              setSelectedProduct(p);
              setStep('11_PRODUCT_COMPARE');
            }}
          />
        )}

        {step === '09_PRODUCT_DETAIL' && (
          <ProductDetailScreen
            product={selectedProduct}
            profile={profile}
            onNavigateToGyaan={handleNavigateToGyaan}
            onNavigateToWhyMatch={() => setStep('10_WHY_MATCH')}
            onNavigateToCompare={() => setStep('11_PRODUCT_COMPARE')}
            onProceedToDecision={() => setStep('12_DECISION_REVIEW')}
          />
        )}

        {step === '10_WHY_MATCH' && (
          <WhyMatchScreen
            product={selectedProduct}
            profile={profile}
            onNavigateToCompare={() => setStep('11_PRODUCT_COMPARE')}
            onProceedToDecision={() => setStep('12_DECISION_REVIEW')}
          />
        )}

        {step === '11_PRODUCT_COMPARE' && (
          <ProductCompareScreen
            onSelectProductToReview={(p) => {
              setSelectedProduct(p);
              setStep('12_DECISION_REVIEW');
            }}
          />
        )}

        {step === '12_DECISION_REVIEW' && (
          <DecisionReviewScreen
            product={selectedProduct}
            profile={profile}
            onNavigateToGyaan={handleNavigateToGyaan}
            onContinueToAmount={() => setStep('13_INVESTMENT_AMOUNT')}
          />
        )}

        {step === '13_INVESTMENT_AMOUNT' && (
          <InvestmentAmountScreen
            product={selectedProduct}
            profile={profile}
            onContinueToAccount={(amt) => {
              setInvestAmount(amt);
              setStep('14_ACCOUNT_ACCESS');
            }}
          />
        )}

        {step === '14_ACCOUNT_ACCESS' && (
          <AccountAccessScreen
            product={selectedProduct}
            amount={investAmount}
            onContinueToFinalReview={(account) => {
              setSelectedAccount(account);
              setStep('15_FINAL_REVIEW');
            }}
          />
        )}

        {step === '15_FINAL_REVIEW' && (
          <FinalReviewScreen
            product={selectedProduct}
            profile={profile}
            amount={investAmount}
            selectedAccount={selectedAccount}
            onConfirmInvestment={() => setStep('16_CONFIRMATION')}
          />
        )}

        {step === '16_CONFIRMATION' && (
          <InvestmentConfirmationScreen
            product={selectedProduct}
            amount={investAmount}
            onNavigateToDarpan={handleNavigateToDarpan}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#1b3a6b' },
  container: { flex: 1, backgroundColor: '#f8fafc' },

  header: {
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 8 : 12,
    paddingBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  backBtn: { width: 36, height: 36, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 17, fontWeight: 'bold', color: '#0f172a', flex: 1, textAlign: 'center' },
});
