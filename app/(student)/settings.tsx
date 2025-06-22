import { View, Text } from "@/components/Themed";
import { StyleSheet, Pressable } from "react-native";
import  Feather  from "@expo/vector-icons/Feather";
import {h, w} from "@/app/_layout"
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useUserStore, useSurveyStore } from "@/hooks/useStore";
import { useRouter } from "expo-router";
import { useNetInfo } from "@react-native-community/netinfo";
import { useAlert } from "@/hooks/useAlert";
import * as Haptics from '@/components/Haptics';


export default function Settings() {

  const {resetUserState} = useUserStore();
  const {reset} = useSurveyStore();
  const router = useRouter();
  const {isConnected} = useNetInfo();
  const {Alert, openAlert} = useAlert();

  const logout = async () => {
      try {
          if(isConnected)
          {
              await AsyncStorage.multiRemove(["user", "token", "answers"])
              router.replace("/login")
              reset();
              resetUserState();
          } else {
            openAlert("fail", "Failed!", "No Internet Connection!");
          }
          
      } catch (e: any) {
        console.log(e);
      } 
      
    }

    return (
      <View style={{ flex: 1, backgroundColor: "white" }}>
        
        
        <View style={styles.container}>
          <Alert/>
          <Text style={styles.title}>Settings</Text>
          <Pressable style={styles.button} onPress={
                          () => {
                              Haptics.triggerHaptic('impact-2');
                              router.push("/about");
                          }
                      }><Feather name="help-circle" size={styles.text.fontSize} color={styles.text.color}/>
          <Text style={styles.text}>About Project</Text></Pressable>
          <Pressable style={styles.button} onPress={logout}><Feather name="log-out" size={styles.signoutText.fontSize} color={styles.signoutText.color}/>
          <Text style={styles.signoutText}>Sign Out</Text></Pressable>
        </View>
      </View>
    )
}


const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F5F7FA",
    borderRadius: 24,
    flex:1,
    width: '92%',
    alignSelf: 'center',
    paddingTop:h*13,
    paddingHorizontal: w*13,
  },
  title: {
      fontFamily: "Poppins_600SemiBold",
      color: "#565555",
      fontSize: h * 12.5+w*12.5,
      textAlign: 'center',
      marginBottom: h*15,
    },

    button: {
      backgroundColor: '#ffffff',
      boxShadow: "0px 30px 40px 0px rgba(0, 0, 0, 0.15)",
      borderRadius: 16,
      paddingHorizontal: w*15,
      paddingVertical: h*10,
      marginTop: h*10,
      flexDirection:'row',
      columnGap:w*7,
      alignItems:'center',
    },
    text: {
      fontFamily: 'Inter_500Medium',
      fontSize: 8*h+8*w,
      color: '#565555'
    },
    signoutText: {
      fontFamily: 'Inter_500Medium',
      fontSize: 8*h+8*w,
      color: '#B3261E'
    }
});