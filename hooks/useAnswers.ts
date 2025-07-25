import { Answer } from "@/types";

type AnswerRef = {
  current: Array<Answer> | undefined;
};

// Singleton ref
let answers: AnswerRef = { current: undefined };

const initializeAnswers = (data: Array<Answer>|undefined) => {
  answers.current = data;
}

// Provide a way to update the ref
const updateAnswersRef = (index: number, answer: Answer, ref:React.MutableRefObject<{
    hash: number;
    index: number;
}>) => {
  if (answers.current && answers.current[index].answer !== answer.answer) 
  {
    ref.current.hash += 1;
    ref.current.index = index;
    answers.current[index] = answer;
  }
};

const getAnswersRef = (index: number): string => {
  if (answers.current) return answers.current[index].answer;
  else return "";
};

const getQuestionsCount = (section: number): number => {
  //takes section number from 1 to 4 and returns number of questions answered by user
  let count = 0;
  if (answers.current) {
    for (let i = 0; i < 11; i++) {
      if (answers.current[(section - 1) * 11 + i].answer !== "") count++;
    }
  }

  return count;
};

const getUnansweredQuestionIndex = (section: number): number => {
  //takes section number from 1 to 4 and returns the first unanswered question by user
  let count = 0;
  if(answers.current)
  {
    for (let i = 0; i < 11; i++) {
      if (answers.current[(section - 1) * 11 + i].answer === "") break;
      count++;
    }
  }
  return count;
}

const useAnswers = () => {
  return { answers, updateAnswersRef, getAnswersRef, getQuestionsCount, initializeAnswers, getUnansweredQuestionIndex };
};

export default useAnswers;
