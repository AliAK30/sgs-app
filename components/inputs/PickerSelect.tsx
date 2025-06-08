import { Text, View } from "@/components/Themed";
import { StyleSheet } from "react-native";
import RNPickerSelect, {PickerSelectProps} from "react-native-picker-select";
import inputStyles from "./styles"
import EvilIcons from "@expo/vector-icons/EvilIcons";
import {w, h} from "@/app/_layout"
import { FieldError } from "react-hook-form";

type Props = {
    error?: FieldError|undefined;
} & PickerSelectProps;

const failedColor = "rgb(255, 0, 0)";

export default function PickerSelect({error, ...props}: Props) {

    let inputContainerStyles = {...styles.input, borderColor: error ? failedColor : "#D8DADC"};

    return (
        <View>
            <RNPickerSelect

            {...props}
            
            style={{
                inputIOS: inputContainerStyles,
                inputAndroid: inputContainerStyles,
                inputWeb: inputContainerStyles,
                iconContainer: { paddingRight: w * 3},
                viewContainer: {justifyContent: "center"},
                inputAndroidContainer:{justifyContent: "center"},
                inputIOSContainer: {pointerEvents: "none",justifyContent: "center"},
            }}

            Icon={() => <EvilIcons name="chevron-down" size={h * 16 + w * 16} color={error? failedColor : "#539DF3"}/>}

            useNativeAndroidPickerStyle={false}
            />

            
            <Text style={[inputStyles.inputError, { opacity: error ? 100 : 0 }]}>
                {error?.message ?? "as"}
            </Text>
            
        </View>

    );
}

const styles = StyleSheet.create({
    input: {
    ...inputStyles.input,
    backgroundColor: "#ffffff",
    borderRadius: 10,
    paddingLeft: w * 9,
    paddingVertical: h * 9,
    borderStyle: "solid",
    borderWidth: 1,
    }
})