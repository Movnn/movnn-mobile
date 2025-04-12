import {
  Image,
  StyleSheet,
  Text,
  View,
  Dimensions,
  SafeAreaView,
} from "react-native";
import React from "react";
import Button from "../../components/common/Button";
import movnnlogo from "../../assets/images/movn-high-logo.png";
import { ROUTES } from "../../navigation/routes";

const { width, height } = Dimensions.get("window");

const AuthScreen = ({ navigation }) => {

  const handleToAuth = () => {
  
    navigation.navigate(ROUTES.AUTH);

  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topRotation} />
      <View style={styles.bottomRotation} />

      <View style={styles.contentContainer}>
        <View style={styles.logoContainer}>
          <Image
            source={movnnlogo}
            style={styles.logo}
            resizeMode="contain"
            fadeDuration={0}
            progressiveRenderingEnabled={true}
          />
        </View>

        <View style={styles.bottomContainer}>
          <Text style={styles.mainText}>Let's get movnn!</Text>
          <Text style={styles.termsText}>
            Our <Text style={styles.linkText}>Terms and Conditions</Text> and{" "}
            <Text style={styles.linkText}>Privacy Policy</Text>
          </Text>
          <Button
            title="Login"
            type="white"
            onPress={handleToAuth}
            style={styles.loginButton}
            fullWidth
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default AuthScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#015cd2",
    position: "relative",
    overflow: "hidden",
  },

  topRotation: {
    // position: "absolute",
    // width: width * 2,
    // height: height * 0.9,
    // backgroundColor: "#1F7DF3",
    // top: -height * 0.5,
    // left: width * 0.46,
    // transform: [{ rotate: "-47.75deg" }],
  },
  bottomRotation: {
    // position: "absolute",
    // width: width * 2,
    // height: height * 0.8,
    // backgroundColor: "#0E63D9",
    // bottom: -height * 0.33,
    // right: -width * 0.97,
    // transform: [{ rotate: "-120.97deg" }],
  },

  contentContainer: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 40,
    zIndex: 1,
  },
  logoContainer: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: width * 0.4,
    height: undefined,
    aspectRatio: 1,
    maxWidth: 200,
  },
  mainText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 10,
  },
  bottomContainer: {
    width: "100%",
    marginBottom: 20,
  },
  loginButton: {
    marginBottom: 20,
    marginTop: 20,
  },
  termsText: {
    fontSize: 14,
    color: "#FFFFFF",
    textAlign: "center",
  },
  linkText: {
    textDecorationLine: "underline",
  },
});
