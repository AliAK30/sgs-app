import { Text, View, TextInput } from "@/components/Themed";
import { Image } from "expo-image";
import { Pressable, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Profile from "./Profile";
import { useState, useEffect } from "react";
import { Redirect, useRouter } from "expo-router";
import { useNetInfo } from "@react-native-community/netinfo";
import axios from "axios";
import { url } from "@/constants/Server";
import { useAlert } from "@/hooks/useAlert";
import { useUserStore } from "@/hooks/useStore";
import { h, w } from "@/app/_layout";

type Props = {
  id?:string;
  full_name: string;
  uni_name?: string;
  picture?: string;
};

export default function Peer({ id, full_name, uni_name, picture }: Props) {

    const [openProfile, setOpenProfile] = useState<boolean>(false);
    const imgSource = picture ?? require("@/assets/images/no-dp.svg");

  return (
    <LinearGradient
      style={styles.container}
      colors={["#0B0B0B", "rgba(23, 23, 23, 0.98)", "rgba(46, 46, 46, 0.95)" ]}
      locations={[0.17, 0.34, 0.70]}
      start={{ x: -0.4, y: 0 }}
    >
        {openProfile && <Profile openProfile={openProfile} setOpenProfile={setOpenProfile} id={id ?? "1"}/>}
        <Pressable onPress={()=>setOpenProfile(true)}><Image source={imgSource} style={{width:h*30+w*30, height:h*30+w*30, borderRadius:"100%"}}/></Pressable>
        <View style={{rowGap:h*2}}>
            <Text style={styles.name}>{full_name}</Text>
            <Text style={styles.uni_name}>{uni_name}</Text>
            <View style={{paddingTop:h*2,borderBottomWidth:0.5, borderColor:'#FFFFFF'}}></View>
        </View>
        <View style={{justifyContent:'flex-end', flex:1}}>

        
        <Pressable style={styles.addFriendButton}>
            <Text style={styles.add}>Add to Peers</Text>
        </Pressable>
        </View>
        
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(230, 236, 245, 0.96)",
    borderRadius: 20,
    flexDirection:'row',
    paddingHorizontal:16*w,
    paddingVertical:16*h,
    columnGap: w*8,
  },
  name: {
    fontFamily: "Inter_700Bold",
    fontSize: 8 * h + 8 * w,
    color:'#FFFFFF',
  },
  uni_name: {
    fontFamily: "Inter_400Regular",
    fontSize: 4.5 * h + 4.5 * w,
    color:'#FFFFFF',
  },
  addFriendButton: {
    backgroundColor: "#539DF3",
    borderRadius:5,
    alignSelf:'flex-end',
    paddingHorizontal:7*w,
    paddingVertical:4*h,
    //justifyContent:'flex-end'
  },
  add: {
    fontFamily:'Inter_500Medium',
    fontSize:h*6+w*6,
    color:'#FFFFFF',
  }
});
