import { Text, View, TextInput } from "@/components/Themed";
import { FlatList, Pressable, StyleSheet, ActivityIndicator } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Feather from "@expo/vector-icons/Feather";
import Back from "./Back";
import { useState, useEffect,useMemo, useRef, useCallback } from "react";
import { useRouter } from "expo-router";
import { useNetInfo } from "@react-native-community/netinfo";
import axios from "axios";
import { url } from "@/constants/Server";
import { useAlert } from "@/hooks/useAlert";
import { useUserStore } from "@/hooks/useStore";
import { h, w } from "@/app/_layout";
import { User } from "@/types";
import debounce from 'lodash/debounce';
import Peer from "./Peer";

type Props = {
  value: string;
  fetching: boolean;
  setFetching: React.Dispatch<React.SetStateAction<boolean>>;
  setClick: React.Dispatch<React.SetStateAction<number>>;
  setValue: React.Dispatch<React.SetStateAction<string>>;
};

type ExtendedUser = { full_name: string } & User;

function Seperator() {
  return <View style={{paddingVertical:h*6}}></View>
}

function Header({text}: any) {
  return <Text style={styles.friends}>{text}</Text>
}

function SearchResult({
  value,
  setClick,
  setValue,
  fetching, setFetching
}: Props) {

  const [results, setResults] = useState<Array<ExtendedUser>>([]);
  
  const [fetchingMore, setFetchingMore] = useState<boolean>(false);
  const { Alert, openAlert } = useAlert();
  const { isConnected } = useNetInfo();
  const { token } = useUserStore();
  const page = useRef<number>(1);
  const hasMore = useRef<boolean>(true);
  const totalCount = useRef<number>(0);

  const fetchStudents = useCallback(async (name: string, pageNum: number) => {
    try {
      
      if (isConnected || isConnected===null) {
        if (name.trim().length >= 1) {
          
          if (pageNum === 1) {
            setFetching(true);
          } else {
            setFetchingMore(true);
          }

          const res: any = await axios.get(`${url}/student/search`, {
            params: { name, page: pageNum },
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            timeout: 1000 * 25,
          });

          hasMore.current = res.data.hasMore;
          page.current = res.data.currentPage+1;
          
          if (pageNum === 1) {
            totalCount.current = res.data.totalCount
            setResults(res.data.students);
          } else {
            setResults(prev => [...prev, ...res.data.students]);
          }

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
        return;
      }
    } finally {
      if (pageNum === 1) {
          setFetching(false);
        } else {
          setFetchingMore(false);
        }
    }
  }, [isConnected, token]);


  const debouncedFetch = useMemo(() => debounce((val: string) => {
  page.current = 1;
  hasMore.current = true;
  totalCount.current = 0;
  fetchStudents(val, 1);
}, 400), [fetchStudents]);

    /* useEffect(() => {
    console.log("Fetching updated to:", fetching);
  }, [fetching]);
 */
  useEffect(() => {
    
    if(isConnected || isConnected === false)
    {
      if (value.trim() === "") {
      page.current = 1;
      hasMore.current = true;
      totalCount.current = 0;
      setResults([]);
      } else {
        debouncedFetch(value);
      }
    } 
  
  return () => {
    debouncedFetch.cancel(); // clean up on unmount or change
  };

}, [value, isConnected]);

  

  const handleEndReached = () => {
    if (hasMore.current && !fetchingMore) {
      
      fetchStudents(value, page.current);
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
              <Text style={styles.title}>Search Results</Text>
           </View>
        </View>
        <Alert />
        <View style={styles.searchView}>
          <TextInput
            style={styles.search}
            placeholder="Search your peers"
            value={value}
            onChangeText={setValue}
            inputMode="text"
            placeholderTextColor="#85878D"
          />
          <Pressable onPress={() => { debouncedFetch.cancel(); page.current = 1; 
          hasMore.current = true; fetchStudents(value, page.current); 
          }}>
            <Feather name="search" color="black" size={19} />
          </Pressable>
        </View>

        
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
              />
            )}
            keyExtractor={(item, index)=>item?._id ?? ""}
            ItemSeparatorComponent={Seperator}
            ListHeaderComponent={<Header text={`Total Results (${totalCount.current})`}/>}
            ListFooterComponent={fetchingMore ? <ActivityIndicator size="small" color="gray" style={{paddingTop:h*15}}/> : <Seperator/>}
            onEndReached={handleEndReached}
            //onEndReachedThreshold={0.01}
            ListEmptyComponent={<Text style={styles.notfound}>No students found</Text>}
          />
       }
       
      
      </LinearGradient>
    </View>
  );
}

export default SearchResult;

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
    outlineWidth: 0,
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
