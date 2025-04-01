import {
  useFonts,
  Inter_400Regular,
  Inter_600SemiBold,
  Inter_500Medium,
} from "@expo-google-fonts/inter";

import {
  Poppins_700Bold,
  Poppins_600SemiBold,
  Poppins_400Regular,
} from "@expo-google-fonts/poppins";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Slot } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";
import { View } from "@/components/Themed";
import UnsafeArea from "@/components/UnsafeArea";
import { StyleSheet, Dimensions } from "react-native";
import { StatusBar } from "expo-status-bar";
import Loader from "@/components/Loader";
import { useUserStore } from "@/hooks/useStore";

export const { width, height } = Dimensions.get("screen");
export const base_height = 817
export const base_width = 412

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
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    Inter_400Regular,
    Inter_600SemiBold,
    Poppins_700Bold,
    Poppins_600SemiBold,
    Poppins_400Regular,
    Inter_500Medium,
  });

  const {
    isUserLoaded,
    setUser,
    setToken,
    setIsUserLoaded,
  } = useUserStore();

  //we will pass this as a prop on the choose "admin" or student login screen
  //const [role, setRole] = useState<string>("");

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
        setToken(await AsyncStorage.getItem("token"));
        setUser(JSON.parse(newUser));
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
    alignItems: "center",
  },
});
