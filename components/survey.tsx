import { Text, View } from "@/components/Themed";
import { StyleSheet, Pressable, ActivityIndicator } from "react-native";
import { useState, useRef, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { questions } from "@/constants/Questions";
import { height, h } from "@/app/_layout";
import { Link } from "expo-router";
import { useSurveyStore } from "@/hooks/useStore";
import LottieView from "lottie-react-native";
import DashedProgress from "@/components/DashedProgress";
import useAnswers from "@/hooks/useAnswers";
import { useAlert } from "@/hooks/useAlert";
import { url } from "@/constants/Server";
import { useNetInfo } from "@react-native-community/netinfo";
import { useRouter } from "expo-router";
import { useUserStore } from "@/hooks/useStore";
import axios from "axios";
import Back from "@/components/Back";
import { Redirect } from "expo-router";
import useSection from "@/hooks/useSection";
import { Answer } from "@/types";
const animationSource = require("@/assets/images/hand.json");

//USE OF WITHAUTH TO PROTECT ROUTE

export default function Survey() {

  
  //section is from 1 to 4
  const { selectedSection, getStartQuestion, setSelectedSection, setSectionsCount} =
    useSurveyStore((state) => state);
  

  const {section} = useSection();
  const { openAlert, Alert } = useAlert();
  const { isConnected } = useNetInfo();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, token, setUser } = useUserStore();

  //startQuestion is 0 indexing so from 0 to 10
  const startQuestion = getStartQuestion();
  //used to show question # from 1 to 11
  const [count, setCount] = useState(startQuestion + 1);
  // used to record answers
  const { answers, updateAnswersRef, getAnswersRef } = useAnswers();
  // used to check for changes in the answer ref
  const checksumRef = useRef({hash: 0, index:0}); 
  //numbering questions from 1 to 44, so total 44
  const realQuestionCount = (selectedSection - 1) * 11 + count;
  const [answer, setAnswer] = useState<string>(
    getAnswersRef(realQuestionCount - 1)
  );


  useEffect(()=>{
    console.log(`It ran ${checksumRef.current.hash} and index ${checksumRef.current.index}`);
    answers.current && updateQuestion([answers.current[checksumRef.current.index]]);
  }, [checksumRef.current.hash])

/*   const animationRef = useRef<LottieView>(null);

  useEffect(() => {
    animationRef.current?.play();
    animationRef.current?.play(0, 222);
  }, []);
 */
  const next = async () => {
    

    //this is what saves the selected answer to the async storage
    if (getAnswersRef(realQuestionCount - 1) !== answer) {
      try {
        updateAnswersRef(realQuestionCount - 1, {
          q: realQuestionCount,
          answer: answer,
        }, checksumRef);
        setSectionsCount();
        await AsyncStorage.setItem("answers", JSON.stringify(answers.current));
        
      } catch (e: any) {
        console.log(e.message);
      }
    }

    if (realQuestionCount !== 44) {
      //first set the answer state to reflect change on users screen
      
      setAnswer(getAnswersRef(realQuestionCount));
  
      //then change the questions and options
      if (count === 11) {
        setSelectedSection(selectedSection + 1);
        setCount(1);
      } else setCount(count=>count + 1);
      
    }
    
    //submit if last question
    realQuestionCount === 44 && submit();
  };

  const previous = () => {
    //first set the answer state to reflect change on users screen

    setAnswer(getAnswersRef(realQuestionCount - 2));
    //then change the questions and options
    if (count === 1) {
      setSelectedSection(selectedSection - 1);
      setCount(11);
      return;
    }
    setCount(count=>count - 1);
  };

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
        console.log('done')
      } 
    } catch (e: any) {
      console.log(e);
    } 
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
              timeout: 1000 * 35,
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
            await AsyncStorage.setItem("user", JSON.stringify(res.data.student));
          }
          }
        
          else await openAlert('fail', 'Error', 'Please answer all the questions from previous sections');

        } else await openAlert('info', 'Already submitted', `Dear ${user.first_name}, you have already submitted the answers.`)
        
        


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
    } finally {
      setIsSubmitting(false);
    }
  };

  

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor:
            questions[selectedSection - 1][count - 1].containerColor,
        },
      ]}
    >
      <Alert />
        <View style={{paddingVertical:h*10, marginBottom:h*15}}>
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
        {(count !== 8 || selectedSection !== 1) && (
          <LinearGradient
            // Background Linear Gradient
            style={[styles.gradientSubContainer, {}]}
            colors={[
              questions[selectedSection - 1][count - 1].gradientColorStart,
              questions[selectedSection - 1][count - 1].gradientColorEnd,
            ]}
          >
            <LottieView autoPlay source={animationSource} loop />
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
              {questions[selectedSection - 1][count - 1].a}
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
              {questions[selectedSection - 1][count - 1].b}
            </Text>
          </Pressable>
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
          <Pressable
            style={[
              styles.button,
              { display: realQuestionCount === 1 ? "none" : "flex" },
            ]}
            onPress={previous}
          >
            <Text style={[styles.buttonText]}>Previous</Text>
          </Pressable>

          <Pressable
            style={[
              styles.button,
              {
                backgroundColor: "#1f2429",
                //display: realQuestionCount === 44 ? "none" : "flex",
              },
            ]}
            onPress={next}
            disabled={answer === ""}
          >
            {isSubmitting ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text
                style={[
                  styles.buttonText,
                  {
                    paddingHorizontal: height * 0.009,
                    color: "#ffffff",
                  },
                ]}
              >
                {realQuestionCount === 44 ? "Submit" : "Next"}
              </Text>
            )}
          </Pressable>
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
    fontSize: height * 0.0244,
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
    //borderWidth: 0.5,
    //borderColor: "black",
    paddingHorizontal: height * 0.0292,
    rowGap: height * 0.012,
    // minHeight: height * 0.317,
  },

  question: {
    fontFamily: "Inter_600SemiBold",
    fontSize: height * 0.01958,
    color: "#1f2429",
    lineHeight: height * 0.0244,
    textAlign: "left",
    marginTop: height * 0.015,
    //paddingRight: height*0.0003
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

  buttonsquestionContainer: {
    flexDirection: "row",
    //alignSelf: "stretch",
    paddingHorizontal: height * 0.028,
    //borderWidth: 1,
    //borderColor: "black",
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
    fontSize: height * 0.01835,
    paddingHorizontal: height * 0.00489,
    lineHeight: height * 0.0244,
  },
});
