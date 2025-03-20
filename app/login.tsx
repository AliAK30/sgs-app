import { Text, View, TextInput } from "@/components/Themed";
import { StyleSheet, Pressable, ActivityIndicator, ScrollView } from "react-native";
import { Image, useImage } from "expo-image";
import ContentLoader, { Rect, Circle } from "react-content-loader/native";
import { Redirect, useRouter } from "expo-router";
import { height } from "./_layout";
import { useForm, Controller, SubmitHandler,  } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { useAlert } from "@/hooks/useAlert";
import { url } from "@/constants/Server";
import { useNetInfo } from "@react-native-community/netinfo";
import { useUser } from "@/contexts/UserContext";



const imgSource = require("@/assets/images/edumatch.png");

const schema = yup
  .object()
  .shape({
    first_name: yup
      .string()
      .required("First Name is Required")
      .min(2, "First name must contain at least 2 letters"),
    last_name: yup
      .string()
      .required("Last Name is Required")
      .min(2, "Last name must contain at least 2 letters"),
    email: yup
      .string()
      .required("Email is required")
      .matches(
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email"
      ),
  })
  .required("Please fill all the above fields");

type User = yup.InferType<typeof schema> & {
  role?: string;
  password?: string;
};

const failedColor = "rgb(255, 0, 0)";

const MyLoader = ({ w, h }: any) => (
  <ContentLoader
    speed={2}
    width={w}
    height={h}
    //viewBox={`0 0 ${229* (height / 817)} ${218* (height / 817)}`}
    backgroundColor="#ffffff"
    foregroundColor="#ecebeb"
  >
    <Circle cx={w / 2.6} cy={h / 2} r={w / 7} />
    <Circle cx={w / 2.6} cy={h / 4} r={w / 7} />
    <Circle cx={w / 1.65} cy={h / 4} r={w / 7} />
    <Circle cx={w / 1.65} cy={h / 2} r={w / 7} />
    <Rect x={w / 5.4} y={h / 1.39} width={w * 0.6} height={h * 0.15} />
  </ContentLoader>
);

const WarnIcon = () => {
  return (
    <Ionicons
      name="warning-outline"
      color="red"
      size={height * 0.02447}
      style={{ position: "absolute", right: 10 }}
    />
  );
};

