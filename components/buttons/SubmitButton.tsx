import { Text } from "../Themed";
import { StyleSheet, Pressable, ActivityIndicator, GestureResponderEvent } from "react-native";
import {h, w} from "@/app/_layout"

type Props = {
 onPress : ((event: GestureResponderEvent) => void) | null | undefined;
 text: string;
 validBackgroundColor?: string;
 isValid?: boolean
 invalidBackgroundColor ?: string;
 isSubmitting ?: boolean;
}

export default function SubmitButton({onPress, text, validBackgroundColor="#007BFF", isValid=true, invalidBackgroundColor="rgba(0, 0, 0, 0.4)", isSubmitting=true}:Props) {

    return (
        <Pressable
                  style={[
                    styles.button,
                    { backgroundColor: isValid ? validBackgroundColor : invalidBackgroundColor },
                  ]}
                  onPress={onPress}
                >
                  {isSubmitting ? (
                    <ActivityIndicator size="small" color="white" />
                  ) : (
                    <Text
                      style={{
                        fontFamily: "Inter_600SemiBold",
                        color: "#ffffff",
                        fontSize: h*8 + w*8,
                        textAlign: "center",
                      }}
                    >{text}</Text>
                  )}
                </Pressable>
    )

}

const styles = StyleSheet.create({
button: {
    boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
    borderRadius: 10,
    paddingVertical: h*17,
  },
}) 