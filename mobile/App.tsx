import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { LayoutDashboard, BookOpen, Compass, ShieldAlert } from 'lucide-react-native';

import AuthScreen from './screens/AuthScreen';
import EkycScreen from './screens/EkycScreen';
import ConsentScreen from './screens/ConsentScreen';
import DarpanScreen from './screens/DarpanScreen';
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
        component={DarpanScreen} 
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

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Auth">
          <Stack.Screen name="Auth" component={AuthScreen} />
          <Stack.Screen name="Ekyc" component={EkycScreen} />
          <Stack.Screen name="Consent" component={ConsentScreen} />
          <Stack.Screen name="MainTabs" component={MainTabs} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
