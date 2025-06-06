import { Text, View, TextInput } from "@/components/Themed";
import {
  StyleSheet,
  Pressable,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useRouter, Link } from "expo-router";
import { h, height } from "./_layout";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState, useEffect, useRef } from "react";
import * as yup from "yup";
import axios from "axios";
import { useAlert } from "@/hooks/useAlert";
import { useBanner } from "@/hooks/useBanner";
import { url } from "@/constants/Server";
import { useNetInfo } from "@react-native-community/netinfo";
import Back from "@/components/buttons/Back";
import { LinearGradient } from "expo-linear-gradient";
import OTPInput from "@/components/OTPInput";
import { EyeIcon, WarnIcon } from "@/components/Icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useUserStore } from "@/hooks/useStore";
import { Redirect } from "expo-router";

const emailSchema = yup.object().shape({
  email: yup
    .string()
    .required("Email is required")
    .matches(
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please enter a valid email"
    ),
});

const passwordSchema = yup.object().shape({
  password: yup
    .string()
    .required("Password is required")
    .matches(
      /^(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])(?=.{8,})/,
      "Password must contain at least 8 characters including at least 1 special character, and at least 1 digit"
    ),
  confirmPassword: yup
    .string()
    .required("Please re-enter Password")
    .oneOf([yup.ref("password")], "Passwords must match"),
});

type EmailSchema = yup.InferType<typeof emailSchema>;
type PasswordSchema = yup.InferType<typeof passwordSchema>;

const failedColor = "rgb(255, 0, 0)";

const initialTime = 10 * 60; //10 minutes for otp expiration

