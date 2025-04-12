import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  TouchableOpacity,
  StatusBar,
  Platform,
  PixelRatio,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
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

const RegisterForm = (props) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [emailError, setEmailError] = useState("");

  const navigation = useNavigation();
  const { signUp, isLoading, error, setSignUpData, resetError } = useAuth();


  const topSectionHeight = Math.min(height * 0.28, normalize(200));

  useEffect(() => {
    if (error) {
      let errorMessage = "Failed to register. Please try again.";

      if (
        typeof error === "string" &&
        (error.startsWith("<!DOCTYPE") || error.startsWith("<html"))
      ) {
        errorMessage =
          "The server encountered an error. Please try again later.";
      } else if (typeof error === "string") {
        errorMessage = error;
      } else if (typeof error === "object") {
        if (error.message) {
          errorMessage = error.message;
        } else if (error.error) {
          errorMessage = error.error;
        }
      }

      Alert.alert("Registration Error", errorMessage);
      resetError();
    }
  }, [error, resetError]);

  const handleToOtpScreen = async () => {
    setFirstNameError("");
    setLastNameError("");
    setPhoneError("");
    setEmailError("");

    let hasError = false;

    if (!firstName.trim()) {
      setFirstNameError("First name is required");
      hasError = true;
    }

    if (!lastName.trim()) {
      setLastNameError("Last name is required");
      hasError = true;
    }

    if (!phoneNumber.trim()) {
      setPhoneError("Phone number is required");
      hasError = true;
    }

    if (!email.trim()) {
      setEmailError("Email is required");
      hasError = true;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Email is invalid");
      hasError = true;
    }

    if (hasError) {
      return;
    }

    const formattedPhone = phoneNumber.trim().startsWith("+234")
      ? phoneNumber.trim()
      : phoneNumber.trim();

    const userData = {
      f_name: firstName.trim(),
      l_name: lastName.trim(),
      phone: formattedPhone,
      email: email.trim(),
      password: "Devadmin123",
      con_password: "Devadmin123",
      address: "123 Test Avenue",
      signup_type: "user",
    };

    setSignUpData({
      ...userData,
      phoneNumber: formattedPhone,
    });

    try {
      const result = await signUp(userData);
      console.log("API call completed, result:", result);

      navigation.navigate(ROUTES.CONFIRM_OTP, {
        email: email.trim(),
        phoneNumber: formattedPhone,
      });
    } catch (error) {
      let errorMessage = "Registration failed. Please try again.";

      if (error.response) {
        if (error.response.status === 500) {
          errorMessage =
            "The server encountered an error. Please try again later.";
        } else if (error.response.status === 400) {
          errorMessage = "Please check your information and try again.";
        } else if (error.response.status === 409) {
          errorMessage =
            "This user already exists. Please use different information.";
        } else if (error.response.data) {
          const responseData = error.response.data;

          if (typeof responseData === "string") {
            if (
              responseData.startsWith("<!DOCTYPE") ||
              responseData.startsWith("<html")
            ) {
              errorMessage =
                "The server encountered an error. Please try again later.";
            } else {
              errorMessage = responseData;
            }
          } else if (typeof responseData === "object") {
            if (responseData.error) {
              errorMessage = responseData.error;
            } else if (responseData.message) {
              errorMessage = responseData.message;
            } else {
              const firstKey = Object.keys(responseData)[0];
              if (firstKey && responseData[firstKey]) {
                errorMessage = responseData[firstKey];
              }
            }
          }
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      Alert.alert("Registration Error", errorMessage);
    }
  };

  const handleLogin = () => {
    if (props.onLoginPress) {
      props.onLoginPress();
    } else {
      navigation.navigate(ROUTES.LOGIN);
    }
  };

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

          <Text style={styles.headerTitle}>Sign Up!</Text>
          <Text style={styles.welcomeText}>Hello, let's get movnn! 👋🏼</Text>
          <View style={styles.divider} />
        </View>

        {/* White bottom section with form */}
        <View
          style={[
            styles.bottomSection,
            { minHeight: height - topSectionHeight },
          ]}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            bounces={false}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.nameRow}>
              <View style={styles.nameField}>
                <InputField
                  label="First Name"
                  placeholder="First name"
                  value={firstName}
                  onChangeText={(text) => {
                    setFirstName(text);
                    setFirstNameError("");
                  }}
                  error={firstNameError}
                />
              </View>
              <View style={styles.nameField}>
                <InputField
                  label="Last Name"
                  placeholder="Last name"
                  value={lastName}
                  onChangeText={(text) => {
                    setLastName(text);
                    setLastNameError("");
                  }}
                  error={lastNameError}
                />
              </View>
            </View>

            <InputField
              label="Phone Number"
              placeholder="Enter your phone number"
              value={phoneNumber}
              onChangeText={(text) => {
                setPhoneNumber(text);
                setPhoneError("");
              }}
              keyboardType="phone-pad"
              leftComponent={<Text style={styles.countryCode}>+234</Text>}
              error={phoneError}
            />

            <InputField
              label="Email"
              placeholder="Enter your email"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                setEmailError("");
              }}
              keyboardType="email-address"
              error={emailError}
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
              onPress={() => console.log("Google signup")}
            />

            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Already have an account? </Text>
              <TouchableOpacity onPress={handleLogin}>
                <Text style={styles.loginLink}>Login</Text>
              </TouchableOpacity>
            </View>

            <Button
              type="primary"
              title={isLoading ? "Processing..." : "Sign Up"}
              style={styles.signUpButton}
              onPress={handleToOtpScreen}
              fullWidth
              disabled={isLoading}
            />

            <View style={styles.buttonSpacer} />
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default RegisterForm;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#015cd2",
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: normalize(60), // Add more padding at the bottom to ensure button visibility
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
  nameRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: normalize(6),
  },
  nameField: {
    width: "48%",
  },
  countryCode: {
    color: "#333",
    fontSize: normalize(14),
    fontWeight: "500",
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
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: normalize(15),
  },
  loginText: {
    color: "#666",
    fontSize: normalize(13),
  },
  loginLink: {
    color: "#015cd2",
    fontSize: normalize(13),
    fontWeight: "bold",
  },
  signUpButton: {
    marginBottom: normalize(10),
    marginTop: normalize(10),
  },
  buttonSpacer: {
    height: normalize(30),
  },
});
