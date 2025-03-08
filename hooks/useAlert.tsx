import { useState } from "react";
import { View, Text, } from "@/components/Themed";
import Modal from "react-native-modal"
import { StyleSheet, Pressable } from "react-native";
import { height } from "../app/_layout";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

type stateObj = {
    isVisible: boolean;
    // Message to be displayed, can be any string
    message: string;
    // Type can be either "success" or "error" or "info"
    type: "success" | "fail" | "info";
    // Function to resolve the promise
    resolvePromise?: () => void;
  };

export function useAlert() {

    const [state, setState] = useState<stateObj>({
        isVisible: false,
        type: "success",
        message: "",
      });
    
      const openAlert = (
        type: stateObj["type"],
        message: string
      ): Promise<void> => {
        return new Promise((resolve) => {
            //promise state will remain pending unless resolve() is called, so you can use await
          setState({ isVisible: true, type, message, resolvePromise: resolve });
        });
      };

      const closeAlert = () => {
        state.resolvePromise && state.resolvePromise();
        setState({ ...state, isVisible: false });
      }

      function Alert() {
      
          const {isVisible, type, message } = state;
      
          
          const Icon = () => {
      
              if(type === "info")
              {
                  return (
                      
                      <Ionicons name="information-circle" color="rgba(83, 157, 243, 1)" size={height*0.045} style={{marginBottom:height*0.009}}/>
                     
                  )
      
              }
              else if(type === "success")
              {
                  return (
                      
                      <Ionicons name="checkmark-circle" color="rgb(3, 168, 25)" size={height*0.045} style={{marginBottom:height*0.009}}/>
                     
                  )
              }
              else {
                  return (
                      
                      <MaterialIcons name="error" color="rgb(209, 0, 0)" size={height*0.045} style={{marginBottom:height*0.009}}/>
                     
                  )
      
              }
              
          }
      
      
          return (
      
                <Modal isVisible = {isVisible} hasBackdrop={true} customBackdrop={
                  <Pressable onPress={closeAlert} style={styles.backdrop}>
                  </Pressable>
                }
                animationIn="fadeIn"
                animationOut="fadeOut"
                >
                  
                  <View style={styles.container}>
                  <Icon/>
                  <Text style={styles.text}>{message}</Text>
                  <Pressable onPress={closeAlert} style={{marginTop:height*0.020}}><Text style={styles.ok}>OK</Text></Pressable>
                  </View>
                  
                </Modal>
              
            );
      
      }

      return {...state, openAlert, closeAlert, Alert};

}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#ffffff",
        borderRadius: 14,
        maxWidth: "85%",
        minWidth: "60%",
        alignSelf: "center",
        minHeight: "10%",
        alignItems: "center",
        justifyContent: "space-evenly",
        paddingBottom: height*0.013,
        paddingTop: height*0.006,
        paddingHorizontal: height * 0.011,
    },
    
    backdrop: { 
        flex: 1, 
        backgroundColor: "black",
        opacity: 0.4,
    },

    text: {
        fontFamily: "Inter_400Regular",
        fontSize: height * 0.0181,
        color: "black",
        textAlign: "center",
        lineHeight: 18,
    },

    ok: {
        fontFamily: "Inter_600SemiBold",
        fontSize: height * 0.02,
        color: "rgb(1, 105, 224)",
        textAlign: "center",
        
    }
})