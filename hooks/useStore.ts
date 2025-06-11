import { create } from "zustand";
import { User, GroupType } from "@/types";
import useAnswers from "./useAnswers";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useSection from "./useSection";

type GroupState = {
  groups: GroupType[];
  setGroups: (groups: GroupType[])=>void;
  reset: () => void;
}

const initialGroupState = {
  groups: []
}

export const useGroupStore = create<GroupState>()((set, get) => ({
  ...initialGroupState,
  setGroups: (groups) => set(() => ({ groups:groups })),
  reset: () => set(() => ({...initialGroupState}))
}))

type SurveyState = {
  selectedSection: number;
  setSelectedSection: (num: number) => void;
  getStartQuestion: () => number;
  setSectionsCount: () =>Promise<void>;
  reset: () => void;
};

const initialSurveyState = {
  selectedSection: 5,
}

export const useSurveyStore = create<SurveyState>()((set, get) => ({
  ...initialSurveyState,
  setSelectedSection: (num) => set(() => ({ selectedSection: num })),
  getStartQuestion: () => {

    const {getUnansweredQuestionIndex} = useAnswers();
    const { selectedSection } = get();
    const {section} = useSection();

    switch (selectedSection) {
      case 1: {
        if (section.one === 11) return 0;
        else return getUnansweredQuestionIndex(1);
      }
      case 2: {
        if (section.two === 11) return 0;
        else return getUnansweredQuestionIndex(2);
      }
      case 3: {
        if (section.three === 11) return 0;
        else return getUnansweredQuestionIndex(3);
      }
      case 4: {
        if (section.four === 11) return 0;
        else return getUnansweredQuestionIndex(4);
      }
      default:
        return 0;
    }
  },
  setSectionsCount: async () => {

    const { selectedSection } = get();
    const {getQuestionsCount} = useAnswers();
    const {section} = useSection();

    if(selectedSection === 1 || selectedSection == 5) section.one = getQuestionsCount(1);
    if(selectedSection === 2 || selectedSection == 5) section.two = getQuestionsCount(2);
    if(selectedSection === 3 || selectedSection == 5) section.three = getQuestionsCount(3);
    if(selectedSection === 4 || selectedSection == 5) section.four = getQuestionsCount(4);
  },
  reset: () => set(() => ({...initialSurveyState}))
}));


type UserState = {
  user: User | null;
  token: string | null;
  setUser: (user: User|null) => void;
  setToken: (token:string|null) => void;
  initializeUser: (userToSet: User, tokenToSet: string) => Promise<void>;
  resetUserState: () => void;
};

const initialUserState = {
  user: null,
  token: null,
}

export const useUserStore = create<UserState>()((set, get) => ({

  ...initialUserState,
  setUser: (user) => {AsyncStorage.setItem("user", JSON.stringify(user)); set(() => ({ user: user }))},
  setToken: (token) => {token && AsyncStorage.setItem("token", token); set(() => ({ token: token }))},
  initializeUser: async (userToSet: User, tokenToSet: string)  => {
    
    
    const { initializeAnswers } = useAnswers();
    const { setUser, setToken } = get();
    //get answers from local storage if user has not completed survey
    //console.log(userToSet);
    if(!userToSet.isSurveyCompleted)
    {
      const temp = await AsyncStorage.getItem("answers");
    //if answers dont exist in local storage
      if(temp===null) {
        //check if answers are stored in questions array of user
        if(userToSet.questions?.length)
        {
          
          //if so then initiliaze the answers ref using questions array of user object
          initializeAnswers(userToSet.questions)
        } else {
          
          //user is new to the app so create an empty array and initialize the answersRef
          initializeAnswers(new Array(44).fill({q: 0, answer: ''}));
        }
        
        } else {
          
          //if answers already exist in the local storage just initialize the answers ref using that
          initializeAnswers(JSON.parse(temp))
        }
    }

    setUser(userToSet);
    setToken(tokenToSet);
  },
  resetUserState: () => set(() => ({...initialUserState}))


}))
