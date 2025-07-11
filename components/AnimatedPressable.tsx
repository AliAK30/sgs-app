import Animated from "react-native-reanimated";
import {
  Pressable,
  PressableProps,
  InteractionManager,
  GestureResponderEvent,
} from "react-native";
import {
  useSharedValue,
  withTiming,
  AnimatedProps,
} from "react-native-reanimated";

export type AnimatedPressableProps = AnimatedProps<PressableProps> & {
  onPress: (event: GestureResponderEvent) => void;
  animationInValue?: number;
  animationInTiming?: number;
  animationOutValue?: number;
  animationOutTiming?: number;
};

const AP = Animated.createAnimatedComponent(Pressable);

export default function AnimatedPressable({
  children,
  onPress,
  animationInTiming=80,
  animationOutTiming=80,
  animationInValue=0.95,
  animationOutValue=1,
  ...props
}: AnimatedPressableProps) {
  const buttonScale = useSharedValue(1);

  const handlePressIn = () => {
    buttonScale.value = withTiming(animationInValue, { duration: animationInTiming });
  };

  const handlePressOut = () => {
    buttonScale.value = withTiming(animationOutValue, { duration: animationOutTiming });
  };

  const handlePress = (event: GestureResponderEvent) => {
    if (onPress)
      InteractionManager.runAfterInteractions(() => {
        onPress(event);
      });
  };

  return (
    <AP
    {...props}
      style={[{transform: [{scale: buttonScale}]}, props.style]}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
    >
      {children}
    </AP>
  );
}
