import FontAwesome from '@expo/vector-icons/FontAwesome';
import {
  useFonts,
  Inter_400Regular,
  Inter_600SemiBold
} from "@expo-google-fonts/inter";

import {
Poppins_700Bold
} from "@expo-google-fonts/poppins"
import { Slot } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { View} from '@/components/Themed';
import UnsafeArea  from '@/components/UnsafeArea'
import { StyleSheet, Platform} from 'react-native';
import { StatusBar } from 'expo-status-bar';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {

  const [loaded, error] = useFonts({
    Inter_400Regular, Inter_600SemiBold, Poppins_700Bold
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
      
        <View style={styles.container}>
          <UnsafeArea/>
            <Slot/>
            
            <StatusBar style={'dark'} />
            
        </View>
      
  );
}


const styles = StyleSheet.create({
  container: {
      flex: 1,
      backgroundColor: '#FFFFFF',
      alignItems: 'center',
  },
})


