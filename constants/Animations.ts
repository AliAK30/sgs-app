const animationSources = [
  // Section 1 (1-1 to 1-11, excluding 1-8)
  require("@/assets/images/survey-lotties/1-1.json"),   // Question 1
  require("@/assets/images/survey-lotties/1-2.json"),   // Question 2
  require("@/assets/images/survey-lotties/1-3.json"),   // Question 3
  require("@/assets/images/survey-lotties/1-4.json"),   // Question 4
  require("@/assets/images/survey-lotties/1-5.json"),   // Question 5
  require("@/assets/images/survey-lotties/1-6.json"),   // Question 6
  require("@/assets/images/survey-lotties/1-7.json"),   // Question 7
  null,                                                 // Question 8 (no animation)
  require("@/assets/images/survey-lotties/1-9.json"),   // Question 9
  require("@/assets/images/survey-lotties/1-10.json"),  // Question 10
  require("@/assets/images/survey-lotties/1-11.json"),  // Question 11
  
  // Section 2 (2-1 to 2-11)
  require("@/assets/images/survey-lotties/2-1.json"),   // Question 12
  require("@/assets/images/survey-lotties/2-2.json"),   // Question 13
  require("@/assets/images/survey-lotties/2-3.json"),   // Question 14
  require("@/assets/images/survey-lotties/2-4.json"),   // Question 15
  require("@/assets/images/survey-lotties/2-5.json"),   // Question 16
  require("@/assets/images/survey-lotties/2-6.json"),   // Question 17
  require("@/assets/images/survey-lotties/2-7.json"),   // Question 18
  require("@/assets/images/survey-lotties/2-8.json"),   // Question 19
  require("@/assets/images/survey-lotties/2-9.json"),   // Question 20
  require("@/assets/images/survey-lotties/2-10.json"),  // Question 21
  require("@/assets/images/survey-lotties/2-11.json"),  // Question 22
  
  // Section 3 (3-1 to 3-11)
  require("@/assets/images/survey-lotties/3-1.json"),   // Question 23
  require("@/assets/images/survey-lotties/3-2.json"),   // Question 24
  require("@/assets/images/survey-lotties/3-3.json"),   // Question 25
  require("@/assets/images/survey-lotties/3-4.json"),   // Question 26
  require("@/assets/images/survey-lotties/3-5.json"),   // Question 27
  require("@/assets/images/survey-lotties/3-6.json"),   // Question 28
  require("@/assets/images/survey-lotties/3-7.json"),   // Question 29
  require("@/assets/images/survey-lotties/3-8.json"),   // Question 30
  require("@/assets/images/survey-lotties/3-9.json"),   // Question 31
  require("@/assets/images/survey-lotties/3-10.json"),  // Question 32
  require("@/assets/images/survey-lotties/3-11.json"),  // Question 33
  
  // Section 4 (4-1 to 4-11)
  require("@/assets/images/survey-lotties/4-1.json"),   // Question 34
  require("@/assets/images/survey-lotties/4-2.json"),   // Question 35
  require("@/assets/images/survey-lotties/4-3.json"),   // Question 36
  require("@/assets/images/survey-lotties/4-4.json"),   // Question 37
  require("@/assets/images/survey-lotties/4-5.json"),   // Question 38
  require("@/assets/images/survey-lotties/4-6.json"),   // Question 39
  require("@/assets/images/survey-lotties/4-7.json"),   // Question 40
  require("@/assets/images/survey-lotties/4-8.json"),   // Question 41
  require("@/assets/images/survey-lotties/4-9.json"),   // Question 42
  require("@/assets/images/survey-lotties/4-10.json"),  // Question 43
  require("@/assets/images/survey-lotties/4-11.json"),  // Question 44
];

export const getAnimationForQuestion = (realQuestionCount: number) => {
  return animationSources[realQuestionCount - 1];
};