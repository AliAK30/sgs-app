import { View, Text } from "@/components/Themed";
import { Pressable, StyleSheet } from "react-native";
import { useState, useRef, useEffect } from "react";
import { height } from "@/app/_layout";

type Props = {
    totalDashes: number,
    focusedDash: number,
}
const returnDashes = (numDashes: number, toFocus: number) => {
    let toReturn = new Array(numDashes);
    for(let i = 0; i < numDashes; i++)
    {
        if(i===toFocus-1)
        {
            toReturn[i] = <View key={i} style={[styles.dash, {backgroundColor: "#1f2429"}]}></View>
            continue;
        }
        toReturn[i] = <View key={i} style={styles.dash}></View>
    }
    return toReturn;
}

export default function DashedProgress({totalDashes, focusedDash}: Props) {

    return (
        <View style={styles.container}>
           
            {returnDashes(totalDashes, focusedDash)}
            
        </View>
    );

}

//{returnDashes(totalDashes, focusedDash).map((Dash)=><Dash/>)}
const styles = StyleSheet.create({

    container: {
        flexDirection: "row",
        columnGap:10.2,
        //alignSelf: "center"
       // width: "100%"
    },

    dash: {
        backgroundColor: "rgba(31, 36, 41, 0.2)",
        height: height*0.0035,
        width: height*0.021,
        borderRadius: 24,
    }
})