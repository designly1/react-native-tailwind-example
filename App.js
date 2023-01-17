import React, { useEffect, useState, useCallback } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Text, View, SafeAreaView, Linking } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';
import { Georama_400Regular } from '@expo-google-fonts/georama';

/* Prevent splash screen from hiding automatically */

SplashScreen.preventAutoHideAsync();

export default function App() {
  // Initialize state for app readiness
  const [appIsReady, setAppIsReady] = useState(false);

  // Show splash screen while we load Google Fonts
  useEffect(() => {
    async function prepare() {
      try {
        await SplashScreen.preventAutoHideAsync();
        await Font.loadAsync({ Georama_400Regular });
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  // Create a callback for when our font is done loading
  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  // return null until app is ready
  if (!appIsReady) {
    return null;
  }

  return (
    <SafeAreaView onLayout={onLayoutRootView}>
      <View className={`py-10 px-5 bg-slate-600`}>
        <Text className={`font-geo text-lg text-white`}>This text is in Google's Georama Regular 400 font!</Text>
      </View>
      <View className={`py-10 px-5 bg-indigo-800`}>
        <Text className="font-geo text-lg text-white">
          For more great information, please read the {' '}
          <Text className={`text-yellow-300`} onPress={() => Linking.openURL('https://designly.biz/blog')}>Designly Blog</Text>!
        </Text>
      </View>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}