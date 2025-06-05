import { Text, View, TextInput } from "@/components/Themed";
import { FlatList, Pressable, StyleSheet, ActivityIndicator } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Back from "./Back";
import { useState, useEffect, useRef,} from "react";
import { useNetInfo } from "@react-native-community/netinfo";
import axios from "axios";
import { url } from "@/constants/Server";
import { useAlert } from "@/hooks/useAlert";
import { useUserStore } from "@/hooks/useStore";
import { h, w } from "@/app/_layout";
import { User } from "@/types";
import Peer from "./Peer";

type Props = {
  fetching: boolean;
  id: string;
  setFetching: React.Dispatch<React.SetStateAction<boolean>>;
  setClick: React.Dispatch<React.SetStateAction<number>>;
};

type ExtendedUser = { full_name: string, similarity: number } & User;

function Seperator() {
  return <View style={{paddingVertical:h*6}}></View>
}

function Header() {
  return <Text style={styles.friends}>Recommendations</Text>
}

function SimilarStudents({
  id,
  setClick,
  fetching, setFetching
}: Props) {

  const [results, setResults] = useState<Array<ExtendedUser>>([]);
  const [fetchingMore, setFetchingMore] = useState<boolean>(false);
  const { Alert, openAlert } = useAlert();
  const { isConnected } = useNetInfo();
  const { token } = useUserStore();
  const page = useRef<number>(1);
  const hasMore = useRef<boolean>(true);

  const fetchStudents = async (pageNum: number) => {
    try {
      
      if (isConnected || isConnected===null) {
       
          
          if (pageNum === 1) {
            setFetching(true);
          } else {
            setFetchingMore(true);
          }

          const res: any = await axios.get(`${url}/student/similarities/${id}`, {
            params: { page: pageNum },
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            timeout: 1000 * 25,
          });

          hasMore.current = res.data.hasMore;
          page.current = res.data.currentPage+1;
          
          if (pageNum === 1) {
            
            setResults(res.data.students);
          } else {
            setResults(prev => [...prev, ...res.data.students]);
          }

        
      } else {
        await openAlert("fail", "Failed!", "No Internet Connection!");
        return;
      }
    } catch (e: any) {
      if (!e.status) {
        switch (e.code) {
          case "ECONNABORTED":
            await openAlert(
              "fail",
              "Failed!",
              "Request TImed out\nPlease try again later!"
            );
            return;

          case "ERR_NETWORK":
            await openAlert(
              "fail",
              "Failed!",
              "Server is not Responding\nPlease try again later!"
            );
            return;
        }
      }

      if (e.status >= 500) {
        await openAlert("fail", "Failed!", e.message);
        return;
      } else {
        await openAlert("fail", "Failed!", e.response.data.message);
        setClick(0);
        return;
      }
    } finally {
      if (pageNum === 1) {
          setFetching(false);
        } else {
          setFetchingMore(false);
        }
    }
  }

  useEffect(() => {
    
    if(isConnected || isConnected===null)
    {
      
      page.current = 1;
      hasMore.current = true;
      fetchStudents(page.current);
    } 
  }, []);

  

  const handleEndReached = () => {
    if (hasMore.current && !fetchingMore) {
      fetchStudents(page.current);
      return;
    }
  };
  
  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <LinearGradient
        // Background Linear Gradient
        colors={["#ADD8E6", "#EAF5F8"]}
        locations={[0.15, 0.35]}
        style={styles.container}
      >
        
        <View style={{justifyContent:'center'}}>
          <Back onPress={() => setClick(0)} />
            <View style={{position:'absolute', alignSelf:'center'}}>
          <Text style={styles.title}>Similar to you</Text>
          </View>
        </View>
        <Alert />

        
        {isConnected===false ? (
          <Text style={styles.notfound}>No Internet Connection</Text>
        ) : fetching ? <View style={{flex:1, justifyContent:'center'}}><ActivityIndicator size="large" color="grey"/></View> : 
          <FlatList
            data={results}
            renderItem={({ item }) => (
              <Peer
                id={item._id}
                full_name={item.full_name}
                picture={item.picture}
                uni_name={item.uni_name}
                similarity={item.similarity}
              />
            )}
            keyExtractor={(item, index)=>item?._id ?? ""}
            ItemSeparatorComponent={Seperator}
            ListHeaderComponent={<Header/>}
            ListFooterComponent={fetchingMore ? <ActivityIndicator size="small" color="gray" style={{paddingTop:h*15}}/> : <Seperator/>}
            onEndReached={handleEndReached}
            //onEndReachedThreshold={0.01}
            ListEmptyComponent={<Text style={[styles.notfound, {paddingTop:h*20}]}>No Similar students found</Text>}
          />
       }
       
      
      </LinearGradient>
    </View>
  );
}

export default SimilarStudents;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "92%",
    borderRadius: 24,
    //backgroundColor: "rgba(173, 216, 230, 0.25)",
    //backgroundColor: 'white',
    paddingHorizontal: 15 * w,
    alignSelf: "center",
    paddingTop: h * 20,
    rowGap: h*20
  },

  title: {
    fontFamily: "Poppins_600SemiBold",
    color: "#565555",
    fontSize: h * 12.5 + w * 12.5,
    textAlign: "center",
    flex: 1,
  },
  searchView: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 9.4,
    borderColor: "#E7EAE9",
    borderWidth: 0.78,
    paddingVertical: h * 10,
    paddingHorizontal: w * 10,
    alignItems: "center",
    columnGap: w * 25,
    marginVertical: h * 20,
  },
  search: {
    flex: 1,
    fontFamily: "Inter_500Medium",
    color: "#85878D",
    fontSize: w * 8.5 + h * 8,
    //outlineWidth: 0,
  },

  friends: {
    fontFamily: "Inter_600SemiBold",
    color: "#565555",
    fontSize: h * 8 + w * 8,
    paddingLeft: w * 4,
    marginBottom:h*6,
  },

  notfound: {
    fontFamily: "Inter_700Bold",
    color: "#565555",
    fontSize: h * 8 + w * 8,
    textAlign:'center'
  }
});
