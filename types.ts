
export type Answer = {
  q: number;
  answer: string;
};

//used for static labels
export type Label =
  | "Verbal"
  | "Global"
  | "Reflective"
  | "Sensing"
  | "Visual"
  | "Sequential"
  | "Active"
  | "Intuitive";

export type LearningStyle = {
  dim1: { name: string, score: number };
  dim2: { name: string, score: number };
  dim3: { name: string, score: number };
  dim4: { name: string, score: number };
  
}

export type User = {
  _id?: string;
  first_name?: string;
  last_name?: string;
  uni_name?: string;
  uni_id?: string;
  email?: string;
  role?: string;
  questions?: Array<Answer>;
  gpa?: number;
  dob?: Date;
  phone_number?: string;
  gender?: string;
  learning_style?: LearningStyle;
  picture?: string;
  newUser?: boolean;
  isSurveyCompleted?: boolean;
  privacy?: { //0 means only me, 1 means friends only, 2 means everyone for privacy
    picture: number, 
    email: number,
    phone_number: number,
    gpa: number,
    learning_style: number,
    dob: number,
  };
  push_notifications?: boolean;

};

export type University = {
  _id: string;
  name: string;
  campus?: string;
  city?: string;
  country?: string;
}

export type Dimension = {
  name: string;
  preference: string;
}

export type GroupType = {
  _id: string;
  name: string;
  uni_name: string;
  uni_id: string;
  gender: string;
  totalStudents: number;
  students?: string[];
  dim1: Dimension;
  dim2: Dimension;
  dim3: Dimension;
  dim4: Dimension;
  createdAt?: string;
}

type FriendBase = {
  _id: string;
  first_name: string;
  last_name: string;
  uni_name: string;
  picture:string;
}

export type Friend = FriendBase & {isFavourite: boolean};

export type FriendRequestPayload = FriendBase & {friendshipId: string};
export type GroupAddedPayload = {fullname: string;
  group_name: string;
};

type NotificationBase<T, L> = {
  _id: string;
  recipient: string;
  payload: L;
  type: T;
  createdAt: string;
};

type FriendRequest = NotificationBase<"fr", FriendRequestPayload>;
type FriendRequestAccepted = NotificationBase<"fr_accepted", string>;
type GroupAdded = NotificationBase<"group_added", GroupAddedPayload>;

export type NotificationType = FriendRequest |  FriendRequestAccepted | GroupAdded;

