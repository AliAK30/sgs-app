import { useUser } from "@/contexts/UserContext";
import { Redirect } from "expo-router";


//This is where redirection happens


export default function Index() {

  const {user} = useUser();

  if(user?.isSurveyCompleted) return (<Redirect href="/statistics"/>)

  if(user) return (<Redirect href="/sections"/>)

  return (<Redirect href="/login"/>)
}

