import { Text, View } from "@/components/Themed";
import { StyleSheet, ScrollView } from "react-native";
import { height, w, h } from "@/app/_layout";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAlert } from "@/hooks/useAlert";
import { url } from "@/constants/Server";
import { useNetInfo } from "@react-native-community/netinfo";
import { handleError } from "@/errors";
import { LinearGradient } from "expo-linear-gradient";
import { useUserStore } from "@/hooks/useStore";
import Back from "@/components/buttons/Back";
import SubmitButton from "@/components/buttons/SubmitButton";
import StyledInput from "@/components/inputs/StyledInput";
import StyledPasswordInput from "@/components/inputs/StyledPasswordInput";
import * as yup from "yup";
import axios from "axios";

const stepOneSchema = yup.object({
  first_name: yup.string().required("First Name is required").min(2),
  last_name: yup.string().required("Last Name is required").min(2),
  email: yup
    .string()
    .required("Email is required")
    .matches(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Invalid email"),
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


type Props = {

back: ()=>void;

};
export default function AdminRegistration({back}:Props) {


  const { openAlert, Alert } = useAlert();
  const { isConnected } = useNetInfo();
  
  const { user, token} = useUserStore();
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid, isSubmitting },
  } = useForm<FirstStepData>({
    mode: "onSubmit",
    resolver: yupResolver(stepOneSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });
  
  const register: SubmitHandler<FirstStepData> = async (data) => {
    try {
      

      if (isConnected) {


        const replicaData = {
          role: "admin",
          email: data.email,
          first_name: data.first_name,
          last_name: data.last_name,
          password: data.password,
          uni_name: user?.uni_name,
          uni_id: user?.uni_id,
        };

        await axios.post(`${url}/admin/register`, replicaData, {
          headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
              "userid": user?._id
            },
          timeout: 1000 * 15,
        });

        await openAlert(
          "success",
          "Admin Registration Successful!",
        );

        reset();
        back();
      } else {
        openAlert("fail", "Failed!", "No Internet Connection!");
        return;
      }
    } catch (e: any) {
      await handleError(e, openAlert);
    }
  };
  
 
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

        <Back onPress={back} />

        <Text style={styles.heading}>Register Admin</Text>

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
            />
          )}
        />
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

      <View style={styles.button}>
        <SubmitButton
          onPress={handleSubmit(register)}
          text="REGISTER"
          isValid={isValid}
          isSubmitting={isSubmitting}
        />
      </View>
    
      </View>
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


  inputLabel: {
    fontFamily: "Inter_400Regular",
    fontSize: h * 7 + w * 7,
    color: "rgba(0, 0, 0, 0.70)",
  },

  button: {
    marginTop: height * 0.04161,
  },
});
