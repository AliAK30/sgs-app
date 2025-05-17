import { Text, View } from "@/components/Themed";
import { Pressable, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "@expo/vector-icons/Ionicons";
import Section from "@/components/Section";
import Loader from "@/components/Loader";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { height } from "./_layout";
import { useEffect, useState } from "react";
import { useSurveyStore } from "@/hooks/useStore";
import useAnswers from "@/hooks/useAnswers";
import { useUserStore } from "@/hooks/useStore";
import { useRouter } from "expo-router";
import { useNetInfo } from "@react-native-community/netinfo";
import axios from "axios";
import { url } from "@/constants/Server";
import { useAlert } from "@/hooks/useAlert";

/* const getAnswers = async () => {
  try {
    let tempAnswers = await AsyncStorage.getItem("answers");
    if (tempAnswers) {
      return JSON.parse(tempAnswers);
    }
    else
    {
      return new Array(44).fill({q: 0, answer: ''})
    }
  } catch (e: any) {
    return e.message;
  } 
}; */

export default function Sections() {
  
  const {
    section1Count,
    setSection1Count,
    section2Count,
    setSection2Count,
    section3Count,
    setSection3Count,
    section4Count,
    setSection4Count,
    selectedSection,
  } = useSurveyStore((state) => state);

  //const [loaded, setLoaded] = useState<boolean>(false)
  const { answers, getQuestionsCount } = useAnswers();
  const {isConnected} = useNetInfo();
  const { openAlert, Alert } = useAlert();
  const {clear, user, token} =  useUserStore();
  const router = useRouter();

  useEffect(() => {
    //console.log(`loaded: ${loaded}`);
    //if (loaded) {
      if(selectedSection === 1 || selectedSection == 5) setSection1Count(getQuestionsCount(1));
      if(selectedSection === 2 || selectedSection == 5) setSection2Count(getQuestionsCount(2));
      if(selectedSection === 3 || selectedSection == 5) setSection3Count(getQuestionsCount(3));
      if(selectedSection === 4 || selectedSection == 5) setSection4Count(getQuestionsCount(4));
    //}
  }, [answers.current?.length]);

/*   const initialize = async () => {
    const val = await getAnswers();
    answers.current = val;
    setLoaded(true);
  }

  useEffect(()=> {initialize()}, [])

  if (!loaded) {
    return <Loader size="large" color="blue" />;
  } */
  

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
        
        
        await AsyncStorage.multiRemove(["user", "token", "answers"], clear)
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

  
  return (
    <LinearGradient
      // Background Linear Gradient
      colors={["#ADD8E6", "#EAF5F8"]}
      locations={[0.27, 1]}
      style={styles.container}
    >
      <Alert/>
      <Pressable style={styles.close} onPress={logout}>
        <Ionicons name="close-outline" size={height * 0.034} color="#565555" />
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
            questionsCompleted={section1Count}
          />

          <Section
            section={2}
            gradient1="rgba(255, 242, 219, 0.8)"
            gradient2="rgba(255, 219, 247, 0.8)"
            questionsCompleted={section2Count}
          />
          <Section
            section={3}
            gradient1="rgba(221, 254, 255, 0.8)"
            gradient2="rgba(255, 234, 234, 0.8)"
            questionsCompleted={section3Count}
          />
          <Section
            section={4}
            gradient1="rgba(255, 251, 221, 0.8)"
            gradient2="rgba(255, 219, 219, 0.8)"
            questionsCompleted={section4Count}
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

