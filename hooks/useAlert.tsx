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
  // Function to resolve the promise
  resolvePromise?: () => void;
};

export function useAlert() {
  const [state, setState] = useState<stateObj>({
    isVisible: false,
    type: "success",
    message: "",
    title: "",
  });

  const openAlert = (
    type: stateObj["type"],
    title: string,
    message: string = "" //default argument
  ): Promise<void> => {
    return new Promise((resolve) => {
      //promise state will remain pending unless resolve() is called, so you can use await
      setState({
        isVisible: true,
        type,
        title,
        resolvePromise: resolve,
        message,
      });
    });
  };

  const closeAlert = () => {
    state.resolvePromise && state.resolvePromise();
    setState({ ...state, isVisible: false });
  };

  function Alert() {
    const { isVisible, type, message, title } = state;

    const Icon = () => {
      if (type === "info") {
        return (
          <Ionicons
            name="information-circle-outline"
            color="#1981FC"
            size={height * 0.045}
            style={{ marginBottom: height * 0.009 }}
          />
        );
      } else if (type === "success") {
        return (
          <Feather
            name="check-circle"
            color="#66BB6A"
            size={height * 0.045}
            style={{ marginBottom: height * 0.009 }}
          />
        );
      } else {
        return (
          <MaterialIcons
            name="error-outline"
            color="rgb(209, 0, 0)"
            size={height * 0.045}
            style={{ marginBottom: height * 0.009 }}
          />
        );
      }
    };

    return (
      <Modal
        isVisible={isVisible}
        hasBackdrop={true}
        customBackdrop={
          <Pressable onPress={closeAlert} style={styles.backdrop}></Pressable>
        }
        animationIn="fadeIn"
        animationOut="fadeOut"
      >
        <View style={styles.container}>
          <Icon />
          <Text style={[styles.message, {fontFamily: "Inter_500Medium", fontSize: height * 0.019 }]}>
            {title}
          </Text>
          {message!==""&&<Text style={styles.message}>{message}</Text>}
          <Pressable
            onPress={closeAlert}
            style={styles.button}
          >
            <Text style={styles.ok}>OK</Text>
          </Pressable>
        </View>
      </Modal>
    );
  }

  return { ...state, openAlert, closeAlert, Alert };
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ffffff",
    borderRadius: 14,
    width: "90%",
    alignSelf: "center",
    minHeight: "10%",
    alignItems: "center",
    justifyContent: "space-evenly",
    paddingBottom: height * 0.013,
    paddingTop: height * 0.025,
    paddingHorizontal: height * 0.011,
  },

  backdrop: {
    flex: 1,
    backgroundColor: "black",
    opacity: 0.4,
  },

  message: {
    fontFamily: "Inter_400Regular",
    fontSize: height * 0.016,
    color: "black",
    textAlign: "center",
    lineHeight: 18,
    paddingTop: height*0.01,
    paddingHorizontal: height*0.03,
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
    //borderWidth: 1,
    paddingHorizontal: height*0.03,
    paddingVertical: height*0.007,
    borderRadius:12,
  }
});
