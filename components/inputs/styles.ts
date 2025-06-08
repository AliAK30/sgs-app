import { StyleSheet } from "react-native";
import {h, w} from "@/app/_layout";


const inputStyles = StyleSheet.create({

input: {
    fontFamily: "Inter_400Regular",
    fontSize: h * 8 + w * 8,
    color: "rgba(0, 0, 0, 1)",
    flex:1,
  },

  inputError: {
    fontFamily: "Inter_400Regular",
    fontSize: h * 6 + w * 6,
    color: "rgb(255, 0, 0)",
  },
})

export default inputStyles;