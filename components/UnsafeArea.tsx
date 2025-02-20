import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function UnsafeArea() {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        backgroundColor: "#ffffff",
        width: "100%",
        height: insets.top + insets.bottom,
      }}
    ></View>
  );
}