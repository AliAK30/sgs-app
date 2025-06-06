import { useUserStore } from "@/hooks/useStore";
import { Redirect, router } from "expo-router";
import { StyleSheet, Pressable } from "react-native";
import { Text, View } from "@/components/Themed";
import { Image, useImage } from "expo-image";
import { height, w, h, width} from "./_layout";
import SkeletonLoader from "@/components/SkeletonLoader";

const imgSource = require("@/assets/images/guy-reads.png");
const eduMatch = require("@/assets/images/edumatch.png");

//This is where redirection happens

export default function Index() {
  const { user, token, setUser } = useUserStore();
  

  const image = useImage(eduMatch, {
    maxWidth: 550,
    onError(error, retry) {
      console.error("Loading failed:", error.message);
      retry();
    },
  });


  if (token)
  {
    if(user?.role === 'student') return <Redirect href="/(student)" />;
    else return <Redirect href="/(admin)" />;
  } 

  return (
    <View style={styles.container}>
      <Image
        source={imgSource}
        style={styles.backgroundImage}
        contentFit="fill"
      />

      {!image ? (
        <SkeletonLoader w={229 * (height / 817)} h={218 * (height / 817)} />
      ) : (
        <Image
          source={image}
          style={{
            width: (image.width * height) / 817,
            height: (image.height * height) / 817,
          }}
        />
      )}

      <View style={styles.mainContent}>
        <Text style={styles.heading}>Select Your Role:</Text>

        <Pressable
          style={[styles.button, { backgroundColor: "#50BFAF" }]}
          onPress={() => {
            setUser({ role: "student" });
            router.push("/login");
          }}
        >
          <Image
            source={require("@/assets/images/grad-cap.svg")}
            style={styles.icon}
            contentFit="contain"
          />
          <View>
            <Text style={styles.buttonTitle}>Student</Text>
            <Text style={styles.buttonSubtitle}>
              Explore Your Learning Journey
            </Text>
          </View>
        </Pressable>

        <Pressable
          style={[styles.button, { backgroundColor: "#635B92" }]}
          onPress={() => {
            setUser({ role: "admin" });
            router.push("/login");
          }}
        >
          <Image
            source={require("@/assets/images/gear.svg")}
            style={styles.icon}
            contentFit="contain"
          />

          <View>
            <Text style={styles.buttonTitle}>Admin</Text>
            <Text style={styles.buttonSubtitle}>
              Manage and Support Learning
            </Text>
          </View>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "92%",
    backgroundColor: "rgba(173, 216, 230, 0.25)",
    borderRadius: 24,
    paddingHorizontal: h * 30,
    alignItems: "center",
    alignSelf: "center",
    justifyContent:'flex-end'
  },

  mainContent: {
    flex: 1,
    alignSelf: "stretch",
    rowGap: h * 18,
  },

  heading: {
    fontFamily: "Poppins_700Bold",
    color: "#333333",
    fontSize: h * 14 + w * 14,
  },

  button: {
    flexDirection: "row",
    alignItems: "center",
    boxShadow: "0px 7px 12.5px 2px rgba(0, 0, 0, 0.20)",
    borderRadius: 30,
    justifyContent: "center",
    columnGap: w * 15,
    paddingVertical: 30 * h,
  },

  icon: {
    width: 48.86,
    height: 41.62,
  },

  backgroundImage: {
          height: height * 0.41 ,
          width: width * 0.92,
          position: "absolute",
          zIndex: 0,
          borderBottomLeftRadius: 24*h,
          borderBottomRightRadius: 24*h,
  },

  buttonTitle: {
    fontFamily: "Poppins_600SemiBold",
    color: "white",
    fontSize: h * 11 + w * 11,
    lineHeight: h * 25,
  },
  buttonSubtitle: {
    fontFamily: "Poppins_400Regular",
    color: "white",
    fontSize: h * 6 + w * 6,
  },
});
