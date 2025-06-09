import { Text, View } from "@/components/Themed";
import { StyleSheet, ScrollView } from "react-native";
import { useRouter } from "expo-router";
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
import { LinearGradient } from "expo-linear-gradient";
import { useUserStore } from "@/hooks/useStore";
import { Redirect } from "expo-router";
import { handleError } from "@/errors";
import { formatTime } from "@/utils";
import StyledInput from "@/components/inputs/StyledInput";
import StyledPasswordInput from "@/components/inputs/StyledPasswordInput";
import SubmitButton from "@/components/buttons/SubmitButton";
import FooterLink from "@/components/FooterLink";
import OTPInput from "@/components/OTPInput";
import Back from "@/components/buttons/Back";

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

const initialTime = 10 * 60; //10 minutes for otp expiration

const OTPToString = (otp: string[]): string => {
  let otpString: string = "";

  for (let i of otp) {
    otpString += i;
  }
  return otpString;
};

export default function PasswordReset() {

  const {user, token} = useUserStore();
  const { openAlert, Alert } = useAlert();
  const { openBanner, Banner } = useBanner();
  const {isConnected } = useNetInfo();
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [displayTime, setDisplayTime] = useState<number>(initialTime);
  const [updateDisplay, setUpdateDisplay] = useState<Boolean>(true);
  const timerRef = useRef<number>(initialTime);
  const [isTimerActive, setIsTimerActive] = useState<boolean>(false);
  const otpVerfied = useRef<boolean>(false);
  

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
      confirmPassword: "",
    },
  });

  // Handle countdown timer
  useEffect(() => {
    let interval: number | null | NodeJS.Timeout = null;

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
          await axios.post(
            `${url}/password/otp/generate`,
            newData,
            {
              timeout: 1000 * 25,
            }
          );
          setEmail(data.email);
          setIsTimerActive(true);
        } 
        else if (email === "backed")
        {
          setEmail(data.email);
        }
        
      } else {
        openAlert("fail", "Failed!", "No Internet Connection!");
        return;
      }
    } catch (e: any) {
      await handleError(e, openAlert);
    }
  };

  const sendOTPAgain = async () => {
    try {
      if (isConnected) {
        await axios.post(
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

      } else {
        openBanner("fail", "No Internet Connection!");
        return;
      }
    } catch (e: any) {
      handleError(e, openBanner);
    }
  };

  const verifyOTP = async () => {
    try {
      if (isConnected) {
        //pause the re renders caused by updating timer
        setUpdateDisplay(false);
        setIsVerifying(true);
        const otpString = OTPToString(otp);

        await axios.post(
          `${url}/password/otp/verify`,
          { email: email, otp: otpString },
          {
            timeout: 1000 * 25,
          }
        );

        otpVerfied.current = true;
        //setIsTimerActive(false);
        
        //setIsVerifying(false);
      } else {
        openAlert("fail", "Failed!", "No Internet Connection!");
        return;
      }
    } catch (e: any) {
      
      await handleError(e, openAlert);

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
          otp: OTPToString(otp),
        };
        await axios.post(
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
      handleError(e, openAlert, 'OTP_EXPIRED', ()=>{otpVerfied.current=false})
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

  //redirect to home screen if user already logged in
  if(token) 
  {
    if(user?.role ==='student') return <Redirect href="/(student)"/>
    else return <Redirect href="/(admin)"/>
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

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>New Password</Text>
            <Controller
              control={passForm.control}
              name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <StyledPasswordInput
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={passForm.formState.errors.password}
                  inputMode="text"
                />
              )}
            />
          </View>

          <View style={[styles.inputContainer, { marginTop: h * 9 }]}>
            <Text style={styles.inputLabel}>Confirm New Password</Text>
            <Controller
              control={passForm.control}
              name="confirmPassword"
              render={({ field: { onChange, onBlur, value } }) => (
                <StyledPasswordInput
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={passForm.formState.errors.confirmPassword}
                  inputMode="text"
                  onSubmitEditing={passForm.handleSubmit(resetPassword)}
                />
              )}
            />
          </View>

          <View style={styles.button}>
            <SubmitButton
              onPress={passForm.handleSubmit(resetPassword)}
              text="RESET PASSWORD"
              isValid={passForm.formState.isValid}
              isSubmitting={passForm.formState.isSubmitting}
            />
          </View>

          <FooterLink
            footerText="Remember password?"
            linkText="Log in"
            link="/login"
          />

        </LinearGradient>
      </ScrollView>
    );
  } else
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
       

        <Text style={styles.heading}>Forgot Password?</Text>

        <Text style={styles.paragraph}>
          {email === "" || email === "backed"
            ? "Don't worry! It happens. Please enter the email associated with your account."
            : `We have sent a six digit OTP to ${email}`}
        </Text>

        {email === "" || email === "backed" ? (
          <View style={styles.inputView}>

            <View style={styles.inputContainer}>
              <Text style={[styles.inputLabel]}>Email Address</Text>
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                  <StyledInput
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder="johndoe@xyz.com"
                    error={errors.email}
                    inputMode="text"
                    placeholderTextColor="rgba(0, 0, 0, 0.30)"
                    onSubmitEditing={handleSubmit(sendOTP)}
                  />
                )}
              />
            </View>

            <View style={styles.button}>
              <SubmitButton
                onPress={handleSubmit(sendOTP)}
                text="CONTINUE"
                isValid={isValid}
                isSubmitting={isSubmitting}
              />
            </View>
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
                <Text
                  style={{
                    color: "rgba(0, 0, 0, 0.9)",
                    fontFamily: "Inter_600SemiBold",
                    fontSize: height * 0.015,
                    textDecorationLine: "underline",
                    textAlign: "center",
                  }}
                  onPress={sendOTPAgain}
                >
                  Resend code
                </Text>
            )}

            <View style={styles.button}>
              <SubmitButton
                onPress={verifyOTP}
                text="VERIFY"
                isValid={OTPToString(otp).length === 6}
                isSubmitting={isVerifying}
              />
            </View>

          </View>
        )}

          <FooterLink
            footerText="Remember password?"
            linkText="Log in"
            link="/login"
          />

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
    marginTop: height * 0.0428,
    rowGap: h * 2,
  },

  inputContainer: {
      rowGap: h * 6,
  },

  inputLabel: {
    fontFamily: "Inter_400Regular",
    fontSize: height * 0.0171,
    color: "rgba(0, 0, 0, 0.70)",
  },

  button: {
    marginTop: height * 0.04161,
  },
});
