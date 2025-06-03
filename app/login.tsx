import { Text, View, TextInput } from "@/components/Themed";
import {
  StyleSheet,
  Pressable,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { Image, useImage } from "expo-image";
import ContentLoader, { Rect, Circle } from "react-content-loader/native";
import { useRouter, Link, Redirect } from "expo-router";
import { height, h, OS} from "./_layout";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { useAlert } from "@/hooks/useAlert";
import { url } from "@/constants/Server";
import { useNetInfo } from "@react-native-community/netinfo";
import { useUserStore, useSurveyStore } from "@/hooks/useStore";
import { useState } from "react";
import { WarnIcon, EyeIcon } from "@/components/Icons";
import Back from "@/components/Back";

const imgSource = require("@/assets/images/edumatch.png");

const schema = yup
  .object()
  .shape({
    email: yup
      .string()
      .required("Email is required")
      .matches(
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email"
      ),
    password: yup.string().required("Password is required"),
  })
  .required("Please fill all the above fields");

type User = yup.InferType<typeof schema>;

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



export default function Login() {

  const { openAlert, Alert } = useAlert();
  const { type, isConnected } = useNetInfo();
  const router = useRouter();
  const { initializeUser, user, token } = useUserStore();
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const {setSectionsCount} = useSurveyStore();

  

  const {
    control,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm({
    mode: "onSubmit",
    resolver: yupResolver(schema),
    defaultValues: {
      email: "",
      password: "",
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
    try {
      if (isConnected) {
        const res: any = await axios.post(`${url}/${user?.role}/login`, data, {
          timeout: 1000 * 25,
        });

        //await openAlert("success", "Login Successful!", `This app is under development, so login feature will be available in future releases. A password is auto generated for you: ${res.data.user.password}!`);
        await initializeUser(res.data.user, res.data.token);
        setSectionsCount();

        user?.role === 'student' ? router.replace("/(student)") : router.replace("/(admin)");
      } else {
        openAlert("fail", "Failed!", "No Internet Connection!");
        return;
      }
    } catch (e: any) {
      if (!e.status) {
        switch (e.code) {
          case "ECONNABORTED":
            openAlert(
              "fail",
              "Failed!",
              "Request TImed out\nPlease try again later!"
            );
            return;

          case "ERR_NETWORK":
            openAlert(
              "fail",
              "Failed!",
              "Server is not Responding\nPlease try again later!"
            );
            return;
        }
      }

      if (e.status === 401) {
        switch (e.response.data.code) {
          case "UNAUTHORIZED":
            openAlert("fail", "Failed!", e.response.data.message);
            return;
        }
      }

      if(e.status === 429)
      {
        openAlert("fail", "Error", e.response.data.message);
      }

      if (e.status === 500) {
        openAlert("fail", "Failed!", e.message);
        return;
      }
    }
  };
  
  //redirect back to index if user has not selected a role
  if(!user?.role) return <Redirect href='/'/>
  if(token) {
    if(user.role === "student") return <Redirect href='/(student)'/>
    else return <Redirect href='/(admin)'/>
  }
  
  return (
    <ScrollView
      automaticallyAdjustKeyboardInsets={true}
      keyboardDismissMode="none"
      contentContainerStyle={{alignItems:'center', flexGrow:1}}
    >
      <View style={styles.container}>
        <View style={{position:'absolute', alignSelf:'flex-start', marginTop:h*20, marginLeft: OS==='web' ? 0 : height*0.024}}>
        <Back onPress={()=>router.replace('/')}/>
          </View>
      <Alert />
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
      <Text style={styles.heading}>Log in</Text>

      <View style={styles.inputView}>
        <Text style={[styles.inputLabel]}>Email address</Text>
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
              {errors.email && (
          <Text style={styles.inputError}>{errors.email.message}</Text>
        )}
            </View>
          )}
        />
        

        <Text style={[styles.inputLabel]}>Password</Text>
        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, onBlur, value } }) => (
            <View style={{ justifyContent: "center" }}>
              <TextInput
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                style={[
                  styles.input,
                  { borderColor: errors.password ? failedColor : "#D8DADC" },
                ]}
                inputMode="text"
                secureTextEntry={!showPassword}
              />
              {errors.password && <WarnIcon />}
              {errors.password && (
          <Text style={styles.inputError}>{errors.password.message}</Text>
        )}
              {!errors.password && (showPassword ? <EyeIcon name="eye-outline" onTap={()=>setShowPassword(!showPassword)}/>: <EyeIcon name="eye-off-outline" onTap={()=>setShowPassword(!showPassword)}/>)}
            </View>
          )}
        />
        

        <Pressable
          style={[
            styles.button,
            { backgroundColor: isValid ? "#007BFF" : "rgba(0, 0, 0, 0.4)" },
          ]}
          onPress={handleSubmit(onSubmit)}
        >
          {isSubmitting ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text
              style={{
                fontFamily: "Inter_600SemiBold",
                color: "#ffffff",
                fontSize: height * 0.0196,
                textAlign: "center",
              }}
            >
              LOGIN
            </Text>
          )}
        </Pressable>
      </View>

      <Link href="/password-reset">
        <Text style={[styles.inputLabel, { textDecorationLine: "underline" }]}>
          Forgot Password?
        </Text>
      </Link>


      {user?.role==='student' && <View style= {{ flexDirection: 'row', flex:1, padding:height*0.03, alignItems:'flex-end', alignSelf:'center'}}>
              <Text style={[styles.inputLabel, {fontSize: height * 0.019}]}> Don't have an account?</Text>
              <Link href="/registration" asChild>
                <Pressable hitSlop={20}>
                <Text
                  style={{
                    fontFamily: "Inter_600SemiBold",
                    color: "#007BFF",
                    textDecorationLine: "underline",
                    fontSize: height * 0.019,
                  }}
                > {" "}Sign up</Text>
                </Pressable>
                </Link>
              </View>
      }

              </View>
    </ScrollView>
  );

}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "92%",
    backgroundColor: "rgba(173, 216, 230, 0.25)",
    borderRadius: 24,
    paddingHorizontal: height * 0.024,
    alignItems: "center",
  },

  heading: {
    fontFamily: "Poppins_700Bold",
    color: "#565555",
    fontSize: height * 0.0367,
    alignSelf: "flex-start",
  },

  inputView: {
    alignSelf: "stretch",
    rowGap: height * 0.00734,
    marginTop: height * 0.0428,
  },

  input: {
    backgroundColor: "#ffffff",
    borderRadius: 10,
    fontFamily: "Inter_400Regular",
    fontSize: height * 0.0196,
    color: "rgba(0, 0, 0, 1)",
    paddingHorizontal: height * 0.0171,
    paddingVertical: height * 0.011,
    borderStyle: "solid",
    borderWidth: 1,
    marginBottom: height*0.019
  },

  inputError: {
    fontFamily: "Inter_400Regular",
    fontSize: height * 0.015,
    color: "rgb(255, 0, 0)",
    position: 'absolute',
    top:"80%"
  },

  inputLabel: {
    fontFamily: "Inter_400Regular",
    fontSize: height * 0.0171,
    color: "rgba(0, 0, 0, 0.70)",
  },

  button: {
    marginBottom: height * 0.019,
    boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
    borderRadius: 10,
    paddingVertical: height * 0.0208,
    marginTop: height * 0.04161,
  },

  note: {
    fontFamily: "Inter_400Regular",
    fontSize: height * 0.0151,
    color: "rgba(0, 0, 0, 0.70)",
    textDecorationLine: "underline",
    textAlign: "center",
  },
});
