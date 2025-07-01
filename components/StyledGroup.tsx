import { Text, View, } from "@/components/Themed";
import {  StyleSheet } from "react-native";
import { h, w } from "@/app/_layout";
import { GroupType } from "@/types";
import { questions } from "@/constants/Questions";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";

type Props = GroupType & {index:number}

export default function StyledGroup(props:Props) {
  

  return (
    
      <View
        style={[styles.container, {backgroundColor: questions[props.index][0].containerColor }]}
        
      >
        <View style={{ rowGap: h * 6, flex: 1 }}>
            <View>
              <Text style={styles.name}>{props.name}</Text>
              <Text style={styles.uni_name}>{props.uni_name}</Text>
            </View>
          <View style={styles.totalStudents}>
            <FontAwesome5 name="users" size={12}/>
            <Text style={styles.tsText}>{props.totalStudents} {props.totalStudents>1 ? 'Students' : 'Student'}</Text>
          </View>
        </View>
      </View>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor: "rgba(230, 236, 245, 0.96)",
    borderRadius: 20,
    flexDirection: "row",
    paddingHorizontal: 16 * w,
    paddingVertical: 16 * h,
    columnGap: w * 8,
    boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
    marginBottom:h*5,

  },
  name: {
    fontFamily: "Inter_700Bold",
    fontSize: 8 * h + 8 * w,
    color: "#565555",
    maxWidth:170,
  },
  uni_name: {
    fontFamily: "Inter_400Regular",
    fontSize: 5 * h + 5 * w,
    color: "#565555",
    alignSelf: "flex-start",
    paddingVertical: h * 3,
  },
  totalStudents: {
    flexDirection:'row',
    backgroundColor:'white',
    borderRadius:10,
    paddingVertical:h*6,
    justifyContent:'center',
    columnGap:w*3,
    alignItems:'center',
  },
  tsText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 5 * h + 5 * w,
    color: "#000000",
  }

});
