import { useUserStore } from "@/hooks/useStore";
import { Redirect, router } from "expo-router";
import { ScrollView, StyleSheet, Pressable } from "react-native";
import { Text,View  } from "@/components/Themed";
import { Image, useImage } from "expo-image";
import { height, w, width } from "./_layout";

const imgSource = require("@/assets/images/guy-reads.svg");

//This is where redirection happens


export default function Index() {


  

  const {user, token} = useUserStore();
  
  //if(user?.isSurveyCompleted) return (<Redirect href="/statistics"/>)

  if(token) return (<Redirect href="/(student)"/>)


  const image = useImage(imgSource, {
    maxWidth: 550,
    onError(error, retry){
      console.error("Loading failed:", error.message);
      retry();
    }, 
  });
    
  return (
  <ScrollView contentContainerStyle={
    { flexGrow: 1,
      justifyContent: 'center',
      alignItems:'center',
    }}>

    <View style={styles.container}>
      
      <Image
          source={require("@/assets/images/edumatch.svg")}
          style={[styles.logo,
            {
            width: width * 0.5,
            height: height * 0.2,
          }
        ]}
        />
      

      <Text style={styles.heading}>Select Your Role:</Text>
      
      <Image
        source={image}
        style={[styles.backgroundImg,
        {
          width: (imgSource.width * height) / 817,
          height: (imgSource.height * height) / 817,
        },
      ]}
    />

    <Pressable
              style={[
                styles.button,
                { backgroundColor: "#50BFAF",
                  marginTop: height * 0.02,
                 },
              ]}
              onPress={()=>router.push("/login")}
              >
              <View style={styles.buttonContent}>
              <Image
                source={require("@/assets/images/grad-cap.svg")}
                style={styles.icon}
              />
              <View>  
              <Text style={styles.buttonTitle}>Student</Text>
              <Text style={styles.buttonSubtitle}>Explore Your Learning Journey</Text>
                </View>
              </View>
    </Pressable>

    <Pressable
              style={[
                styles.button,
                { backgroundColor: "#635B92" },
              ]}
              onPress={()=>router.push("/login")}>
              <View style={styles.buttonContent}>
              <Image
                source={require("@/assets/images/gear.svg")}
                style={styles.icon}
              />
              <View>  
              <Text style={styles.buttonTitle}>Admin</Text>
              <Text style={styles.buttonSubtitle}>Manage and Support Learning</Text>
                </View>
              </View>
    </Pressable>
    </View>

  {/* <Redirect href="/login"/> */}
  </ScrollView>
  );   
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "92%",
    backgroundColor: "rgba(173, 216, 230, 0.25)",
  },
  backgroundImg: {
    position: 'absolute',
    bottom: 0,
    left: '10%',
    opacity: 0.65,
    resizeMode: 'contain',
    zIndex: -1,
  },
  logo: {
    alignSelf: 'center',
    paddingTop: '20%',
  },
  heading:
  {
    fontFamily: "Poppins_700Bold",
    color: "#565555",
    fontSize: height * 0.0327,
    marginTop: height * 0.07,
    marginBottom: height * 0.015,
    alignSelf:'flex-start',
    paddingLeft: "11%",
  },
  button: 
  {
    marginBottom: height * 0.01,
    boxShadow: "0px 7px 12.5px 2px rgba(0, 0, 0, 0.20)",
    borderRadius: 30,
    padding: height * 0.01,
    marginTop: height * 0.002,
    width: "85%",
    alignSelf: 'center',
    elevation: 15,
  },
  buttonContent:
  {
    flexDirection: "row",
    alignItems:"center",
    gap: 12,
    paddingLeft: 25,
  },
  icon: 
  {
    width: width * 0.10,
    height: height * 0.10,
    resizeMode: 'contain',
    marginRight: "2%",
  },
  buttonTitle: 
  {
    fontFamily: "Poppins_600SemiBold",
    color: 'white',
    marginBottom: '-3%',
    fontSize: height * 0.026,
  },
  buttonSubtitle: 
  {
    marginTop: height * 0.001, 
    fontFamily: "Poppins_400Regular",
    color: 'white',
    fontSize: height * 0.0145,
  }
});