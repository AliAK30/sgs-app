import { Text, View } from "@/components/Themed";
import { Pressable, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "@expo/vector-icons/Ionicons";
import Section from "@/components/Section";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { height } from "./_layout";
import { useEffect } from "react";
import { useSurveyStore } from "@/hooks/useStore";

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
  } = useSurveyStore(state => state);

  //section1/2/3/4 keys in localstorage tracks the number of questions user has answered in each section

  const initializeQuestionsCount = async (key: string) => {
    try {
      const result: string | null = await AsyncStorage.getItem(key);
      if (result) {
        if (key === "section1") setSection1Count(Number(result));
        else if (key === "section2") setSection2Count(Number(result));
        else if (key === "section3") setSection3Count(Number(result));
        else if (key === "section4") setSection4Count(Number(result));
      }
      return;
    } catch (e: any) {
      console.log(e.message);
    }
  };

  useEffect(() => {
    initializeQuestionsCount("section1");
    initializeQuestionsCount("section2");
    initializeQuestionsCount("section3");
    initializeQuestionsCount("section4");
  }, []);

  return (
    <LinearGradient
      // Background Linear Gradient
      colors={["#ADD8E6", "#EAF5F8"]}
      locations={[0.27, 1]}
      style={styles.container}
    >
      <Pressable style={styles.close}>
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
});
