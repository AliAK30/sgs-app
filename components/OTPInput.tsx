import { useRef } from 'react';
import { TextInput, StyleSheet, NativeSyntheticEvent, TextInputKeyPressEventData } from 'react-native';
import {View} from './Themed'
import { height } from '@/app/_layout';

type Props = {
    otp: string[],
    setOTP: React.Dispatch<React.SetStateAction<string[]>>;
}

const OTPInput = ({ otp, setOTP }: Props) => {

  const inputs = useRef<(TextInput | null)[]>([]);
  
  const handleChange = (text:string, index:number) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOTP(newOtp);

    // Auto focus to next input
    if (text && index < 5) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: NativeSyntheticEvent<TextInputKeyPressEventData>, index:number) => {
    // Handle backspace to move focus to previous input
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  return (
      
      
      <View style={styles.otpContainer}>
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            style={[styles.otpInput, {borderColor: otp[index]===''? 'rgba(46, 142, 255, 1)' : 'black' }]}
            keyboardType="numeric"
            maxLength={1}
            value={digit}
            onChangeText={(text) => handleChange(text, index)}
            onKeyPress={(e) => handleKeyPress(e, index)}
            ref={(ref) => (inputs.current[index] = ref)}
            selectTextOnFocus
          />
        ))}
      </View>
      
  );
};

const styles = StyleSheet.create({
 
  
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: height*0.03,
    columnGap: height*0.01,
  },
  otpInput: {
    width: height*0.06,
    height: height*0.06,
    borderWidth: height*0.003,
    borderRadius: 10,
    textAlign: 'center',
    fontSize: 18,
    
  },
});


export default OTPInput;
