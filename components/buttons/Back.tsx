import { StyleSheet } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { h, w } from "@/app/_layout"
import * as Haptics from '@/components/Haptics';
import {useSharedValue, withTiming} from 'react-native-reanimated';
import AnimatedPressable from "../AnimatedPressable";
    
export default function Back({onPress}: any) {
  const buttonScale = useSharedValue(1);   


  const handlePressIn = () => {
    buttonScale.value = withTiming(0.95, { duration: 50 });
  };

  const handlePressOut = () => {
    buttonScale.value = withTiming(1, { duration: 80 });
  };

  const handlePress = () => {
    Haptics.triggerHaptic('impact-1');
    onPress();
  };

  return (
    
      <AnimatedPressable
        style={[styles.close, {transform: [{scale: buttonScale}],}]}
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        hitSlop={20}
      >
        <Ionicons name="chevron-back" size={h*12+w*12} color="#565555" />
      </AnimatedPressable>
    
  );
}


const styles = StyleSheet.create({
  close: {
      borderRadius: 10,
      borderColor: "#565555",
      borderWidth: 1,
      paddingHorizontal:w*2.5,
      paddingVertical:h*2.5,
      alignItems:'center',
      justifyContent:'center',
      alignSelf: "flex-start",
    },
})