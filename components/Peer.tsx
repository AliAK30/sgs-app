import { Text, View, TextInput } from "@/components/Themed";
import { Image } from "expo-image";
import { Pressable, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Profile from "./screens/Profile";
import { useState} from "react";
import { h, w } from "@/app/_layout";
import { nameWithInitials } from "@/utils";

type Props = {
  id?:string;
  full_name: string;
  uni_name?: string;
  picture?: string;
  similarity?: number;
  friend?: boolean;
  isFavourite?: boolean;
};

export default function Peer({ id, full_name, uni_name, picture, similarity=-1, friend=false, isFavourite=false }: Props) {

    const [openProfile, setOpenProfile] = useState<boolean>(false);
    const imgSource = picture ?? require("@/assets/images/no-dp.svg");

  return (
    <LinearGradient
      style={styles.container}
      colors={["#0B0B0B", "rgba(23, 23, 23, 0.98)", "rgba(46, 46, 46, 0.95)" ]}
      locations={[0.17, 0.34, 0.70]}
      start={{ x: -0.4, y: 0 }}
    >
        {openProfile && <Profile openProfile={openProfile} setOpenProfile={setOpenProfile} id={id ?? "1"} similarity={similarity}/>}
        <Pressable onPress={()=>setOpenProfile(true)}><Image source={imgSource} style={{width:h*30+w*30, height:h*30+w*30, borderRadius:50}}/></Pressable>
        <View style={{rowGap:h*6, flex:1}}>
          <View style={{flexDirection:'row',}}>
            <View style={{flex:2*w}}>
            <Text style={styles.name}>{nameWithInitials(full_name)}</Text>
            <Text style={styles.uni_name}>{uni_name}</Text>
            </View>
              <View style={{flex:0.9*w, alignItems:'center'}}>
                {similarity>-1 && 
                <>
                  <Text style={{fontFamily:'Inter_700Bold', fontSize:h*9+w*9, color:'#FFFFFF'}}>{similarity}%</Text>
                  <Text style={{fontFamily:'Inter_400Regular', fontSize:h*5+w*5, color:'#FFFFFF'}}>Similarity</Text>
                </>}
        
              </View>
            </View>
        
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
    borderBottomWidth:0.5,
    borderColor:'white',
    alignSelf:'flex-start',
    paddingBottom:h*3,
  },
  
});
