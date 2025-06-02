import { Text, View, TextInput } from "@/components/Themed";
import {
  StyleSheet,
  Pressable,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useRouter, Link, Redirect } from "expo-router";
import { height, width, OS, w, h } from "./_layout";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState, useRef } from "react";
import * as yup from "yup";
import axios from "axios";
import { useAlert } from "@/hooks/useAlert";
import { url } from "@/constants/Server";
import { useNetInfo } from "@react-native-community/netinfo";
import Back from "@/components/Back";
import { LinearGradient } from "expo-linear-gradient";
import { EyeIcon, WarnIcon } from "@/components/Icons";
import { University } from "@/types";
import { useUserStore } from "@/hooks/useStore";
import RNPickerSelect from "react-native-picker-select";
import { EvilIcons } from "@expo/vector-icons";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Checkbox from "expo-checkbox";
import ServiceTerms from "@/components/ServiceTerms";
import PrivacyPolicy from "@/components/PrivacyPolicy";
import Modal from "react-native-modal";

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
  gender: yup
    .string()
    .required("Gender is required"),
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

const failedColor = "rgb(255, 0, 0)";

export default function Registration() {

  const insets = useSafeAreaInsets();
  const { openAlert, Alert } = useAlert();
  const { type, isConnected } = useNetInfo();
  const router = useRouter();

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date(2025, 1, 1));
  const { user, setUser, token } = useUserStore();
  const [openToS, setOpenToS] = useState<boolean>(false); //Terms of Service
  const [openPP, setOpenPP] = useState<boolean>(false); // Privacy Policy
  const [agreeTerms, setAgreeTerms] = useState<boolean>(false);

  //redirect to home screen if user already logged in
  if(token) 
  {
    if(user?.role ==='student') return <Redirect href="/(student)"/>
    else return <Redirect href="/(admin)"/>
  }

  const universitiesRef = useRef<University[] | null>([]);

  const dateRef = useRef<HTMLInputElement | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
    reset
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

  const checkEmail: SubmitHandler<FirstSchema> = async (data) => {
    try {
      const dataReplica = { ...data, role: user?.role };
      //setUser(dataReplica)
      //return;
      if (isConnected) {
        await axios.post(`${url}/student/preregister`, dataReplica, {
          timeout: 1000 * 15,
        });

        const res = await axios.get(`${url}/universities`, {
          timeout: 1000 * 15,
        });

        universitiesRef.current = res.data;
        setUser(dataReplica);
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

      if (e.status === 400) {
        switch (e.response.data.code) {
          case "INVALID_EMAIL":
            openAlert("fail", "Failed!", e.response.data.message);
            return;

          case "DUPLICATE_EMAIL":
            openAlert("info", "Already Registered!", e.response.data.message);
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
  //console.log(fontScale);
  const register: SubmitHandler<SecondSchema> = async (data) => {
    try {
          if(!agreeTerms)
          {
            await openAlert('fail', 'Error', "You must agree to our terms of service and privacy policy");
            return;
          }
          if (isConnected) {

            const uni_id = universitiesRef.current?.find((university)=>university.name===data.uni_name)?._id
            const replicaData = {role: user?.role, email:user?.email, first_name:user?.first_name, last_name:user?.last_name
              , password:data.password, dob: data.dob, gender: data.gender, uni_name: data.uni_name, uni_id: uni_id};
            const res: any = await axios.post(`${url}/student/register`, replicaData, {
              timeout: 1000 * 15,
            });
    
            await openAlert("success", "Registration Successful!", 'Lets transform your Learning Experience!');
            router.replace("/login");
            setUser({role:'student'});
            reset();
            secondForm.reset();
            }
          else {
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
    
          if (e.status === 400) {
            switch (e.response.data.code) {
              case "VALIDATION_ERROR":
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


  
  const handleBack = () => {
    //console.log(universitiesRef.current)
    //console.log(showDatePicker);
    console.log('here');
    if (user?.email) {
      secondForm.reset();
      setUser({role: user.role});
    } else {
      //console.log(user)
      router.replace("/login");
    }
  };

  const onDateChange = (event: DateTimePickerEvent, date?: Date) => {
    //setShowDatePicker(OS ==='ios');
    if (date) {
      setSelectedDate(date);
      secondForm.setValue("dob", date);
      
      secondSchema.validateAt('dob', secondForm.getValues()).then(()=>secondForm.clearErrors("dob")); 
    }
  };

   

  
  
  return (
    <ScrollView
      //style={{flex:1}}
      automaticallyAdjustKeyboardInsets={true}
      keyboardDismissMode="none"
      contentContainerStyle={{alignItems:'center', height:height-(OS==='android'?0:insets.top)}}
    >
      <LinearGradient
        style={styles.container}
        colors={["#ADD8E6", "#EAF5F8"]}
        locations={[0.27, 1]}
      >
        <Alert />
        <ServiceTerms isVisible={openToS} setIsVisible={setOpenToS}/>
        <PrivacyPolicy isVisible={openPP} setIsVisible={setOpenPP}/>

        <Back onPress={handleBack} />

        <Text style={styles.heading}>
          {user?.email === undefined
            ? "Sign up"
            : `Hello there, ${user?.first_name}!`}
        </Text>

        {user?.email === undefined ? (
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
                      {
                        borderColor: errors.first_name
                          ? failedColor
                          : "#D8DADC",
                      },
                    ]}
                    placeholder="John"
                    placeholderTextColor="rgba(0, 0, 0, 0.30)"
                    inputMode="text"
                  />
                  {errors.first_name && <WarnIcon />}
                  {errors.first_name && (
                    <Text style={styles.inputError}>
                      {errors.first_name.message}
                    </Text>
                  )}
                </View>
              )}
            />

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
                      {
                        borderColor: errors.last_name ? failedColor : "#D8DADC",
                      },
                    ]}
                    placeholder="Doe"
                    placeholderTextColor="rgba(0, 0, 0, 0.30)"
                    inputMode="text"
                  />
                  {errors.last_name && <WarnIcon />}
                  {errors.last_name && (
                    <Text style={styles.inputError}>
                      {errors.last_name.message}
                    </Text>
                  )}
                </View>
              )}
            />

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
              onPress={handleSubmit(checkEmail)}
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
          <View style={styles.inputView}>
            <Text style={styles.inputLabel}>University</Text>
            <Controller
              control={secondForm.control}
              name="uni_name"
              render={({ field: { onChange, value } }) => (
                <View>
                  <RNPickerSelect
                    onValueChange={(val)=>{if(val!=="") {secondForm.setValue("uni_name", val); secondForm.clearErrors("uni_name")}}}
                    //onDonePress={()=>console.log(value)}
                    style={{
                      inputIOS: {
                        ...styles.input,
                        borderColor: secondForm.formState.errors.uni_name
                          ? failedColor
                          : "#D8DADC",
                      },
                      iconContainer: {
                        right: 0.01199 * height,
                        top: 0.013 * height,
                      },
                      inputAndroid: {
                        ...styles.input,
                        borderColor: secondForm.formState.errors.uni_name
                          ? failedColor
                          : "#D8DADC",
                      },
                      inputWeb: {
                        ...styles.input,
                        borderColor: secondForm.formState.errors.uni_name
                          ? failedColor
                          : "#D8DADC",
                        paddingVertical: height*0.010
                      },
                      inputIOSContainer: { pointerEvents: "none" },
                    }}
                    Icon={() =>
                      OS !== "web" && (
                        <EvilIcons
                          name="chevron-down"
                          size={height * 0.04}
                          color="#539DF3"
                        />
                      )
                    }
                    useNativeAndroidPickerStyle={false}
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
                  />

                  {secondForm.formState.errors.uni_name && (
                    <Text style={styles.inputError}>
                      {secondForm.formState.errors.uni_name.message}
                    </Text>
                  )}
                </View>
              )}
            />
            

            <View style={{ flexDirection: "row",  columnGap:w*10}}>
                <View style={{rowGap:height*0.008, flex:1}}>
                <Text style={styles.inputLabel}>Date of Birth</Text>
                
              <Controller
                control={secondForm.control}
                name="dob"
                render={({ field: { value, onChange} }) => (
                  OS==='web' ? 
                    (<View>
                    <input 
                    type="date" 
                    value={value?.toISOString().split('T')[0] ?? (new Date(2025, 1, 1)).toISOString().split('T')[0]} 
                    max={(new Date).toISOString().split('T')[0]}
                    onChange={(e)=> {onChange(e.target.valueAsDate)}} 
                    style={{backgroundColor: "#ffffff",
                      borderRadius: 10,
                      fontFamily: "Inter_400Regular",
                      fontSize: height * 0.0196,
                      color: "rgba(0, 0, 0, 1)",
                      paddingLeft: w*9,
                      paddingRight: w*9,
                      paddingTop: height * 0.010,
                      paddingBottom: height * 0.010,
                      borderStyle: "solid",
                      borderWidth: 1,
                      borderColor: secondForm.formState.errors.dob ? failedColor: "#D8DADC"}}
                      />

{secondForm.formState.errors.dob && (
                      <Text style={[styles.inputError, {paddingTop:height*0.015}]}>
                        {secondForm.formState.errors.dob.message}
                      </Text>
                    )}
                    </View>
                    ) :
                  (<View>
                    <Pressable
                      onPress={() => setShowDatePicker(true)}
                      style={[
                        
                        {
                          backgroundColor: "#ffffff",
                          borderRadius: 10,
                          borderStyle: 'solid',
                          borderWidth: 1,
                          flexDirection:'row',
                          justifyContent: "space-evenly",
                          alignItems: 'center',
                          borderColor: secondForm.formState.errors.dob
                            ? failedColor
                            : "#D8DADC",
                          
                          
                        },
                      ]}
                    >
                      <Text
                        style={{
                          fontFamily: "Inter_400Regular",
                          flex:1,
                          fontSize: height * 0.0196,
                          color: "rgba(0, 0, 0, 1)",
                          paddingHorizontal:w*9,
                          paddingVertical: height * 0.011,
                        }}
                      >
                        {value.toLocaleDateString()}
                      </Text>
                      <EvilIcons
                        name="chevron-down"
                        size={height * 0.04}
                        color="#539DF3"
                      />
                    </Pressable>
                    {<Modal
                      isVisible={showDatePicker}
                      hasBackdrop={true}
                      customBackdrop={
                        <Pressable onPress={()=>setShowDatePicker(false)} style={styles.backdrop}></Pressable>
                      }
                      
                      animationIn="fadeIn"
                      animationOut="fadeOut"
                      >
                        <DateTimePicker
                        value={value}
                        mode="date"
                        display={OS === "ios" ? "inline" : "default"}
                        maximumDate={new Date()}
                        style={{backgroundColor:'black', borderRadius:24}}
                        onChange={onDateChange}
                      />
                      </Modal>
                      
                    }
                
                    {secondForm.formState.errors.dob && (
                      <Text style={[styles.inputError, {paddingTop:height*0.015}]}>
                        {secondForm.formState.errors.dob.message}
                      </Text>
                    )}
                  </View>)
                )}
              />
              </View>

              <View style={{rowGap:height*0.008, flex:1}}>
              <Text style={styles.inputLabel}>Gender</Text>
            <Controller
              control={secondForm.control}
              name="gender"
              render={({ field: { onChange, value } }) => (
                <View>
                  <RNPickerSelect
                    onValueChange={(val)=>{secondForm.setValue("gender", val); if(val!=="") secondForm.clearErrors("gender")}}
                    //onDonePress={()=>console.log(value)}
                    
                    style={{
                      inputIOS: {
                        ...styles.input,
                        
                    
                        borderColor: secondForm.formState.errors.gender
                          ? failedColor
                          : "#D8DADC",
                      },
                      iconContainer: {
                        right: 0.019 * width,
                        top: 0.009 * height,
                      },
                      inputAndroid: {
                        ...styles.input,
                        
                        
                        borderColor: secondForm.formState.errors.gender
                          ? failedColor
                          : "#D8DADC",
                          
                      },
                      
                      inputWeb: {
                        ...styles.input,
                        
                        borderColor: secondForm.formState.errors.uni_name
                          ? failedColor
                          : "#D8DADC",
                        paddingVertical: height*0.010,
                      },
                      inputIOSContainer: { pointerEvents: "none"},
                      
                    }}
                    Icon={() =>
                      OS !== "web" && (
                        <EvilIcons
                          name="chevron-down"
                          size={height * 0.04}
                          color="#539DF3"
                        />
                      )
                    }
                    
                    useNativeAndroidPickerStyle={false}
                    placeholder={{ label: "Select gender", value: "" }}
                    items={[{ label: "Male", value: "Male" }, { label: "Female", value: "Female" },{ label: "Other", value: "Other" },]}
                  />

                  {secondForm.formState.errors.gender && (
                    <Text style={styles.inputError}>
                      {secondForm.formState.errors.gender.message}
                    </Text>
                  )}
                </View>
              )}
            />

              </View>
            </View>

            <Text style={[styles.inputLabel, {marginTop:width>=570? 0 : height*0.017}]}>
                        Password
                      </Text>
                      <Controller
                        control={secondForm.control}
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
                                  borderColor: secondForm.formState.errors.password
                                    ? failedColor
                                    : "#D8DADC",
                                },
                              ]}
                              inputMode="text"
                              secureTextEntry={!showPassword}
                            />
            
                            {secondForm.formState.errors.password && (
                              <Text style={styles.inputError}>
                                {secondForm.formState.errors.password.message}
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
                        style={[styles.inputLabel, {marginTop:height*0.018}]}
                      >
                        Confirm Password
                      </Text>
                      <Controller
                        control={secondForm.control}
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
                                  borderColor: secondForm.formState.errors.confirmPassword
                                    ? failedColor
                                    : "#D8DADC",
                                },
                              ]}
                              inputMode="text"
                              secureTextEntry={!showPassword}
                            />
            
                            {secondForm.formState.errors.confirmPassword && (
                              <Text style={styles.inputError}>
                                {secondForm.formState.errors.confirmPassword.message}
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

                      {/* Terms Agreement */}
      
          <View style={{ flexDirection: 'row', marginTop: height*0.007}}>
            <Checkbox
              value={agreeTerms}
              onValueChange={setAgreeTerms}
              color={agreeTerms ? '#007AFF' : undefined}
              style={{marginTop:height*0.002}}
              hitSlop={10}
            />
            <Text style={[styles.inputLabel, {paddingLeft:width*0.025}]}>I agree to the <Pressable hitSlop={20} onPress={()=>setOpenToS(true)}>
              <Text
                style={{
                  fontFamily: "Inter_600SemiBold",
                  color: "#007BFF",
                  textDecorationLine: "underline",
                  fontSize: height * 0.019,
                }}
              >Terms of Service</Text>
            </Pressable> and <Pressable hitSlop={20} onPress={()=>setOpenPP(true)}>
              <Text
                style={{
                  fontFamily: "Inter_600SemiBold",
                  color: "#007BFF",
                  textDecorationLine: "underline",
                  fontSize: height * 0.019,
                }}
              >Privacy Policy</Text></Pressable></Text>
            
          </View>
        
    
            <Pressable
              style={[
                styles.button,
                {
                  backgroundColor: secondForm.formState.isValid
                    ? "#007BFF"
                    : "rgba(0, 0, 0, 0.4)",
                },
              ]}

              onPress={secondForm.handleSubmit(register)}
            >
              {secondForm.formState.isSubmitting ? (
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
                  SIGN UP
                </Text>
              )}
            </Pressable>
          </View>
        )}

<View style= {{ flexDirection: 'row', flex:1, padding:height*0.03, alignItems:'flex-end', alignSelf:'center'}}>
          <Text style={[styles.inputLabel, { fontSize: height * 0.019 }]}>
            {" "}
            Already a user?
          </Text>
          <Link href="/login" asChild>
            <Pressable hitSlop={20}>
              <Text
                style={{
                  fontFamily: "Inter_600SemiBold",
                  color: "#007BFF",
                  textDecorationLine: "underline",
                  fontSize: height * 0.019,
                }}
              >
                {" "}
                Log in
              </Text>
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
    backgroundColor: "rgba(173, 216, 230, 0.25)",
    borderRadius: 24,
    paddingHorizontal: height * 0.024,
    paddingVertical:h*20,
  },

  heading: {
    fontFamily: "Poppins_700Bold",
    color: "#565555",
    fontSize: height * 0.0367,
    //alignSelf: "center",
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
    paddingHorizontal: w*9,
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

  backdrop: {
    flex: 1,
    backgroundColor: "black",
    opacity: 0.4,
    

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