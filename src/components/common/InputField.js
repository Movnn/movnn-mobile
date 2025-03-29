import {
  StyleSheet,
  Text,
  View,
  TextInput,
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

const InputField = ({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry,
  keyboardType = 'default',
  leftComponent,
  error,
}) => {
  return (
    <View style={styles.container}>
      {label && (
        <Text style={[styles.label, {fontSize: normalize(14)}]}>{label}</Text>
      )}
      <View
        style={[
          styles.inputContainer,
          error && styles.inputError,
          {height: normalize(48)},
        ]}>
        {leftComponent && (
          <View
            style={[
              styles.leftComponentContainer,
              {paddingHorizontal: normalize(12)},
            ]}>
            {leftComponent}
          </View>
        )}
        <TextInput
          style={[
            styles.input,
            {
              fontSize: normalize(16),
              paddingHorizontal: normalize(12),
            },
          ]}
          placeholder={placeholder}
          placeholderTextColor="#999"
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize="none"
        />
      </View>
      {error && (
        <Text style={[styles.errorText, {fontSize: normalize(12)}]}>
          {error}
        </Text>
      )}
    </View>
  );
};

export default InputField;

const styles = StyleSheet.create({
  container: {
    marginBottom: normalize(20),
    width: '100%',
  },
  label: {
    color: '#333',
    marginBottom: normalize(8),
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: normalize(8),
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  inputError: {
    borderColor: '#ff3b30',
  },
  leftComponentContainer: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: '#eee',
  },
  input: {
    flex: 1,
    height: '100%',
    color: '#333',
  },
  errorText: {
    color: '#ff3b30',
    marginTop: normalize(4),
  },
});
