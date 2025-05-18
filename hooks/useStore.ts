import { create } from "zustand";
import { User } from "@/types";
import useAnswers from "./useAnswers";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useSection from "./useSection";

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

    const { selectedSection } = get();
    const {section} = useSection();

    switch (selectedSection) {
      case 1: {
        if (section.one === 11) return 0;
        else return section.one;
      }
      case 2: {
        if (section.two === 11) return 0;
        else return section.two;
      }
      case 3: {
        if (section.three === 11) return 0;
        else return section.three;
      }
      case 4: {
        if (section.four === 11) return 0;
        else return section.four;
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
  setUser: (user) => set(() => ({ user: user })),
  setToken: (token) => set(() => ({ token: token })),
  initializeUser: async (userToSet: User, tokenToSet: string)  => {
    
    const { initializeAnswers, answers } = useAnswers();
    const { setUser, setToken } = get();
    //get answers from local storage
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
    
    await AsyncStorage.setItem("user", JSON.stringify(userToSet));
    await AsyncStorage.setItem("token", tokenToSet);
    setUser(userToSet);
    setToken(tokenToSet);
    

  },
  resetUserState: () => set(() => ({...initialUserState}))


}))
