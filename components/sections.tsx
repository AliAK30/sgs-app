import { Text, View } from "@/components/Themed";
import { StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Section from "@/components/Section";
import { height, h } from "../app/_layout";
import { useAlert } from "@/hooks/useAlert";
import useSection from "@/hooks/useSection";
import { useSurveyStore } from "@/hooks/useStore";
import Survey from "./survey";
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
  
  
  const {section} = useSection();
  const { Alert } = useAlert();
  const selectedSection = useSurveyStore(state=>state.selectedSection) 
  

  if(selectedSection!==5) return <Survey/>
  
  return (
    <LinearGradient
      // Background Linear Gradient
      colors={["#ADD8E6", "#EAF5F8"]}
      locations={[0.27, 1]}
      style={styles.container}
    >
      <Alert/>
      

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
    alignSelf:'center',
    paddingVertical:h*20
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

