import { Text, View } from "@/components/Themed";
import { StyleSheet, Pressable, ScrollView } from "react-native";
import { useRouter, Redirect } from "expo-router";
import { height, width, w, h } from "./_layout";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState, useRef, useEffect } from "react";
import * as yup from "yup";
import axios from "axios";
import { useAlert } from "@/hooks/useAlert";
import { url } from "@/constants/Server";
import { useNetInfo } from "@react-native-community/netinfo";
import Back from "@/components/buttons/Back";
import { LinearGradient } from "expo-linear-gradient";
import { University } from "@/types";
import { useUserStore } from "@/hooks/useStore";
import Checkbox from "expo-checkbox";
import ServiceTerms from "@/components/ServiceTerms";
import PrivacyPolicy from "@/components/PrivacyPolicy";
import FooterLink from "@/components/FooterLink";
import SubmitButton from "@/components/buttons/SubmitButton";
import StyledInput from "@/components/inputs/StyledInput";
import StyledPasswordInput from "@/components/inputs/StyledPasswordInput";
import PickerSelect from "@/components/inputs/PickerSelect";
import { handleError } from "@/errors";
import DateTimePicker from "@/components/inputs/DateTimePicker";


const firstSchema = yup
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

const secondSchema = yup.object().shape({
  uni_name: yup.string().required("University is required"),
  dob: yup
    .date()
    .required("Date of Birth is required")
    .max(new Date(), "Date cannot be in the future")
    .test("is-old-enough", "You must be at least 10 years old", (date) => {
      if (!date) return false;
      const today = new Date();
      const minDate = new Date(
        today.getFullYear() - 10,
        today.getMonth(),
        today.getDate()
      );
      return date <= minDate;
    }),
  gender: yup.string().required("Gender is required"),
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

type FirstSchema = yup.InferType<typeof firstSchema>;
type SecondSchema = yup.InferType<typeof secondSchema>;


export default function Registration() {

  const { openAlert, Alert } = useAlert();
  const { isConnected } = useNetInfo();
  const router = useRouter();
  const { user, setUser, token } = useUserStore();
  const [openToS, setOpenToS] = useState<boolean>(false); //Terms of Service
  const [openPP, setOpenPP] = useState<boolean>(false); // Privacy Policy
  const [agreeTerms, setAgreeTerms] = useState<boolean>(false);


  const universitiesRef = useRef<University[] | null>([]);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
    reset,
  } = useForm({
    mode: "onSubmit",
    resolver: yupResolver(firstSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
    },
  });


  const secondForm = useForm({
    mode: "onSubmit",
    resolver: yupResolver(secondSchema),
    defaultValues: {
      uni_name: "",
      dob: new Date(2025, 1, 1),
      gender: "",
      password: "",
      confirmPassword: "",
    },
  });

  // Add this effect to reset when user changes
useEffect(() => {
  if (user?.email) {
    secondForm.reset({
      uni_name: "",
      dob: new Date(2000, 0, 1),
      gender: "",
      password: "",
      confirmPassword: "",
    });
  }
}, [user?.email]);

  const checkEmail: SubmitHandler<FirstSchema> = async (data) => {
    try {
      const dataReplica = { ...data, role: user?.role };
      if (isConnected) {
        await axios.post(`${url}/student/preregister`, dataReplica, {
          timeout: 1000 * 15,
        });

        const res = await axios.get(`${url}/universities`, {
          timeout: 1000 * 15,
        });
        reset();
        universitiesRef.current = res.data;
        setUser(dataReplica);
      } else {
        openAlert("fail", "Failed!", "No Internet Connection!");
        return;
      }
    } catch (e: any) {
      await handleError(e, openAlert);
    }
  };

  const register: SubmitHandler<SecondSchema> = async (data) => {

    console.log(data);
    return;
    try {
      if (!agreeTerms) {
        await openAlert(
          "fail",
          "Error",
          "You must agree to our terms of service and privacy policy"
        );
        return;
      }
      if (isConnected) {
        const uni_id = universitiesRef.current?.find(
          (university) => university.name === data.uni_name
        )?._id;
        const replicaData = {
          role: user?.role,
          email: user?.email,
          first_name: user?.first_name,
          last_name: user?.last_name,
          password: data.password,
          dob: data.dob,
          gender: data.gender,
          uni_name: data.uni_name,
          uni_id: uni_id,
        };
        const res: any = await axios.post(
          `${url}/student/register`,
          replicaData,
          {
            timeout: 1000 * 15,
          }
        );

        await openAlert(
          "success",
          "Registration Successful!",
          "Lets transform your Learning Experience!"
        );
        router.replace("/login");
        setUser({ role: "student" });
        reset();
        secondForm.reset();
      } else {
        openAlert("fail", "Failed!", "No Internet Connection!");
        return;
      }
    } catch (e: any) {
      await handleError(e, openAlert);
    }
  };

  const handleBack = () => {
    console.log("here");
    if (user?.email) {
      secondForm.reset();
      setUser({ role: user.role });
    } else {
      router.replace("/login");
    }
  };


  //redirect to home screen if user already logged in
  if (token) {
    if (user?.role === "student") return <Redirect href="/(student)" />;
    else return <Redirect href="/(admin)" />;
  }

  return (
    <ScrollView
      automaticallyAdjustKeyboardInsets={true}
      keyboardDismissMode="none"
      contentContainerStyle={{ alignItems: "center", flexGrow: 1 }}
    >
      <LinearGradient
        style={styles.container}
        colors={["#ADD8E6", "#EAF5F8"]}
        locations={[0.27, 1]}
      >
        <Alert />
        <ServiceTerms isVisible={openToS} setIsVisible={setOpenToS} />
        <PrivacyPolicy isVisible={openPP} setIsVisible={setOpenPP} />

        <Back onPress={handleBack} />

        <Text style={styles.heading}>
          {user?.email === undefined
            ? "Sign up"
            : `Hello there, ${user?.first_name}!`}
        </Text>

        {user?.email === undefined ? (
          <View style={styles.inputView}>

            <View style={styles.inputContainer}>
            <Text style={[styles.inputLabel]}>First name</Text>
            <Controller
              control={control}
              name="first_name"
              render={({ field: { onChange, onBlur, value } }) => (
                <StyledInput
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholder="John"
                  error={errors.first_name}
                  inputMode="text"
                  placeholderTextColor="rgba(0, 0, 0, 0.30)"
                />
              )}
            />
            </View>

            <View style={styles.inputContainer}>
            <Text style={[styles.inputLabel]}>Last name</Text>
            <Controller
              control={control}
              name="last_name"
              render={({ field: { onChange, onBlur, value } }) => (
                <StyledInput
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholder="Doe"
                  error={errors.last_name}
                  inputMode="text"
                  placeholderTextColor="rgba(0, 0, 0, 0.30)"
                />
              )}
            />
            </View>

            <View style={styles.inputContainer}>
            <Text style={[styles.inputLabel]}>Email</Text>
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
                  onSubmitEditing={handleSubmit(checkEmail)}
                />
              )}
            />
            </View>

            <View style={styles.button}>
              <SubmitButton
                onPress={handleSubmit(checkEmail)}
                text="CONTINUE"
                isValid={isValid}
                isSubmitting={isSubmitting}
              />
            </View>
          </View>
        ) : (
          <View style={styles.inputView}>

            <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>University</Text>
            <Controller
              control={secondForm.control}
              name="uni_name"
              render={({ field: { onChange } }) => (

                <PickerSelect
                  onValueChange={onChange}
                  placeholder={{ label: "Select your university", value: "" }}
                  items={
                    universitiesRef.current
                      ? universitiesRef.current.map((uni) => ({
                          key: uni._id,
                          label: uni.name,
                          value: uni.name,
                        }))
                      : [{ label: "ali", value: "ali" }]
                  }
                  error={secondForm.formState.errors.uni_name}
                />
                  
              )}
            />
            </View>

            <View style={{ flexDirection: "row", columnGap: w * 10 }}>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Date of Birth</Text>

                <Controller
                  control={secondForm.control}
                  name="dob"
                  render={({ field: { value, onChange } }) =>
                    
                      <DateTimePicker
                      value={value}
                      onChange={onChange}
                      maximumDate={new Date()}
                      error={secondForm.formState.errors.dob}
                      />
                }
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Gender</Text>
                <Controller
                  control={secondForm.control}
                  name="gender"
                  render={({ field: { onChange } }) => (

                      <PickerSelect
                        onValueChange={onChange}
                        placeholder={{ label: "Select gender", value: "" }}
                        items={[
                          { label: "Male", value: "Male" },
                          { label: "Female", value: "Female" },
                          { label: "Other", value: "Other" },
                        ]}
                        error={secondForm.formState.errors.gender}
                      />
                  )}
                />
              </View>
            </View>
              
            <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Password</Text>
            <Controller
              control={secondForm.control}
              name="password"
              render={({ field}) => {
                console.log(field.name);
                //console.log(field.onChange())
                return <StyledPasswordInput
                  value={field.value}
                  //onChangeText={(val)=>{secondForm.setValue('password', val)}}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  error={secondForm.formState.errors.password}
                  inputMode="text"
                />
              }}
            />
            </View>

            <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Confirm Password</Text>
            <Controller
              control={secondForm.control}
              name="confirmPassword"
              render={({ field: { onChange, onBlur, value } }) => (
                <StyledPasswordInput
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={secondForm.formState.errors.confirmPassword}
                  inputMode="text"
                  onSubmitEditing={secondForm.handleSubmit(register)}
                />
              )}
            />
            </View>

            {/* Terms Agreement */}

            <View style={{ flexDirection: "row", marginTop: height * 0.007 }}>
              <Checkbox
                value={agreeTerms}
                onValueChange={setAgreeTerms}
                color={agreeTerms ? "#007AFF" : undefined}
                style={{ marginTop: height * 0.002 }}
                hitSlop={10}
              />
              <Text style={[styles.inputLabel, { paddingLeft: width * 0.025 }]}>
                I agree to the{" "}
                <Pressable hitSlop={20} onPress={() => setOpenToS(true)}>
                  <Text
                    style={{
                      fontFamily: "Inter_600SemiBold",
                      color: "#007BFF",
                      textDecorationLine: "underline",
                      fontSize: height * 0.019,
                    }}
                  >
                    Terms of Service
                  </Text>
                </Pressable>{" "}
                and{" "}
                <Pressable hitSlop={20} onPress={() => setOpenPP(true)}>
                  <Text
                    style={{
                      fontFamily: "Inter_600SemiBold",
                      color: "#007BFF",
                      textDecorationLine: "underline",
                      fontSize: height * 0.019,
                    }}
                  >
                    Privacy Policy
                  </Text>
                </Pressable>
              </Text>
            </View>

            <View style={styles.button}>
              <SubmitButton
                onPress={secondForm.handleSubmit(register)}
                text="SIGN UP"
                isValid={secondForm.formState.isValid}
                isSubmitting={secondForm.formState.isSubmitting}
              />
            </View>
          </View>
        )}

        <FooterLink
          footerText="Already a user?"
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
    backgroundColor: "rgba(173, 216, 230, 0.25)",
    borderRadius: 24,
    paddingHorizontal: height * 0.024,
    paddingTop: h * 20,
  },

  inputContainer: {
    rowGap: h*6, 
    flex: 1,
  },

  heading: {
    fontFamily: "Poppins_700Bold",
    color: "#565555",
    fontSize: height * 0.0367,
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
    rowGap: h*2,
  },

  input: {
    backgroundColor: "#ffffff",
    borderRadius: 10,
    fontFamily: "Inter_400Regular",
    fontSize: h * 8 + w * 8,
    color: "rgba(0, 0, 0, 1)",
    paddingLeft: w * 9,
    paddingVertical: h * 9,
    borderStyle: "solid",
    borderWidth: 1,
  },

  inputError: {
    fontFamily: "Inter_400Regular",
    fontSize: height * 0.015,
    color: "rgb(255, 0, 0)",
    position: "absolute",
    top: "80%",
  },

  backdrop: {
    flex: 1,
    backgroundColor: "black",
    opacity: 0.4,
  },

  inputLabel: {
    fontFamily: "Inter_400Regular",
    fontSize: h * 7 + w * 7,
    color: "rgba(0, 0, 0, 0.70)",
  },

  button: {
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
