import { View, Text } from "@/components/Themed";
import { Pressable, StyleSheet, useWindowDimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

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
  const { height, width } = useWindowDimensions();

  return (
    <LinearGradient
      // Background Linear Gradient
      style={styles.container}
      colors={[gradient1, gradient2]}
      locations={[0, 1]}
      start={{ x: -0.40, y: 0 }}
    >
        <View style={{width: "90%", paddingBottom: "3%", }}>
      <Text style={[styles.heading, { fontSize: height * 0.020 }]}>
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
          style={{ fontFamily: "Inter_500Medium", fontSize: height * 0.016 }}
        >
          {questionsCompleted < 10 && "0"}
          {questionsCompleted}/11
        </Text>
      </View>
      </View>
    </LinearGradient>
  );
}


const bsObj = {
    offsetX: 0,
    offsetY: 20,
    blurRadius: 25,
    spread: 0,
    color: "rgba(28, 28, 34, 0.15)",
    inset: false,
};

const styles = StyleSheet.create({
  container: {
    marginVertical: "3%",
    borderRadius: 20,
    alignItems: "center",
    boxShadow:[bsObj]
  },

  heading: {
    fontFamily: "Poppins_600SemiBold",
    color: "#4D3E3E",
    letterSpacing: -0.3,
    marginVertical: "4%",
    alignSelf: "center",
  },

  progressContainer: {
    marginBottom: "5%",
    borderRadius: 31,
    backgroundColor: "white",
  },

  progress: {
    backgroundColor: "#71E9AF",
    height: 4,
    borderRadius: 31,
  },

  count: {
    alignSelf: "flex-end",
    borderRadius: 29,
    paddingVertical: "1%",
    paddingHorizontal: "7%",
  },
});


/* Section_Figma */

// linear-gradient(126.68deg, rgba(221, 246, 255, 0.8) -31.48%, rgba(234, 255, 239, 0.8) 95.46%);
//linear-gradient(126.68deg, rgba(255, 242, 219, 0.8) -31.48%, rgba(255, 219, 247, 0.8) 95.46%);

//linear-gradient(126.68deg, rgba(221, 254, 255, 0.8) -31.48%, rgba(255, 234, 234, 0.8) 95.46%);

//linear-gradient(126.68deg, rgba(255, 251, 221, 0.8) -31.48%, rgba(255, 219, 219, 0.8) 95.46%);