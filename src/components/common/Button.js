import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  PixelRatio,
} from 'react-native';

const {width, height} = Dimensions.get('window');


const scale = width / 375; 
const normalize = size => {
  const newSize = size * scale;
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
};

const Button = ({
  type = 'primary',
  title,
  onPress,
  style,
  textStyle,
  disabled,
  loading,
  fullWidth = false,
}) => {
 
  const getButtonStyles = () => {
    switch (type) {
      case 'primary':
        return {
          backgroundColor: disabled ? '#cccccc' : '#015cd2',
          borderColor: '#015cd2',
        };
      case 'secondary':
        return {
          backgroundColor: 'transparent',
          borderColor: '#015cd2',
        };
      case 'white':
        return {
          backgroundColor: '#FFFFFF',
          borderColor: '#FFFFFF',
        };
      default:
        return {
          backgroundColor: '#015cd2',
          borderColor: '#015cd2',
        };
    }
  };

 
  const getTextColor = () => {
    switch (type) {
      case 'primary':
        return '#FFFFFF';
      case 'secondary':
        return '#015cd2';
      case 'white':
        return '#015cd2';
      default:
        return '#FFFFFF';
    }
  };

  const buttonStyles = getButtonStyles();
  const textColor = getTextColor();


  const defaultHeight = normalize(38);

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          height: defaultHeight,
          borderRadius: normalize(8),
          paddingHorizontal: normalize(24),
        },
        {backgroundColor: buttonStyles.backgroundColor},
        {borderColor: buttonStyles.borderColor},
        fullWidth && styles.fullWidth,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}>
      {loading ? (
        <ActivityIndicator color={textColor} size="small" />
      ) : (
        <Text
          style={[
            styles.buttonText,
            {
              color: textColor,
              fontSize: normalize(16),
            },
            textStyle,
          ]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default Button;

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  fullWidth: {
    width: '100%',
  },
  buttonText: {
    fontWeight: 'bold',
  },
});
