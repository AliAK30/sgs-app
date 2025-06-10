import { Text } from "../Themed";
import { StyleSheet, Pressable, ActivityIndicator, GestureResponderEvent } from "react-native";
import {h, w} from "@/app/_layout"
import * as Haptics from '@/components/Haptics';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    } from 'react-native-reanimated';


type Props = {
 onPress : ((event: GestureResponderEvent) => void);
 text: string;
 validBackgroundColor?: string;
 isValid?: boolean
 invalidBackgroundColor ?: string;
 isSubmitting ?: boolean;
}

export default function SubmitButton({onPress, text, validBackgroundColor="#007BFF", isValid=true, invalidBackgroundColor="rgba(0, 0, 0, 0.4)", isSubmitting=true}:Props) {
    const buttonScale = useSharedValue(1);

    const btnAnimatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: buttonScale.value }],
    }));

    const handlePressIn = () => {
        buttonScale.value = withTiming(0.95, { duration: 80 });
      };
    
      const handlePressOut = () => {
        buttonScale.value = withTiming(1, { duration: 80 });
      };

      const handlePress = (event: GestureResponderEvent) => {

        if (!isValid) {
            Haptics.triggerHaptic('feedback-warn');
            return;
          } else {
            Haptics.triggerHaptic('impact-1');
            onPress(event);
          }

        }
    
    return (

      <Animated.View style={btnAnimatedStyle}>
        <Pressable
                  style={[
                    styles.button,
                    { backgroundColor: isValid ? validBackgroundColor : invalidBackgroundColor },
                  ]}
                  onPressIn={handlePressIn}
                  onPressOut={handlePressOut}
                  onPress={handlePress}
                >
                  {isSubmitting ? (
                    <ActivityIndicator size="small" color="white" />
                  ) : (
                    <Text
                      style={{
                        fontFamily: "Inter_600SemiBold",
                        color: "#ffffff",
                        fontSize: h*8 + w*8,
                        textAlign: "center",
                      }}
                    >{text}</Text>
                  )}
                  
          </Pressable>
        </Animated.View>
    )

}

const styles = StyleSheet.create({
button: {
    boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
    borderRadius: 10,
    paddingVertical: h*17,
  },
}) 