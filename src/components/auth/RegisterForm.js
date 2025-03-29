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
  SafeAreaView,
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


const scale = Math.min(width / 375, height / 812) * 0.95; 
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

    // console.log("Submitting user data:", userData);

  
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
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoid}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          bounces={false}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.container}>
         
            <View style={styles.topRotation} />

         
            <View style={styles.logoContainer}>
              <Image
                source={movnn_logo}
                style={styles.logo}
                resizeMode="contain"
                fadeDuration={0}
                quality={1.0}
              />
            </View>

            
            <View style={styles.topSection}>
              <Text style={styles.headerTitle}>Sign Up!</Text>
              <Text style={styles.welcomeText}>Hello, let's get movnn! 👋🏼</Text>
              <View style={styles.divider} />
            </View>

      
            <View style={styles.bottomSection}>
    
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
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default RegisterForm;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#015cd2",
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    backgroundColor: "#015cd2",
    position: "relative",
  },
  topRotation: {
    position: "absolute",
    width: 627.68,
    height: 292.03,
    left: 199.81,
    top: -280, 
    backgroundColor: "#1F7DF3",
    transform: [{ rotate: "-44.75deg" }],
    zIndex: 1,
  },
  logoContainer: {
    alignItems: "center",
    paddingTop: normalize(40), 
    zIndex: 2,
  },
  logo: {
    width: normalize(110),
    height: normalize(45), 
  },
  topSection: {
    paddingTop: normalize(10), 
    paddingHorizontal: normalize(24),
    paddingBottom: normalize(10), 
    zIndex: 2,
  },
  headerTitle: {
    fontSize: normalize(26), 
    fontWeight: "bold",
    color: "#fff",
    marginBottom: normalize(3), 
  },
  welcomeText: {
    fontSize: normalize(15), 
    color: "#fff",
    marginBottom: normalize(18), 
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    marginTop: normalize(14), 
  },
  bottomSection: {
    flex: 1,
    backgroundColor: "#fff",
    borderTopLeftRadius: normalize(25), 
    borderTopRightRadius: normalize(25), 
    paddingTop: normalize(35), 
    paddingHorizontal: normalize(22), 
    paddingBottom: normalize(15), 

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
    marginVertical: normalize(12), 
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#ddd",
  },
  orText: {
    paddingHorizontal: normalize(8), 
    color: "#999",
    fontSize: normalize(12), 
  },
  socialButton: {
    marginBottom: normalize(20), 
    borderColor: "#ddd",
    height: normalize(50), 
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: normalize(12), 
    marginBottom: normalize(12),
  },
  loginText: {
    color: "#666",
    fontSize: normalize(12), 
  },
  loginLink: {
    color: "#015cd2",
    fontSize: normalize(12), 
    fontWeight: "bold",
  },
  signUpButton: {
    marginBottom: normalize(5), 
    marginTop: normalize(7), 
  },
  buttonSpacer: {
    height: normalize(10), 
  },
});
