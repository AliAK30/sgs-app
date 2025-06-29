import {
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

import { loadAsync } from "expo-font";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Slot } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { View } from "@/components/Themed";
import UnsafeArea from "@/components/UnsafeArea";
import { StyleSheet, Dimensions, Platform } from "react-native";
import { useUserStore, useSurveyStore } from "@/hooks/useStore";
import { useState, useEffect } from "react";
import { SystemBars } from "react-native-edge-to-edge";
import Loader from "@/components/Loader";

const dims = Dimensions.get("window");

export const height = dims.height;
export const width = dims.width > 480 ? 480 : dims.width;
export const fontScale = dims.fontScale;
export const scale = dims.scale;
export const base_height = 817;
export const base_width = 412;
export const { OS } = Platform;
//export const height = dims.width>dims.height?dims.width:dims.height
//export const width = dims.width>dims.height?dims.height:dims.width
export const h = height / base_height;
export const w = width / base_width;

if (OS === "web") require("@/assets/global.css");

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

  const [ready, setReady] = useState<boolean>(false);

  const { initializeUser, setUser, setToken } = useUserStore();

  const { setSectionsCount } = useSurveyStore();

  useEffect(() => {

    const initialize = async () => {
      //check if user is stored in local storage
      const newUser = await AsyncStorage.getItem("user");
      if (newUser && newUser !== "null") {
        //if yes then check if user is logged in
        const tok = await AsyncStorage.getItem("token");
        if (tok) {
          //if yes initialize the rest of the app
          await initializeUser(JSON.parse(newUser), tok);
          setSectionsCount();
        } else {
          //if user is not logged in then only set user
          setUser(JSON.parse(newUser));
        }
      }
    };

    console.log("layout rerendered")

    const load = async () => {
      try {
        await Promise.all([
          loadAsync({
            Inter_400Regular,
            Inter_600SemiBold,
            Poppins_700Bold,
            Poppins_600SemiBold,
            Poppins_400Regular,
            Inter_500Medium,
            Inter_700Bold,
          }),
          initialize()
        ]);
      } catch (e:any) {
        console.error(e);
      } finally {
        setReady(true);
        SplashScreen.hideAsync();
      }
    };
    load();
    

    return () => {
      setUser(null);
      setToken(null);
    };
  }, []);

  if (!ready) return <Loader color="blue" size="large" />;

  return (
    <View style={styles.container}>
      <UnsafeArea />
      <Slot />
      <SystemBars style={{ statusBar: "dark", navigationBar: "dark" }} />
      <UnsafeArea bottom={true} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    width: width,
    alignSelf: "center",
  },
});
