import { Text, View } from "@/components/Themed";
import { StyleSheet, ScrollView } from "react-native";
import { useRouter, Redirect, Router } from "expo-router";
import { height, w, h } from "./_layout";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState, useRef } from "react";
import { useAlert } from "@/hooks/useAlert";
import { url } from "@/constants/Server";
import { useNetInfo } from "@react-native-community/netinfo";
import { handleError } from "@/errors";
import { LinearGradient } from "expo-linear-gradient";
import { University, User } from "@/types";
import { useUserStore } from "@/hooks/useStore";
import { formatFirstName } from "@/utils";
import Back from "@/components/buttons/Back";
import Checkbox from "expo-checkbox";
import ServiceTerms from "@/components/screens/ServiceTerms";
import PrivacyPolicy from "@/components/screens/PrivacyPolicy";
import FooterLink from "@/components/FooterLink";
import SubmitButton from "@/components/buttons/SubmitButton";
import StyledInput from "@/components/inputs/StyledInput";
import StyledPasswordInput from "@/components/inputs/StyledPasswordInput";
import PickerSelect from "@/components/inputs/PickerSelect";
import DateTimePicker from "@/components/inputs/DateTimePicker";
import * as yup from "yup";
import axios from "axios";

const stepOneSchema = yup.object({
  first_name: yup.string().required("First Name is required").min(2),
  last_name: yup.string().required("Last Name is required").min(2),
  email: yup
    .string()
    .required("Email is required")
    .matches(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Invalid email"),
});

const stepTwoSchema = yup.object({
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
      "Password must contain at least 8 characters including 1 special character and 1 digit"
    ),
  confirmPassword: yup
    .string()
    .required("Please re-enter Password")
    .oneOf([yup.ref("password")], "Passwords must match"),
});

type FirstStepData = yup.InferType<typeof stepOneSchema>;
type SecondStepData = yup.InferType<typeof stepTwoSchema>;

type Props = {
  user: User | null;
  setUser: (user: User | null) => void;
  openAlert: (
    type: "fail" | "success" | "info",
    title: string,
    message?: string
  ) => Promise<void>;
  isConnected: boolean | null;
  setUniversities?: (universities: University[]) => void | undefined;
  router?: Router | undefined;
  universities?: University[] | null | undefined;
};

