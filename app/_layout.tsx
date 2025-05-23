import {
  useFonts,
  Inter_400Regular,
  Inter_600SemiBold,
  Inter_500Medium,
  Inter_700Bold,
} from "@expo-google-fonts/inter";

import {
  Poppins_700Bold,
  Poppins_600SemiBold,
  Poppins_400Regular,
} from "@expo-google-fonts/poppins";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Slot } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
//import "react-native-reanimated";
import { View } from "@/components/Themed";
import UnsafeArea from "@/components/UnsafeArea";
import { StyleSheet, Dimensions, Platform } from "react-native";
import { StatusBar,  } from "expo-status-bar";
import Loader from "@/components/Loader";
import { useUserStore, useSurveyStore } from "@/hooks/useStore";
import * as NavigationBar from "expo-navigation-bar"



const dims = Dimensions.get("window");
export const height = dims.height;
export const width = dims.width>480 ? 480 : dims.width
export const fontScale = dims.fontScale;
export const scale = dims.scale
export const base_height = 817
export const base_width = 412
export const {OS} = Platform
//export const height = dims.width>dims.height?dims.width:dims.height
//export const width = dims.width>dims.height?dims.height:dims.width
export const h = height/base_height;
export const w = width/base_width;



/* if(width>height){
  let temp = height;
  height = width;
  width = temp;
}

export {width, height}; */

// Expo Router uses Error Boundaries to catch errors in the navigation tree.
export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "index",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
OS !== 'web' && SplashScreen.preventAutoHideAsync();
//Hide navigation bar on android
OS==='android' && NavigationBar.setBehaviorAsync('overlay-swipe');

export default function RootLayout() {

  const visibility = NavigationBar.useVisibility();
  
  const [loaded, error] = useFonts({
    Inter_400Regular,
    Inter_600SemiBold,
    Poppins_700Bold,
    Poppins_600SemiBold,
    Poppins_400Regular,
    Inter_500Medium,
    Inter_700Bold,
  });

  const [isUserLoaded, setIsUserLoaded] = useState<boolean>(false)

  const {
    initializeUser,
    setUser,
    setToken
  } = useUserStore();

  const {setSectionsCount} = useSurveyStore();

  //we will pass this as a prop on the choose "admin" or student login screen
  //const [role, setRole] = useState<string>("");

  

  useEffect(() => {
    if (OS === 'android') {
    if (visibility === 'visible') {
      setTimeout(() => {
        NavigationBar.setVisibilityAsync('hidden');
      }, 2000);
    }
    }
  }, [visibility]);

  useEffect(() => {
    
    
    initialize();

    return () => {
      setUser(null);
      setToken(null);
    };
  }, []);

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded && isUserLoaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded, isUserLoaded]);

  const initialize = async () => {
    
    try {
      const newUser = await AsyncStorage.getItem("user");
      if (newUser) {
        
        const tok = await AsyncStorage.getItem("token");
        await initializeUser(JSON.parse(newUser), tok ? tok : "");
        setSectionsCount();
      } else {
        setUser({role: 'student'});
      }
    } catch (e: any) {
      console.log(e.message);
    } finally {
      setIsUserLoaded(true);
    }
  };

  if (!loaded || !isUserLoaded) {
    return <Loader size="large" color="blue" />;
  }

  return (
    <View style={styles.container}>
      <UnsafeArea />
      <Slot />
      <StatusBar style={"dark"} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    width: width,
    alignSelf: 'center',
  },
});