export default function PasswordReset() {

  const {user, token} = useUserStore();
  const insets = useSafeAreaInsets();
  const { openAlert, Alert } = useAlert();
  const { openBanner, Banner } = useBanner();
  const { type, isConnected } = useNetInfo();
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [displayTime, setDisplayTime] = useState<number>(initialTime);
  const [updateDisplay, setUpdateDisplay] = useState<Boolean>(true);
  const timerRef = useRef<number>(initialTime);
  const [isTimerActive, setIsTimerActive] = useState<boolean>(false);
  const otpVerfied = useRef<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  //redirect to home screen if user already logged in
    if(token) 
    {
      if(user?.role ==='student') return <Redirect href="/(student)"/>
      else return <Redirect href="/(admin)"/>
    }

  const {
    control,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm({
    mode: "onSubmit",
    resolver: yupResolver(emailSchema),
    defaultValues: {
      email: "",
    },
  });

  const passForm = useForm({
    mode: "onSubmit",
    resolver: yupResolver(passwordSchema),
    defaultValues: {
      password: "",
    },
  });

  // Format time as MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // Handle countdown timer
  useEffect(() => {
    let interval: number | null = null;

    if (isTimerActive) {
      interval = setInterval(() => {
        timerRef.current -= 1;

        // Only update state if we want to trigger re-renders
        if (updateDisplay) {
          setDisplayTime(timerRef.current);
        }

        if (timerRef.current <= 0) {
          setIsTimerActive(false);
          if (interval) clearInterval(interval);
        }
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerActive, updateDisplay]);

  const sendOTP: SubmitHandler<EmailSchema> = async (data) => {

    
    try {
      
      if (isConnected) {
        if(email === "")
        {
          //add the role because api expects it
          const newData = { ...data, role: user?.role };
          const res: any = await axios.post(
            `${url}/password/otp/generate`,
            newData,
            {
              timeout: 1000 * 25,
            }
          );
          setEmail(data.email);
          setIsTimerActive(true);
        } else if (email === "backed")
        {
          setEmail(data.email);
        }
        
        
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

      if (e.status === 404) {
        switch (e.response.data.code) {
          case "ACCOUNT_NOT_EXISTS":
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

  const sendOTPAgain = async () => {
    try {
      if (isConnected) {
        const res: any = await axios.post(
          `${url}/password/otp/generate`,
          { email: email, role: user?.role },
          {
            timeout: 1000 * 15,
          }
        );

        setUpdateDisplay(false);
        setTimeout(() => {
          timerRef.current = initialTime;
          setIsTimerActive(true);
          setUpdateDisplay(true);
        }, 2500);
        openBanner("success", "new OTP sent successfully!");

        //router.replace("/sections");
      } else {
        openBanner("fail", "No Internet Connection!");
        return;
      }
    } catch (e: any) {
      if (!e.status) {
        switch (e.code) {
          case "ECONNABORTED":
            openBanner("fail", "Request TImed out\nPlease try again later!");
            return;

          case "ERR_NETWORK":
            openBanner(
              "fail",
              "Server is not Responding\nPlease try again later!"
            );
            return;
        }
      }

      if (e.status >= 400 && e.status < 500) {
        switch (e.response.data.code) {
          case "ACCOUNT_NOT_EXISTS":
            openBanner("fail", e.response.data.message);
            return;
        }
      }

      if (e.status === 500) {
        openBanner("fail", e.message);
        return;
      }
    }
  };

  const OTPToString = (): string => {
    let otpString: string = "";

    for (let i of otp) {
      otpString += i;
    }
    return otpString;
  };

  const verifyOTP = async () => {
    try {
      if (isConnected) {
        setIsVerifying(true);
        const otpString = OTPToString();

        const res: any = await axios.post(
          `${url}/password/otp/verify`,
          { email: email, otp: otpString },
          {
            timeout: 1000 * 25,
          }
        );

        otpVerfied.current = true;
        setIsTimerActive(false);
        setUpdateDisplay(false);
        setIsVerifying(false);
      } else {
        openAlert("fail", "Failed!", "No Internet Connection!");
        return;
      }
    } catch (e: any) {
      //pause the re renders caused by updating timer
      setUpdateDisplay(false);

      if (!e.status) {
        switch (e.code) {
          case "ECONNABORTED":
            await openAlert(
              "fail",
              "Failed!",
              "Request TImed out\nPlease try again later!"
            );
            return;

          case "ERR_NETWORK":
            await openAlert(
              "fail",
              "Failed!",
              "Server is not Responding\nPlease try again later!"
            );
            return;
        }
      }

      if (e.status >= 400 && e.status < 500) {
        switch (e.response.data.code) {
          case "OTP_INVALID":
            await openAlert("fail", "Failed!", e.response.data.message);
            return;

          case "OTP_EXPIRED":
            await openAlert("fail", "Failed!", e.response.data.message);
            return;
        }
      }

      if (e.status === 500) {
        await openAlert("fail", "Failed!", e.message);
        return;
      }
    } finally {
      setIsVerifying(false);
      //resume the re renders caused by updating timer
      if (!otpVerfied.current) setUpdateDisplay(true);
    }
  };

  const resetPassword: SubmitHandler<PasswordSchema> = async (data) => {
    try {
      if (isConnected) {
        const newData = {
          email: email,
          new_password: data.password,
          role:user?.role,
          otp: OTPToString(),
        };
        const res: any = await axios.post(
          `${url}/password/reset`,
          newData,
          {
            timeout: 1000 * 15,
          }
        );

        await openAlert(
          "success",
          "Password Reset Successful!",
          `Lets get back into the App!`
        );

        router.replace("/login");
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

      if (e.status >= 400 && e.status < 500) {
        switch (e.response.data.code) {
          case "OTP_INVALID":
            await openAlert("fail", "Failed!", e.response.data.message);
            return;

          case "OTP_EXPIRED":
            await openAlert("fail", "Failed!", e.response.data.message);
            router.replace("/password-reset");
            return;
        }
      }

      if (e.status === 500) {
        openAlert("fail", "Failed!", e.message);
        return;
      }
    }
  };

  const handleBack = () => {
    if(email != "")
    {
      if(otpVerfied.current)
      {
        otpVerfied.current = false;
        setUpdateDisplay(!updateDisplay); //to trigger state change
      } else {
        setEmail("backed")
      }

    } else {
      router.replace('/login');
    }
  }

  if (otpVerfied.current) {
    return (
      <ScrollView
      automaticallyAdjustKeyboardInsets={true}
      keyboardDismissMode="none"
      contentContainerStyle={{alignItems:'center', flexGrow:1}}
      >
        <LinearGradient
          style={styles.container}
          colors={["#ADD8E6", "#EAF5F8"]}
          locations={[0.27, 1]}
        >
          <Alert />
          <Banner />

          
            <Back onPress={handleBack}/>
          

          <Text style={styles.heading}>Reset Password</Text>

          <Text style={[styles.paragraph, { marginBottom: height * 0.03 }]}>
            Please type something you would remember
          </Text>

          <Text style={[styles.inputLabel, { paddingBottom: height * 0.005 }]}>
            New Password
          </Text>
          <Controller
            control={passForm.control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <View style={{ justifyContent: "center" }}>
                <TextInput
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  style={[
                    styles.input,
                    {
                      borderColor: passForm.formState.errors.password
                        ? failedColor
                        : "#D8DADC",
                    },
                  ]}
                  inputMode="text"
                  secureTextEntry={!showPassword}
                />

                {passForm.formState.errors.password && (
                  <Text style={styles.inputError}>
                    {passForm.formState.errors.password.message}
                  </Text>
                )}

                {showPassword ? (
                  <EyeIcon
                    name="eye-outline"
                    onTap={() => setShowPassword(!showPassword)}
                  />
                ) : (
                  <EyeIcon
                    name="eye-off-outline"
                    onTap={() => setShowPassword(!showPassword)}
                  />
                )}
              </View>
            )}
          />

          <Text
            style={[
              styles.inputLabel,
              { paddingBottom: height * 0.005, paddingTop: height * 0.025 },
            ]}
          >
            Confirm New Password
          </Text>
          <Controller
            control={passForm.control}
            name="confirmPassword"
            render={({ field: { onChange, onBlur, value } }) => (
              <View style={{ justifyContent: "center" }}>
                <TextInput
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  style={[
                    styles.input,
                    {
                      borderColor: passForm.formState.errors.confirmPassword
                        ? failedColor
                        : "#D8DADC",
                    },
                  ]}
                  inputMode="text"
                  secureTextEntry={!showPassword}
                />

                {passForm.formState.errors.confirmPassword && (
                  <Text style={styles.inputError}>
                    {passForm.formState.errors.confirmPassword.message}
                  </Text>
                )}

                {showPassword ? (
                  <EyeIcon
                    name="eye-outline"
                    onTap={() => setShowPassword(!showPassword)}
                  />
                ) : (
                  <EyeIcon
                    name="eye-off-outline"
                    onTap={() => setShowPassword(!showPassword)}
                  />
                )}
              </View>
            )}
          />

          <Pressable
            style={[
              styles.button,
              {
                backgroundColor: passForm.formState.isValid
                  ? "#007BFF"
                  : "rgba(0, 0, 0, 0.4)",
              },
            ]}
            onPress={passForm.handleSubmit(resetPassword)}
          >
            {passForm.formState.isSubmitting ? (
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

          <View style= {{ flexDirection: 'row', flex:1, padding:height*0.03, alignItems:'flex-end', alignSelf:'center'}}>
        <Text style={[styles.inputLabel, {fontSize: height * 0.019}]}> Remember password?</Text>
        <Link href="/login" asChild>
          <Pressable hitSlop={20}>
          <Text
            style={{
              fontFamily: "Inter_600SemiBold",
              color: "#007BFF",
              textDecorationLine: "underline",
              fontSize: height * 0.019,
            }}
          > {" "}Log in</Text>
          </Pressable>
          </Link>
        </View>
        </LinearGradient>
      </ScrollView>
    );
  } else
    return (

      <ScrollView
      //style={{borderWidth:10}}
      automaticallyAdjustKeyboardInsets={true}
      keyboardDismissMode="none"
      contentContainerStyle={{alignItems:'center', flexGrow:1}}
      >
      <LinearGradient
        style={styles.container}
        colors={["#ADD8E6", "#EAF5F8"]}
        locations={[0.27, 1]}
      >
        <Alert />
        <Banner />

        
        <Back onPress={handleBack}/>
       

        <Text style={styles.heading}>Forgot Password?</Text>

        <Text style={styles.paragraph}>
          {email === "" || email === "backed"
            ? "Don't worry! It happens. Please enter the email associated with your account."
            : `We have sent a six digit OTP to ${email}`}
        </Text>

        {email === "" || email === "backed" ? (
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
                    <Text style={styles.inputError}>
                      {errors.email.message}
                    </Text>
                  )}
                </View>
              )}
            />

            <Pressable
              style={[
                styles.button,
                { backgroundColor: isValid ? "#007BFF" : "rgba(0, 0, 0, 0.4)" },
              ]}
              onPress={handleSubmit(sendOTP)}
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
                  CONTINUE
                </Text>
              )}
            </Pressable>
          </View>
        ) : (
          <View style={{ justifyContent: "space-evenly" }}>
            <OTPInput otp={otp} setOTP={setOtp} />

            {isTimerActive ? (
              <Text
                style={{
                  color: "rgba(0, 0, 0, 0.7)",
                  fontFamily: "Inter_400Regular",
                  fontSize: height * 0.015,
                  textAlign: "center",
                }}
              >
                Send code again in {formatTime(displayTime)}
              </Text>
            ) : (
              <Pressable onPress={sendOTPAgain}>
                <Text
                  style={{
                    color: "rgba(0, 0, 0, 0.9)",
                    fontFamily: "Inter_600SemiBold",
                    fontSize: height * 0.015,
                    textDecorationLine: "underline",
                    textAlign: "center",
                  }}
                >
                  Resend code
                </Text>
              </Pressable>
            )}

            <Pressable
              style={[
                styles.button,
                {
                  backgroundColor:
                    OTPToString().length === 6
                      ? "#007BFF"
                      : "rgba(0, 0, 0, 0.4)",
                },
              ]}
              onPress={verifyOTP}
            >
              {isVerifying ? (
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
                  VERIFY
                </Text>
              )}
            </Pressable>
          </View>
        )}

<View style= {{ flexDirection: 'row', flex:1, padding:height*0.03, alignItems:'flex-end', alignSelf:'center'}}>
        <Text style={[styles.inputLabel, {fontSize: height * 0.019}]}> Remember password?</Text>
        <Link href="/login" asChild>
          <Pressable hitSlop={20}>
          <Text
            style={{
              fontFamily: "Inter_600SemiBold",
              color: "#007BFF",
              textDecorationLine: "underline",
              fontSize: height * 0.019,
            }}
          > {" "}Log in</Text>
          </Pressable>
          </Link>
        </View>
      </LinearGradient>
      </ScrollView>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "92%",
    paddingVertical:h*20,
    backgroundColor: "rgba(173, 216, 230, 0.25)",
    borderRadius: 24,
    paddingHorizontal: height * 0.024,
  },

  heading: {
    fontFamily: "Poppins_700Bold",
    color: "#565555",
    fontSize: height * 0.0367,
    alignSelf: "center",
    marginTop: height * 0.05,
  },

  paragraph: {
    fontFamily: "Inter_400Regular",
    fontSize: height * 0.0196,
    color: "rgba(0, 0, 0, 0.70)",
    marginTop: height * 0.00734,
    textAlign: "center",
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
    marginBottom: height * 0.019,
  },

  inputError: {
    fontFamily: "Inter_400Regular",
    fontSize: height * 0.015,
    color: "rgb(255, 0, 0)",
    position: "absolute",
    top: "80%",
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
