import {
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  View,
  Dimensions,
  PixelRatio,
} from 'react-native';
import React from 'react';

const {width, height} = Dimensions.get('window');


const scale = width / 375; 
const normalize = size => {
  const newSize = size * scale;
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
};

const ButtonIcon = ({
  title,
  icon,
  onPress,
  style,
  textStyle,
  iconPosition = 'left',
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          padding: normalize(12),
          borderRadius: normalize(8),
        },
        style,
      ]}
      onPress={onPress}
      activeOpacity={0.8}>
      {iconPosition === 'left' && icon && (
        <Image
          source={icon}
          style={[
            styles.icon,
            {
              width: normalize(24),
              height: normalize(24),
              marginHorizontal: normalize(8),
            },
          ]}
          resizeMode="contain"
        />
      )}

      <Text style={[styles.buttonText, {fontSize: normalize(16)}, textStyle]}>
        {title}
      </Text>

      {iconPosition === 'right' && icon && (
        <Image
          source={icon}
          style={[
            styles.icon,
            {
              width: normalize(24),
              height: normalize(24),
              marginHorizontal: normalize(8),
            },
          ]}
          resizeMode="contain"
        />
      )}
    </TouchableOpacity>
  );
};

export default ButtonIcon;

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    marginVertical: normalize(8),
  },
  buttonText: {
    color: '#333',
    fontWeight: '500',
  },
  icon: {
    width: 24,
    height: 24,
    marginHorizontal: 8,
  },
});
