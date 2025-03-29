
import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import LoginForm from "../../components/auth/LoginForm";
import RegisterForm from "../../components/auth/RegisterForm";
import { useRoute } from "@react-navigation/native";

const { height } = Dimensions.get("window");

const Auth = () => {
  const [isLoginForm, setIsLoginForm] = useState(true);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const route = useRoute();


  useEffect(() => {
    if (route.params?.showRegister) {
      setIsLoginForm(false);
    }
  }, [route.params]);


  const toggleForm = () => {
    setIsLoginForm((prevState) => !prevState);
  };

  
  const renderForm = () => {
    if (isLoginForm) {
      return <LoginForm onRegisterPress={toggleForm} />;
    } else {
      return <RegisterForm onLoginPress={toggleForm} />;
    }
  };

  return (
    <SafeAreaView
      style={styles.safeAreaContainer}
      edges={["top"]} 
    >
      <StatusBar barStyle="light-content" backgroundColor="#015cd2" />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.keyboardView}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
      >
      
        <View style={styles.formContainer}>{renderForm()}</View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeAreaContainer: {
    flex: 1,
    backgroundColor: "#015cd2",
  },
  keyboardView: {
    flex: 1,
  },
  formContainer: {
    flex: 1, 
  },
});

export default Auth;
