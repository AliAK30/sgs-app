import { Text } from "../Themed";
import { StyleSheet, ActivityIndicator, GestureResponderEvent } from "react-native";
import AnimatedPressable from "../AnimatedPressable";
import { h, w } from "@/app/_layout";
import * as Haptics from "@/components/Haptics";

type Props = {
  onPress: (event: GestureResponderEvent) => void;
  text: string;
  validBackgroundColor?: string;
  isValid?: boolean;
  invalidBackgroundColor?: string;
  isSubmitting?: boolean;
};

export default function SubmitButton({
  onPress,
  text,
  validBackgroundColor = "#007BFF",
  isValid = true,
  invalidBackgroundColor = "rgba(0, 0, 0, 0.4)",
  isSubmitting = false,
}: Props) {


  const handlePress = (event: GestureResponderEvent) => {
    if (!isValid) {
      Haptics.triggerHaptic("feedback-warn");
      return;
    } else {
      Haptics.triggerHaptic("impact-1");
      onPress(event);
    }
  };

  return (
    <AnimatedPressable
      style={[
        styles.button,
        {
          backgroundColor: isValid
            ? validBackgroundColor
            : invalidBackgroundColor,
        },
      ]}
      onPress={handlePress}
    >
      {isSubmitting ? (
        <ActivityIndicator size="small" color="white" />
      ) : (
        <Text
          style={{
            fontFamily: "Inter_600SemiBold",
            color: "#ffffff",
            fontSize: h * 8 + w * 8,
            textAlign: "center",
          }}
        >
          {text}
        </Text>
      )}
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  button: {
    boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
    borderRadius: 10,
    paddingVertical: h * 17,
  },
});
