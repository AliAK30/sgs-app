import Animated from "react-native-reanimated";
import {
  TextProps,
  InteractionManager,
  GestureResponderEvent,
} from "react-native";
import {
  useSharedValue,
  withTiming,
  AnimatedProps,
} from "react-native-reanimated";

export type AnimatedPressableTextProps = AnimatedProps<TextProps> & {
  onPress: (event: GestureResponderEvent) => void;
  animationInValue?: number;
  animationInTiming?: number;
  animationOutValue?: number;
  animationOutTiming?: number;
};


export default function AnimatedPressableText({
  children,
  onPress,
  animationInTiming=80,
  animationOutTiming=80,
  animationInValue=0.95,
  animationOutValue=1,
  ...props
}: AnimatedPressableTextProps) {
  const textScale = useSharedValue(1);

  const handlePressIn = () => {
    textScale.value = withTiming(animationInValue, { duration: animationInTiming });
  };

  const handlePressOut = () => {
    textScale.value = withTiming(animationOutValue, { duration: animationOutTiming });
  };

  const handlePress = (event: GestureResponderEvent) => {
    if (onPress)
      InteractionManager.runAfterInteractions(() => {
        onPress(event);
      });
  };

  return (
    <Animated.Text
    {...props}
      style={[{transform: [{scale: textScale}]}, props.style]}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
    >
      {children}
    </Animated.Text>
  );
}