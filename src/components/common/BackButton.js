import React from "react";
import { TouchableOpacity, StyleSheet, View, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";

const BackButton = ({
  onPress,
  color = "#005DD2",
  size = 24,
  containerStyle = {},
  showText = false,
  text = "Back",
  textStyle = {},
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
    >
      <Feather name="chevron-left" size={size} color={color} />
      {showText && (
        <Text style={[styles.text, { color }, textStyle]}>{text}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    // padding: 8,
  },
  text: {
    fontSize: 16,
    fontWeight: "500",
    // marginLeft: 4,
  },
});

export default BackButton;
