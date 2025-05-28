import { Text, View, TextInput } from "@/components/Themed";
import { FlatList, Pressable, StyleSheet, ActivityIndicator } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Feather from "@expo/vector-icons/Feather";
import Back from "./Back";
import { useState, useEffect, memo } from "react";
import { Redirect, useRouter } from "expo-router";
import { useNetInfo } from "@react-native-community/netinfo";
import axios from "axios";
import { url } from "@/constants/Server";
import { useAlert } from "@/hooks/useAlert";
import { useUserStore } from "@/hooks/useStore";
import { h, w } from "@/app/_layout";
import { User } from "@/types";
import Peer from "./Peer";

type Props = {
  value: string;
  click: boolean;
  setClick: React.Dispatch<React.SetStateAction<boolean>>;
  setValue: React.Dispatch<React.SetStateAction<string>>;
};

type ExtendedUser = { full_name: string } & User;

function Seperator() {
  return(
    <View style={{paddingVertical:h*4}}>

    </View>
  )
}

function Header({text}: any) {
  return (
    <Text style={styles.friends}>{text}</Text>
  )
}

function SearchResult({
  value,
  click,
  setClick,
  setValue,
}: Props) {
  const [results, setResults] = useState<Array<ExtendedUser>>();
  const [fetching, setFetching] = useState<boolean>(false)
  const { Alert, openAlert } = useAlert();
  const router = useRouter();
  const { isConnected } = useNetInfo();
  const { token } = useUserStore();

  useEffect(() => {
    fetchStudents(value);
  }, [value]);

  const fetchStudents = async (name: string) => {
    try {
      if (isConnected === null || isConnected) {
        if (name.trim().length > 1) {
          setFetching(true);
          const res: any = await axios.get(`${url}/student/search`, {
            params: { name },
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            timeout: 1000 * 25,
          });
          
          setResults(res.data);
          
        }
      } else {
        openAlert("fail", "Failed!", "No Internet Connection!");
        return;
      }
    } catch (e: any) {
      if (!e.status) {
        switch (e.code) {
          case "ECONNABORTED":
            openAlert(
              "fail",
              "Failed!",
              "Request TImed out\nPlease try again later!"
            );
            return;

          case "ERR_NETWORK":
            openAlert(
              "fail",
              "Failed!",
              "Server is not Responding\nPlease try again later!"
            );
            return;
        }
      }

      if (e.status >= 500) {
        openAlert("fail", "Failed!", e.message);
        return;
      } else {
        openAlert("fail", "Failed!", e.response.data.message);
        return;
      }
    } finally {
      setFetching(false)
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
        <View style={{ flexDirection: "row", justifyContent: "flex-start" }}>
          <Back onPress={() => setClick(false)} />
          <Text style={styles.title}>Search Results</Text>
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
          <Pressable onPress={() => fetchStudents(value)}>
            <Feather name="search" color="black" size={19} />
          </Pressable>
        </View>

        
        {!isConnected ? (
          <Text style={styles.notfound}>No Internet Connection</Text>
        ) : fetching ? <ActivityIndicator size="large" color="grey"/> : results?.length ? (
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
            ListHeaderComponent={<Header text={`Total Results (${results?.length ?? 0})`}/>}
            ListFooterComponent={Seperator}
          />
        ) : (
          <Text style={styles.notfound}>No students found</Text>
        )}

      </LinearGradient>
    </View>
  );
}

export default memo(SearchResult, (prevProps, nextProps)=>prevProps.value === nextProps.value)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "92%",
    borderRadius: 24,
    //backgroundColor: "rgba(173, 216, 230, 0.25)",
    //backgroundColor: 'white',
    paddingHorizontal: 15 * w,
    alignSelf: "center",
    paddingTop: h * 13,
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
