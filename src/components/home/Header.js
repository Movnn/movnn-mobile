import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import React from "react";
import movnn_logo_filled from "../../assets/images/filled-logo.png";
import {
  ChatBubbleOvalLeftIcon,
  BellIcon,
} from "react-native-heroicons/outline";

const Header = () => {
  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={movnn_logo_filled}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <View style={styles.iconsContainer}>
        <TouchableOpacity style={styles.iconButton}>
          <ChatBubbleOvalLeftIcon size={20} color="#005DD2" />
          <View style={styles.questionMark}>
            <Text style={styles.questionMarkText}>?</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconButton}>
          <BellIcon size={20} color="#005DD2" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  logoContainer: {
    flex: 1,
  },
  logo: {
    width: 90,
    height: 30,
  },
  iconsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#E0EEFF",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
    position: "relative",
  },
  questionMark: {
    position: "absolute",
    bottom: 6,
    right: 6,
    backgroundColor: "#005DD2",
    width: 12,
    height: 12,
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  questionMarkText: {
    color: "#ffffff",
    fontSize: 8,
    fontWeight: "bold",
  },
});

export default Header;
