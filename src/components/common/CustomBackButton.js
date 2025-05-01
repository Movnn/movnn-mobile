import React from "react";
import { TouchableOpacity, View, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";


const CustomBackButton = ({
  onPress,
  containerStyle,
  iconStyle,
  iconName = "arrow-left",
  iconSize = 24,
  iconColor = "#000",
}) => {
  const navigation = useNavigation();

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      navigation.goBack();
    }
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={[styles.container, containerStyle]}
      activeOpacity={0.7}
      accessibilityLabel="Go back"
      accessibilityHint="Navigate to the previous screen"
    >
      <View style={[styles.iconContainer, iconStyle]}>
        <Feather name={iconName} size={iconSize} color={iconColor} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 8,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
});

export default CustomBackButton;