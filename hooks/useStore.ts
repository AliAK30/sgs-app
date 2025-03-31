import { create } from "zustand";
import { User } from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";

type SurveyState = {
  section1Count: number;
  section2Count: number;
  section3Count: number;
  section4Count: number;
  setSection1Count: (num: number) => void;
  setSection2Count: (num: number) => void;
  setSection3Count: (num: number) => void;
  setSection4Count: (num: number) => void;
  selectedSection: number;
  setSelectedSection: (num: number) => void;
  getStartQuestion: () => number;
};

export const useSurveyStore = create<SurveyState>()((set, get) => ({
  section1Count: 0,
  section2Count: 0,
  section3Count: 0,
  section4Count: 0,
  setSection1Count: (num) => set(() => ({ section1Count: num })),
  setSection2Count: (num) => set(() => ({ section2Count: num })),
  setSection3Count: (num) => set(() => ({ section3Count: num })),
  setSection4Count: (num) => set(() => ({ section4Count: num })),
  selectedSection: 5,
  setSelectedSection: (num) => set(() => ({ selectedSection: num })),
  getStartQuestion: () => {
    const {
      selectedSection,
      section1Count,
      section2Count,
      section3Count,
      section4Count,
    } = get();

    switch (selectedSection) {
      case 1: {
        if (section1Count === 11) return 0;
        else return section1Count;
      }
      case 2: {
        if (section2Count === 11) return 0;
        else return section2Count;
      }
      case 3: {
        if (section3Count === 11) return 0;
        else return section3Count;
      }
      case 4: {
        if (section4Count === 11) return 0;
        else return section4Count;
      }
      default:
        return 0;
    }
  },
}));


type UserState = {
  user: User | null;
  token: string | null;
  setUser: (user: User|null) => void;
  setToken: (token:string|null) => void;
  isUserLoaded: boolean;
  setIsUserLoaded: (load: boolean) => void;
  setUserAndTokenAsync: (userToSet: User, tokenToSet: string) => Promise<void>;
  clear: () => void;
};

export const useUserStore = create<UserState>()((set, get) => ({

  user: null,
  token: null,
  setUser: (user) => set(() => ({ user: user })),
  setToken: (token) => set(() => ({ token: token })),
  isUserLoaded: false,
  setIsUserLoaded: (load) => set(() => ({ isUserLoaded: load })),
  setUserAndTokenAsync: async (userToSet: User, tokenToSet: string)  => {

    const { setUser, setToken } = get();

    await AsyncStorage.setItem("user", JSON.stringify(userToSet));
    await AsyncStorage.setItem("token", tokenToSet);
    setUser(userToSet);
    setToken(tokenToSet);
  },
  clear: () => {
    const { setUser, setToken } = get();
    setToken(null);
    setUser(null);
    
  }


}))
