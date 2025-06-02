import { Text, View, TextInput } from "@/components/Themed";
import { Pressable, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Feather from "@expo/vector-icons/Feather";
import { Redirect, useRouter } from "expo-router";
import { useNetInfo } from "@react-native-community/netinfo";
import axios from "axios";
import { url } from "@/constants/Server";
import { useAlert } from "@/hooks/useAlert";
import {h, w} from '../_layout'


export default function Admins() {
  
  const {Alert} = useAlert()
  const router = useRouter();
  
  const admins = 1;

  
  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
    <LinearGradient
      // Background Linear Gradient
      colors={["#ADD8E6", "#EAF5F8"]}
      locations={[0.15, 0.35]}
      style={styles.container}
    >
      <Alert/>
      <Text style={styles.title}>Admins</Text>
      <View style={styles.searchView}>
        <TextInput style={styles.search} placeholder="Search groups" inputMode="text" placeholderTextColor="#85878D"/>
        <Feather name="search" color="black" size={19}/>
        <Pressable><Feather name="search" color="black" size={19}/></Pressable>
    </View>

    <Text style={styles.friends}>Total Admins ({admins})</Text>
    </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "92%",
    borderRadius: 24,
    backgroundColor: "rgba(173, 216, 230, 0.25)",
    paddingHorizontal: 15*w,
    alignSelf:'center',
    paddingTop:h*13
  },

   title: {
    fontFamily: "Poppins_600SemiBold",
    color: "#565555",
    fontSize: h * 12.5+w*12.5,
    textAlign: 'center',
  },
  searchView: {
        
        flexDirection:'row',
        backgroundColor:'#FFFFFF',
        borderRadius:9.4,
        borderColor:'#E7EAE9',
        borderWidth:0.78,
        paddingVertical:h*10,
        paddingHorizontal:w*10,
        alignItems:'center',
        columnGap:w*25,
        marginVertical: h*20
    },
    search: {
        flex:1,
        fontFamily: 'Inter_500Medium',
        color:'#85878D',
        fontSize: w*8.5+h*8,
        outlineWidth:0
    },

    friends : {
    fontFamily: "Inter_600SemiBold",
    color: "#565555",
    fontSize: h *8+w*8,
    paddingLeft:w*4
  },
});

