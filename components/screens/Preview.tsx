import { Text, View } from "@/components/Themed";
import {
  Pressable,
  StyleSheet,
  ActivityIndicator,
  FlatList,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRef, useState } from "react";
import { useNetInfo } from "@react-native-community/netinfo";
import axios from "axios";
import { url } from "@/constants/Server";
import { useAlert } from "@/hooks/useAlert";
import { h, w } from "@/app/_layout";
import Back from "../buttons/Back";
import { useUserStore, useGroupStore } from "@/hooks/useStore";
import { User } from "@/types";
import Student from "../Student";

type FormValues = {
  name: string;
  dim1: string;
  value1: string;
  uni_id: string;
  dim2: string;
  dim3: string;
  dim4: string;
  value2: string;
  value3: string;
  value4: string;
  gender: string;
};

type Props = {
  setShowPreview: React.Dispatch<React.SetStateAction<number>>;
  setClick: React.Dispatch<React.SetStateAction<number>>;
  results: User[];
  setResults: React.Dispatch<React.SetStateAction<User[]>>;
  allValues: FormValues;
};

function Seperator() {
  return <View style={{ paddingVertical: h * 6 }}></View>;
}

export default function Preview({
  setShowPreview,
  results,
  setResults,
  allValues,
  setClick,
}: Props) {

  const { Alert, openAlert } = useAlert();
  const { isConnected } = useNetInfo();
  const [editable, setEditable] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { token, user } = useUserStore();
  const {groups, setGroups} = useGroupStore();
  const backup = useRef<User[]>(results);

  /* useEffect(() => {
    if (isConnected || isConnected === null) fetchUniversities();
  }, [isConnected]); */

  const createGroup = async () => {
    try {
      if (isConnected || isConnected === null) {
        setIsSubmitting(true);
        const groupData = {
        name: allValues.name,
        gender: allValues.gender,
        students: results.map(result=>result._id),
        dim1: { name: allValues.dim1, preference: allValues.value1 },
        dim2: { name: allValues.dim2, preference:  allValues.value2},
        dim3: { name: allValues.dim3, preference: allValues.value3 },
        dim4: { name: allValues.dim4, preference: allValues.value4 },
        };

        const res = await axios.post(`${url}/admin/groups/create`, groupData, {
          timeout: 1000 * 15,
          headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                  "userid": user?._id
                },
        });
        setGroups([...groups, res.data]);
        setClick(0);
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
        setIsSubmitting(false);
    }
  };


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
        {editable ? (
          <View style={{flexDirection:'row'}}>
            <Text onPress={handleUndo} style={styles.edit}>Undo | </Text>
            <Text onPress={handlePress} style={styles.edit}>Done</Text>
          </View>
        ) : (
          <Text onPress={handlePress} style={styles.edit}>
            Edit
          </Text>
        )}
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
          <Back onPress={() => setShowPreview(0)} />
          <View style={{ position: "absolute", alignSelf: "center" }}>
            <Text style={styles.title}>Preview</Text>
          </View>
        </View>

        
          <Text style={styles.groupName}>{allValues.name} Group</Text>

        {isConnected === false ? (
          <Text style={styles.notfound}>No Internet Connection</Text>
        ) : (
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

        
        
        <Pressable  style={styles.createButton} onPress={createGroup}>
            {isSubmitting ?  <ActivityIndicator size="small" color="white" />
             : <Text style={styles.createButtonText}>Create Group</Text> }
           </Pressable>
           

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
    marginVertical: h * 15,
  },
  createButton: {
    backgroundColor: "#539DF3",
    borderRadius:44,
    alignSelf:'flex-end',
    paddingHorizontal:25*w,
    paddingVertical: 15*h,
    flexDirection:'row',
    alignItems:'center',
    columnGap:w*8,
    justifyContent:'center',
    boxShadow: "2px 4px 7.4px 0px rgba(0, 0, 0, 0.35)",
    position:'absolute',
    marginRight:w*25,
    marginBottom:h*25,
  },

  createButtonText: {
    fontFamily: "Inter_600SemiBold",
    color:"#FFFFFF",
    fontSize:h*8+w*8,
  },
});
