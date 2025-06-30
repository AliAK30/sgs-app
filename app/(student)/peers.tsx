import { Text, View, TextInput } from "@/components/Themed";
import { Pressable, StyleSheet, FlatList } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Feather from "@expo/vector-icons/Feather";
import { useFriendsStore } from "@/hooks/useStore";
import { useNetInfo } from "@react-native-community/netinfo";
import Peer from "@/components/Peer";
import { useAlert } from "@/hooks/useAlert";
import {h, w} from '../_layout'


function Seperator() {
  return <View style={{paddingVertical:h*6}}></View>
}

function Header({text}: any) {
  return <Text style={styles.friends}>{text}</Text>
}

export default function Peers() {
  
  const {Alert} = useAlert()
  const {isConnected} = useNetInfo();
  const {friends} = useFriendsStore();

  
  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
    <LinearGradient
      // Background Linear Gradient
      colors={["#ADD8E6", "#EAF5F8"]}
      locations={[0.15, 0.35]}
      style={styles.container}
    >
      <Alert/>
      <Text style={styles.title}>Your Peers</Text>
      <View style={styles.searchView}>
        <TextInput style={styles.search} placeholder="Search your peers" inputMode="text" placeholderTextColor="#85878D"/>
        <Pressable><Feather name="search" color="black" size={19}/></Pressable>
    </View>

    {isConnected===false ? (
              <Text style={styles.notfound}>No Internet Connection</Text>
            ) : 
              <FlatList
                data={friends}
                renderItem={({ item }) => (
                  <Peer
                    id={item._id}
                    full_name={`${item.first_name} ${item.last_name}`}
                    picture={item.picture}
                    uni_name={item.uni_name}
                    friend={true}
                    isFavourite={item.isFavourite}
                  />
                )}
                keyExtractor={(item, index)=>item?._id ?? ""}
                ItemSeparatorComponent={Seperator}
                ListHeaderComponent={<Header text={`Total Friends (${friends.length})`}/>}
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
  }
});

