import { useUserStore } from "@/hooks/useStore";
import { Redirect, router } from "expo-router";
import { StyleSheet, Pressable } from "react-native";
import { Text, View } from "@/components/Themed";
import { Image, useImage } from "expo-image";
import { height, w, h, width} from "./_layout";
import ContentLoader, { Rect, Circle } from "react-content-loader/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const imgSource = require("@/assets/images/guy-reads.png");
const eduMatch = require("@/assets/images/edumatch.png");

const MyLoader = ({ wi, hi }: any) => (
  <ContentLoader
    speed={2}
    width={wi}
    height={hi}
    //viewBox={`0 0 ${229* (height / 817)} ${218* (height / 817)}`}
    backgroundColor="#ffffff"
    foregroundColor="#ecebeb"
  >
    <Circle cx={wi / 2.6} cy={hi / 2} r={wi / 7} />
    <Circle cx={wi / 2.6} cy={hi / 4} r={wi / 7} />
    <Circle cx={wi / 1.65} cy={hi / 4} r={wi / 7} />
    <Circle cx={wi / 1.65} cy={hi / 2} r={wi / 7} />
    <Rect x={wi / 5.4} y={hi / 1.39} width={wi * 0.6} height={hi * 0.15} />
  </ContentLoader>
);

//This is where redirection happens

export default function Index() {
  const insets = useSafeAreaInsets();
  const { token, setUser } = useUserStore();

  if (token) return <Redirect href="/(student)" />;

  const image = useImage(eduMatch, {
    maxWidth: 550,
    onError(error, retry) {
      console.error("Loading failed:", error.message);
      retry();
    },
  });

  const image2 = useImage(imgSource, {
    maxWidth: 550,
    onError(error, retry) {
      console.error("Loading failed:", error.message);
      retry();
    },
  });

  return (
    <View style={styles.container}>
      <Image
        source={image2}
        style={{
          height: height * 0.41 - insets.top,
          width: width * 0.92,
          position: "absolute",
          zIndex: 0,
          borderBottomLeftRadius: 24,
          borderBottomRightRadius: 24,
          top: h * 482,
        }}
        contentFit="fill"
      />

      {!image ? (
        <MyLoader w={229 * (height / 817)} h={218 * (height / 817)} />
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
            router.push("/onboarding");
          }}
        >
          <Image
            source={require("@/assets/images/grad-cap.svg")}
            style={styles.icon}
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
    resizeMode: "contain",
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
