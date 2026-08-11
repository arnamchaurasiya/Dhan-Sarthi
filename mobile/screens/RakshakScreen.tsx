import React from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import RakshakNavigator from './rakshak/RakshakNavigator';

export default function RakshakScreen() {
  return (
    <SafeAreaView style={styles.safeArea} edges={['left', 'right']}>
      <StatusBar barStyle="light-content" backgroundColor="#1b3a6b" />
      <View style={styles.container}>
        <RakshakNavigator />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#1b3a6b',
  },
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
});
