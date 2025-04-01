import { Pressable, StyleSheet } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { height } from "@/app/_layout"


export default function Back({onPress}: any) {
    return (<Pressable style={styles.close} onPress={onPress}>
              <Ionicons name="chevron-back" size={height * 0.034} color="#565555" />
            </Pressable>)
}


const styles = StyleSheet.create({
    close: {
        borderRadius: 10,
        borderColor: "#565555",
        borderWidth: 1,
        marginTop: height * 0.0257,
        alignSelf: "flex-start",
      },
})