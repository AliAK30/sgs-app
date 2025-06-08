import { FieldError } from "react-hook-form";
import { Text, View } from "../Themed";
import inputStyles from "./styles";
import DTPicker, { DateTimePickerEvent, DateTimePickerAndroid, AndroidNativeProps } from "@react-native-community/datetimepicker";
import { StyleSheet, Pressable } from "react-native";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import Modal from "react-native-modal";
import { useState } from "react";
import {h, w, OS} from "@/app/_layout"


type Props = {
 error?: FieldError|undefined;
 maximumDate?: Date | undefined;
 value: Date;
 onChange: (...event: any[]) => void;
};

const failedColor = 'rgb(255,0,0)';

export default function DateTimePicker({error, onChange, value, maximumDate}: Props) {

  const [showDatePicker, setShowDatePicker] = useState(false);

  const containerStyle = {...styles.container, borderColor: error ? failedColor : "#D8DADC",}


  const onDateChange = (event: DateTimePickerEvent, date?: Date) => {
    onChange(date);
    if(OS==='android') DateTimePickerAndroid.dismiss('date')
    else setShowDatePicker(false);
  }


  const openDateTimePicker = () => {
    if(OS==='android')
    {
      DateTimePickerAndroid.open({value:value, onChange:onDateChange, mode:'date', maximumDate: new Date(), 
        style: {
          backgroundColor: "black",
          borderRadius: 24,
      }, display:'default',
      })
    } else {
      setShowDatePicker(true);
    }
  }

  return (

    <View>

      <Modal
          isVisible={showDatePicker}
          hasBackdrop={true}
          customBackdrop={
            <Pressable
              onPress={() => setShowDatePicker(false)}
              style={styles.backdrop}
            ></Pressable>
          }
          animationIn="fadeIn"
          animationOut="fadeOut"
        >
          <DTPicker
            
            value={value}
            mode="date"
            display={OS === "ios" ? "inline" : "default"}
            maximumDate={new Date()}
            style={{
              backgroundColor: "black",
              borderRadius: 24,
            }}
            onChange={onDateChange}
            
          />
        
       </Modal>
      {OS==='web' ?

      (<View style={containerStyle}>
        <input
          type="date"
          value={
            value?.toISOString().split("T")[0] ??
            new Date(2025, 1, 1).toISOString().split("T")[0]
          }
          max={maximumDate?.toISOString().split("T")[0]}
          onChange={(e) => {
            onChange(e.target.valueAsDate);
          }}
          style={{
            ...inputStyles.input,
            paddingTop: h * 9,
            paddingBottom: h * 9,
            paddingLeft: h*9,
          }}
        />

        <EvilIcons
          name="chevron-down"
          size={h * 16 + w * 16}
          color={error ? failedColor : "#539DF3"}
        />
      </View>
      ) : (
        <Pressable
        onPress={openDateTimePicker}
        style={containerStyle}
      >
        <Text
          style={{...inputStyles.input,
            flex: 1,
            paddingHorizontal: w * 9,
            paddingVertical: h * 9,
            
          }}
        >
          {value.toLocaleDateString()}
        </Text>
        <EvilIcons
          name="chevron-down"
          size={h * 16 + w * 16}
          color="#539DF3"
        />
      </Pressable>  
      )
    }
    <Text style={[inputStyles.inputError, { opacity: error ? 100 : 0 }]}>
        {error?.message ?? "You must be at least 10 years old"}
      </Text>
    </View>
  );


};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    borderStyle: "solid",
    borderWidth: 1,
    backgroundColor: "#ffffff",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "space-between",
  },
  backdrop: {
    flex: 1,
    backgroundColor: "black",
    opacity: 0.4,
  },
})
