import { Text, View, TextInput } from "@/components/Themed";
import { Pressable, StyleSheet, FlatList, ActivityIndicator } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Feather from "@expo/vector-icons/Feather";
import { useNetInfo } from "@react-native-community/netinfo";
import {h, w} from '../_layout'
import { useGroupStore } from "@/hooks/useStore";
import { useState,useRef } from "react";
import GroupDetails from "@/components/screens/GroupDetails";
import Group from "@/components/Group";


function Seperator() {
  return <View style={{paddingVertical:h*6}}></View>
}

function Header({text}: any) {
  return <Text style={styles.friends}>{text}</Text>
}

export default function Groups() {
  

  const {groups} = useGroupStore();
    const [click, setClick] = useState<number>(0);
    const indexRef = useRef<number>(0);
    const { isConnected } = useNetInfo();

  
  if (click === 1)
      return (
        <GroupDetails
          setShowGD={setClick}
          id={groups[indexRef.current]._id}
          name={groups[indexRef.current].name}
          dim1={groups[indexRef.current].dim1.name}
          dim2={groups[indexRef.current].dim2.name}
          dim3={groups[indexRef.current].dim3.name}
          dim4={groups[indexRef.current].dim4.name}
          uni_name={groups[indexRef.current].uni_name}
          gender={groups[indexRef.current].gender}
        />
      );
  
 

  
  return (
    
    <LinearGradient
      // Background Linear Gradient
      colors={["#ADD8E6", "#EAF5F8"]}
      locations={[0.15, 0.35]}
      style={styles.container}
    >
      
      <Text style={styles.title}>Your Groups</Text>
      <View style={styles.searchView}>
        <TextInput style={styles.search} placeholder="Search your groups" inputMode="text" placeholderTextColor="#85878D"/>
        <Feather name="search" color="black" size={19}/>
        <Pressable><Feather name="search" color="black" size={19}/></Pressable>
    </View>

    {isConnected===false ? (
                  <Text style={styles.notfound}>No Internet Connection</Text>
                ) :  
                  <FlatList
                  
                    data={groups}
                    renderItem={({ item, index }) => (
                      <Pressable onPress={() => {indexRef.current = index; setClick(1);}}>
                      <Group
                        id={item._id}
                        name={item.name}
                        gender={item.gender}
                        uni_name={item.uni_name}
                        dim1={item.dim1.name}
                        dim2={item.dim2.name}
                        dim3={item.dim3.name}
                        dim4={item.dim4.name}
                      />
                      </Pressable>
                    )}
                    keyExtractor={(item, index)=>item?._id ?? ""}
                    ItemSeparatorComponent={Seperator}
                    ListHeaderComponent={<Header text={`Total Groups (${groups.length})`}/>}
                    ListFooterComponent={<Seperator/>}
                    ListEmptyComponent={<Text style={[styles.notfound, {paddingTop:h*20}]}>No Groups found</Text>}
                  />
               }
    </LinearGradient>
    
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

  notfound: {
      fontFamily: "Inter_700Bold",
      color: "#565555",
      fontSize: h * 8 + w * 8,
      textAlign:'center'
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
    },

    friends : {
    fontFamily: "Inter_600SemiBold",
    color: "#565555",
    fontSize: h *8+w*8,
    paddingLeft:w*4,
    paddingBottom:h*10,
  },
});

