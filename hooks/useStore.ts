import { create } from "zustand";
import { User, GroupType, NotificationType, Friend } from "@/types";
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

//SOCKET STATE

type SocketState = {
  isConnected: boolean | null;
  setIsConnected: (value: boolean | null) => void;
  resetSocketState: ()=>void;
}

export const useSocketStore = create<SocketState>((set) => ({
  isConnected: null,
  setIsConnected: (value) => set({ isConnected: value }),
  resetSocketState: () => set({isConnected:null})
}));

//NOTIFICATION STATE

type NotificationsState = {
  notifications: NotificationType[];
  setNotifications: (notifications: NotificationType[])=>void;
  reset: () => void;
}

export const useNotificationsStore = create<NotificationsState>()((set, get) => ({
  notifications: [],
  setNotifications: (notifications: NotificationType[]) => set(() => ({ notifications:notifications })),
  reset: () => set(() => ({notifications:[]}))
}))


//BANNER STATE

type BannerState = {
  isVisible: boolean;
  // Message to be displayed, can be any string
  message: string;

  //Title to be displayed
  title: string;
  // Type can be either "success" or "error" or "info"
  type: "success" | "fail" | "info";
  openBanner: (type: BannerState['type'], title: string, message?: string) => void

};

const initialBannerState = {
    isVisible: false,
    type: "success",
    message: "",
    title: "",
} as BannerState;

export const useBanner = create<BannerState>()((set, get) => ({
  ...initialBannerState,
  openBanner: (type: BannerState['type'], title: string, message?: string) => {
    setTimeout(()=> {set((initialstate)=>({...initialstate, isVisible:false}))}, 2500);

      set(()=>({ isVisible: true, type, title, message }));
  }
}))


type FriendsState = {
  friends: Friend[];
  setFriends: (friends: Friend[])=>void;
  reset: () => void;
}

export const useFriendsStore = create<FriendsState>()((set, get) => ({
  friends: [],
  setFriends: (friends: Friend[]) => set(() => ({ friends:friends })),
  reset: () => set(() => ({friends:[]}))
}))


type AdminsState = {
  admins: User[];
  setAdmins: (admins: User[])=>void;
  reset: () => void;
}

export const useAdminsStore = create<AdminsState>()((set, get) => ({
  admins: [],
  setAdmins: (admins: User[]) => set(() => ({ admins:admins })),
  reset: () => set(() => ({admins:[]}))
}))