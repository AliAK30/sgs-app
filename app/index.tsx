import { useUserStore } from "@/hooks/useStore";
import { Redirect } from "expo-router";


//This is where redirection happens


export default function Index() {

  const {user} = useUserStore();
  
  //if(user?.isSurveyCompleted) return (<Redirect href="/statistics"/>)

  //if(user) return (<Redirect href="/sections"/>)

  return (<Redirect href="/login"/>)
}

