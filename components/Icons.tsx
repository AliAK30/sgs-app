import Ionicons from "@expo/vector-icons/Ionicons";
import {h,w } from "@/app/_layout";
import { Pressable } from "react-native";



export const WarnIcon = () => {
  return (
    <Ionicons
      name="warning-outline"
      color="red"
      size={h*10+w*10}
    />
  );
};

export const EyeIcon = ({name, onTap}: any) => {
  return (
    <Pressable onPress={onTap} hitSlop={10}>
    <Ionicons
      name={name}
      color="black"
      size={h*10+w*10}
      
    />
    </Pressable>
  );
}