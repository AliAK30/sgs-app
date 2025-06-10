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

type Props = AnimatedProps<PressableProps> & {
  onPress: (event: GestureResponderEvent) => void;
};

const AP = Animated.createAnimatedComponent(Pressable);

export default function AnimatedPressable({
  children,
  onPress,
  ...props
}: Props) {
  const buttonScale = useSharedValue(1);

  const handlePressIn = () => {
    buttonScale.value = withTiming(0.95, { duration: 80 });
  };

  const handlePressOut = () => {
    buttonScale.value = withTiming(1, { duration: 80 });
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
