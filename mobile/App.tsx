import React, { useState, useEffect } from 'react';
import { Platform, View, StyleSheet, useWindowDimensions, Text, TouchableOpacity, Image, ScrollView, Modal } from 'react-native';
import { NavigationContainer, createNavigationContainerRef } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { LayoutDashboard, BookOpen, Compass, ShieldAlert, RotateCcw, Smartphone, Download, QrCode, Sparkles, CheckCircle2, X } from 'lucide-react-native';

import AuthScreen from './screens/AuthScreen';
import EkycScreen from './screens/EkycScreen';
import ConsentScreen from './screens/ConsentScreen';
import DarpanNavigator from './screens/darpan/DarpanNavigator';
import GyaanScreen from './screens/GyaanScreen';
import MargScreen from './screens/MargScreen';
import RakshakScreen from './screens/RakshakScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

export const navigationRef = createNavigationContainerRef<any>();

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
  // If running on native mobile app (Android / iOS APK or Expo Go), return children directly without any web wrapper or APK button
  if (Platform.OS !== 'web') {
    return <>{children}</>;
  }

  const { width, height } = useWindowDimensions();
  const isDesktopWeb = width > 640;

  const [timeStr, setTimeStr] = useState('09:41');
  const [frameStyle, setFrameStyle] = useState<'pixel' | 'galaxy' | 'minimal'>('pixel');
  const [showQrModal, setShowQrModal] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const mins = now.getMinutes().toString().padStart(2, '0');
      setTimeStr(`${hours}:${mins}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleDownloadApk = () => {
    if (typeof window !== 'undefined') {
      const link = document.createElement('a');
      link.href = '/dhan-sarthi.apk';
      link.download = 'dhan-sarthi-v1.0.0.apk';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleResetApp = () => {
    if (navigationRef.isReady()) {
      navigationRef.reset({
        index: 0,
        routes: [{ name: 'Auth' }],
      });
    }
  };

  // Mobile Web Browser View (< 640px)
  if (!isDesktopWeb) {
    return (
      <View style={{ flex: 1, backgroundColor: '#070a12' }}>
        {/* Mobile Web Header with APK Download link outside app content */}
        <View style={styles.mobileTopBar}>
          <View style={styles.mobileTopBarLeft}>
            <Text style={styles.mobileTopBarTitle}>Dhan-Sarthi App</Text>
            <Text style={styles.mobileTopBarSub}>SEBI TechSprint Prototype</Text>
          </View>
          <TouchableOpacity 
            style={styles.mobileDownloadBtn} 
            onPress={handleDownloadApk} 
            activeOpacity={0.8}
          >
            <Download size={14} color="#ffffff" />
            <Text style={styles.mobileDownloadText}>Get APK</Text>
          </TouchableOpacity>
        </View>

        {/* Live Mobile Web App */}
        <View style={{ flex: 1 }}>{children}</View>
      </View>
    );
  }

  // Desktop / Laptop View (> 640px)
  const currentUrl = typeof window !== 'undefined' ? window.location.href : 'https://dhan-sarthi.vercel.app';
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(currentUrl)}&color=1b3a6b&format=png`;

  const phoneWidth = Math.min(410, width * 0.38);
  const phoneHeight = Math.min(840, height - 60);

  return (
    <View style={[styles.webOuterContainer, { minHeight: height }]}>
      <View style={styles.desktopContentWrapper}>
        {/* Left / Top Info Sidebar */}
        <View style={styles.sidebarPanel}>
          {/* SEBI TechSprint Badge */}
          <View style={styles.sebiBadgeContainer}>
            <Sparkles size={14} color="#60a5fa" />
            <Text style={styles.sebiBadgeText}>SEBI SECURITIES MARKET TECHSPRINT</Text>
          </View>

          {/* App Title & Tagline */}
          <Text style={styles.sidebarTitle}>Dhan-Sarthi (धन-सारथि)</Text>
          <Text style={styles.sidebarSubtitle}>
            Unified Multi-Asset Investing & Financial Awareness Super-App for Retail Investors
          </Text>

          {/* Feature Highlights Pills */}
          <View style={styles.featuresContainer}>
            <View style={styles.featurePill}>
              <CheckCircle2 size={13} color="#22c55e" />
              <Text style={styles.featurePillText}>Dhan Darpan (Unified Portfolio)</Text>
            </View>
            <View style={styles.featurePill}>
              <CheckCircle2 size={13} color="#22c55e" />
              <Text style={styles.featurePillText}>Dhan Gyaan (AI Tutor)</Text>
            </View>
            <View style={styles.featurePill}>
              <CheckCircle2 size={13} color="#22c55e" />
              <Text style={styles.featurePillText}>Dhan Rakshak (Scam Guard)</Text>
            </View>
            <View style={styles.featurePill}>
              <CheckCircle2 size={13} color="#22c55e" />
              <Text style={styles.featurePillText}>Dhan Marg (Goal Navigator)</Text>
            </View>
          </View>

          {/* Main Action Buttons: Download APK & Scan QR Code */}
          <View style={styles.actionCard}>
            <Text style={styles.actionCardHeading}>📲 Try on Mobile Device</Text>
            <Text style={styles.actionCardDesc}>
              Download native Android APK or scan QR code to test on your phone.
            </Text>

            <View style={styles.btnRow}>
              <TouchableOpacity 
                style={styles.downloadApkBtnPrimary} 
                onPress={handleDownloadApk} 
                activeOpacity={0.85}
              >
                <Download size={18} color="#ffffff" />
                <Text style={styles.downloadApkPrimaryText}>Download APK (.apk)</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.qrCodeBtnSecondary} 
                onPress={() => setShowQrModal(true)} 
                activeOpacity={0.85}
              >
                <QrCode size={18} color="#94a3b8" />
                <Text style={styles.qrCodeSecondaryText}>Scan QR</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.apkMetaRow}>
              <Text style={styles.apkMetaText}>v1.0.0-preview</Text>
              <Text style={styles.apkMetaDot}>•</Text>
              <Text style={styles.apkMetaText}>~24.8 MB</Text>
              <Text style={styles.apkMetaDot}>•</Text>
              <Text style={styles.apkMetaText}>Android 8.0+</Text>
            </View>
          </View>

          {/* Interactive Simulator Controls */}
          <View style={styles.simulatorControlCard}>
            <Text style={styles.controlCardHeading}>⚙️ Simulator Controls</Text>
            <View style={styles.controlRow}>
              <TouchableOpacity 
                style={styles.controlBtn} 
                onPress={handleResetApp}
                activeOpacity={0.8}
              >
                <RotateCcw size={14} color="#60a5fa" />
                <Text style={styles.controlBtnText}>Restart Prototype</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.controlBtn} 
                onPress={() => {
                  setFrameStyle(prev => prev === 'pixel' ? 'galaxy' : prev === 'galaxy' ? 'minimal' : 'pixel');
                }}
                activeOpacity={0.8}
              >
                <Smartphone size={14} color="#60a5fa" />
                <Text style={styles.controlBtnText}>Frame: {frameStyle.toUpperCase()}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Right / Center Android Smartphone Simulator */}
        <View style={styles.simulatorArea}>
          {/* Side Hardware Buttons */}
          {frameStyle !== 'minimal' && (
            <>
              {/* Left Volume Buttons */}
              <View style={[styles.hardwareButtonLeft, { top: 140 }]} />
              <View style={[styles.hardwareButtonLeft, { top: 195 }]} />
              {/* Right Power Button */}
              <View style={[styles.hardwareButtonRight, { top: 160 }]} />
            </>
          )}

          {/* Smartphone Chassis Frame */}
          <View 
            style={[
              styles.phoneFrame, 
              { 
                width: phoneWidth, 
                height: phoneHeight,
                borderColor: frameStyle === 'pixel' ? '#1e293b' : frameStyle === 'galaxy' ? '#334155' : '#0f172a',
                borderRadius: frameStyle === 'minimal' ? 24 : 44,
              }
            ]}
          >
            {/* Speaker Grill */}
            <View style={styles.speakerGrill} />

            {/* Android Punch Hole Camera */}
            <View style={styles.cameraPunchHole}>
              <View style={styles.cameraInnerLens} />
            </View>

            {/* Android Dynamic Status Bar */}
            <View style={styles.androidStatusBar}>
              <Text style={styles.statusTime}>{timeStr}</Text>
              <View style={styles.statusIcons}>
                <Text style={styles.statusBadgeText}>5G</Text>
                <Text style={styles.statusIconText}>📶</Text>
                <Text style={styles.statusIconText}>⚡ 98%</Text>
              </View>
            </View>

            {/* Live Interactive App Screen Container */}
            <View style={styles.appContainer}>
              {children}
            </View>

            {/* Diagonal Screen Reflection Glare Overlay */}
            <View style={styles.glassGlareOverlay} pointerEvents="none" />

            {/* Android Bottom Navigation Gesture Bar */}
            <View style={styles.androidBottomBar}>
              <View style={styles.gesturePill} />
            </View>
          </View>
        </View>
      </View>

      {/* QR Code Modal Dialog */}
      <Modal
        visible={showQrModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowQrModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.qrModalCard}>
            <TouchableOpacity 
              style={styles.modalCloseBtn} 
              onPress={() => setShowQrModal(false)}
            >
              <X size={20} color="#94a3b8" />
            </TouchableOpacity>

            <Text style={styles.modalTitle}>📱 Scan QR Code to Open / Install</Text>
            <Text style={styles.modalSub}>
              Point your phone camera to open live mobile view or download APK on your mobile device.
            </Text>

            <View style={styles.qrImageContainer}>
              <Image 
                source={{ uri: qrUrl }} 
                style={{ width: 200, height: 200, borderRadius: 8 }} 
              />
            </View>

            <TouchableOpacity 
              style={styles.modalDownloadBtn} 
              onPress={handleDownloadApk}
            >
              <Download size={16} color="#ffffff" />
              <Text style={styles.modalDownloadText}>Direct Download APK File</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <WebContainer>
        <NavigationContainer ref={navigationRef}>
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
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  desktopContentWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: 1200,
    width: '100%',
    gap: 40,
  },
  sidebarPanel: {
    flex: 1,
    maxWidth: 480,
    paddingRight: 10,
  },
  sebiBadgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(37, 99, 235, 0.15)',
    borderColor: 'rgba(96, 165, 250, 0.3)',
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  sebiBadgeText: {
    color: '#60a5fa',
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  sidebarTitle: {
    color: '#ffffff',
    fontSize: 32,
    fontWeight: 'bold',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  sidebarSubtitle: {
    color: '#94a3b8',
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 20,
  },
  featuresContainer: {
    gap: 8,
    marginBottom: 24,
  },
  featurePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    borderColor: '#1e293b',
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  featurePillText: {
    color: '#e2e8f0',
    fontSize: 13,
    fontWeight: '500',
  },
  actionCard: {
    backgroundColor: '#0f172a',
    borderColor: '#1e293b',
    borderWidth: 1,
    borderRadius: 16,
    padding: 18,
    marginBottom: 18,
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
  },
  actionCardHeading: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  actionCardDesc: {
    color: '#64748b',
    fontSize: 12,
    marginBottom: 14,
  },
  btnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  downloadApkBtnPrimary: {
    flex: 1,
    backgroundColor: '#16a34a',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  downloadApkPrimaryText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: 'bold',
  },
  qrCodeBtnSecondary: {
    backgroundColor: '#1e293b',
    borderColor: '#334155',
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  qrCodeSecondaryText: {
    color: '#e2e8f0',
    fontSize: 13,
    fontWeight: '600',
  },
  apkMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  apkMetaText: {
    color: '#64748b',
    fontSize: 11,
  },
  apkMetaDot: {
    color: '#334155',
    fontSize: 12,
  },
  simulatorControlCard: {
    backgroundColor: 'rgba(15, 23, 42, 0.4)',
    borderColor: '#1e293b',
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
  },
  controlCardHeading: {
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  controlRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  controlBtn: {
    flex: 1,
    backgroundColor: '#1e293b',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    borderRadius: 8,
  },
  controlBtnText: {
    color: '#cbd5e1',
    fontSize: 12,
    fontWeight: '500',
  },
  simulatorArea: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  hardwareButtonLeft: {
    position: 'absolute',
    left: -6,
    width: 6,
    height: 40,
    backgroundColor: '#334155',
    borderTopLeftRadius: 3,
    borderBottomLeftRadius: 3,
    zIndex: 10,
  },
  hardwareButtonRight: {
    position: 'absolute',
    right: -6,
    width: 6,
    height: 55,
    backgroundColor: '#334155',
    borderTopRightRadius: 3,
    borderBottomRightRadius: 3,
    zIndex: 10,
  },
  phoneFrame: {
    backgroundColor: '#ffffff',
    borderWidth: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 25 },
    shadowOpacity: 0.7,
    shadowRadius: 40,
    elevation: 35,
    position: 'relative',
  },
  speakerGrill: {
    width: 50,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#334155',
    position: 'absolute',
    top: 6,
    alignSelf: 'center',
    zIndex: 9999,
  },
  cameraPunchHole: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#070a12',
    position: 'absolute',
    top: 12,
    alignSelf: 'center',
    zIndex: 9999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraInnerLens: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#1b2a4a',
  },
  androidStatusBar: {
    height: 34,
    backgroundColor: '#1b3a6b',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingTop: 4,
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
  statusBadgeText: {
    color: '#60a5fa',
    fontSize: 9,
    fontWeight: 'bold',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 3,
  },
  statusIconText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '600',
  },
  appContainer: {
    flex: 1,
    width: '100%',
    overflow: 'hidden',
  },
  glassGlareOverlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: '100%',
    height: '45%',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    transform: [{ rotate: '-25deg' }, { translateY: -100 }, { translateX: 50 }],
  },
  androidBottomBar: {
    height: 18,
    backgroundColor: '#0f172a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gesturePill: {
    width: 130,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#475569',
  },
  mobileTopBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1b3a6b',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  mobileTopBarLeft: {
    flex: 1,
  },
  mobileTopBarTitle: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  mobileTopBarSub: {
    color: '#93c5fd',
    fontSize: 11,
  },
  mobileDownloadBtn: {
    backgroundColor: '#16a34a',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  mobileDownloadText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  qrModalCard: {
    backgroundColor: '#0f172a',
    borderColor: '#1e293b',
    borderWidth: 1,
    borderRadius: 20,
    padding: 24,
    maxWidth: 380,
    width: '100%',
    alignItems: 'center',
    position: 'relative',
  },
  modalCloseBtn: {
    position: 'absolute',
    top: 16,
    right: 16,
    padding: 4,
  },
  modalTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 6,
    textAlign: 'center',
  },
  modalSub: {
    color: '#94a3b8',
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 18,
  },
  qrImageContainer: {
    backgroundColor: '#ffffff',
    padding: 12,
    borderRadius: 12,
    marginBottom: 20,
  },
  modalDownloadBtn: {
    backgroundColor: '#16a34a',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    width: '100%',
    paddingVertical: 12,
    borderRadius: 10,
  },
  modalDownloadText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: 'bold',
  },
});
