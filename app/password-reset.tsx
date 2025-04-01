import { Text, View, TextInput } from "@/components/Themed";
import {
  StyleSheet,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { Redirect, useRouter, Link } from "expo-router";
import { height } from "./_layout";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { useAlert } from "@/hooks/useAlert";
import { url } from "@/constants/Server";
import { useNetInfo } from "@react-native-community/netinfo";
import { useState } from "react";
import Back from "@/components/Back";
import { LinearGradient } from "expo-linear-gradient";


const schema = yup
  .object()
  .shape({
    email: yup
      .string()
      .required("Email is required")
      .matches(
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email")
  })
  .required("Please fill all the above fields");

type User = yup.InferType<typeof schema>;

const failedColor = "rgb(255, 0, 0)";

const WarnIcon = () => {
  return (
    <Ionicons
      name="warning-outline"
      color="red"
      size={height * 0.02447}
      style={{ position: "absolute", right: 8, top:8 }}
    />
  );
};

export default function Login() {
  const { openAlert, Alert } = useAlert();
  const { type, isConnected } = useNetInfo();
  const router = useRouter();
  

  const {
    control,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm({
    mode: "onSubmit",
    resolver: yupResolver(schema),
    defaultValues: {
      email: "",
    },
  });


  const onSubmit: SubmitHandler<User> = async (data) => {
    try {
      if (isConnected) {
        const res: any = await axios.post(`${url}/student/login`, data, {
          timeout: 1000 * 15,
        });

        //await openAlert("success", "Login Successful!", `This app is under development, so login feature will be available in future releases. A password is auto generated for you: ${res.data.user.password}!`);
        
        //router.replace("/sections");
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

      if (e.status === 500) {
        openAlert("fail", "Failed!", e.message);
        return;
      }
    }
  };

  
  return (
    <LinearGradient
      style={styles.container}
      colors={["#ADD8E6", "#EAF5F8"]}
      locations={[0.27, 1]}
      
    >
      <Alert />

      <Link href="/login" asChild>
        <Back/>
    </Link>
      
      <Text style={styles.heading}>Forgot Password?</Text>

      <Text style={styles.paragraph}>Don't worry! It happens. Please enter the email associated with your account.</Text>

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
              RESET PASSWORD
            </Text>
          )}
        </Pressable>
      </View>


    </LinearGradient>
  );

}


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
    alignSelf: "center",
    marginTop: height*0.05,
    
  },

  paragraph: {
    fontFamily: "Inter_400Regular",
    fontSize: height * 0.0196,
    color: "rgba(0, 0, 0, 0.70)",
    marginTop: height * 0.00734,
    textAlign:"center"
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