export default function Login() {

  const {openAlert, Alert} = useAlert();
  const { type, isConnected } = useNetInfo();
  const router = useRouter();
  const {setUserAndToken, user } = useUser();

  const {
    control,
    handleSubmit,
    formState: { errors, isValid, isSubmitting, },
  } = useForm({
    mode: "onSubmit",
    resolver: yupResolver(schema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
    },
  });

  const image = useImage(imgSource, {
    maxWidth: 800,
    onError(error, retry) {
      console.error("Loading failed:", error.message);
      retry();
    },
  });

  

  

  const onSubmit: SubmitHandler<User> = async (data) => {

    try{
      data.role = "student";
      if(isConnected)
      {
        
        const res: any = await axios.post(`${url}/student/register`,data, {timeout:1000*15})
       
        
        await openAlert("success", `This app is under development, so login feature will be available in future releases. A password is auto generated for you: ${res.data.user.password}!`);
        setUserAndToken(res.data.user, res.data.token);
        router.replace("/sections");
        

      }
      else
      {
        openAlert("fail", "No Internet Connection!");
        return;
      }
      
    
    } catch(e:any) {
      
      if(!e.status)
      {
        switch(e.code)
        {
          case "ECONNABORTED":
            openAlert("fail", "Request TImed out\nPlease try again later!");
            return;

          case "ERR_NETWORK":
            openAlert("fail", "Server is not Responding\nPlease try again later!");
            return;
        }
      }
    
    
      if(e.status === 400)
      {
        switch(e.response.data.code)
        {
          case 'INVALID_EMAIL':
            openAlert("fail", e.response.data.message);
            return;

          case 'DUPLICATE_EMAIL':
            openAlert("info", e.response.data.message);
            return;

          case 'VALIDATION_ERROR':
            openAlert("fail", e.response.data.message);
            return;
        }
        
      }

      if(e.status === 500)
      {
        openAlert("fail", e.message);
        return;
      }

    }
    
  }


  if(!user)
  return (
    
    <ScrollView style={styles.container} automaticallyAdjustKeyboardInsets={true} keyboardDismissMode="none" contentContainerStyle={{alignItems:"center"}} >
      
      <Alert/>
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
      <Text style={[styles.heading]}>Welcome</Text>
      <Text style={[styles.paragraph]}>
        Enter your name and email address to continue
      </Text>
      <View style={styles.inputView}>
        <Text style={[styles.inputLabel]}>First name</Text>
        <Controller
          control={control}
          name="first_name"
          render={({ field: { onChange, onBlur, value } }) => (
            <View style={{ justifyContent: "center" }}>
              <TextInput
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                style={[
                  styles.input,
                  { borderColor: errors.first_name ? failedColor : "#D8DADC" },
                ]}
                placeholder="John"
                placeholderTextColor="rgba(0, 0, 0, 0.30)"
                inputMode="text"
              />
              {errors.first_name && <WarnIcon />}
            </View>
          )}
        />
        {errors.first_name && (
          <Text style={styles.inputError}>{errors.first_name.message}</Text>
        )}
        <Text style={[styles.inputLabel]}>Last name</Text>
        <Controller
          control={control}
          name="last_name"
          render={({ field: { onChange, onBlur, value } }) => (
            <View style={{ justifyContent: "center" }}>
              <TextInput
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                style={[
                  styles.input,
                  { borderColor: errors.last_name ? failedColor : "#D8DADC" },
                ]}
                placeholder="Doe"
                placeholderTextColor="rgba(0, 0, 0, 0.30)"
                inputMode="text"
              />
              {errors.last_name && <WarnIcon />}
            </View>
          )}
        />
        {errors.last_name && (
          <Text style={styles.inputError}>{errors.last_name.message}</Text>
        )}

        <Text style={[styles.inputLabel]}>Email</Text>
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <View style={{ justifyContent: "center" }}>
              <TextInput
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                style={[
                  styles.input,
                  { borderColor: errors.email ? failedColor : "#D8DADC" },
                ]}
                placeholder="abc@gmail.com"
                placeholderTextColor="rgba(0, 0, 0, 0.30)"
                inputMode="text"
              />
              {errors.email && <WarnIcon />}
            </View>
          )}
        />
        {errors.email && (
          <Text style={styles.inputError}>{errors.email.message}</Text>
        )}

        <Pressable
          style={styles.button}
       
          onPress={handleSubmit(onSubmit)}
        >
          {isSubmitting ? <ActivityIndicator size="small" color="white"/> : <Text
            style={{
              fontFamily: "Inter_600SemiBold",
              color: "#ffffff",
              fontSize: height * 0.0196,
              textAlign: "center",
            }}
          >
            CONTINUE
          </Text> }
        </Pressable>
      </View>
      <View style={{marginTop: height*0.10}}>
      </View>
    </ScrollView>
  );

  return <Redirect href="/sections"/>
}

//<Link href="/sections" asChild></Link>

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
    
    borderRadius: 24,
    paddingHorizontal: height * 0.024,
    
  },

  heading: {
    fontFamily: "Poppins_700Bold",
    color: "#565555",
    fontSize: height * 0.0367,
  },

  paragraph: {
    fontFamily: "Inter_400Regular",
    fontSize: height * 0.0196,
    color: "rgba(0, 0, 0, 0.70)",
    textAlign: "center",
    marginTop: height * 0.00734,
  },

  inputView: {
    alignSelf: "stretch",
    //backgroundColor: 'white',
    //paddingHorizontal: "6%",
    rowGap: height * 0.00734,
    marginTop: height * 0.0428,
  },

  input: {
    backgroundColor: "#ffffff",
    borderRadius: 10,
    //width: "100%",
    fontFamily: "Inter_400Regular",
    fontSize: height * 0.0196,
    color: "rgba(0, 0, 0, 1)",
    paddingHorizontal: height * 0.0171,
    paddingVertical: height * 0.011,
    borderStyle: "solid",
    borderWidth: 1,
  },

  inputError: {
    fontFamily: "Inter_400Regular",
    fontSize: height * 0.0171,
    color: "rgb(255, 0, 0)",
  },

  inputLabel: {
    fontFamily: "Inter_400Regular",
    fontSize: height * 0.0171,
    color: "rgba(0, 0, 0, 0.70)",
  },

  button: {
    
    backgroundColor: "#539df3",
    boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
    borderRadius: 10,
    paddingVertical: height * 0.0208,
    marginTop: height * 0.04161,
  },

  note: {
    fontFamily: "Inter_400Regular",
    fontSize: height * 0.0151,
    color: "rgba(0, 0, 0, 0.70)",
    textDecorationLine: "underline" ,
    textAlign: "center",
  
  }
});
