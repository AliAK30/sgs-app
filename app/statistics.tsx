import { Text, View } from "@/components/Themed";
import { StyleSheet } from "react-native";
import { height } from "./_layout";
import { useUserStore } from "@/hooks/useStore";
import Back from "@/components/Back";
import LearningStyleComponent from "@/components/LearningStyle";
import { useRouter, Redirect } from "expo-router";

export default function Statistics() {
  const { user, token } = useUserStore();
  const router  = useRouter();

  
  if(!token) return <Redirect href="/login"/>

  return (
    <View style={styles.container}>
      
        <Back onPress={()=>router.replace("/sections")}/>
        <Text style={styles.heading}>Your Statistics</Text>
      
      

      <View style={styles.main}>
        <View style={styles.learningStyle}>
          
          <LearningStyleComponent user={user} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "92%",
    borderRadius: 24,
    backgroundColor: "rgba(245, 247, 250, 1)",
    paddingHorizontal: height * 0.024,
    paddingTop: height * 0.02,
    alignSelf:'center'
  },

  

  main: {
    flex: 1,
    marginTop: height * 0.05,
  },

  learningStyle: {
    minHeight: height * 0.4247,
    backgroundColor: "rgba(230, 236, 245, 0.96)",
    borderRadius: 20,
    paddingVertical: height * 0.024,
    boxShadow: "0px 7px 12.5px 2px rgba(0, 0, 0, 0.15)",
    
  },

  heading: {
    fontFamily: "Poppins_600SemiBold",
    color: "#565555",
    fontSize: height * 0.03059,
    textAlign: "center",
  },
});

