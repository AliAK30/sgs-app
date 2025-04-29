import { useState } from "react";
import { View, Text } from "@/components/Themed";
import Modal from "react-native-modal";
import { StyleSheet, Pressable } from "react-native";
import { height } from "../app/_layout";
import { Ionicons, MaterialIcons, Feather } from "@expo/vector-icons";

type stateObj = {
  isVisible: boolean;
  // Message to be displayed, can be any string
  message: string;

  //Title to be displayed
  title: string;
  // Type can be either "success" or "error" or "info"
  type: "success" | "fail" | "info";

};

export function useBanner() {
  const [state, setState] = useState<stateObj>({
    isVisible: false,
    type: "success",
    message: "",
    title: "",
  });

  const openBanner = (
    type: stateObj["type"],
    title: string,
    message: string = "" //default argument
  ) => {

    setTimeout(()=> {setState({ ...state, isVisible: false })}, 2500);

      setState({
        isVisible: true,
        type,
        title,
        message,
      });
  };


  function Banner() {
    const { isVisible, type, message, title } = state;

    let color;
    if (type === "info") {
       
            color="#1981FC"
            
      } else if (type === "success") {
       
            color="#66BB6A"
            
      } else {
        
            color="rgb(209, 0, 0)"
            
      }

    return (
      <Modal
        isVisible={isVisible}
        hasBackdrop={true}
        customBackdrop={
          <Pressable style={styles.backdrop}></Pressable>
        }
        animationIn="slideInDown"
        animationOut="slideOutUp"
        
        style={{justifyContent:'flex-start'}}
      >
        <View style={[{backgroundColor: color}, styles.container]}>
          
          <Text style={[styles.message, {fontFamily: "Inter_500Medium", fontSize: height * 0.019 }]}>
            {title}
          </Text>
          {message!==""&&<Text style={styles.message}>{message}</Text>}
          
        </View>
      </Modal>
    );
  }

  return { ...state, openBanner, Banner};
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 14,
    width: "70%",
    alignSelf: "center",
    minHeight: "6%",
    alignItems: "center",
    justifyContent: 'center',
    paddingTop: height * 0.002,
    paddingHorizontal: height * 0.011,
    flexDirection:'row'
  },

  backdrop: {
    flex: 1,
    backgroundColor: "black",
    opacity: 0,
  },

  message: {
    fontFamily: "Inter_400Regular",
    fontSize: height * 0.016,
    color: "white",
    textAlign: "center",
    lineHeight: 18,
  },

  ok: {
    fontFamily: "Inter_600SemiBold",
    fontSize: height * 0.02,
    color: "#ffffff",
    textAlign: "center",
  },

  button: {
    marginTop: height * 0.02,
    backgroundColor: "#1981FC",
    paddingHorizontal: height*0.03,
    paddingVertical: height*0.007,
    borderRadius:12,
  }
});
