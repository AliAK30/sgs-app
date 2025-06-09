import { Text, View, TextInput } from "../Themed";
import {
  StyleSheet,
  TextInputProps,
} from "react-native";
//import { useRef } from "react";
import { WarnIcon } from "@/components/Icons";
import { h, w, OS } from "@/app/_layout";
import inputStyles from "./styles";
import { FieldError } from "react-hook-form";



export type StyledInputProps = {
  error?: FieldError | undefined;
  Icon?: ()=>JSX.Element | undefined;
  iconRenderingCondition?: any | undefined;
  errorClone?: string;
} & TextInputProps;

export default function StyledInput({error, Icon=WarnIcon, iconRenderingCondition, errorClone="as", ...props}: StyledInputProps) {

  //const TextInputRef = useRef<typeof TextInput | null>(null)
 

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
          
          style={inputStyles.input}
        />
        {(iconRenderingCondition || error) && <Icon/>}
      </View>
      <Text style={[inputStyles.inputError, { opacity: error ? 100 : 0 }]}>
        {error?.message ?? errorClone}
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
});
