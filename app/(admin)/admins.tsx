import { Text, View, TextInput } from "@/components/Themed";
import { Pressable, StyleSheet, FlatList } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Feather from "@expo/vector-icons/Feather";
import { useAdminsStore } from "@/hooks/useStore";
import { useAlert } from "@/hooks/useAlert";
import { useNetInfo } from "@react-native-community/netinfo";
import {h, w} from '../_layout'
import Admin from "@/components/Admin";


function Seperator() {
  return <View style={{paddingVertical:h*6}}></View>
}

function Header({text}: any) {
  return <Text style={styles.friends}>{text}</Text>
}


export default function Admins() {
  
  const {Alert} = useAlert();
  const {isConnected} = useNetInfo();
  const {admins} = useAdminsStore();

  
  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
   <LinearGradient
             // Background Linear Gradient
             colors={["#D6EBF2", "#FDFEFE"]}
             locations={[0.11, 1]}
             style={styles.container}
           >
      <Alert/>
      <Text style={styles.title}>Admins</Text>
      <View style={styles.searchView}>
        <TextInput style={styles.search} placeholder="Search admins" inputMode="text" placeholderTextColor="#85878D"/>
        <Pressable><Feather name="search" color="black" size={19}/></Pressable>
    </View>

    {isConnected===false ? (
                  <Text style={styles.notfound}>No Internet Connection</Text>
                ) : 
                  <FlatList
                    data={admins}
                    renderItem={({ item }) => (
                      <Admin
                        id={item._id}
                        full_name={`${item.first_name} ${item.last_name}`}
                        picture={item.picture}
                        uni_name={item.uni_name}
                      />
                    )}
                    keyExtractor={(item, index)=>item?._id ?? ""}
                    ItemSeparatorComponent={Seperator}
                    ListHeaderComponent={<Header text={`Total Admins (${admins.length})`}/>}
                    ListFooterComponent={<Seperator/>}
                    ListEmptyComponent={<Text style={[styles.notfound, {paddingTop:h*20}]}>No Friends Added</Text>}
                  />
               }
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
  notfound: {
    fontFamily: "Inter_700Bold",
    color: "#565555",
    fontSize: h * 8 + w * 8,
    textAlign:'center'
  },
});

