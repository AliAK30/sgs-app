import { View, Text, TextInput } from "@/components/Themed";
import { StyleSheet, ScrollView, Pressable, ActivityIndicator } from "react-native";
import { useUserStore } from "@/hooks/useStore";
import { useState, useRef, useEffect } from "react";
import { Image } from "expo-image";
import SearchResult from "@/components/screens/SearchResult";
import { Feather, Ionicons } from "@expo/vector-icons";
import { w, h, OS } from "../_layout";
import { url } from "@/constants/Server";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { formatFirstName } from "@/utils";
import { useNetInfo } from "@react-native-community/netinfo";
import { useAlert } from "@/hooks/useAlert";
import CreateGroup from "@/components/screens/CreateGroup";
import axios from "axios";


type Counts = {
    admins: number;
    students: number;
    groups: number;
};

export default function Index() {
  const [click, setClick] = useState<number>(0);
  const [fetching, setFetching] = useState<boolean>(false);
  const {isConnected} = useNetInfo();
  const { user, token } = useUserStore();
  const {Alert,openAlert} = useAlert();
  const [value, setValue] = useState<string>("");
  const InsightsRef = useRef<Counts>({admins: 0, students: 0, groups:0});
  const imgSource = user?.picture ?? require("@/assets/images/no-dp.svg");

  useEffect(()=> {
    if(isConnected || isConnected===null)
    {
        fillAdminDashboard();
    }
  }, [isConnected])

  const fillAdminDashboard = async () => {
    try {
      
      if (isConnected || isConnected===null) {
       
        setFetching(true);
        //FETCH TOTAL NUMBER OF STUDENTS
        let res: any = await axios.get(`${url}/admin/students/count`, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            "userid": user?._id
        },
        timeout: 1000 * 25,
        });

        InsightsRef.current.students = res.data;

        //FETCH TOTAL NUMBER OF ADMINS
        res = await axios.get(`${url}/admin/count`, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            "userid": user?._id
        },
        timeout: 1000 * 25,
        });

        InsightsRef.current.admins = res.data;

        //FETCH TOTAL NUMBER OF GROUPS
        res = await axios.get(`${url}/admin/groups/count`, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            "userid": user?._id
        },
        timeout: 1000 * 25,
        });

        InsightsRef.current.groups = res.data;
        
      } else {
        await openAlert("fail", "Failed!", "No Internet Connection!");
        return;
      }
    } catch (e: any) {
      InsightsRef.current.admins = -1
      InsightsRef.current.groups = -1
      InsightsRef.current.students = -1
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
      setFetching(false)
    }
  }

  if (click === 1)
    return (
      <SearchResult
        value={value}
        fetching={fetching}
        setFetching={setFetching}
        setValue={setValue}
        setClick={setClick}
      />
    );

  if(click === 2) 
    return (<CreateGroup setClick={setClick}/>)

  return (
    <ScrollView
      automaticallyAdjustKeyboardInsets={true}
      keyboardDismissMode="none"
      contentContainerStyle={styles.container}
      style={{ backgroundColor: "#FFFFFF" }}
    >
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <View>
          <Text style={styles.title}>
            Hey {formatFirstName(user?.first_name)} 👋
          </Text>
          <Text style={styles.belowTitle}>{user?.uni_name}</Text>
        </View>
        <Image
          source={imgSource}
          style={{
            width: h * 26 + w * 26,
            height: h * 26 + w * 26,
            borderRadius: 50,
          }}
        />
      </View>
      <View style={{ flexDirection: "row", columnGap: w * 8 }}>
        <View style={styles.searchView}>
          <TextInput
            style={styles.search}
            placeholder="Search a student"
            inputMode="text"
            value={value}
            onChangeText={setValue}
            placeholderTextColor="#85878D"
          />
          <Pressable
            onPress={() => {
              setFetching(true);
              setClick(1);
            }}
            hitSlop={15}
          >
            <Feather name="search" color="black" size={19} />
          </Pressable>
        </View>
        <View style={styles.bell}>
          <Ionicons name="notifications-outline" color="black" size={19} />
        </View>
      </View>

      <Text style={styles.quickInsights}>Quick Insights</Text>
      <View style={{ flexDirection: "row" }}>
        <View style={styles.lgView}>
          <LinearGradient
            style={styles.linearG}
            colors={[
              "rgba(145, 214, 205, 0.96)",
              "rgba(108, 200, 188, 0.96)",
              "rgba(74, 189, 172, 0.96)",
            ]}
            locations={[0.2926, 0.4331, 0.7603]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0.98, y: 1 }}
          />

          <View style={styles.insideLgView}>
            <Text style={styles.totalStudents}>Total Students</Text>
            {fetching ? <ActivityIndicator size={15*h+15*w} color="#0C0C0C" style={{alignSelf:'flex-start', paddingTop:h*6}}/> : <Text style={styles.totalStudentsCount}>{InsightsRef.current.students===-1?"?":InsightsRef.current.students}</Text>}
          </View>
        </View>
      </View>
      <View style={{ flexDirection: "row", columnGap: w * 10 }}>
        <View style={styles.lgView}>
          <LinearGradient
            style={styles.linearG}
            colors={[
              "rgba(191, 183, 230, 0.96)",
              "rgba(204, 203, 235, 0.96)",
              "rgba(210, 211, 238, 0.96)",
            ]}
            locations={[0.2926, 0.5917, 0.7603]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0.98, y: 1 }}
          />

          <View style={styles.insideLgView}>
            <Text style={styles.totalStudents}>Total Admins</Text>
            {fetching ? <ActivityIndicator size={15*h+15*w} color="#0C0C0C" style={{alignSelf:'flex-start', paddingTop:h*6}}/> : <Text style={styles.totalStudentsCount}>{InsightsRef.current.admins===-1?"?":InsightsRef.current.admins}</Text>}
          </View>
        </View>
        <View style={styles.lgView}>
          <LinearGradient
            style={styles.linearG}
            colors={[
              "rgba(255, 236, 186, 0.96)",
              "rgba(250, 238, 204, 0.96)",
              "rgba(245, 240, 213, 0.96)",
            ]}
            locations={[0.0914, 0.2914, 0.757]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0.99, y: 1 }}
          />

          <View style={styles.insideLgView}>
            <Text style={styles.totalStudents}>Total Groups</Text>
            {fetching ? <ActivityIndicator size={15*h+15*w} color="#0C0C0C" style={{alignSelf:'flex-start', paddingTop:h*6}}/> : <Text style={styles.totalStudentsCount}>{InsightsRef.current.groups===-1?"?":InsightsRef.current.groups}</Text>}
          </View>
        </View>
      </View>
      <View style={{ flexDirection: "row", columnGap: w * 10 }}>
        {user?.role === "system_admin" && <Pressable style={styles.lgView}>
          <LinearGradient
            style={styles.linearG}
            colors={[
              "rgba(235, 215, 201, 0.96)",
              "rgba(234, 223, 215, 0.96)",
              "rgba(235, 228, 222, 0.96)",
            ]}
            locations={[0.0926, 0.3145, 0.8312]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />

          <View style={[styles.insideLgView, { alignItems: "center" }]}>
            <Feather name="plus-circle" size={h * 25 + w * 25} />
            <Text style={styles.create}>Add New Admin</Text>
          </View>
        </Pressable>
        }
        <Pressable style={styles.lgView} onPress={()=>setClick(2)}>
          <LinearGradient
            style={styles.linearG}
            colors={[
              "rgba(145, 214, 205, 0.96)",
              "rgba(108, 200, 188, 0.96)",
              "rgba(74, 189, 172, 0.96)",
            ]}
            locations={[0.1519, 0.3542, 0.8255]}
            start={{ x: 1, y: 1 }}
            end={{ x: 0.2, y: 0 }}
          />

          <View style={[styles.insideLgView, { alignItems: "center" }]}>
            <Feather name="users" size={h * 25 + w * 25} />
            <Text style={styles.create}>Create New Group</Text>
          </View>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(173, 216, 230, 0.25)",
    borderRadius: 24,
    paddingHorizontal: w * 15,
    paddingTop: h * 25,
    width: "92%",
    alignSelf: "center",
    rowGap: h * 17,
  },

  linearG: {
    borderRadius: 20,
    position: "absolute",
    height: "100%",
    width: "100%",
  },

  lgView: {
    boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
    borderRadius: 20,
    flex: 1,
  },

  insideLgView: {
    paddingHorizontal: w * 26,
    paddingVertical: h * 22,
  },

  title: {
    fontFamily: "Poppins_600SemiBold",
    color: "#565555",
    fontSize: 14 * w + 14 * h,
  },

  belowTitle: {
    fontFamily: "Inter_500Medium",
    color: "#85878D",
    fontSize: w * 5.5 + h * 5.5,
  },
  searchView: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 9.4,
    borderColor: "#E7EAE9",
    borderWidth: 0.78,
    paddingVertical: h * 10,
    paddingHorizontal: w * 10,
    alignItems: "center",
    columnGap: w * 25,
  },

  bell: {
    backgroundColor: "#FFFFFF",
    borderRadius: 9.4,
    borderColor: "#E7EAE9",
    borderWidth: 0.78,
    paddingVertical: h * 10,
    paddingHorizontal: w * 10,
    alignItems: "center",
    justifyContent:'center',
  },
  search: {
    flex: 1,
    fontFamily: "Inter_500Medium",
    color: "#85878D",
    fontSize: w * 8.5 + h * 8,
  },

  quickInsights: {
    color: "#565555",
    fontFamily: "Inter_700Bold",
    fontSize: 8 * w + 8 * h,
  },

  totalStudents: {
    color: "#0C0C0C",
    fontFamily: "Inter_500Medium",
    fontSize: 9 * h + 9 * w,
  },
  totalStudentsCount: {
    color: "#0C0C0C",
    fontFamily: "Inter_600SemiBold",
    fontSize: 15 * h + 15 * w,
  },

  create: {
    fontSize: h * 10 + w * 10,
    color: "#0C0C0C",
    fontFamily: "Inter_600SemiBold",
    textAlign:'center'
  },
});
