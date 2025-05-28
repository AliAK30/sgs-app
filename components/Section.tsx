import { View, Text } from "@/components/Themed";
import { StyleSheet, } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { height } from "../app/_layout";
import { Pressable } from "react-native";
import { useRouter } from "expo-router";
import { useSurveyStore } from "@/hooks/useStore";

type Props = {
  section: number;
  gradient1: string;
  gradient2: string;
  questionsCompleted: number;
};

export default function Section({
  section,
  gradient1,
  gradient2,
  questionsCompleted,
}: Props) {

  const router = useRouter();
  const setSelectedSection = useSurveyStore(state=>state.setSelectedSection) 

  const onPress = () => {
    setSelectedSection(section);
    //router.navigate("/(student)/survey");
  }
  

  return (
    
    <Pressable style={styles.container} onPress={onPress}>
    <LinearGradient
      // Background Linear Gradient
      style={styles.background}
      colors={[gradient1, gradient2]}
      locations={[0, 1]}
      start={{ x: -0.40, y: 0 }}
    />
        <View style={{width: "90%", paddingBottom: height*0.01223, }}>
      <Text style={styles.heading}>
        Section {section}
      </Text>
      <View style={styles.progressContainer}>
        <View style={[styles.progress, {width: `${questionsCompleted/11*100}%`}]}></View>
      </View>
      <View
        style={[
          styles.count,
          {
            backgroundColor:
              questionsCompleted === 11 ? "#53F396" : "rgba(255, 255, 255, 0.5)",
          },
        ]}
      >
        <Text
          style={{ fontFamily: "Inter_500Medium", fontSize: height * 0.01468 }}
        >
          {questionsCompleted < 10 && "0"}
          {questionsCompleted}/11
        </Text>
      </View>
      </View>
    
    </Pressable>
    
  );
}


const styles = StyleSheet.create({
  container: {
    marginVertical: height*0.0122,
    alignItems: "center",
    boxShadow: "0px 20px 25px 0px rgba(28, 28, 34, 0.15)",
    borderRadius: 20,
  },

  background: {
    height: "100%",
    width: "100%",
    position: "absolute",
    borderRadius: 20,
  },

  heading: {
    fontFamily: "Poppins_600SemiBold",
    color: "#4D3E3E",
    letterSpacing: -0.3,
    marginVertical: height*0.0146,
    alignSelf: "center",
    fontSize: height * 0.0196,
  },

  progressContainer: {
    marginBottom: height*0.0183,
    borderRadius: 31,
    backgroundColor: "white",
  },

  progress: {
    backgroundColor: "#71E9AF",
    height: height*0.0048,
    borderRadius: 31,
  },

  count: {
    alignSelf: "flex-end",
    borderRadius: 29,
    paddingVertical: height*0.0036,
    paddingHorizontal: height*0.0257,
  },
});


/* Section_Figma */

// linear-gradient(126.68deg, rgba(221, 246, 255, 0.8) -31.48%, rgba(234, 255, 239, 0.8) 95.46%);
//linear-gradient(126.68deg, rgba(255, 242, 219, 0.8) -31.48%, rgba(255, 219, 247, 0.8) 95.46%);

//linear-gradient(126.68deg, rgba(221, 254, 255, 0.8) -31.48%, rgba(255, 234, 234, 0.8) 95.46%);

//linear-gradient(126.68deg, rgba(255, 251, 221, 0.8) -31.48%, rgba(255, 219, 219, 0.8) 95.46%);