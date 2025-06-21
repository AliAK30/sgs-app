import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Props= {
bottom?: boolean;
};

export default function UnsafeArea({bottom=false}:Props) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        backgroundColor: "#ffffff",
        width: "100%",
        height: bottom ? insets.bottom-10 : insets.top,
       
      }}
    ></View>
  );
}