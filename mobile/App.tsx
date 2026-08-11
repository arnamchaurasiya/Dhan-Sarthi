import React from 'react';
import { Platform, View, StyleSheet, useWindowDimensions, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { LayoutDashboard, BookOpen, Compass, ShieldAlert } from 'lucide-react-native';

import AuthScreen from './screens/AuthScreen';
import EkycScreen from './screens/EkycScreen';
import ConsentScreen from './screens/ConsentScreen';
import DarpanNavigator from './screens/darpan/DarpanNavigator';
import GyaanScreen from './screens/GyaanScreen';
import MargScreen from './screens/MargScreen';
import RakshakScreen from './screens/RakshakScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#2563eb',
        tabBarInactiveTintColor: '#64748b',
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopColor: '#e2e8f0',
          height: 60,
          paddingBottom: 8,
        },
        headerStyle: {
          backgroundColor: '#1b3a6b',
        },
        headerTintColor: '#ffffff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Tab.Screen 
        name="Darpan" 
        component={DarpanNavigator} 
        options={{
          title: 'Dhan Darpan',
          tabBarIcon: ({ color, size }) => (
            <LayoutDashboard color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen 
        name="Gyaan" 
        component={GyaanScreen} 
        options={{
          title: 'Dhan Gyaan',
          tabBarIcon: ({ color, size }) => (
            <BookOpen color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen 
        name="Marg" 
        component={MargScreen} 
        options={{
          title: 'Dhan Marg',
          tabBarIcon: ({ color, size }) => (
            <Compass color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen 
        name="Rakshak" 
        component={RakshakScreen} 
        options={{
          title: 'Dhan Rakshak',
          tabBarIcon: ({ color, size }) => (
            <ShieldAlert color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

function WebContainer({ children }: { children: React.ReactNode }) {
  const { width, height } = useWindowDimensions();
  const isDesktopWeb = Platform.OS === 'web' && width > 520;

  if (!isDesktopWeb) {
    return <View style={{ flex: 1 }}>{children}</View>;
  }

  return (
    <View style={[styles.webOuterContainer, { minHeight: height }]}>
      <View style={styles.webHeader}>
        <Text style={styles.webHeaderTitle}>📱 Dhan-Sarthi Mobile App</Text>
        <Text style={styles.webHeaderSubtitle}>SEBI Securities Market TechSprint — Prototype Preview</Text>
      </View>

      <View style={styles.phoneFrame}>
        <View style={styles.phoneNotch} />
        <View style={{ flex: 1, width: '100%', overflow: 'hidden' }}>
          {children}
        </View>
      </View>
    </View>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <WebContainer>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Auth">
            <Stack.Screen name="Auth" component={AuthScreen} />
            <Stack.Screen name="Ekyc" component={EkycScreen} />
            <Stack.Screen name="Consent" component={ConsentScreen} />
            <Stack.Screen name="MainTabs" component={MainTabs} />
          </Stack.Navigator>
        </NavigationContainer>
      </WebContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  webOuterContainer: {
    flex: 1,
    backgroundColor: '#0b0f19',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
  },
  webHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  webHeaderTitle: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  webHeaderSubtitle: {
    color: '#94a3b8',
    fontSize: 14,
    marginTop: 4,
  },
  phoneFrame: {
    width: 410,
    height: 820,
    backgroundColor: '#ffffff',
    borderRadius: 40,
    borderWidth: 10,
    borderColor: '#1e293b',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.5,
    shadowRadius: 30,
    elevation: 25,
  },
  phoneNotch: {
    width: 130,
    height: 24,
    backgroundColor: '#1e293b',
    alignSelf: 'center',
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    zIndex: 999,
  },
});

