import { Text, View, TextInput } from "@/components/Themed";
import { Image } from "expo-image";
import { Pressable, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Profile from "./Profile";
import Entypo from "@expo/vector-icons/Entypo";
import { useState, useEffect } from "react";
import { Redirect, useRouter } from "expo-router";
import { useNetInfo } from "@react-native-community/netinfo";
import axios from "axios";
import { url } from "@/constants/Server";
import { useAlert } from "@/hooks/useAlert";
import { useUserStore } from "@/hooks/useStore";
import { h, w } from "@/app/_layout";
import { User } from "@/types";

type Props = {
  id?: string;
  full_name: string;
  gender?: string;
  picture?: string;
  setResults: React.Dispatch<React.SetStateAction<User[]>>;
  editable: boolean;
};

function formatName(fullName: string): string {
  if (!fullName || typeof fullName !== "string") {
    return fullName;
  }

  // Trim and split the name into parts
  const nameParts = fullName.trim().split(" ");
  // split by one or more spaces use split(/\s+/)

  // If there are less than 3 parts, return as-is
  if (nameParts.length < 3) {
    return fullName;
  }

  // Process all parts
  const formattedParts = nameParts.map((part, index) => {
    // Abbreviate all except last two names
    if (index < nameParts.length - 2) {
      return `${part.charAt(0).toUpperCase()}.`;
    }
    return part;
  });

  return formattedParts.join(" ");
}

export default function Student({
  id,
  full_name,
  gender,
  picture,
  setResults,
  editable,
}: Props) {
  const [openProfile, setOpenProfile] = useState<boolean>(false);
  const imgSource = picture ?? require("@/assets/images/no-dp.svg");

  const handleRemove = () => {
    setResults(results=>results.filter(result=>result._id!==id));
  }

  return (
    <LinearGradient
      style={styles.container}
      colors={["#0B0B0B", "rgba(23, 23, 23, 0.98)", "rgba(46, 46, 46, 0.95)"]}
      locations={[0.17, 0.34, 0.7]}
      start={{ x: -0.4, y: 0 }}
    >
      {openProfile && (
        <Profile
          openProfile={openProfile}
          setOpenProfile={setOpenProfile}
          id={id ?? "1"}
          similarity={-1}
        />
      )}
      <Pressable onPress={() => setOpenProfile(true)}>
        <Image
          source={imgSource}
          style={{
            width: h * 24 + w * 24,
            height: h * 24 + w * 24,
            borderRadius: 50,
          }}
        />
      </Pressable>

      <View style={{ flex: 1 }}>
        <Text style={styles.name}>{formatName(full_name)}</Text>
        <Text style={styles.uni_name}>{gender}</Text>
      </View>
      {editable && (
        <View style={{ justifyContent: "center" }}>
          <Entypo
            name="cross"
            size={24}
            color="white"
            onPress={handleRemove}
            style={{
              borderWidth: 2,
              borderColor: "white",
              borderRadius: 50,
              alignItems: "center",
              justifyContent: "center",
            }}
          />
        </View>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(230, 236, 245, 0.96)",
    borderRadius: 20,
    flexDirection: "row",
    paddingHorizontal: 16 * w,
    paddingVertical: 10 * h,
    columnGap: w * 8,
  },
  name: {
    fontFamily: "Inter_700Bold",
    fontSize: 8 * h + 8 * w,
    color: "#FFFFFF",
  },
  uni_name: {
    fontFamily: "Inter_400Regular",
    fontSize: 4.5 * h + 4.5 * w,
    color: "#FFFFFF",
    //borderBottomWidth:0.5,
    //borderColor:'white',
    alignSelf: "flex-start",
    paddingBottom: h * 3,
  },
  addFriendButton: {
    backgroundColor: "#539DF3",
    borderRadius: 5,
    alignSelf: "flex-end",
    paddingHorizontal: 7 * w,
    paddingVertical: 4 * h,
    //justifyContent:'flex-end'
  },
  add: {
    fontFamily: "Inter_500Medium",
    fontSize: h * 6 + w * 6,
    color: "#FFFFFF",
  },
});
