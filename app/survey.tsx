import { Text, View } from "@/components/Themed";
import { StyleSheet, Pressable } from "react-native";
import { useState, useRef, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { questions } from "@/constants/Questions";
import Question from "@/components/Question";
import { height } from "./_layout";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Link } from "expo-router";
import { useSurveyStore } from "@/hooks/useStore";


export type Answer = {
  q: number;
  answer: string;
};
//USE OF WITHAUTH TO PROTECT ROUTE

export default function Survey() {

  //section is from 1 to 4
  const {selectedSection, getStartQuestion, setQuestionsCount, setSelectedSection} = useSurveyStore(state=>state)
  //startQuestion is 0 indexing so from 0 to 10
  const startQuestion = getStartQuestion();
  //used to show question # from 1 to 11
  const [count, setCount] = useState(startQuestion + 1);
  // used to record answers
  const answers = useRef<Array<Answer>>(new Array(44).fill({q: 0, answer: ''}));

  useEffect(()=> {
    //used to fill answers from localStorage
    initialize();
  }
  ,[])

  const initialize = async () => {
    try {
    let tempAnswers = await AsyncStorage.getItem('answers');
    if(tempAnswers)
    {
      answers.current = JSON.parse(tempAnswers);
    }
    }catch(e: any) {
      console.log(e.message)
    }
  }

  const selectAnswer = async (q: number, answer: string) => {
    if(answers.current)
    {
      try {
      answers.current[q-1] = {q: q, answer:answer }
      await AsyncStorage.setItem('answers', JSON.stringify(answers.current))
      //console.log(answers.current[q-1]);
      setQuestionsCount(selectedSection, count);
      } catch(e:any) {
        console.log(e.message);
      }
    }
    
  }

  const next = (num: number) => {
    if(num===11)
    {
      setSelectedSection(selectedSection+1);
      setCount(1);
      return;
    }
    setCount(num+1);
  }

  const previous = (num:number) => {
    if(num===1)
      {
        setSelectedSection(selectedSection-1);
        setCount(11);
        return;
      }
    setCount(num-1);
  }

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: questions[selectedSection - 1][count-1].containerColor,
        },
      ]}
    >
      <Link href="/sections" asChild>
      <Pressable style={styles.close}>
          <Ionicons
            name="chevron-back"
            size={height * 0.034}
            color="#565555"
          />
        </Pressable>
      </Link>

      <Text style={styles.heading}>Section {selectedSection}</Text>

      <Question questionNumber={count} section={selectedSection} answers={answers.current} selectAnswer={selectAnswer} next={next} previous={previous}/>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 24,
    width: "92%",
    paddingHorizontal: height * 0.024,
  },

  close: {
    borderRadius: 10,
    borderColor: "#565555",
    borderWidth: 1,
    marginVertical: height * 0.0257,
    alignSelf: "flex-start",
  },

  heading: {
    fontFamily: "Poppins_700Bold",
    color: "#4D3E3E",
    fontSize: height * 0.0244,
    paddingLeft: height * 0.009
  },
});
