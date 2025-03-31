import { Answer } from "@/types";

type AnswerRef = {
  current: Array<Answer> | undefined;
};

// Singleton ref
let answers: AnswerRef = { current: undefined };

// Provide a way to update the ref
const updateAnswersRef = (index: number, answer: Answer) => {
  if (answers.current) answers.current[index] = answer;
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

const useAnswers = () => {
  return { answers, updateAnswersRef, getAnswersRef, getQuestionsCount };
};

export default useAnswers;
