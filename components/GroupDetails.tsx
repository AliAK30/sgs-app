import { Text, View } from "@/components/Themed";
import {
  Pressable,
  StyleSheet,
  ActivityIndicator,
  FlatList,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useRef, useState } from "react";
import * as yup from "yup";
import { useNetInfo } from "@react-native-community/netinfo";
import axios from "axios";
import { url } from "@/constants/Server";
import { useAlert } from "@/hooks/useAlert";
import { h, w } from "@/app/_layout";
import Back from "./buttons/Back";
import { useUserStore, useGroupStore } from "@/hooks/useStore";
import { GroupType, User } from "@/types";
import Student from "./Student";

type Props = {
    setShowGD: React.Dispatch<React.SetStateAction<number>>;
  id:string;
  name: string;
  dim1: string;
  dim2: string;
  dim3: string;
  dim4: string;
  uni_name: string;
  gender: string;
};

function Seperator() {
  return <View style={{ paddingVertical: h * 6 }}></View>;
}

export default function GroupDetails({
  setShowGD,
  id,
  name,
  uni_name,
}: Props) {

  const { Alert, openAlert } = useAlert();
  const { isConnected } = useNetInfo();
  const [results, setResults] = useState<User[]>([])
  const [editable, setEditable] = useState<boolean>(false);
  const [fetching, setFetching] = useState<boolean>(false);
  const [deleting, setDeleting] = useState<boolean>(false);
  const { token, user } = useUserStore();
  const {groups, setGroups} = useGroupStore();
  const backup = useRef<User[]>(results);
  const role = user?.role !== "student" ? "admin" : "student";

  useEffect(() => {
    if (isConnected || isConnected === null) fetchGroup();
  }, [isConnected]);

  const fetchGroup = async () => {
    try {
      if (isConnected || isConnected === null) {
        setFetching(true);
        
        const res = await axios.get(`${url}/${role}/group/${id}`, {
          timeout: 1000 * 35,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            "userid": user?._id
        },
        });
        //console.log(2)
        //console.log(res.data)
        setResults(res.data);
        
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
        await openAlert("fail", "Failed!", e.message);
        return;
      } else {
        await openAlert("fail", "Failed!", e.response.data.message);
        return;
      }
    } finally {
        setFetching(false);
    }
  };

  

  const deleteGroup = async () => {
    try {
      if (isConnected || isConnected === null) {
        setFetching(true);
        

        const res = await axios.delete(`${url}/admin/groups/delete/${id}`, {
          timeout: 1000 * 15,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            "userid": user?._id
        },
        });

        setGroups(groups.filter(group=>group._id!==res.data._id));
        setShowGD(0);
        //console.log(groups);
        
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
        await openAlert("fail", "Failed!", e.message);
        return;
      } else {
        await openAlert("fail", "Failed!", e.response.data.message);
        return;
      }
    } finally {
        setDeleting(false);
    }
  }


  const handlePress = () => setEditable((prev) => !prev);
  const handleUndo = () => setResults(backup.current);

  function Header({ text }: any) {
    return (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          paddingHorizontal: w * 10,
          paddingBottom: h * 6,
        }}
      >
        
        <Text style={styles.friends}>{text}</Text>
        { role !== 'student' && 
        (editable ? (
          <View style={{flexDirection:'row'}}>
            <Text onPress={handleUndo} style={styles.edit}>Undo | </Text>
            <Text onPress={handlePress} style={styles.edit}>Done</Text>
          </View>
        ) : (
          <Text onPress={handlePress} style={styles.edit}>
            Edit
          </Text>
        ))}
      </View>
    );
  }
  
  return (
    <View
      style={{
        backgroundColor: "white",
        flex: 1,
      }}
    >
      <LinearGradient
        colors={["#D6EBF2", "#FDFEFE"]}
        locations={[0.11, 1]}
        style={styles.container}
      >
        <Alert />

        <View style={{ justifyContent: "center" }}>
          <Back onPress={() => setShowGD(0)} />
          
        </View>

        
          <Text style={styles.groupName}>{name} Group</Text>

        {isConnected === false ? (
          <Text style={styles.notfound}>No Internet Connection</Text>
        ) : fetching ? <View style={{flex:1, justifyContent:'center'}}><ActivityIndicator size="large" color="grey"/></View> : (
          <FlatList
            data={results}
            renderItem={({ item }) => (
              <Student
                id={item._id}
                full_name={item.first_name + " " + item.last_name}
                picture={item.picture}
                gender={item.gender}
                setResults={setResults}
                editable={editable}
              />
            )}
            keyExtractor={(item, index) => item?._id ?? ""}
            ItemSeparatorComponent={Seperator}
            ListHeaderComponent={
              <Header text={`Members (${results.length})`} />
            }
            ListFooterComponent={<Seperator />}
            //onEndReachedThreshold={0.01}
            ListEmptyComponent={
              <Text style={[styles.notfound, { paddingTop: h * 20 }]}>
                No Students fall in the criteria
              </Text>
            }
          />
        )}

        
        {user?.role!== "student" && 
        <Pressable  style={styles.createButton} onPress={deleteGroup}>
            {deleting ?  <ActivityIndicator size="small" color="white" />
             : <Text style={styles.createButtonText}>Delete Group</Text> }
           </Pressable>
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
    paddingHorizontal: 15 * w,
    paddingTop: h * 20,
    alignSelf: "center",
    justifyContent:'flex-end',
  },

  title: {
    fontFamily: "Poppins_600SemiBold",
    color: "#565555",
    fontSize: h * 12.5 + w * 12.5,
    textAlign: "center",
  },

  friends: {
    fontFamily: "Inter_600SemiBold",
    color: "#565555",
    fontSize: h * 8 + w * 8,
    paddingLeft: w * 4,
  },

  edit: {
    color: "#0056D2",
    fontSize: w * 8 + h * 8,
    fontFamily: "Inter_700Bold",
  },

  notfound: {
    fontFamily: "Inter_700Bold",
    color: "#565555",
    fontSize: h * 8 + w * 8,
    textAlign: "center",
  },

  groupName: {
    color: "#565555",
    fontFamily: "Poppins_600SemiBold",
    fontSize: 15 * h + 15 * w,
    textAlign: "center",
    marginTop: h * 10,
  },
  createButton: {
    backgroundColor: "#D41A10",
    borderRadius:44,
    alignSelf:'flex-end',
    paddingHorizontal:25*w,
    paddingVertical: 15*h,
    flexDirection:'row',
    alignItems:'center',
    columnGap:w*8,
    position:"absolute",
    justifyContent:'center',
    boxShadow: "2px 4px 7.4px 0px rgba(0, 0, 0, 0.35)",
    marginRight:h*20,
    marginBottom:h*20,
  },

  createButtonText: {
    fontFamily: "Inter_600SemiBold",
    color:"#FFFFFF",
    fontSize:h*8+w*8,
  },
});
