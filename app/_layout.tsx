import {
  useFonts,
  Inter_400Regular,
  Inter_600SemiBold,
  Inter_500Medium,
} from "@expo-google-fonts/inter";

import {
  Poppins_700Bold,
  Poppins_600SemiBold,
  Poppins_400Regular
} from "@expo-google-fonts/poppins";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Slot, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useRef, useState } from "react";
import "react-native-reanimated";
import { View } from "@/components/Themed";
import UnsafeArea from "@/components/UnsafeArea";
import { StyleSheet, Dimensions } from "react-native";
import { StatusBar } from "expo-status-bar";
import { UserContext, User } from "@/contexts/UserContext";
import Loader from "@/components/Loader";

export const { width, height } = Dimensions.get("screen");

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

  const [user, setUser] = useState<User | null>(null);
  const [done, setDone] = useState<boolean>(false);
  const router = useRouter();

  //we will pass this as a prop on the choose "admin" or student login screen
  //const [role, setRole] = useState<string>("");
  const token = useRef<string | null>(null);
  useEffect(() => {
    initialize();

    return () => {
      setUser(null);
      token.current = null;
    };
  }, []);

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded && done) {
      SplashScreen.hideAsync();
    }
  }, [loaded, done]);

  const initialize = async () => {
    try {
      const newUser = await AsyncStorage.getItem("user");
      if (newUser) {
        token.current = await AsyncStorage.getItem("token");
        setUser(JSON.parse(newUser));
      }
    } catch (e: any) {
      console.log(e.message);
    } finally {
      setDone(true);
    }
  };

  const setUserAndToken = async (userToSet: User, tokenToSet: string) => {
    await AsyncStorage.setItem("user", JSON.stringify(userToSet));
    await AsyncStorage.setItem("token", tokenToSet);
    setUser(userToSet);
    token.current = tokenToSet;
  };

  const clear = () => {
    token.current = null;
    setUser(null);
    router.replace("/login");
  }

  if (!loaded || !done) {
    return <Loader size="large" color="blue" />;
  }

  return (
    <UserContext.Provider
      value={{
        user,
        token,
        done,
        setUserAndToken,
        clear,
      }}
    >
      <View style={styles.container}>
        <UnsafeArea />
        <Slot />
        <StatusBar style={"dark"} />
      </View>
    </UserContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
  },
});
