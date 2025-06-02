import { View, Text, Pressable, StyleSheet, Dimensions } from 'react-native'
import React from 'react'
import { Feather} from "@expo/vector-icons"

const { height } = Dimensions.get('window');
const iconSize: number = 28;

interface NextButtonProps {
  onPress: () => void;
}

const NextButton: React.FC<NextButtonProps> = ({ onPress }) => {
  return (
    <Pressable 
      style={styles.button}
      onPress={onPress}
      android_ripple={{ color: 'rgba(255, 255, 255, 0.2)' }}
    >
      <View style={styles.arrowContainer}>
        <Feather size={iconSize} name="chevron-right" color='white' />
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  button: {
    width: height * 0.06,
    height: height * 0.06,
    borderRadius: height * 0.03,
    backgroundColor: '#007BFF',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  
  arrowContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  arrow: {
    color: '#FFFFFF',
    fontSize: height * 0.025,
    fontWeight: 'bold',
  },
});

export default NextButton