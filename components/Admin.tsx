import { Text, View, } from "@/components/Themed";
import { Image } from "expo-image";
import { StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { h, w } from "@/app/_layout";
import { nameWithInitials } from "@/utils";

type Props = {
  id?:string;
  full_name: string;
  uni_name?: string;
  picture?: string;
};

export default function Admin({ id, full_name, uni_name, picture}: Props) {

    
    const imgSource = picture ?? require("@/assets/images/no-dp.svg");

  return (
    <LinearGradient
      style={styles.container}
      colors={["#0B0B0B", "rgba(23, 23, 23, 0.98)", "rgba(46, 46, 46, 0.95)" ]}
      locations={[0.17, 0.34, 0.70]}
      start={{ x: -0.4, y: 0 }}
    >
        
        <Image source={imgSource} style={{width:h*30+w*30, height:h*30+w*30, borderRadius:50}}/>
        <View style={{rowGap:h*6, flex:1}}>
          <View style={{flexDirection:'row',}}>
            <View style={{flex:2*w}}>
            <Text style={styles.name}>{nameWithInitials(full_name)}</Text>
            <Text style={styles.uni_name}>{uni_name}</Text>
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
