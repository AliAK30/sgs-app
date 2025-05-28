import { View, Text, TextInput } from "@/components/Themed";
import { StyleSheet, ScrollView, Pressable, } from "react-native";
import { useUserStore } from "@/hooks/useStore";
import { useState } from "react";
import { Image } from "expo-image";
import SearchResult from "@/components/SearchResult";
import { Feather, Ionicons } from "@expo/vector-icons";
import {w, h, width, OS} from "../_layout"
import { router, useRouter } from "expo-router";




export default function Index() {

    const [click, setClick] = useState<boolean>(false);
    const router = useRouter();
    const {user} = useUserStore();
    const [value, setValue] = useState<string>("")
    const imgSource = user?.picture ?? require("@/assets/images/no-dp.svg");
    
    if(click)
        return (<SearchResult value={value} click={click} setValue={setValue} setClick={setClick}/>);
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
                <Pressable onPress={()=>setClick(true)}><Feather name="search" color="black" size={19}/></Pressable>
            </View>
            <View style={styles.bell}>
                <Ionicons name="notifications-outline" color="black" size={19}/>
            </View>
        </View>
        
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
        rowGap:h*15
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
        marginRight:w*4
        
    },
    search: {
        flex:1,
        fontFamily: 'Inter_500Medium',
        color:'#85878D',
        fontSize: w*8.5+h*8,
        outlineWidth:0
    },

});

