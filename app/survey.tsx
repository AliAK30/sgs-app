import { Text, View } from '@/components/Themed';
import { StyleSheet } from 'react-native';
import { useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { questions } from '@/constants/Questions';

export default function Survey() {

    const [count, setCount] = useState(0);

  return (
    <View style={[styles.container, {backgroundColor: questions[count].containerColor,}]}>
      
    </View>
  );
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        marginVertical: "3%",
        borderRadius: 24,
        alignItems: "center",
    },
  
});
