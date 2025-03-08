import { View, Text } from "@/components/Themed";
import { Pressable, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { questions } from "@/constants/Questions";
import { useState, useRef, useEffect } from "react";
import { Answer } from "@/app/survey";
import { height } from "@/app/_layout";
import LottieView from "lottie-react-native";
import DashedProgress from "./DashedProgress";

type Props = {
  questionNumber: number; //from 1 to 11
  section: number;
  answers: Array<Answer>;
  selectAnswer: (q: number, answer: string) => Promise<void>;
  next: (num: number) => void;
  previous: (num: number) => void;
};

const animationSource = require("@/assets/images/hand.lottie");

export default function Question({
  questionNumber,
  section,
  selectAnswer,
  next,
  previous,
}: Props) {
  const [answer, setAnswer] = useState<string>('');

  //numbering questions from 1 to 44, so total 44
  const realQuestionNumber = (section - 1) * 11 + questionNumber;
  const animationRef = useRef<LottieView>(null);

  useEffect(() => {
    animationRef.current?.play();
    animationRef.current?.play(0, 222);
  }, []);

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor:
            questions[section - 1][questionNumber - 1].gradientColorEnd,
        },
      ]}
    >
      {(questionNumber !== 8 || section!==1) && (
        <LinearGradient
          // Background Linear Gradient
          style={[styles.gradientSubContainer, {}]}
          colors={[
            questions[section - 1][questionNumber - 1].gradientColorStart,
            questions[section - 1][questionNumber - 1].gradientColorEnd,
          ]}
        >
          <LottieView
            autoPlay
            ref={animationRef}
            source={animationSource}
            style={styles.animation}
          />
        </LinearGradient>
      )}
      <View style={[styles.main]}>
        <DashedProgress totalDashes={11} focusedDash={questionNumber} />
        <View style={{ flexDirection: "row" }}>
          <Text style={styles.question}>{questionNumber}. </Text>
          <Text style={styles.question}>
            {questions[section - 1][questionNumber - 1].question}
          </Text>
        </View>
        
        <Pressable
          onPressIn={() => {
            setAnswer("a");
          }}
        >
          <Text
            style={[
              styles.options,
              {
                color: answer === "a" ? "white" : "#1f2429",
                backgroundColor:
                  answer === "a"
                    ? "rgba(31, 36, 41, 0.8)"
                    : "rgba(31, 36, 41, 0.05)",
              },
            ]}
          >
            {questions[section - 1][questionNumber - 1].a}
          </Text>
        </Pressable>
        <Pressable
          onPressIn={() => {
            setAnswer("b");
          }}

          
        >
          <Text
            style={[
              styles.options,
              {
                color: answer === "b" ? "white" : "#1f2429",
                backgroundColor:
                  answer === "b"
                    ? "rgba(31, 36, 41, 0.8)"
                    : "rgba(31, 36, 41, 0.05)",
              },
            ]}
          >
            {questions[section - 1][questionNumber - 1].b}
          </Text>
        </Pressable>
        <View
          style={[
            styles.buttonsContainer,
            {
              justifyContent:
                realQuestionNumber === 1 ? "flex-end" : "space-between",
            },
          ]}
        >
          <Pressable
            style={[
              styles.button,
              { display: realQuestionNumber === 1 ? "none" : "flex" },
            ]}
            onPress={() => {
              previous(questionNumber);
            }}
          >
            <Text style={[styles.buttonText]}>Previous</Text>
          </Pressable>

          <Pressable
            style={[styles.button, { backgroundColor: "#1f2429", display: realQuestionNumber === 44 ? "none" : "flex", }]}
            onPress={() => {
              next(questionNumber);
            }}
            disabled={answer===''}
          >
            <Text
              style={[
                styles.buttonText,
                {
                  paddingHorizontal: height * 0.009,
                  color: "#ffffff",
                  
                },
              ]}
            >
              Next
            </Text>
          </Pressable>
        </View>
      </View>
      `
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 24,
    height: height * 0.6132,
    marginTop: height * 0.025,
    //alignItems: "center",
  },

  gradientSubContainer: {
    height: height * 0.24,
    borderRadius: 24,
    //position: "absolute"
  },

  animation: {},

  main: {
    marginVertical: height * 0.025,
    //alignItems: "center",
    paddingHorizontal: height * 0.028,
    rowGap: height * 0.012,
  },

  question: {
    fontFamily: "Inter_600SemiBold",
    fontSize: height * 0.01958,
    color: "#1f2429",
    lineHeight: height * 0.0244,
    textAlign: "left",
    marginTop: height * 0.015,
  },

  options: {
    fontFamily: "Inter_500Medium",
    fontSize: height * 0.01835,
    lineHeight: height * 0.0244,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(31, 36, 41, 0.2)",
    padding: height * 0.0097,
  },

  buttonsContainer: {
    flexDirection: "row",
    alignSelf: "stretch",
    marginTop: height * 0.04,
    //borderWidth: 1,
    //borderColor: "black",
  },

  button: {
    borderRadius: 1000,
    borderWidth: 1,
    padding: height * 0.01,
  },

  buttonText: {
    fontFamily: "Inter_500Medium",
    fontSize: height * 0.01835,
    paddingHorizontal: height * 0.00489,
    lineHeight: height * 0.0244,
  },
});
