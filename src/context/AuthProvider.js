import React, { createContext, useState, useContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import authApi from "../api/authApi";


const AuthContext = createContext();


export const useAuth = () => useContext(AuthContext);


const AuthProvider = ({ children }) => {
  const [state, setState] = useState({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
    signUpData: null,
  });


  const updateState = (newState) => {
    setState((prevState) => ({ ...prevState, ...newState }));
  };


  const apiCall = async (apiFunction, data, successCallback) => {
    updateState({ isLoading: true, error: null });

    try {
   

      const response = await apiFunction(data);

     

      if (successCallback) {
        await successCallback(response.data);
      }

      updateState({ isLoading: false });
      return response.data;
    } catch (error) {
      console.error(`API error:`, error);

      let errorMessage =
        "An unexpected error occurred. Please try again later.";

   
      if (error.response) {
        const contentType = error.response.headers?.["content-type"] || "";


        if (error.response.status === 500) {
          // Server error
          errorMessage =
            "The server encountered an error. Please try again later.";
        } else if (error.response.status === 409) {
       
          errorMessage =
            "This record already exists. Please try with different information.";
        } else if (error.response.status === 400) {
      
          errorMessage = "Please check your information and try again.";
        }

     
        if (error.response.data) {
          if (contentType.includes("application/json")) {
            const responseData = error.response.data;

            
            if (typeof responseData === "string") {
              errorMessage = responseData;
            } else if (typeof responseData === "object") {
          
              if (responseData.error) {
                errorMessage = responseData.error;
              } else if (responseData.message) {
                errorMessage = responseData.message;
              } else if (
                responseData.errors &&
                Array.isArray(responseData.errors) &&
                responseData.errors.length > 0
              ) {
           
                errorMessage = responseData.errors[0];
              } else {
        
                const firstKey = Object.keys(responseData)[0];
                if (firstKey && responseData[firstKey]) {
                  errorMessage = responseData[firstKey];
                }
              }
            }
          } else if (
            contentType.includes("text/html") &&
            typeof error.response.data === "string"
          ) {
        
            if (error.response.status === 500) {
              errorMessage = "Server error. Please try again later.";
            } else if (error.response.status === 404) {
              errorMessage = "The requested resource was not found.";
            }
          }
        }
      } else if (error.request) {
      
        errorMessage =
          "No response from server. Please check your internet connection.";
      } else if (error.message) {
       
        errorMessage = error.message;
      }


      updateState({
        error: errorMessage,
        isLoading: false,
      });

      throw error;
    }
  };


  const saveToken = async (token) => {
    if (token) {
      await AsyncStorage.setItem("token", token);
      updateState({ isAuthenticated: true });
    }
  };

  const clearToken = async () => {
    await AsyncStorage.removeItem("token");
    updateState({ isAuthenticated: false, user: null });
  };


  useEffect(() => {
    const checkAuthStatus = async () => {
      updateState({ isLoading: true });

      try {
        const token = await AsyncStorage.getItem("token");
        updateState({ isAuthenticated: !!token });
      } catch (error) {
        console.error("Error checking auth status:", error);
      } finally {
        updateState({ isLoading: false });
      }
    };

    checkAuthStatus();
  }, []);


  const resetError = () => updateState({ error: null });

  const signUp = (userData) =>
    apiCall(authApi.signUp, userData, () => {
      updateState({ signUpData: userData });
    });

  const verifyOtp = (otpData) =>
    apiCall(authApi.verifyOtp, otpData, async (data) => {
      if (data.token) {
        await saveToken(data.token);
        updateState({ user: data.user, signUpData: null });
      }
    });

  const resendOtp = (otpData) =>
    apiCall(authApi.resendOtp, otpData, async (data) => {
      if (data.token) {
        await saveToken(data.token);
        updateState({ user: data.user, signUpData: null });
      }
    });

const login = (credentials) =>
  apiCall(authApi.login, credentials, async (data) => {

    if (data.user) {
  
      const token = data.user.token;
      if (token) {
        await saveToken(token);
      }
  
      updateState({ user: data.user });
    }
  });

  const logout = () =>
    apiCall(authApi.logout, null, async () => {
      await clearToken();
      return true;
    });

  const value = {
    ...state,
    setSignUpData: (data) => updateState({ signUpData: data }),
    signUp,
    verifyOtp,
    resendOtp,
    login,
    logout,
    resetError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export { AuthContext };
export default AuthProvider;
