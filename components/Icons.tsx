import { Ionicons } from "@expo/vector-icons";
import { height } from "@/app/_layout";
import { Pressable } from "react-native";

export const WarnIcon = () => {
  return (
    <Ionicons
      name="warning-outline"
      color="red"
      size={height * 0.02447}
      style={{ position: "absolute", right: 0.01199*height, top:0.0155*height }}
    />
  );
};

export const EyeIcon = ({name, onTap}: any) => {
  return (
    <Pressable onPress={onTap} hitSlop={10} style={{ position: "absolute", right: 0.01199*height, top:0.0155*height }}>
    <Ionicons
      name={name}
      color="black"
      size={height * 0.02447}
      
    />
    </Pressable>
  );
}