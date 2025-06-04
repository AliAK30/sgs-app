import { Text, View, TextInput } from "@/components/Themed";
import { Image } from "expo-image";
import { Pressable, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import GroupDetails from "./GroupDetails";
import { useState, useEffect } from "react";
import { Redirect, useRouter } from "expo-router";
import { useNetInfo } from "@react-native-community/netinfo";
import axios from "axios";
import { url } from "@/constants/Server";
import { useAlert } from "@/hooks/useAlert";
import { useUserStore } from "@/hooks/useStore";
import { h, w } from "@/app/_layout";

type Props = {
  id: string;
  name: string;
  uni_name: string;
  dim1: string;
  dim2: string;
  dim3: string;
  dim4: string;
  gender: string;
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

export default function Group({
  id,
  name,
  uni_name,
  gender,
  dim1,
  dim2,
  dim3,
  dim4,
}: Props) {
  const [showGD, setShowGD] = useState<number>(0);

  if (showGD === 1)
    return (
      <GroupDetails
        setShowGD={setShowGD}
        id={id}
        name={name}
        dim1={dim1}
        dim2={dim2}
        dim3={dim3}
        dim4={dim4}
        uni_name={uni_name}
        gender={gender}
      />
    );

  return (
    <Pressable onPress={() => setShowGD(1)}>
      <LinearGradient
        style={styles.container}
        colors={["#0B0B0B", "rgba(23, 23, 23, 0.98)", "rgba(46, 46, 46, 0.95)"]}
        locations={[0.17, 0.34, 0.7]}
        start={{ x: -0.4, y: 0 }}
      >
        <View style={{ rowGap: h * 6, flex: 1 }}>
          <View style={{ flexDirection: "row" }}>
            <View style={{ flex: 2 * w }}>
              <Text style={styles.name}>{name}</Text>
              <Text style={styles.uni_name}>{uni_name}</Text>
            </View>
          </View>
        </View>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(230, 236, 245, 0.96)",
    borderRadius: 20,
    flexDirection: "row",
    paddingHorizontal: 16 * w,
    paddingVertical: 16 * h,
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
    borderBottomWidth: 0.5,
    borderColor: "white",
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
