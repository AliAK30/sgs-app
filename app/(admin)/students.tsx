import { Text, View, TextInput } from "@/components/Themed";
import { StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import AnimatedPressable from "@/components/AnimatedPressable";
import Feather from "@expo/vector-icons/Feather";
import SearchResult from "@/components/screens/SearchResult";
import { useAlert } from "@/hooks/useAlert";
import { useState } from "react";
import { h, w } from "../_layout";

export default function Students() {
  const { Alert } = useAlert();
  const [click, setClick] = useState<number>(0);
  const [fetching, setFetching] = useState<boolean>(false);
  const [value, setValue] = useState<string>("");

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
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <LinearGradient
        // Background Linear Gradient
        colors={["#D6EBF2", "#FDFEFE"]}
        locations={[0.11, 1]}
        style={styles.container}
      >
        <Alert />
        <Text style={styles.title}>Students</Text>
        <View style={styles.searchView}>
          <TextInput
            style={styles.search}
            placeholder="Search students"
            inputMode="text"
            placeholderTextColor="#85878D"
            value={value}
            onChangeText={setValue}
          />

          <AnimatedPressable onPress={() => {setFetching(true); setClick(1);}} hitSlop={15}>
            <Feather name="search" color="black" size={19} />
          </AnimatedPressable>
        </View>

        <Text style={styles.friends}>Use search bar to find students</Text>
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
    alignSelf: "center",
    paddingTop: h * 13,
  },

  title: {
    fontFamily: "Poppins_600SemiBold",
    color: "#565555",
    fontSize: h * 12.5 + w * 12.5,
    textAlign: "center",
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
  },

  friends: {
    fontFamily: "Inter_600SemiBold",
    color: "#565555",
    fontSize: h * 8 + w * 8,
    paddingLeft: w * 4,
    textAlign: "center",
  },
});
