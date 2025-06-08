import Ionicons from "@expo/vector-icons/Ionicons";
import { height } from "@/app/_layout";
import { Pressable } from "react-native";



export const WarnIcon = () => {
  return (
    <Ionicons
      name="warning-outline"
      color="red"
      size={height * 0.02447}
    />
  );
};

export const EyeIcon = ({name, onTap}: any) => {
  return (
    <Pressable onPress={onTap} hitSlop={10}>
    <Ionicons
      name={name}
      color="black"
      size={height * 0.02447}
      
    />
    </Pressable>
  );
}