function FirstStepForm({
  user,
  setUser,
  openAlert,
  isConnected,
  setUniversities,
}: Props) {

  const {
    control,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<FirstStepData>({
    mode: "onSubmit",
    resolver: yupResolver(stepOneSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
    },
  });

  const checkEmail: SubmitHandler<FirstStepData> = async (data) => {
    try {
      const firstStepData = {
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        role: user?.role,
      };

      if (isConnected) {
        await axios.post(`${url}/student/preregister`, firstStepData, {
          timeout: 1000 * 15,
        });

        const res = await axios.get(`${url}/universities`, {
          timeout: 1000 * 15,
        });

        setUniversities && setUniversities(res.data);
        setUser(firstStepData);
      } else {
        openAlert("fail", "Failed!", "No Internet Connection!");
        return;
      }
    } catch (e: any) {
      await handleError(e, openAlert);
    }
  };

  return (
    <>
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
    </>
  );
}


function SecondStepForm({
  user,
  setUser,
  openAlert,
  isConnected,
  universities,
  router,
}: Props) {

  const [openToS, setOpenToS] = useState<boolean>(false);
  const [openPP, setOpenPP] = useState<boolean>(false);
  const [agreeTerms, setAgreeTerms] = useState<boolean>(false);
  
  const {
    control,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
    reset,
  } = useForm<SecondStepData>({
    mode: "onSubmit",
    resolver: yupResolver(stepTwoSchema),
    defaultValues: {
      uni_name: "",
      dob: new Date(2025, 0, 1),
      gender: "",
      password: "",
      confirmPassword: "",
    },
  });

  const register: SubmitHandler<SecondStepData> = async (data) => {
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
        //data.uni_name is actually uni_id, so we are finding uni name by uni id
        const uni_name = universities?.find(
          (university) => university._id === data.uni_name
        )?.name;

        const replicaData = {
          role: user?.role,
          email: user?.email,
          first_name: user?.first_name,
          last_name: user?.last_name,
          password: data.password,
          dob: data.dob,
          gender: data.gender,
          uni_name: uni_name,
          uni_id: data.uni_name,
        };

        await axios.post(`${url}/student/register`, replicaData, {
          timeout: 1000 * 15,
        });

        await openAlert(
          "success",
          "Registration Successful!",
          "Lets transform your Learning Experience!"
        );

        router?.replace("/login");
        setUser({ role: "student" });
        reset();
      } else {
        openAlert("fail", "Failed!", "No Internet Connection!");
        return;
      }
    } catch (e: any) {
      await handleError(e, openAlert);
    }
  };

  return (
    <>
            <ServiceTerms isVisible={openToS} setIsVisible={setOpenToS} />
        <PrivacyPolicy isVisible={openPP} setIsVisible={setOpenPP} />
    <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>University</Text>
        <Controller
          control={control}
          name="uni_name"
          render={({ field: { onChange } }) => (
            <PickerSelect
              onValueChange={onChange}
              placeholder={{ label: "Select your university", value: "" }}
              items={
                universities
                  ? universities?.map((uni) => ({
                      key: uni._id,
                      label: uni.name,
                      value: uni._id,
                    }))
                  : []
              }
              error={errors.uni_name}
            />
          )}
        />
      </View>

      <View style={{ flexDirection: "row", columnGap: w * 10 }}>
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Date of Birth</Text>
          <Controller
            control={control}
            name="dob"
            render={({ field: { value, onChange } }) => (
              <DateTimePicker
                value={value ?? new Date()}
                onChange={onChange}
                maximumDate={new Date()}
                error={errors.dob}
              />
            )}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Gender</Text>
          <Controller
            control={control}
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
                error={errors.gender}
              />
            )}
          />
        </View>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Password</Text>
        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, onBlur, value } }) => (
            <StyledPasswordInput
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.password}
              inputMode="text"
            />
          )}
        />
      </View>

      <View style={[styles.inputContainer, { marginTop: h * 9 }]}>
        <Text style={styles.inputLabel}>Confirm Password</Text>
        <Controller
          control={control}
          name="confirmPassword"
          render={({ field: { onChange, onBlur, value } }) => (
            <StyledPasswordInput
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.confirmPassword}
              inputMode="text"
              onSubmitEditing={handleSubmit(register)}
            />
          )}
        />
      </View>

      {/* Terms Agreement */}
      <View
        style={{
          flexDirection: "row",
          marginTop: h * 5.5,
          columnGap: w * 7,
        }}
      >
        <Checkbox
          value={agreeTerms}
          onValueChange={setAgreeTerms}
          color={agreeTerms ? "#007AFF" : undefined}
          hitSlop={10}
        />
        <Text style={styles.inputLabel}>
          I agree to the{" "}
          <Text style={styles.ppAndTos} onPress={() => setOpenToS(true)}>
            Terms of Service
          </Text>{" "}
          and{" "}
          <Text style={styles.ppAndTos} onPress={() => setOpenPP(true)}>
            Privacy Policy
          </Text>
        </Text>
      </View>

      <View style={styles.button}>
        <SubmitButton
          onPress={handleSubmit(register)}
          text="SIGN UP"
          isValid={isValid}
          isSubmitting={isSubmitting}
        />
      </View>
    </>
  )

}

export default function Registration() {


  const { openAlert, Alert } = useAlert();
  const { isConnected } = useNetInfo();
  const router = useRouter();
  const { user, setUser, token } = useUserStore();
  const universitiesRef = useRef<University[] | null>(null);

  const currentStep = user?.email ? 2 : 1;

  const setUniversities = (universities: University[]) => {
    universitiesRef.current = universities;
  };

  const handleBack = () => {
    if (currentStep === 2) {
      //Go back to step 1
      setUser({ role: user?.role });
    } else {
      // Go back to login
      router.replace("/login");
    }
  };

  // Determine if we're on step 1 or 2
  const isStepOne = currentStep === 1;

  // Redirect to home screen if user already logged in
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

        <Back onPress={handleBack} />

        <Text style={styles.heading}>
          {isStepOne
            ? "Sign up"
            : `Hello there, ${formatFirstName(user?.first_name)}!`}
        </Text>

        <View style={styles.inputView}>
        {isStepOne ? (
          // Step 1: Basic Information
          
            <FirstStepForm
              user={user}
              setUser={setUser}
              setUniversities={setUniversities}
              openAlert={openAlert}
              isConnected={isConnected}
            />
          
        ) : (
          // Step 2: Additional Information

            <SecondStepForm
              user={user}
              setUser={setUser}
              universities={universitiesRef.current}
              openAlert={openAlert}
              isConnected={isConnected}
              router={router}
            />

        )}
      </View>
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
    rowGap: h * 6,
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
    rowGap: h * 2,
  },

  ppAndTos: {
    fontFamily: "Inter_600SemiBold",
    color: "#007BFF",
    textDecorationLine: "underline",
    fontSize: h * 7.6 + w * 7.6,
  },

  inputLabel: {
    fontFamily: "Inter_400Regular",
    fontSize: h * 7 + w * 7,
    color: "rgba(0, 0, 0, 0.70)",
  },

  button: {
    marginTop: height * 0.04161,
  },
});
