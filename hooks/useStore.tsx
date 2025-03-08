import AsyncStorage from "@react-native-async-storage/async-storage";
import {create} from 'zustand';

type SurveyState = {
  section1Count: number;
  section2Count: number;
  section3Count: number;
  section4Count: number;
  setSection1Count: (num:number)=>void;
  setSection2Count: (num:number)=>void;
  setSection3Count: (num:number)=>void;
  setSection4Count: (num:number)=>void;
  selectedSection: number;
  setSelectedSection: (num:number)=>void;
  getStartQuestion: ()=>number;
  setQuestionsCount: (section: number, question: number) => Promise<void>
} 

export const useSurveyStore = create<SurveyState>()((set, get) => ({
  section1Count: 0,
  section2Count: 0,
  section3Count: 0,
  section4Count: 0,
  setSection1Count: (num) => set(()=>({section1Count: num})),
  setSection2Count: (num) => set(()=>({section2Count: num})),
  setSection3Count: (num) => set(()=>({section3Count: num})),
  setSection4Count: (num) => set(()=>({section4Count: num})),
  selectedSection: 1,
  setSelectedSection: (num) => set(()=>({selectedSection: num})),
  getStartQuestion: ()=> {

    const {selectedSection, section1Count, section2Count, section3Count, section4Count} = get();
    switch(selectedSection) {
      case 1: return section1Count;
      case 2: return section2Count;
      case 3: return section3Count;
      case 4: return section4Count;
      default: return 0;
    }
  },
  setQuestionsCount: async (section: number, question: number) => {
    try {
      //takes section # from 1 to 4 and question# completed
      const {setSection1Count, setSection2Count, setSection3Count, setSection4Count} = get();
      await AsyncStorage.setItem(`section${section}`, question.toString());

      if (section === 1) setSection1Count(question);
      else if (section === 2) setSection2Count(question);
      else if (section === 3) setSection3Count(question);
      else if (section === 4) setSection4Count(question);

      return;
    } catch (e: any) {
      console.log(e.message);
    }
  },
  
  
}));
