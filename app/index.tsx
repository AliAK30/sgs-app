import { Text, View, TextInput } from "@/components/Themed";
import { StyleSheet, Pressable, useWindowDimensions } from "react-native";
import { Image, useImage } from "expo-image";
import { Link } from "expo-router";
import FontAwesome from "@expo/vector-icons/FontAwesome";



const imgSource = require("@/assets/images/edumatch.png");

export default function Index() {
  const { height, width } = useWindowDimensions();
  const image = useImage(imgSource, {
    maxWidth: 800,
    onError(error, retry) {
      console.error("Loading failed:", error.message);
      retry();
    },
  });
  console.log(width, height)
  if (!image) {
    return <Text>Image is loading...</Text>;
  }


  return (
    <View
      style={[
        styles.container,
        { width: width < 480 ? 0.92 * width : 0.5 * width },
      ]}
    >
      <Image
        style={{
          width: height < 700 ? image.width * 0.7 : image.width,
          height: height < 700 ? image.width * 0.7 : image.width,
        }}
        source={imgSource}
        contentFit="contain"
      />
      <Text style={[styles.heading, {fontSize: height*0.040}]}>Welcome</Text>
      <Text style={[styles.paragraph, {fontSize:height*0.020}]}>
        Enter your name and email address to continue
      </Text>
      <View style={styles.inputView}>
        <Text style={[styles.inputLabel, {fontSize:height*0.018}]}>First name</Text>
        <TextInput
          style={[styles.input, {fontSize: height*0.018}]}
          placeholder="John"
          placeholderTextColor="rgba(0, 0, 0, 0.30)"
          inputMode="text"
        />
        <Text style={[styles.inputLabel, {fontSize:height*0.018}]}>Last name</Text>
        <TextInput
          style={[styles.input, {fontSize: height*0.018}]}
          placeholder="Doe"
          placeholderTextColor="rgba(0, 0, 0, 0.30)"
          inputMode="text"
        />
        <Text style={[styles.inputLabel, {fontSize:height*0.018}]}>Email</Text>
        <TextInput
          style={[styles.input, {fontSize: height*0.018}]}
          placeholder="abc@gmail.com"
          placeholderTextColor="rgba(0, 0, 0, 0.30)"
          inputMode="email"
        />
        <Link href='/sections' asChild>
        <Pressable style={styles.button}>
          <Text
            style={{
              fontFamily: "Inter_600SemiBold",
              color: "#ffffff",
              fontSize:height*0.020,
              textAlign: "center",
            }}
          >
            CONTINUE
          </Text>
        </Pressable>
        </Link>
      </View>
    </View>
  );
}

const obj = {
  offsetX: 0,
  offsetY: 4,
  blurRadius: 4,
  spread: 0,
  color: "rgba(0, 0, 0, 0.25)",
  inset: false,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(173, 216, 230, 0.25)",

    marginVertical: "3%",
    borderRadius: 24,
    alignItems: "center",
  },

  heading: {
    fontFamily: "Poppins_700Bold",
    color: "#565555",
    fontSize: 30,
  },

  paragraph: {
    fontFamily: "Inter_400Regular",
    fontSize: 16,
    color: "rgba(0, 0, 0, 0.70)",
    textAlign: "center",
    marginTop:"2%",
  },

  inputView: {
    width: "100%",
    alignItems: "flex-start",
    //backgroundColor: 'white',
    paddingHorizontal: "6%",
    rowGap: 6,
    marginTop: "10%",
  },

  input: {
    backgroundColor: "#ffffff",
    borderRadius: 10,
    width: "100%",
    fontFamily: "Inter_400Regular",
    fontSize: 16,
    color: "rgba(0, 0, 0, 1)",
    padding: "3%",
    borderColor: "#D8DADC",
    borderStyle: "solid",
    borderWidth: 1,
  },

  inputLabel: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    color: "rgba(0, 0, 0, 0.70)",
  },

  button: {
    width: "100%",
    backgroundColor: "#539df3",
    boxShadow: [obj],
    borderRadius: 10,
    paddingVertical: "3%",
    marginTop: "10%",
  },
});
