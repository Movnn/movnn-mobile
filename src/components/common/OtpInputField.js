import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Keyboard,
  Dimensions,
  PixelRatio,
} from 'react-native';
import React, {useState, useRef, useEffect} from 'react';

const {width, height} = Dimensions.get('window');


const scale = width / 375; 
const normalize = size => {
  const newSize = size * scale;
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
};

const OtpInputField = ({length = 6, onOtpChange}) => {
  const [otp, setOtp] = useState(Array(length).fill(''));
  const inputRefs = useRef([]);


  useEffect(() => {
    inputRefs.current = Array(length)
      .fill(0)
      .map((_, i) => inputRefs.current[i] || React.createRef());
  }, [length]);

  const handleChange = (value, index) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

   
    if (value && index < length - 1) {
      inputRefs.current[index + 1].focus();
    }

    
    if (onOtpChange) {
      onOtpChange(newOtp.join(''));
    }
  };

  const handleKeyPress = (e, index) => {

    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = text => {
    if (text.length <= length) {
      const newOtp = text
        .split('')
        .concat(Array(length - text.length).fill(''));
      setOtp(newOtp);

    
      if (text.length < length) {
        inputRefs.current[text.length].focus();
      } else {
        Keyboard.dismiss();
      }

      if (onOtpChange) {
        onOtpChange(newOtp.join(''));
      }
    }
  };


  const containerPadding = normalize(20) * 2; 
  const totalSpacing = normalize(4) * (length - 1); 
  const availableWidth = width - containerPadding - totalSpacing;


  const inputSize = Math.floor(availableWidth / length);
  const fontSize = normalize(20); 
  const spacing = normalize(4); 

  return (
    <View style={styles.container}>
      {otp.map((digit, index) => (
        <TextInput
          key={index}
          ref={ref => (inputRefs.current[index] = ref)}
          style={[
            styles.input,
            {
              width: inputSize,
              height: inputSize,
              fontSize: fontSize,
              marginHorizontal: spacing / 2,
            },
          ]}
          maxLength={1}
          keyboardType="number-pad"
          value={digit}
          onChangeText={value => handleChange(value, index)}
          onKeyPress={e => handleKeyPress(e, index)}
          onPaste={e => handlePaste(e.nativeEvent.text)}
          autoFocus={index === 0}
          selectTextOnFocus
        />
      ))}
    </View>
  );
};

export default OtpInputField;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingHorizontal: normalize(20),
    marginVertical: normalize(10),
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    textAlign: 'center',
    fontWeight: 'bold',
    backgroundColor: '#f9f9f9',
  },
});
