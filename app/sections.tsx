import { Text, View } from "@/components/Themed";
import { Pressable, StyleSheet, useWindowDimensions } from "react-native";
import { Link } from "expo-router";
import { useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { questions } from "@/constants/Questions";
import Ionicons from "@expo/vector-icons/Ionicons";
import Section from "@/components/Section";

export default function Sections() {
  const { height, width } = useWindowDimensions();

  return (
    <LinearGradient
      // Background Linear Gradient
      colors={["#ADD8E6", "#EAF5F8"]}
      locations={[0.27, 1]}
      style={[
        styles.container,
        { width: width < 480 ? 0.92 * width : 0.5 * width },
      ]}
    >
      <Link href="/" asChild>
        <Pressable style={styles.close}>
          <Ionicons
            name="close-outline"
            size={height * 0.036}
            color="#565555"
          />
        </Pressable>
      </Link>
      <View style={styles.main}>
      <Text style={[styles.heading, { fontSize: height * 0.040 }]}>
        Questions
      </Text>
      <Text style={[styles.paragraph, { fontSize: height * 0.020 }]}>
        Answer these questions to discover your learning styles
      </Text>
      <View style={{marginTop:"5%"}}>
      <Section section={1} gradient1="rgba(221, 246, 255, 0.8)" gradient2="rgba(234, 255, 239, 0.8)" questionsCompleted={3}/>
      <Section section={2} gradient1="rgba(255, 242, 219, 0.8)" gradient2="rgba(255, 219, 247, 0.8)" questionsCompleted={5}/>
      <Section section={3} gradient1="rgba(221, 254, 255, 0.8)" gradient2="rgba(255, 234, 234, 0.8)" questionsCompleted={1}/>
      <Section section={4} gradient1="rgba(255, 251, 221, 0.8)" gradient2="rgba(255, 219, 219, 0.8)" questionsCompleted={11}/>
      </View>
      </View>
    </LinearGradient>

    /* Section_Figma */

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginVertical: "3%",
    borderRadius: 24,
    backgroundColor: "rgba(173, 216, 230, 0.25)",
    paddingHorizontal: "4%",
  },

  close: {
    borderRadius: 10,
    borderColor: "#565555",
    borderWidth: 1,
    marginTop: "6%",
    marginBottom: "6%",
    padding: 3,
    alignSelf: "flex-start",
  },

  main : {
    paddingLeft: "2%",
  },

  heading: {
    fontFamily: "Poppins_700Bold",
    color: "#565555",
  },

  

  paragraph: {
    color: "rgba(0, 0 ,0, 0.7)",
    fontFamily: "Inter_400Regular",
  },
});
