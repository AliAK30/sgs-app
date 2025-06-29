import { h, w, OS } from "@/app/_layout"
import { View, Text } from "./Themed"
import {Href, useRouter } from "expo-router"
import { StyleSheet } from "react-native"

type Props = {
    footerText: string;
    linkText: string;
    link: Href;
}

export default function FooterLink({footerText, linkText, link}:Props) {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <Text style={styles.text}>{footerText} </Text>
            <Text style={styles.linkText} onPress={()=>router.replace(link)}>{linkText}</Text>
        </View>
    )

};

const styles = StyleSheet.create({

    container: { 

        flexDirection: 'row', 
        flex:1, 
        paddingBottom:h*24, 
        alignItems:'flex-end', 
        alignSelf:'center',
    },

    text: {
        fontFamily: "Inter_400Regular",
        fontSize: h*7.5+w*7.5,
        color: "rgba(0, 0, 0, 0.70)",
    },

    linkText: {
        fontFamily: "Inter_600SemiBold",
        color: "#007BFF",
        textDecorationLine: "underline",
        fontSize: h*7.5+w*7.5,
        paddingBottom: OS !== 'web' ? h*1 : 0,    
    }

})