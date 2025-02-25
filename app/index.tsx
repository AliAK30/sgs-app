import { Text, View, TextInput } from "@/components/Themed";
import {
  StyleSheet,
  Pressable,
} from "react-native";
import { Image, useImage } from "expo-image";
import { Link } from "expo-router";
import {height } from "./_layout"


const imgSource = require("@/assets/images/edumatch.png");

export default function Index() {
  
  const image = useImage(imgSource, {
    maxWidth: 800,
    onError(error, retry) {
      console.error("Loading failed:", error.message);
      retry();
    },
  });
  //console.log(width, height);

  if (!image) {
    return <Text>Image is loading...</Text>;
  }


  return (
    <View style={styles.container}>
      <Image
        style={{
          width: image.width * (height/817),
          height: image.height * (height/817),
        }}
        source={imgSource}
        contentFit="contain"
      />
      <Text style={[styles.heading,]}>
        Welcome
      </Text>
      <Text style={[styles.paragraph, ]}>
        Enter your name and email address to continue
      </Text>
      <View style={styles.inputView}>
        <Text style={[styles.inputLabel, ]}>
          First name
        </Text>
        <TextInput
          style={[styles.input, ]}
          placeholder="John"
          placeholderTextColor="rgba(0, 0, 0, 0.30)"
          inputMode="text"
        />
        <Text style={[styles.inputLabel, ]}>
          Last name
        </Text>
        <TextInput
          style={[styles.input, ]}
          placeholder="Doe"
          placeholderTextColor="rgba(0, 0, 0, 0.30)"
          inputMode="text"
        />
        <Text style={[styles.inputLabel, ]}>
          Email
        </Text>
        <TextInput
          style={[styles.input, ]}
          placeholder="abc@gmail.com"
          placeholderTextColor="rgba(0, 0, 0, 0.30)"
          inputMode="email"
        />
        <Link href="/sections" asChild>
          <Pressable style={styles.button}>
            <Text
              style={{
                fontFamily: "Inter_600SemiBold",
                color: "#ffffff",
                fontSize: height * 0.0196,
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

/* const obj = {
  offsetX: 0,
  offsetY: 4,
  blurRadius: 4,
  spread: 0,
  color: "rgba(0, 0, 0, 0.25)",
  inset: false,
}; */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "92%",
    backgroundColor: "rgba(173, 216, 230, 0.25)",
    overflow: "scroll",
    borderRadius: 24,
    alignItems: "center",
    paddingHorizontal: height*0.024,
  },

  heading: {
    fontFamily: "Poppins_700Bold",
    color: "#565555",
    fontSize: height * 0.0367
  },

  paragraph: {
    fontFamily: "Inter_400Regular",
    fontSize: height * 0.0196,
    color: "rgba(0, 0, 0, 0.70)",
    textAlign: "center",
    marginTop: height*0.00734,
  },

  inputView: {
    alignSelf: "stretch",
    //backgroundColor: 'white',
    //paddingHorizontal: "6%",
    rowGap: height*0.00734,
    marginTop: height*0.0428,
  },

  input: {
    backgroundColor: "#ffffff",
    borderRadius: 10,
    //width: "100%",
    fontFamily: "Inter_400Regular",
    fontSize: height * 0.0196,
    color: "rgba(0, 0, 0, 1)",
    paddingHorizontal: height*0.0171,
    paddingVertical: height*0.0110,
    borderColor: "#D8DADC",
    borderStyle: "solid",
    borderWidth: 1,
  },

  inputLabel: {
    fontFamily: "Inter_400Regular",
    fontSize: height * 0.0171,
    color: "rgba(0, 0, 0, 0.70)",
  },

  button: {
    //width: "100%",
    backgroundColor: "#539df3",
    boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
    borderRadius: 10,
    paddingVertical: height*0.0208,
    marginTop: height*0.04161,
  },
});
