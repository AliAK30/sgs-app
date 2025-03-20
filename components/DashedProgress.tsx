import { View } from "@/components/Themed";
import { Pressable, StyleSheet } from "react-native";
import { height, width } from "@/app/_layout";

type Props = {
    totalDashes: number,
    focusedDash: number,
    onPress: (num: number)=>void
}

const returnDashes = (numDashes: number, toFocus: number, onPress: (num: number)=>void) => {
    let toReturn = new Array(numDashes);
    for(let i = 0; i < numDashes; i++)
    {
        if(i===toFocus-1)
        {
            toReturn[i] = <Pressable key={i+1} style={[styles.dash, {backgroundColor: "#1f2429"}]} ></Pressable>
            continue;
        }
        toReturn[i] = <Pressable key={i+1} style={styles.dash} hitSlop={15} onPress={()=>onPress(i+1)}></Pressable>
    }
    return toReturn;
}

export default function DashedProgress({totalDashes, focusedDash, onPress}: Props) {

    return (
        <View style={styles.container}>
           
            {returnDashes(totalDashes, focusedDash, onPress)}
            
        </View>
    );

}

//{returnDashes(totalDashes, focusedDash).map((Dash)=><Dash/>)}
const styles = StyleSheet.create({

    container: {
        flexDirection: "row",
        columnGap:10.2,
        alignSelf: "center"
       // width: "100%"
    },

    dash: {
        backgroundColor: "rgba(31, 36, 41, 0.2)",
        height: height*0.005,
        width: width*0.042,
        borderRadius: 24,
    }
})