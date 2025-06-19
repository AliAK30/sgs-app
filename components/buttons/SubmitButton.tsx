import { Text } from "../Themed";
import { StyleSheet, ActivityIndicator, GestureResponderEvent, TextStyle, StyleProp } from "react-native";
import AnimatedPressable, {AnimatedPressableProps} from "../AnimatedPressable";
import { h, w } from "@/app/_layout";
import {triggerHaptic} from '@/utils';

type Props = AnimatedPressableProps & {
  text: string;
  validBackgroundColor?: string;
  isValid?: boolean;
  invalidBackgroundColor?: string;
  isSubmitting?: boolean;
  textStyle?: StyleProp<TextStyle> | undefined;
  Icon?: ()=>React.ReactNode | undefined;
};

export default function SubmitButton({
  onPress,
  text,
  style,
  textStyle,
  Icon,
  validBackgroundColor = "#007BFF",
  isValid = true,
  invalidBackgroundColor = "rgba(0, 0, 0, 0.4)",
  isSubmitting = false,
  ...props
}: Props) {


  const handlePress = (event: GestureResponderEvent) => {
    if (!isValid) {
      triggerHaptic("feedback-warn");
      return;
    } else {
      triggerHaptic("impact-1");
      onPress(event);
    }
  };

  const styleForPressable = style ? style : [
        styles.button,
        {
          backgroundColor: isValid
            ? validBackgroundColor
            : invalidBackgroundColor,
        },
      ];

  const styleForText = textStyle ? textStyle : styles.text;

  return (
    <AnimatedPressable
      {...props}
      style={styleForPressable}
      onPress={handlePress}
    >
      {Icon && <Icon/>}
      {isSubmitting ? (
        <ActivityIndicator size="small" color="white" />
      ) : (
        <Text style={styleForText}>{text}</Text>
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

  text: {
    fontFamily: "Inter_600SemiBold",
    color: "#ffffff",
    fontSize: h * 8 + w * 8,
    textAlign: "center",
  }
});
