import { View, Text, TextInput } from "@/components/Themed";
import { StyleSheet, ScrollView, Pressable, } from "react-native";
import { useUserStore } from "@/hooks/useStore";
import { useState } from "react";
import { Image } from "expo-image";
import SearchResult from "@/components/SearchResult";
import { Feather, Ionicons } from "@expo/vector-icons";
import {w, h,} from "../_layout"
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import SimilarStudents from "@/components/SimilarStudents";




export default function Index() {

    const [click, setClick] = useState<number>(0);
    const [fetching, setFetching] = useState<boolean>(false)
    const router = useRouter();
    const {user} = useUserStore();
    const [value, setValue] = useState<string>("")
    const imgSource = user?.picture ?? require("@/assets/images/no-dp.svg");
    const imgSource2 = require("@/assets/images/bino.png");
    
    if(click === 1)
        return (<SearchResult value={value} fetching={fetching} setFetching={setFetching} setValue={setValue} setClick={setClick}/>);

    if(click === 2)
        return (<SimilarStudents id={user?._id ?? ""} fetching={fetching} setFetching={setFetching} setClick={setClick}/>)
  return (
    <ScrollView 
    automaticallyAdjustKeyboardInsets={true}
      keyboardDismissMode="none"
      contentContainerStyle={styles.container}
      style={{backgroundColor: '#FFFFFF'}}>
        <View style={{flexDirection:'row', justifyContent:'space-between'}}>
            
            <View>
            <Text style={styles.title}>Welcome {user?.first_name} 👋</Text>
            <Text style={styles.belowTitle}>Connect, Collaborate, Learn in your style!</Text>
            </View>
            <Image source={imgSource} style={{width:h*26+w*26, height:h*26+w*26, borderRadius:'100%'}}/>
            
            
        </View>
        <View style={{flexDirection:'row', columnGap:w*8}}>
            <View style={styles.searchView}>
                <TextInput style={styles.search} placeholder="Find peers by name.." inputMode="text" value={value} onChangeText={setValue} placeholderTextColor="#85878D"/>
                <Pressable onPress={()=>{setFetching(true); setClick(1);}} hitSlop={15}><Feather name="search" color="black" size={19}/></Pressable>
            </View>
            <View style={styles.bell}>
                <Ionicons name="notifications-outline" color="black" size={19}/>
            </View>
        </View>
        <Pressable onPress={()=>setClick(2)}>
        <LinearGradient
              style={{flexDirection:'row',borderRadius:20}}
              colors={["#0B0B0B", "rgba(23, 23, 23, 0.98)", "rgba(46, 46, 46, 0.95)" ]}
              locations={[0.17, 0.34, 0.70]}
              start={{ x: 0.5, y: 0 }}
            >
                <Image source={imgSource2} style={{width:152, height:68}}/>
                <View style={{justifyContent:'center', rowGap:h*4,}}>
                    <Text style={styles.findTwin}>Find your Study Twin</Text>
                    <Text style={styles.findTwinSubText}>and learn together like never before!</Text>
                </View>
                    
        </LinearGradient>
        </Pressable>
        
    </ScrollView>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "rgba(173, 216, 230, 0.25)",
        borderRadius: 24,
        paddingHorizontal: w*15,
        paddingTop: h*25,
        width:"92%",
        alignSelf:'center',
        rowGap:h*20
      },

    title: {
        fontFamily: 'Poppins_600SemiBold',
        color: "#565555",
        fontSize: 14*w+14*h
    },

    belowTitle: {
        fontFamily: 'Inter_500Medium',
        color:'#85878D',
        fontSize: w*5.5+h*5.5,
    },
    searchView: {
        flex:1,
        flexDirection:'row',
        backgroundColor:'#FFFFFF',
        borderRadius:9.4,
        borderColor:'#E7EAE9',
        borderWidth:0.78,
        paddingVertical:h*10,
        paddingHorizontal:w*10,
        alignItems:'center',
        columnGap:w*25,
        
    },

    bell: {
        backgroundColor:'#FFFFFF',
        borderRadius:9.4,
        borderColor:'#E7EAE9',
        borderWidth:0.78,
        paddingVertical:h*10,
        paddingHorizontal:w*10,
        alignItems:'center',
        
        
    },
    search: {
        flex:1,
        fontFamily: 'Inter_500Medium',
        color:'#85878D',
        fontSize: w*8.5+h*8,
        outlineWidth:0
    },

    findTwin: {
        color: '#ADD8E6',
        fontFamily:'Inter_600SemiBold',
        fontSize: 8.5*w+8.5*h,
    },

    findTwinSubText: {
        color: "#FFFEFE",
        fontFamily:'Inter_400Regular',
        fontSize:5*h+5*w,
    }
});

