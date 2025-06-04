import { Text, View, TextInput } from "@/components/Themed";
import {
  Pressable,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useRef, useState } from "react";
import * as yup from "yup";
import { useNetInfo } from "@react-native-community/netinfo";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import axios from "axios";
import { url } from "@/constants/Server";
import { useAlert } from "@/hooks/useAlert";
import { h, w, OS } from "@/app/_layout";
import Back from "./Back";
import { useUserStore } from "@/hooks/useStore";
import RNPickerSelect from "react-native-picker-select";
import { University } from "@/types";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { WarnIcon } from "./Icons";
import { User } from "@/types";
import Preview from "./Preview";

type Props = {
  setClick: React.Dispatch<React.SetStateAction<number>>;
  
};

const failedColor = "rgb(255, 0, 0)";

const schema = yup
  .object()
  .shape({
    name: yup
      .string()
      .required("First Name is Required")
      .min(2, "First name must contain at least 2 letters"),
    uni_id: yup.string().required("University is required"),
    dim1: yup.string().required("Dimension 1 is required"),
    dim2: yup.string().required("Dimension 2 is required"),
    dim3: yup.string().required("Dimension 3 is required"),
    dim4: yup.string().required("Dimension 4 is required"),
    value1: yup.string().required("Preference is required"),
    value2: yup.string().required("Preference is required"),
    value3: yup.string().required("Preference is required"),
    value4: yup.string().required("Preference is required"),
    gender: yup.string().required("Gender is required"),
  })
  .required("Please fill all the above fields");

type Schema = yup.InferType<typeof schema>;

