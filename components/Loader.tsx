import { View } from "./Themed";
import { ActivityIndicator, ActivityIndicatorProps } from "react-native";

export default function Loader(props: ActivityIndicatorProps) {
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <ActivityIndicator {...props} />
    </View>
  );
}
