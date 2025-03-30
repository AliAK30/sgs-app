import { View, Text } from "@/components/Themed";
import { StyleSheet, Pressable } from "react-native";
import { height } from "@/app/_layout";
import { FontAwesome6 } from "@expo/vector-icons";
import details from "@/constants/Details";
import { Label } from "./LearningStyle";

type Props = {
  score: number;
  dimension: Label;
  goBack: () => void;
};

export default function DimensionInfo({ score, dimension, goBack }: Props) {
  return (
    <View>
      <View style={styles.header}>
        
        <Text style={styles.heading}>{dimension} Learner</Text>
        <Pressable onPress={goBack} style={styles.button} hitSlop={6}>
          <FontAwesome6
            name="arrow-left"
            color="#333F50"
            size={height * 0.02937}
          />
        </Pressable>
      </View>
      <Text style={[styles.mainTexts1, { textAlign: "center", marginTop: height*0.009 }]}>
        {score} / 11
      </Text>

      <View style={styles.info}>

      {details[dimension].text.map((each, index) => (
        <View style={{ flexDirection: "row" }} key={index}>
            <Text style={[styles.mainTexts1,styles.bullet]}>
                {"\u2022"}
            </Text>
          <Text
            style={styles.mainTexts1}
          >{each}</Text>
        </View>
      ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    //justifyContent: "flex-start"
  },

  button: {
    marginLeft: height * 0.025,
  },

  /* score: {
    fontFamily: "Inter_400Regular",
    fontSize: height * 0.02447,
    color: "#333F50",
    textAlign: "center",
  }, */

  info:{
    paddingTop: height*0.027,
    paddingHorizontal: height*0.021,
    rowGap: height*0.03,
  },

  mainTexts1: {
    fontFamily: "Inter_400Regular",
    fontSize: height * 0.01958,
    color: "#333F50",
  },

  bullet: {
    fontSize: height * 0.022,
    paddingRight: height*0.007
  },

  heading: {
    fontFamily: "Inter_600SemiBold",
    fontSize: height * 0.02447,
    color: "#333F50",
    textAlign: "center",
    position:"absolute",
    width: "100%",
    //borderWidth: 1,
    //paddingBottom: height * 0.009,
  },
});
