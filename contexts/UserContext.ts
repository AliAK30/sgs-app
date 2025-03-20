import { createContext, useContext } from "react";
import { Answer } from "@/hooks/useAnswers";


export type LearningStyle = {
  dim1: { name: string, score: number };
  dim2: { name: string, score: number };
  dim3: { name: string, score: number };
  dim4: { name: string, score: number };
  
}

export type User = {
  _id: string;
  first_name: string;
  last_name: string;
  uni_name: string;
  uni_id: string;
  email: string;
  role: string;
  questions?: Array<Answer>;
  gpa?: number;
  dob?: Date;
  phone_number?: string;
  gender?: string;
  learning_style?: LearningStyle;
  picture?: string;
  newUser?: boolean;
  isSurveyCompleted?: boolean;
  privacy: { //0 means only me, 1 means friends only, 2 means everyone for privacy
    picture: number, 
    email: number,
    phone_number: number,
    gpa: number,
    learning_style: number,
  };

};

type UserContextType = {
  user: User | null;
  token: React.MutableRefObject<string | null>;
  done: boolean;
  setUserAndToken: (userToSet: User, tokenToSet: string) => Promise<void>;
  clear: () => void;
};

export const UserContext = createContext<UserContextType>({} as UserContextType);

export const useUser = () => useContext(UserContext);
