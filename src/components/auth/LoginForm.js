import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  TouchableOpacity,
  Platform,
  PixelRatio,
  KeyboardAvoidingView,
} from "react-native";
import React, { useState } from "react";
import movnn_logo from "../../assets/images/movn-high-logo.png";
import Button from "../common/Button";
import { useNavigation } from "@react-navigation/native";
import { ROUTES } from "../../navigation/routes";
import InputField from "../common/InputField";
import ButtonIcon from "../common/ButtonIcon";
import googleIcon from "../../assets/icons/google_high.png";
import { useAuth } from "../../context/AuthProvider";

const { width, height } = Dimensions.get("window");

const scale = width / 375;
const normalize = (size) => {
  const newSize = size * scale;
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
};

const LoginForm = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const navigation = useNavigation();
  const { login, isLoading, error } = useAuth();

  const handleLogin = async () => {
    let isValid = true;

    if (!email.trim()) {
      setEmailError("Email is required");
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Please enter a valid email address");
      isValid = false;
    }

    if (!password.trim()) {
      setPasswordError("Password is required");
      isValid = false;
    }

    if (!isValid) return;

    try {
      await login({
        user_type: "user",
        email,
        password,
      });

      navigation.navigate(ROUTES.DASHBOARD);
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  const handleRegister = () => {
    if (props.onRegisterPress) {
      props.onRegisterPress();
    } else {
      navigation.navigate(ROUTES.REGISTER);
    }
  };

  // Calculate top section height based on screen dimensions
  const topSectionHeight = Math.min(height * 0.28, normalize(200));

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.keyboardAvoid}
      >
        {/* Blue top section with logo and welcome text */}
        <View style={[styles.topSection, { height: topSectionHeight }]}>
          <View style={styles.logoContainer}>
            <Image
              source={movnn_logo}
              style={styles.logo}
              resizeMode="contain"
              fadeDuration={0}
            />
          </View>

          <Text style={styles.headerTitle}>Login!</Text>
          <Text style={styles.welcomeText}>Welcome back, John Doe! 👋🏼</Text>
          <View style={styles.divider} />
        </View>

        {/* White bottom section with form */}
        <View
          style={[
            styles.bottomSection,
            { minHeight: height - topSectionHeight },
          ]}
        >
          <InputField
            label="Email"
            placeholder="Enter your email address"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              setEmailError("");
            }}
            keyboardType="email-address"
            autoCapitalize="none"
            error={emailError}
          />

          <InputField
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              setPasswordError("");
            }}
            secureTextEntry
            error={passwordError}
            style={styles.passwordInput}
          />

          <View style={styles.orDivider}>
            <View style={styles.dividerLine} />
            <Text style={styles.orText}>OR</Text>
            <View style={styles.dividerLine} />
          </View>

          <ButtonIcon
            title="Continue with Google"
            icon={googleIcon}
            style={styles.socialButton}
            onPress={() => console.log("Google login")}
          />

          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>Don't have an account? </Text>
            <TouchableOpacity onPress={handleRegister}>
              <Text style={styles.registerLink}>Register now</Text>
            </TouchableOpacity>
          </View>

          <Button
            type="primary"
            title="Login"
            style={styles.loginButton}
            onPress={handleLogin}
            fullWidth
            loading={isLoading}
          />

          {error && (
            <Text style={styles.errorText}>
              {error.message || "Something went wrong. Please try again."}
            </Text>
          )}

          <View style={styles.buttonSpacer} />
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default LoginForm;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#015cd2",
  },
  keyboardAvoid: {
    flex: 1,
  },
  topSection: {
    paddingHorizontal: normalize(24),
    paddingBottom: normalize(10),
  },
  logoContainer: {
    alignItems: "center",
    paddingTop: normalize(20),
  },
  logo: {
    width: normalize(120),
    height: normalize(50),
  },
  headerTitle: {
    fontSize: normalize(28),
    fontWeight: "bold",
    color: "#fff",
    marginBottom: normalize(6),
  },
  welcomeText: {
    fontSize: normalize(16),
    color: "#fff",
    marginBottom: normalize(10),
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    marginTop: normalize(5),
  },
  bottomSection: {
    flex: 1,
    backgroundColor: "#fff",
    borderTopLeftRadius: normalize(30),
    borderTopRightRadius: normalize(30),
    paddingTop: normalize(25),
    paddingHorizontal: normalize(24),
    paddingBottom: normalize(30),
  },
  passwordInput: {
    marginBottom: normalize(5),
  },
  orDivider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: normalize(15),
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#ddd",
  },
  orText: {
    paddingHorizontal: normalize(10),
    color: "#999",
    fontSize: normalize(13),
  },
  socialButton: {
    marginBottom: normalize(15),
    borderColor: "#ddd",
    height: normalize(45),
  },
  registerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: normalize(15),
  },
  registerText: {
    color: "#666",
    fontSize: normalize(13),
  },
  registerLink: {
    color: "#015cd2",
    fontSize: normalize(13),
    fontWeight: "bold",
  },
  loginButton: {
    marginBottom: normalize(10),
    marginTop: normalize(10),
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginTop: normalize(8),
    fontSize: normalize(13),
  },
  buttonSpacer: {
    height: normalize(10),
  },
});