export default function CreateGroup({ setClick }: Props) {
  const { Alert, openAlert } = useAlert();
  const { isConnected } = useNetInfo();
  const [results, setResults] = useState<Array<User>>([]);
  const [showPreview, setShowPreview] = useState<number>(0)
  const {token, user} = useUserStore();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    getValues,
    setValue,
    clearErrors,
  } = useForm({
    mode: "onSubmit",
    resolver: yupResolver(schema),
    defaultValues: {
      name: "",
      dim1: "",
      value1: "",
      uni_id: "",
    },
  });

  /* useEffect(() => {
    if (isConnected || isConnected === null) fetchUniversities();
  }, [isConnected]);

  const fetchUniversities = async () => {
    try {
      if (isConnected || isConnected === null) {
        const res = await axios.get(`${url}/universities`, {
          timeout: 1000 * 15,
        });

        universitiesRef.current = res.data;
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

      if (e.status >= 500) {
        await openAlert("fail", "Failed!", e.message);
        return;
      } else {
        await openAlert("fail", "Failed!", e.response.data.message);
        return;
      }
    }
  }; */

  const generate: SubmitHandler<Schema> = async (data) => {
    try {
      if (isConnected) {
        
        const res: any = await axios.post(`${url}/admin/groups/generate`, data, {
        timeout: 1000 * 15,
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        });
       
        setResults(res.data);
        setShowPreview(1);
              
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

      if (e.status >= 500) {
        await openAlert("fail", "Failed!", e.message);
        return;
      } else {
        await openAlert("fail", "Failed!", e.response.data.message);
        return;
      }
    }
  };

  if(showPreview === 1) return <Preview results={results} setResults={setResults} setShowPreview={setShowPreview} allValues={getValues()} setClick={setClick}/>

  return (
    <ScrollView
      automaticallyAdjustKeyboardInsets={true}
      keyboardDismissMode="none"
      contentContainerStyle={{
        alignItems: "center",
        backgroundColor: "white",
        flexGrow: 1,
      }}
    >
      <LinearGradient
        colors={["#D6EBF2", "#FDFEFE"]}
        locations={[0.11, 1]}
        style={styles.container}
      >
        <Alert />

        <View style={{ justifyContent: "center" }}>
          <Back onPress={() => setClick(0)} />
          <View style={{ position: "absolute", alignSelf: "center" }}>
            <Text style={styles.title}>Create Group</Text>
          </View>
        </View>

        <View style={styles.inputView}>
          <Text style={[styles.inputLabel]}>Group name</Text>
          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, onBlur, value } }) => (
              <View style={{ justifyContent: "center" }}>
                <TextInput
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  style={[
                    styles.input,
                    {
                      borderColor: errors.name ? failedColor : "#D8DADC",
                    },
                  ]}
                  placeholder="Visual group"
                  placeholderTextColor="rgba(0, 0, 0, 0.30)"
                  inputMode="text"
                />
                {errors.name && <WarnIcon />}
                {errors.name && (
                  <Text style={styles.inputError}>{errors.name.message}</Text>
                )}
              </View>
            )}
          />

          <View style={{ flexDirection: "row", columnGap: w * 10 }}>
            <View style={{ rowGap: h * 9, flex: 1.1 }}>
              <Text style={styles.inputLabel}>Dimension 1: Processing</Text>
              <Controller
                control={control}
                name="dim1"
                render={({ field: { onChange, value } }) => (
                  <View>
                    <RNPickerSelect
                      onValueChange={(val) => {
                        setValue("dim1", val);
                        if (val === "any") setValue("value1", "balanced");
                        else setValue("value1", "");
                        if (val !== "") clearErrors("dim1");
                      }}
                      //onDonePress={()=>console.log(value)}
                      style={{
                        inputIOS: {
                          ...styles.input,
                          borderColor: errors.dim1 ? failedColor : "#D8DADC",
                        },
                        iconContainer: styles.iconContainer,
                        inputAndroid: {
                          ...styles.input,
                          borderColor: errors.dim1 ? failedColor : "#D8DADC",
                        },

                        inputWeb: {
                          ...inputWeb,
                          borderColor: errors.dim1 ? failedColor : "#D8DADC",
                        },
                        inputIOSContainer: { pointerEvents: "none" },
                      }}
                      Icon={() =>
                        OS !== "web" && (
                          <EvilIcons
                            name="chevron-down"
                            size={h * 32.7}
                            color="#539DF3"
                          />
                        )
                      }
                      useNativeAndroidPickerStyle={false}
                      placeholder={{ label: "Select Dimension", value: "" }}
                      items={[
                        { label: "Active", value: "Active" },
                        { label: "Reflective", value: "Reflective" },
                        { label: "Any", value: "any" },
                      ]}
                    />

                    {errors.dim1 && (
                      <Text style={styles.inputError}>
                        {errors.dim1.message}
                      </Text>
                    )}
                  </View>
                )}
              />
            </View>

            <View style={{ rowGap: h * 9, flex: 1 }}>
              <Text style={styles.inputLabel}>Preference</Text>
              <Controller
                control={control}
                name="value1"
                render={({ field: { onChange, value } }) => (
                  <View>
                    <RNPickerSelect
                      onValueChange={(val) => {
                        setValue("value1", val);
                        if (val !== "") clearErrors("value1");
                      }}
                      //onDonePress={()=>console.log(value)}
                      style={{
                        inputIOS: {
                          ...styles.input,
                          color:
                            value === "balanced"
                              ? "rgba(0, 0, 0, 0.30)"
                              : "black",
                          borderColor: errors.value1 ? failedColor : "#D8DADC",
                        },
                        iconContainer: styles.iconContainer,
                        inputAndroid: {
                          ...styles.input,
                          color:
                            value === "balanced"
                              ? "rgba(0, 0, 0, 0.30)"
                              : "black",
                          borderColor: errors.value1 ? failedColor : "#D8DADC",
                        },

                        inputWeb: {
                          ...inputWeb,
                          color:
                            value === "balanced"
                              ? "rgba(0, 0, 0, 0.30)"
                              : "black",
                          borderColor: errors.value1 ? failedColor : "#D8DADC",
                        },
                        inputIOSContainer: { pointerEvents: "none" },
                      }}
                      Icon={() =>
                        OS !== "web" && (
                          <EvilIcons
                            name="chevron-down"
                            size={h * 32.7}
                            color="#539DF3"
                          />
                        )
                      }
                      disabled={value === "balanced"}
                      value={value}
                      useNativeAndroidPickerStyle={false}
                      placeholder={{ label: "Select strength", value: "" }}
                      items={[
                        { label: "Weak", value: "weak" },
                        { label: "Moderate", value: "moderate" },
                        { label: "Strong", value: "strong" },
                        { label: "Any", value: "balanced" },
                        //{ label: "Balanced", value: "balanced" },
                      ]}
                    />
                    {errors.value1 && (
                      <Text style={styles.inputError}>
                        {errors.value1.message}
                      </Text>
                    )}
                  </View>
                )}
              />
            </View>
          </View>

          <View style={{ flexDirection: "row", columnGap: w * 10 }}>
            <View style={{ rowGap: h * 9, flex: 1.1 }}>
              <Text style={styles.inputLabel}>Dimension 2: Perception</Text>
              <Controller
                control={control}
                name="dim2"
                render={({ field: { onChange, value } }) => (
                  <View>
                    <RNPickerSelect
                      onValueChange={(val) => {
                        setValue("dim2", val);
                        if (val === "any") setValue("value2", "balanced");
                        else setValue("value2", "");
                        if (val !== "") clearErrors("dim2");
                      }}
                      style={{
                        inputIOS: {
                          ...styles.input,
                          borderColor: errors.dim2 ? failedColor : "#D8DADC",
                        },
                        iconContainer: styles.iconContainer,
                        inputAndroid: {
                          ...styles.input,
                          borderColor: errors.dim2 ? failedColor : "#D8DADC",
                        },

                        inputWeb: {
                          ...inputWeb,
                          borderColor: errors.dim2 ? failedColor : "#D8DADC",
                        },
                        inputIOSContainer: { pointerEvents: "none" },
                      }}
                      Icon={() =>
                        OS !== "web" && (
                          <EvilIcons
                            name="chevron-down"
                            size={h * 32.7}
                            color="#539DF3"
                          />
                        )
                      }
                      useNativeAndroidPickerStyle={false}
                      placeholder={{ label: "Select Dimension", value: "" }}
                      items={[
                        { label: "Sensing", value: "Sensing" },
                        { label: "Intuitive", value: "Intuitive" },
                        { label: "Any", value: "any" },
                      ]}
                    />

                    {errors.dim2 && (
                      <Text style={styles.inputError}>
                        {errors.dim2.message}
                      </Text>
                    )}
                  </View>
                )}
              />
            </View>

            <View style={{ rowGap: h * 9, flex: 1 }}>
              <Text style={styles.inputLabel}>Preference</Text>
              <Controller
                control={control}
                name="value2"
                render={({ field: { onChange, value } }) => (
                  <View>
                    <RNPickerSelect
                      onValueChange={(val) => {
                        setValue("value2", val);
                        if (val !== "") clearErrors("value2");
                      }}
                      //onDonePress={()=>console.log(value)}

                      disabled={value === "balanced"}
                      value={value}
                      style={{
                        inputIOS: {
                          ...styles.input,
                          color:
                            value === "balanced"
                              ? "rgba(0, 0, 0, 0.30)"
                              : "black",
                          borderColor: errors.value2 ? failedColor : "#D8DADC",
                        },
                        iconContainer: styles.iconContainer,
                        inputAndroid: {
                          ...styles.input,
                          color:
                            value === "balanced"
                              ? "rgba(0, 0, 0, 0.30)"
                              : "black",
                          borderColor: errors.value2 ? failedColor : "#D8DADC",
                        },

                        inputWeb: {
                          ...inputWeb,
                          color:
                            value === "balanced"
                              ? "rgba(0, 0, 0, 0.30)"
                              : "black",
                          borderColor: errors.value2 ? failedColor : "#D8DADC",
                        },
                        inputIOSContainer: { pointerEvents: "none" },
                      }}
                      Icon={() =>
                        OS !== "web" && (
                          <EvilIcons
                            name="chevron-down"
                            size={h * 32.7}
                            color="#539DF3"
                          />
                        )
                      }
                      useNativeAndroidPickerStyle={false}
                      placeholder={{ label: "Select strength", value: "" }}
                      items={[
                        { label: "Weak", value: "weak" },
                        { label: "Moderate", value: "moderate" },
                        { label: "Strong", value: "strong" },
                        { label: "Any", value: "balanced" },
                        //{ label: "Balanced", value: "balanced" },
                      ]}
                    />
                    {errors.value2 && (
                      <Text style={styles.inputError}>
                        {errors.value2.message}
                      </Text>
                    )}
                  </View>
                )}
              />
            </View>
          </View>

          <View style={{ flexDirection: "row", columnGap: w * 10 }}>
            <View style={{ rowGap: h * 9, flex: 1.1 }}>
              <Text style={styles.inputLabel}>Dimension 3: Input</Text>
              <Controller
                control={control}
                name="dim3"
                render={({ field: { onChange, value } }) => (
                  <View>
                    <RNPickerSelect
                      onValueChange={(val) => {
                        setValue("dim3", val);
                        if (val === "any") setValue("value3", "balanced");
                        else setValue("value3", "");
                        if (val !== "") clearErrors("dim3");
                      }}
                      style={{
                        inputIOS: {
                          ...styles.input,
                          borderColor: errors.dim3 ? failedColor : "#D8DADC",
                        },
                        iconContainer: styles.iconContainer,
                        inputAndroid: {
                          ...styles.input,
                          borderColor: errors.dim3 ? failedColor : "#D8DADC",
                        },

                        inputWeb: {
                          ...inputWeb,
                          borderColor: errors.dim3 ? failedColor : "#D8DADC",
                        },
                        inputIOSContainer: { pointerEvents: "none" },
                      }}
                      Icon={() =>
                        OS !== "web" && (
                          <EvilIcons
                            name="chevron-down"
                            size={h * 32.7}
                            color="#539DF3"
                          />
                        )
                      }
                      useNativeAndroidPickerStyle={false}
                      placeholder={{ label: "Select Dimension", value: "" }}
                      items={[
                        { label: "Visual", value: "Visual" },
                        { label: "Verbal", value: "Verbal" },
                        { label: "Any", value: "any" },
                      ]}
                    />

                    {errors.dim3 && (
                      <Text style={styles.inputError}>
                        {errors.dim3.message}
                      </Text>
                    )}
                  </View>
                )}
              />
            </View>

            <View style={{ rowGap: h * 9, flex: 1 }}>
              <Text style={styles.inputLabel}>Preference</Text>
              <Controller
                control={control}
                name="value3"
                render={({ field: { onChange, value } }) => (
                  <View>
                    <RNPickerSelect
                      onValueChange={(val) => {
                        setValue("value3", val);
                        if (val !== "") clearErrors("value3");
                      }}
                      //onDonePress={()=>console.log(value)}
                      style={{
                        inputIOS: {
                          ...styles.input,
                          color:
                            value === "balanced"
                              ? "rgba(0, 0, 0, 0.30)"
                              : "black",
                          borderColor: errors.value3 ? failedColor : "#D8DADC",
                        },
                        iconContainer: styles.iconContainer,
                        inputAndroid: {
                          ...styles.input,
                          color:
                            value === "balanced"
                              ? "rgba(0, 0, 0, 0.30)"
                              : "black",
                          borderColor: errors.value3 ? failedColor : "#D8DADC",
                        },

                        inputWeb: {
                          ...inputWeb,
                          color:
                            value === "balanced"
                              ? "rgba(0, 0, 0, 0.30)"
                              : "black",
                          borderColor: errors.value3 ? failedColor : "#D8DADC",
                        },
                        inputIOSContainer: { pointerEvents: "none" },
                      }}
                      Icon={() =>
                        OS !== "web" && (
                          <EvilIcons
                            name="chevron-down"
                            size={h * 32.7}
                            color="#539DF3"
                          />
                        )
                      }
                      disabled={value === "balanced"}
                      value={value}
                      useNativeAndroidPickerStyle={false}
                      placeholder={{ label: "Select strength", value: "" }}
                      items={[
                        { label: "Weak", value: "weak" },
                        { label: "Moderate", value: "moderate" },
                        { label: "Strong", value: "strong" },
                        { label: "Any", value: "balanced" },
                        //{ label: "Balanced", value: "balanced" },
                      ]}
                    />
                    {errors.value3 && (
                      <Text style={styles.inputError}>
                        {errors.value3.message}
                      </Text>
                    )}
                  </View>
                )}
              />
            </View>
          </View>

          <View style={{ flexDirection: "row", columnGap: w * 10 }}>
            <View style={{ rowGap: h * 9, flex: 1.1 }}>
              <Text style={styles.inputLabel}>Dimension 4: Understanding</Text>
              <Controller
                control={control}
                name="dim4"
                render={({ field: { onChange, value } }) => (
                  <View>
                    <RNPickerSelect
                      onValueChange={(val) => {
                        setValue("dim4", val);
                        if (val === "any") setValue("value4", "balanced");
                        else setValue("value4", "");
                        if (val !== "") clearErrors("dim4");
                      }}
                      style={{
                        inputIOS: {
                          ...styles.input,
                          borderColor: errors.dim4 ? failedColor : "#D8DADC",
                        },
                        iconContainer: styles.iconContainer,
                        inputAndroid: {
                          ...styles.input,
                          borderColor: errors.dim4 ? failedColor : "#D8DADC",
                        },

                        inputWeb: {
                          ...inputWeb,
                          borderColor: errors.dim4 ? failedColor : "#D8DADC",
                        },
                        inputIOSContainer: { pointerEvents: "none" },
                      }}
                      Icon={() =>
                        OS !== "web" && (
                          <EvilIcons
                            name="chevron-down"
                            size={h * 32.7}
                            color="#539DF3"
                          />
                        )
                      }
                      useNativeAndroidPickerStyle={false}
                      placeholder={{ label: "Select Dimension", value: "" }}
                      items={[
                        { label: "Global", value: "Global" },
                        { label: "Sequential", value: "Sequential" },
                        { label: "Any", value: "any" },
                      ]}
                    />

                    {errors.dim4 && (
                      <Text style={styles.inputError}>
                        {errors.dim4.message}
                      </Text>
                    )}
                  </View>
                )}
              />
            </View>

            <View style={{ rowGap: h * 9, flex: 1 }}>
              <Text style={styles.inputLabel}>Preference</Text>
              <Controller
                control={control}
                name="value4"
                render={({ field: { onChange, value } }) => (
                  <View>
                    <RNPickerSelect
                      onValueChange={(val) => {
                        setValue("value4", val);
                        if (val !== "") clearErrors("value4");
                      }}
                      disabled={value === "balanced"}
                      value={value}
                      style={{
                        inputIOS: {
                          ...styles.input,
                          color:
                            value === "balanced"
                              ? "rgba(0, 0, 0, 0.30)"
                              : "black",
                          borderColor: errors.value4 ? failedColor : "#D8DADC",
                        },
                        iconContainer: styles.iconContainer,
                        inputAndroid: {
                          ...styles.input,
                          color:
                            value === "balanced"
                              ? "rgba(0, 0, 0, 0.30)"
                              : "black",
                          borderColor: errors.value4 ? failedColor : "#D8DADC",
                        },

                        inputWeb: {
                          ...inputWeb,
                          color:
                            value === "balanced"
                              ? "rgba(0, 0, 0, 0.30)"
                              : "black",
                          borderColor: errors.value4 ? failedColor : "#D8DADC",
                        },
                        inputIOSContainer: { pointerEvents: "none" },
                      }}
                      Icon={() =>
                        OS !== "web" && (
                          <EvilIcons
                            name="chevron-down"
                            size={h * 32.7}
                            color="#539DF3"
                          />
                        )
                      }
                      useNativeAndroidPickerStyle={false}
                      placeholder={{ label: "Select strength", value: "" }}
                      items={[
                        { label: "Weak", value: "weak" },
                        { label: "Moderate", value: "moderate" },
                        { label: "Strong", value: "strong" },
                        { label: "Any", value: "balanced" },
                        //{ label: "Balanced", value: "balanced" },
                      ]}
                    />
                    {errors.value4 && (
                      <Text style={styles.inputError}>
                        {errors.value4.message}
                      </Text>
                    )}
                  </View>
                )}
              />
            </View>
          </View>

          <Text style={styles.inputLabel}>Gender</Text>
          <Controller
            control={control}
            name="gender"
            render={({ field: { onChange, value } }) => (
              <View>
                <RNPickerSelect
                  onValueChange={(val) => {
                    if (val !== "") {
                      setValue("gender", val);
                      clearErrors("gender");
                    }
                  }}
                  //onDonePress={()=>console.log(value)}
                  style={{
                    inputIOS: {
                      ...styles.input,
                      borderColor: errors.gender ? failedColor : "#D8DADC",
                    },
                    iconContainer: styles.iconContainer,
                    inputAndroid: {
                      ...styles.input,
                      borderColor: errors.gender ? failedColor : "#D8DADC",
                    },
                    inputWeb: {
                      ...inputWeb,
                      borderColor: errors.gender ? failedColor : "#D8DADC",
                    },
                    inputIOSContainer: { pointerEvents: "none" },
                  }}
                  Icon={() =>
                    OS !== "web" && (
                      <EvilIcons
                        name="chevron-down"
                        size={h * 32.7}
                        color="#539DF3"
                      />
                    )
                  }
                  useNativeAndroidPickerStyle={false}
                  placeholder={{ label: "Select gender", value: "" }}
                  items={[
                    { label: "Male", value: "Male" },
                    { label: "Female", value: "Female" },
                    { label: "Any", value: "any" },
                  ]}
                />

                {errors.gender && (
                  <Text style={styles.inputError}>{errors.gender.message}</Text>
                )}
              </View>
            )}
          />

          <Text style={styles.inputLabel}>University</Text>
          <Controller
            control={control}
            name="uni_id"
            render={({ field: { onChange, value } }) => (
              <View>
                <RNPickerSelect
                  onValueChange={(val) => {
                    if (val !== "") {
                      setValue("uni_id", val);
                      clearErrors("uni_id");
                    }
                  }}
                  //onDonePress={()=>console.log(value)}
                  style={{
                    inputIOS: {
                      ...styles.input,
                      borderColor: errors.uni_id ? failedColor : "#D8DADC",
                    },
                    iconContainer: styles.iconContainer,
                    inputAndroid: {
                      ...styles.input,
                      borderColor: errors.uni_id ? failedColor : "#D8DADC",
                    },
                    inputWeb: {
                      ...inputWeb,
                      borderColor: errors.uni_id ? failedColor : "#D8DADC",
                    },
                    inputIOSContainer: { pointerEvents: "none" },
                  }}
                  Icon={() =>
                    OS !== "web" && (
                      <EvilIcons
                        name="chevron-down"
                        size={h * 32.7}
                        color="#539DF3"
                      />
                    )
                  }
                  useNativeAndroidPickerStyle={false}
                  placeholder={{ label: "Select your university", value: "" }}
                  items={[{label: user?.uni_name??"Undefined",value: user?.uni_id,},]}
                />

                {errors.uni_id && (
                  <Text style={styles.inputError}>{errors.uni_id.message}</Text>
                )}
              </View>
            )}
          />

          <Pressable
            style={[
              styles.button,
              {
                backgroundColor: "#007BFF"
              },
            ]}
            onPress={handleSubmit(generate)}
          >
            {isSubmitting ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text
                style={{
                  fontFamily: "Inter_600SemiBold",
                  color: "#ffffff",
                  fontSize: h * 8 + w * 8,
                  textAlign: "center",
                }}
              >
                Generate
              </Text>
            )}
          </Pressable>
        </View>
      </LinearGradient>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "92%",
    borderRadius: 24,
    backgroundColor: "rgba(173, 216, 230, 0.25)",
    paddingHorizontal: 15 * w,
    paddingTop: h * 20,
  },

  title: {
    fontFamily: "Poppins_600SemiBold",
    color: "#565555",
    fontSize: h * 12.5 + w * 12.5,
    textAlign: "center",
  },
  button: {
    marginBottom: h * 15.523,
    boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
    borderRadius: 10,
    paddingVertical: h * 17,
    marginTop: h * 22,
  },
  inputLabel: {
    fontFamily: "Inter_400Regular",
    fontSize: h * 6.6 + w * 6.6,
    color: "rgba(0, 0, 0, 0.70)",
  },
  searchView: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 9.4,
    borderColor: "#E7EAE9",
    borderWidth: 0.78,
    paddingVertical: h * 10,
    paddingHorizontal: w * 10,
    alignItems: "center",
    columnGap: w * 25,
    marginVertical: h * 20,
  },
  search: {
    flex: 1,
    fontFamily: "Inter_500Medium",
    color: "#85878D",
    fontSize: w * 8.5 + h * 8,
    outlineWidth: 0,
  },

  friends: {
    fontFamily: "Inter_600SemiBold",
    color: "#565555",
    fontSize: h * 8 + w * 8,
    paddingLeft: w * 4,
  },

  inputView: {
    alignSelf: "stretch",
    rowGap: h * 10,
    marginTop: h * 25,
  },

  input: {
    backgroundColor: "#ffffff",
    borderRadius: 10,
    fontFamily: "Inter_400Regular",
    fontSize: h * 8 + w * 8,
    color: "rgba(0, 0, 0, 1)",
    paddingHorizontal: w * 9,
    paddingVertical: h * 9,
    borderStyle: "solid",
    borderWidth: 1,
    marginBottom: h * 16,
  },

  inputError: {
    fontFamily: "Inter_400Regular",
    fontSize: h * 6.1 + w * 6.1,
    color: "rgb(255, 0, 0)",
    position: "absolute",
    top: "80%",
  },

  iconContainer: {
    right: 7.828 * w,
    top: 7.353 * h,
  },
});

const inputWeb = {
  ...styles.input,
  paddingVertical: h * 8.17,
};
