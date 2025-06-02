import { View, Text, TextInput } from "@/components/Themed";
import { StyleSheet, ScrollView, Pressable } from "react-native";
import { useUserStore } from "@/hooks/useStore";
import { useState } from "react";
import { Image } from "expo-image";
import SearchResult from "@/components/SearchResult";
import { Feather, Ionicons } from "@expo/vector-icons";
import { w, h, OS } from "../_layout";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { formatTwoWordsName } from "@/utils";

export default function Index() {
  const [click, setClick] = useState<number>(0);
  const [fetching, setFetching] = useState<boolean>(false);
  const router = useRouter();
  const { user } = useUserStore();
  const [value, setValue] = useState<string>("");
  const imgSource = user?.picture ?? require("@/assets/images/no-dp.svg");

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
            Hey {formatTwoWordsName(user?.first_name ?? "")} 👋
          </Text>
          <Text style={styles.belowTitle}>{user?.uni_name}</Text>
        </View>
        <Image
          source={imgSource}
          style={{
            width: h * 26 + w * 26,
            height: h * 26 + w * 26,
            borderRadius: "100%",
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
            <Text style={styles.totalStudentsCount}>1200</Text>
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
            <Text style={styles.totalStudentsCount}>0</Text>
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
            <Text style={styles.totalStudentsCount}>0</Text>
          </View>
        </View>
      </View>
      <View style={{ flexDirection: "row", columnGap: w * 10 }}>
        <View style={styles.lgView}>
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
        </View>
        <View style={styles.lgView}>
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
        </View>
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
  },
  search: {
    flex: 1,
    fontFamily: "Inter_500Medium",
    color: "#85878D",
    fontSize: w * 8.5 + h * 8,
    outlineWidth: 0,
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
