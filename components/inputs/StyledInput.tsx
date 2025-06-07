import { Text, View, TextInput } from "../Themed";
import {
  StyleSheet,
  TextInputProps,
} from "react-native";
import { useRef } from "react";
import { WarnIcon } from "@/components/Icons";
import { h, w, OS } from "@/app/_layout";



export type StyledInputProps = {
  error?: any | undefined;
  Icon?: ()=>JSX.Element | undefined;
  iconRenderingCondition?: any | undefined;
} & TextInputProps;

export default function StyledInput({error, Icon=WarnIcon, iconRenderingCondition, ...props}: StyledInputProps) {

  const TextInputRef = useRef<typeof TextInput | null>(null)

  return (
    <View>
      <View
        style={[
          styles.container,
          { borderColor: error ? "rgb(255, 0, 0)" : "#D8DADC" },
        ]}
      >
        <TextInput
          {...props}
          
          style={styles.input}
        />
        {(iconRenderingCondition || error) && <Icon/>}
      </View>
      <Text style={[styles.inputError, { opacity: error ? 100 : 0 }]}>
        {error ? error.message : "as"}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#ffffff",
    paddingHorizontal: w * 14,
    paddingVertical: h * 9,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: h * 1.5,
    alignItems: "center",
  },
  input: {
    fontFamily: "Inter_400Regular",
    fontSize: h * 8 + w * 8,
    color: "rgba(0, 0, 0, 1)",
    outlineColor: "rgba(0,0,0,0)",
  },

  inputError: {
    fontFamily: "Inter_400Regular",
    fontSize: h * 6 + w * 6,
    color: "rgb(255, 0, 0)",
  },
  
});
