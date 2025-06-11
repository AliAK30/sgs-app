import { Text, View } from "@/components/Themed";
import { StyleSheet } from "react-native";
import { useState, useRef, useEffect, useCallback} from "react";
import { debounce } from "lodash";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { questions } from "@/constants/Questions";
import { height, h, w } from "@/app/_layout";
import { useSurveyStore } from "@/hooks/useStore";
import LottieView from "lottie-react-native";
import DashedProgress from "@/components/DashedProgress";
import useAnswers from "@/hooks/useAnswers";
import { useAlert } from "@/hooks/useAlert";
import { url } from "@/constants/Server";
import { useNetInfo } from "@react-native-community/netinfo";
import { useUserStore } from "@/hooks/useStore";
import axios from "axios";
import Back from "@/components/buttons/Back";
import {triggerHaptic} from "@/components/Haptics";
import useSection from "@/hooks/useSection";
import { Answer } from "@/types";
import { getAnimationForQuestion } from "@/constants/Animations";
import { handleError } from "@/errors";
import SubmitButton from "./buttons/SubmitButton";
import AnimatedPressableText from "./AnimatedPressableText";


export default function Survey() {

  
  //section is from 1 to 4
  const { selectedSection, getStartQuestion, setSelectedSection, setSectionsCount} =
    useSurveyStore((state) => state);
  
  const {section} = useSection();
  const { openAlert, Alert } = useAlert();
  const { isConnected } = useNetInfo();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, token, setUser } = useUserStore();

  //startQuestion is 0 indexing so from 0 to 10
  const startQuestion = getStartQuestion();
  //used to show question # from 1 to 11
  const [count, setCount] = useState(startQuestion + 1);
  // used to record answers
  const { answers, updateAnswersRef, getAnswersRef } = useAnswers();
  // used to check for changes in the answer ref
  const checksumRef = useRef({hash: 0, index:-1}); 
  //numbering questions from 1 to 44, so total 44
  const realQuestionCount = (selectedSection - 1) * 11 + count;

  const [answer, setAnswer] = useState<string>(getAnswersRef(realQuestionCount - 1));

  const currentAnimationSource = getAnimationForQuestion(realQuestionCount);

  useEffect(()=>{
    if(answers.current && checksumRef.current.index>-1)
    updateQuestion([answers.current[checksumRef.current.index]]);
  }, [checksumRef.current.hash])

  const debouncedNext = useCallback(
    debounce((shouldSubmit: boolean) => {
      // Original next logic without the async parts that need immediate response
      if (getAnswersRef(realQuestionCount - 1) !== answer) {
        updateAnswersRef(realQuestionCount - 1, {
          q: realQuestionCount,
          answer: answer,
        }, checksumRef);
        setSectionsCount();
        AsyncStorage.setItem("answers", JSON.stringify(answers.current)).catch(console.error);
      }

      if (realQuestionCount !== 44) {
        setAnswer(getAnswersRef(realQuestionCount));
        if (count === 11) {
          setSelectedSection(selectedSection + 1);
          setCount(1);
        } else {
          setCount(count => count + 1);
        }
      } else if (shouldSubmit) {
        submit();
      }
    }, 300, { leading: true, trailing: false }) // 300ms debounce, execute on leading edge
  , [count, answer]);

  const debouncedPrevious = useCallback(
    debounce(() => {
      setAnswer(getAnswersRef(realQuestionCount - 2));
      if (count === 1) {
        setSelectedSection(selectedSection - 1);
        setCount(11);
        return;
      }
      setCount(count => count - 1);
    }, 300, { leading: true, trailing: false })
  , [count, answer]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      debouncedNext.cancel();
      debouncedPrevious.cancel();
    };
  }, []);

  const skipTo = (num: number) => {
    //used to skip to any previous answered question
    const real = (selectedSection - 1) * 11 + num;
    if (getAnswersRef(real - 1) !== "") {
      setAnswer(getAnswersRef(real - 1));
      setCount(num);
    }
  };



  const updateQuestion = async (oneAnswer: Array<Answer>) => {
    try {
      if (isConnected) {
        
        await axios.patch(`${url}/student/update/questions`, {answers: oneAnswer, isSurveyCompleted: false}, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        timeout: 1000 * 15,
        });
      } 
    } catch (e: any) {} 
  }

  const submit = async () => {
    setIsSubmitting(true);
    try {
      if (isConnected) {
        if(!user?.isSurveyCompleted)
        {
          if(section.one+section.two+section.three+section.four === 44)
          {
              await axios.patch(`${url}/student/update/questions`, {answers: answers.current, isSurveyCompleted: true}, {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              timeout: 1000 * 15,
            });
            const res: any = await axios.get(
            `${url}/student/identify/learningstyle`,
            {
              headers: { Authorization: `Bearer ${token}` },
              timeout: 1000 * 60,
            }
          );
          await openAlert(
            "success",
            "Submission Successful!",
            `Thanks for submitting! You will now see your learning style`
          );
          
          //update the user state so statistics screen is displayed
          if (token){
            setUser(res.data.student);
          }
          }
        
          else await openAlert('fail', 'Error', 'Please answer all the questions from previous sections');

        } else await openAlert('info', 'Already submitted', `Dear ${user.first_name}, you have already submitted the answers.`)
        
      } else {
        openAlert("fail", "Failed!", "No Internet Connection!");
        return;
      }
    } catch (e: any) {
      handleError(e, openAlert);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNext = () => {
    triggerHaptic("impact-1");
    debouncedNext(realQuestionCount === 44);
  };

  const handlePrevious = () => {
    triggerHaptic("impact-1");
    debouncedPrevious();
  };

  
  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor:
            questions[selectedSection-1][count-1].containerColor,
        },
      ]}
    >
      <Alert />
        <View style={{paddingTop:h*18, marginBottom:h*15}}>
          <Back onPress={()=>setSelectedSection(5)}/>
        </View>
        
      

      <Text style={styles.heading}>Section {selectedSection}</Text>

      <View
        style={[
          styles.questionContainer,
          {
            backgroundColor:
              questions[selectedSection - 1][count - 1].gradientColorEnd,
          },
        ]}
      >
        
        {currentAnimationSource && (
          <LinearGradient
            // Background Linear Gradient
            style={[styles.gradientSubContainer, {}]}
            colors={[
              questions[selectedSection - 1][count - 1].gradientColorStart,
              questions[selectedSection - 1][count - 1].gradientColorEnd,
            ]}
          >
            
            <LottieView
              ref={animation => {
                if (animation) {
                  animation.play();
                }
              }}
              source={currentAnimationSource}
              resizeMode="contain"
              autoPlay
              loop
              key={`animation-${realQuestionCount}`}
              style={{ width: '100%', height: 170, alignSelf:'center', backgroundColor: 'transparent' }}
              imageAssetsFolder="images/survey-lotties"
            />
            
          </LinearGradient>
        )}
        <View style={[styles.main]}>
          <DashedProgress
            totalDashes={11}
            focusedDash={count}
            onPress={skipTo}
          />
          <View style={{ flexDirection: "row" }}>
            <Text style={styles.question}>{count}. </Text>
            <Text style={styles.question}>
              {questions[selectedSection - 1][count - 1].question}
            </Text>
          </View>

          <AnimatedPressableText
            onPress={() => {
              setAnswer("a");
              triggerHaptic("impact-1");
            }}
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
              {questions[selectedSection - 1][count - 1].a}
          </AnimatedPressableText>

          <AnimatedPressableText
            onPress={() => {
              triggerHaptic("impact-1");
              setAnswer("b");
            }}
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
              {questions[selectedSection - 1][count - 1].b}
          </AnimatedPressableText>

        </View>
        <View
          style={[
            styles.buttonsquestionContainer,
            {
              justifyContent:
                realQuestionCount === 1 ? "flex-end" : "space-between",
              marginTop:
                realQuestionCount === 8 ? height * 0.088 : height * 0.035,
            },
          ]}
        >
          <SubmitButton
            style={[styles.button, { display: realQuestionCount === 1 ? "none" : "flex" }]}
            onPress={handlePrevious}
            textStyle={styles.buttonText}
            text="Previous"
          />

          <SubmitButton
            style={[styles.button,{backgroundColor: "#1f2429"}]}
            onPress={handleNext}
            disabled={answer === ""}
            isSubmitting={isSubmitting}
            text={realQuestionCount === 44 ? "Submit" : "Next"}
            textStyle={[styles.buttonText, {paddingHorizontal: height * 0.009, color: "#ffffff"}]}
          />

        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 24,
    width: "92%",
    paddingHorizontal: height * 0.024,
    alignSelf:'center',
  },

  heading: {
    fontFamily: "Poppins_700Bold",
    color: "#4D3E3E",
    fontSize: h*10+w*10,
    paddingLeft: height * 0.009,
    marginTop: height * 0.0257
  },

  questionContainer: {
    borderRadius: 24,
    height: height * 0.65,
    marginTop: height * 0.025,
  },

  gradientSubContainer: {
    height: height * 0.2,
    borderRadius: 24,
  },

  main: {
    marginTop: height * 0.025,
    paddingHorizontal: height * 0.0292,
    rowGap: height * 0.012,
  },

  question: {
    fontFamily: "Inter_600SemiBold",
    fontSize: h*8+w*8,
    color: "#1f2429",
    lineHeight: height * 0.0244,
    textAlign: "left",
    marginTop: height * 0.015,
  },

  options: {
    fontFamily: "Inter_500Medium",
    fontSize: h*7.5+w*7.5,
    lineHeight: h*20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(31, 36, 41, 0.2)",
    padding: height * 0.0097,
  },

  buttonsquestionContainer: {
    flexDirection: "row",
    paddingHorizontal: height * 0.028,
    position: "absolute",
    bottom: height * 0.03,
    width: "100%",
  },

  button: {
    borderRadius: 1000,
    borderWidth: 1,
    padding: height * 0.01,
  },

  buttonText: {
    fontFamily: "Inter_500Medium",
    fontSize: h*7.5+w*7.5,
    paddingHorizontal: height * 0.00489,
    lineHeight: h*20,
  },
});
