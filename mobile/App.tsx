import React from 'react';
import { Platform, View, StyleSheet, useWindowDimensions, Text, TouchableOpacity } from 'react-native';
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

  const handleDownloadApk = () => {
    if (typeof window !== 'undefined') {
      window.open('https://github.com/arnamchaurasiya/Dhan-Sarthi/releases', '_blank');
    }
  };

  const handleOpenGithub = () => {
    if (typeof window !== 'undefined') {
      window.open('https://github.com/arnamchaurasiya/Dhan-Sarthi', '_blank');
    }
  };

  return (
    <View style={[styles.webOuterContainer, { minHeight: height }]}>
      {/* Top Banner Header for Judges */}
      <View style={styles.webHeader}>
        <View style={styles.sebiTechSprintBadge}>
          <Text style={styles.sebiTechSprintText}>SEBI SECURITIES MARKET TECHSPRINT</Text>
        </View>
        <Text style={styles.webHeaderTitle}>📱 Dhan-Sarthi Android App Simulator</Text>
        <Text style={styles.webHeaderSubtitle}>
          Interactive Mobile Prototype — Test features live below or download the native Android APK
        </Text>

        {/* Action Buttons for Judges */}
        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.downloadApkBtn} onPress={handleDownloadApk} activeOpacity={0.85}>
            <Text style={styles.downloadApkText}>⬇️ Download Android APK (.apk)</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.githubBtn} onPress={handleOpenGithub} activeOpacity={0.85}>
            <Text style={styles.githubBtnText}>⭐ View GitHub Repository</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Android Device Shell */}
      <View style={styles.phoneFrame}>
        {/* Android Punch Hole Camera */}
        <View style={styles.cameraPunchHole} />

        {/* Android Top Status Bar */}
        <View style={styles.androidStatusBar}>
          <Text style={styles.statusTime}>09:41</Text>
          <View style={styles.statusIcons}>
            <Text style={styles.statusIconText}>5G</Text>
            <Text style={styles.statusIconText}>📶</Text>
            <Text style={styles.statusIconText}>🔋 98%</Text>
          </View>
        </View>

        {/* Live App Screen */}
        <View style={{ flex: 1, width: '100%', overflow: 'hidden' }}>
          {children}
        </View>

        {/* Android Bottom Navigation Bar */}
        <View style={styles.androidBottomBar}>
          <View style={styles.gesturePill} />
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
    backgroundColor: '#070a12',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
  },
  webHeader: {
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  sebiTechSprintBadge: {
    backgroundColor: '#1b3a6b',
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  sebiTechSprintText: {
    color: '#60a5fa',
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 1.2,
  },
  webHeaderTitle: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  webHeaderSubtitle: {
    color: '#94a3b8',
    fontSize: 13,
    marginTop: 4,
    textAlign: 'center',
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 14,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  downloadApkBtn: {
    backgroundColor: '#16a34a',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    shadowColor: '#16a34a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  downloadApkText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: 'bold',
  },
  githubBtn: {
    backgroundColor: '#1e293b',
    borderColor: '#334155',
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  githubBtnText: {
    color: '#e2e8f0',
    fontSize: 13,
    fontWeight: 'bold',
  },
  phoneFrame: {
    width: 410,
    height: 830,
    backgroundColor: '#ffffff',
    borderRadius: 44,
    borderWidth: 12,
    borderColor: '#1e293b',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 25 },
    shadowOpacity: 0.6,
    shadowRadius: 35,
    elevation: 30,
    position: 'relative',
  },
  cameraPunchHole: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#0f172a',
    position: 'absolute',
    top: 10,
    alignSelf: 'center',
    zIndex: 9999,
  },
  androidStatusBar: {
    height: 32,
    backgroundColor: '#1b3a6b',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    zIndex: 9998,
  },
  statusTime: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: 'bold',
  },
  statusIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusIconText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '600',
  },
  androidBottomBar: {
    height: 16,
    backgroundColor: '#0f172a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gesturePill: {
    width: 120,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#475569',
  },
});

