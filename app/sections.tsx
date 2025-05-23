import { Text, View } from "@/components/Themed";
import { Pressable, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "@expo/vector-icons/Ionicons";
import Section from "@/components/Section";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { height } from "./_layout";
import { useSurveyStore } from "@/hooks/useStore";
import useAnswers from "@/hooks/useAnswers";
import { useUserStore } from "@/hooks/useStore";
import { Redirect, useRouter } from "expo-router";
import { useNetInfo } from "@react-native-community/netinfo";
import axios from "axios";
import { url } from "@/constants/Server";
import { useAlert } from "@/hooks/useAlert";
import useSection from "@/hooks/useSection";

/* const getAnswers = async () => {
  try {
    let tempAnswers = await AsyncStorage.getItem("answers");
    if (tempAnswers) {
      return JSON.parse(tempAnswers);
    }
    else
    {
      return 
    }
  } catch (e: any) {
    return e.message;
  } 
}; */

export default function Sections() {
  
  const {reset} = useSurveyStore();
  const {section} = useSection();
  const { answers } = useAnswers();
  const {isConnected} = useNetInfo();
  const { openAlert, Alert } = useAlert();
  const {resetUserState, user, token, setUser} =  useUserStore();
  const router = useRouter();


  

  const logout = async () => {
    try {
      if (isConnected) {
        if(!user?.isSurveyCompleted)
        await axios.patch(`${url}/student/update/questions`, {answers: answers.current, isSurveyCompleted: false}, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          timeout: 1000 * 15,
        });
        
        
        await AsyncStorage.multiRemove(["user", "token", "answers"])
        reset();
        resetUserState();
        setUser({role: 'student'});
        router.replace("/login");


      } else {
        openAlert("fail", "Failed!", "No Internet Connection!");
        return;
      }
    } catch (e: any) {
      if (!e.status) {
        switch (e.code) {
          case "ECONNABORTED":
            openAlert("fail", "Failed!", "Request TImed out\nPlease try again later!");
            return;

          case "ERR_NETWORK":
            openAlert(
              "fail",
              "Failed!",
              "Server is not Responding\nPlease try again later!"
            );
            return;
        }
      }

      if (e.status === 400) {
        switch (e.response.data.code) {

          case "VALIDATION_ERROR":
            openAlert("fail", "Failed!", e.response.data.message);
            return;

          case "RESUBMISSION":
            openAlert("info", "Already Submitted!", e.response.data.message);
            return;
        }
      }

      if(e.status === 429)
      {
        openAlert("fail", "Error", e.response.data.message);
      }

      if (e.status === 500) {
        openAlert("fail", "Failed!", e.message);
        return;
      }
    } 
    
  }


  if(!token) return <Redirect href="/login"/>
  
  return (
    <LinearGradient
      // Background Linear Gradient
      colors={["#ADD8E6", "#EAF5F8"]}
      locations={[0.27, 1]}
      style={styles.container}
    >
      <Alert/>
      <Pressable style={styles.close} onPress={logout}>
        <Text style={styles.paragraph}>Logout</Text>
      </Pressable>

      <View style={styles.main}>
        <Text style={styles.heading}>Questions</Text>
        <Text style={styles.paragraph}>
          Answer these questions to discover your learning styles
        </Text>
        <View style={{ marginTop: "5%" }}>
          <Section
            section={1}
            gradient1="rgba(221, 246, 255, 0.8)"
            gradient2="rgba(234, 255, 239, 0.8)"
            questionsCompleted={section.one}
          />

          <Section
            section={2}
            gradient1="rgba(255, 242, 219, 0.8)"
            gradient2="rgba(255, 219, 247, 0.8)"
            questionsCompleted={section.two}
          />
          <Section
            section={3}
            gradient1="rgba(221, 254, 255, 0.8)"
            gradient2="rgba(255, 234, 234, 0.8)"
            questionsCompleted={section.three}
          />
          <Section
            section={4}
            gradient1="rgba(255, 251, 221, 0.8)"
            gradient2="rgba(255, 219, 219, 0.8)"
            questionsCompleted={section.four}
          />
        </View>
        {user?.isSurveyCompleted && <Pressable
                  style={[
                    styles.button,
                    { backgroundColor: "#007BFF" },
                  ]}
                  onPress={()=>router.replace("/statistics")}
                >
              
                    <Text
                      style={{
                        fontFamily: "Inter_600SemiBold",
                        color: "#ffffff",
                        fontSize: height * 0.0196,
                        textAlign: "center",
                      }}
                    >MY LEARNING STYLE</Text>
                </Pressable> }
        
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "92%",
    borderRadius: 24,
    backgroundColor: "rgba(173, 216, 230, 0.25)",
    paddingHorizontal: height * 0.024,
    alignSelf:'center'
  },

  close: {
    borderRadius: 10,
    borderColor: "#565555",
    borderWidth: 1,
    marginVertical: height * 0.0257,
    alignSelf: "flex-start",
    padding: height *0.01
  },

  main: {
    paddingLeft: height * 0.00734,
  },

  heading: {
    fontFamily: "Poppins_700Bold",
    color: "#565555",
    fontSize: height * 0.0367,
  },

  paragraph: {
    color: "rgba(0, 0 ,0, 0.7)",
    fontFamily: "Inter_400Regular",
    fontSize: height * 0.0196,
  },
    button: {
    marginBottom: height * 0.019,
    boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
    borderRadius: 10,
    paddingVertical: height * 0.0208,
    marginTop: height * 0.04161,
  },
});

