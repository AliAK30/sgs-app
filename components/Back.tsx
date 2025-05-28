import { Pressable, StyleSheet } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { h, w } from "@/app/_layout"


export default function Back({onPress}: any) {
    return (<Pressable style={styles.close} onPress={onPress} hitSlop={20}>
              <Ionicons name="chevron-back" size={h*12+w*12} color="#565555" />
            </Pressable>)
}


const styles = StyleSheet.create({
    close: {
        borderRadius: 10,
        borderColor: "#565555",
        borderWidth: 1,
        padding:w*3,
        //marginTop: h*0,
        zIndex:1,
        backgroundColor:'white',
        //alignSelf: "flex-start",
        position:'absolute',
      },
})