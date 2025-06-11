import { Text, View } from "@/components/Themed";
import { StyleSheet, ScrollView } from "react-native";
import { Image, useImage } from "expo-image";
import { useRouter, Link, Redirect } from "expo-router";
import { height, h, OS } from "./_layout";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { useAlert } from "@/hooks/useAlert";
import { url } from "@/constants/Server";
import { useNetInfo } from "@react-native-community/netinfo";
import { useUserStore, useSurveyStore } from "@/hooks/useStore";
import Back from "@/components/buttons/Back";
import SubmitButton from "@/components/buttons/SubmitButton";
import FooterLink from "@/components/FooterLink";
import StyledInput from "@/components/inputs/StyledInput";
import SkeletonLoader from "@/components/SkeletonLoader";
import StyledPasswordInput from "@/components/inputs/StyledPasswordInput";
import { handleError } from "@/errors";

const imgSource = require("@/assets/images/edumatch.png");

const schema = yup
  .object()
  .shape({
    email: yup
      .string()
      .required("Email is required")
      .matches(
        /^\s*\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+\s*$/,
        "Please enter a valid email"
      ),
    password: yup.string().required("Password is required"),
  })
  .required("Please fill all the above fields");

type User = yup.InferType<typeof schema>;

export default function Login() {
  
  const { openAlert, Alert } = useAlert();
  const { isConnected } = useNetInfo();
  const router = useRouter();
  const { initializeUser, user, token } = useUserStore();
  const { setSectionsCount } = useSurveyStore();

  const {control, handleSubmit, formState: { errors, isValid, isSubmitting }, } = useForm({
    mode: "onSubmit",
    resolver: yupResolver(schema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const image = useImage(imgSource, { maxWidth: 800, onError(error, retry) {
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

        await initializeUser(res.data.user, res.data.token);
        setSectionsCount();

        user?.role === "student"
          ? router.replace("/onboarding")
          : router.replace("/(admin)");
      } else {
        openAlert("fail", "Failed!", "No Internet Connection!");
        return;
      }
    } catch (e: any) {
      await handleError(e, openAlert);
    }
  };

  //redirect back to index if user has not selected a role
  if (!user?.role) return <Redirect href="/" />;
  if (token) return <Redirect href={user.role === "student" ? "/(student)" : "/(admin)"} />;

  return (
    <ScrollView
      automaticallyAdjustKeyboardInsets={true}
      keyboardDismissMode="none"
      contentContainerStyle={{ alignItems: "center", flexGrow: 1 }}
    >
      <Alert />
      <View style={styles.container}>
        <View
          style={{
            position: "absolute",
            alignSelf: "flex-start",
            marginTop: h * 20,
            marginLeft: OS === "web" ? 0 : height * 0.024,
          }}
        >
          <Back onPress={() => router.replace("/")} />
        </View>
        
        {!image ? (
          <SkeletonLoader w={229 * (height / 817)} h={218 * (height / 817)} />
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

          <Text style={[styles.inputLabel]}>Password</Text>
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
                onSubmitEditing={handleSubmit(onSubmit)}
              />
            )}
          />

          <View style={styles.button}>
            <SubmitButton
              onPress={handleSubmit(onSubmit)}
              text="LOGIN"
              isValid={isValid}
              isSubmitting={isSubmitting}
            />
          </View>
        </View>

        <Link href="/password-reset">
          <Text
            style={[styles.inputLabel, { textDecorationLine: "underline" }]}
          >
            Forgot Password?
          </Text>
        </Link>

        {user?.role === "student" && (
          <FooterLink
            footerText="Don't have an account?"
            linkText="Sign up"
            link="/registration"
          />
        )}
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

  inputLabel: {
    fontFamily: "Inter_400Regular",
    fontSize: height * 0.0171,
    color: "rgba(0, 0, 0, 0.70)",
  },

  button: {
    marginBottom: height * 0.019,
    marginTop: height * 0.04161,
  },
});
