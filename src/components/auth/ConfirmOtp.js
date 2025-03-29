import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  PixelRatio,
  Alert,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';

import Button from '../common/Button';

import {ROUTES} from '../../navigation/routes';
import OtpInputField from '../common/OtpInputField';
import {useAuth} from '../../context/AuthProvider';

const {width, height} = Dimensions.get('window');

const scale = width / 375; 
const normalize = size => {
  const newSize = size * scale;
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
};

const ConfirmOtp = () => {
  const navigation = useNavigation();
  const route = useRoute();

  console.log('ConfirmOtp - Route params:', route.params);


  const {email = '', phoneNumber = ''} = route.params || {};


  const {
    signUpData,
    isLoading,
    error,
    isAuthenticated,
    verifyOtp,
    resendOtp,
    signUp,
    resetError,
  } = useAuth();



  const [otp, setOtp] = useState('');
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);


  const [hasNavigated, setHasNavigated] = useState(false);


  const displayPhone =
    phoneNumber || signUpData?.phoneNumber || signUpData?.phone || '';
  const userEmail = email || signUpData?.email || '';


  useEffect(() => {
  
    if (isAuthenticated && !hasNavigated) {
      console.log('User is authenticated, navigating to Dashboard');
      setHasNavigated(true); 
      navigation.reset({
        index: 0,
        routes: [{name: ROUTES.DASHBOARD}],
      });
    }
  }, [isAuthenticated, navigation, hasNavigated]);


  useEffect(() => {
    if (error) {


   
      let errorMessage = 'Failed to verify OTP. Please try again.';

      if (typeof error === 'string') {
        errorMessage = error;
      } else if (typeof error === 'object') {
       
        if (error.message) {
          errorMessage = error.message;
        } else if (error.error) {
          errorMessage = error.error;
        }
      }

      Alert.alert('Verification Error', errorMessage);
      resetError();
    }
  }, [error, resetError]);


  useEffect(() => {
    if (timer > 0 && !canResend) {
      const interval = setInterval(() => {
        setTimer(prevTimer => prevTimer - 1);
      }, 1000);

      return () => clearInterval(interval);
    } else if (timer === 0) {
      setCanResend(true);
    }
  }, [timer, canResend]);

  const handleVerify = async () => {
    
    if (otp.length !== 6) {
      Alert.alert('Invalid OTP', 'Please enter a valid 6-digit OTP');
      return;
    }

    console.log('Verifying OTP:', otp, 'for email:', userEmail);

    
    const verificationData = {
      email: userEmail,
      OTP: otp,
    };

    try {


 
      const result = await verifyOtp(verificationData);

      setHasNavigated(true);

     
      setTimeout(() => {

        navigation.reset({
          index: 0,
          routes: [{name: ROUTES.DASHBOARD}],
        });
      }, 300);
    } catch (error) {
     
      Alert.alert(
        'Verification Error',
        error.message || 'An unexpected error occurred',
      );
    }
  };

  const handleResendCode = async () => {
    if (canResend) {
      
      setTimer(60);
      setCanResend(false);

   
      if (signUpData) {
        try {
          console.log('Resending OTP for:', signUpData);

   
         
          const resendData = {
            email: signUpData.email,
            
          };

          await resendOtp(resendData);

          Alert.alert(
            'OTP Sent',
            'A new OTP has been sent to your email/phone',
          );
        } catch (error) {

          Alert.alert('Error', 'Failed to resend OTP. Please try again.');
   
          setCanResend(true);
        }
      } else {
        Alert.alert('Error', 'Could not resend OTP. Please try again later.');
  
        setCanResend(true);
      }
    }
  };

  const formatTime = seconds => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <View style={styles.container}>

      <View style={styles.topRotation} />


      <View style={styles.topSection}>
        <Text style={styles.headerTitle}>Confirm OTP</Text>
        <Text style={styles.otpSentText}>
          An OTP has been sent to {displayPhone}
        </Text>
        <View style={styles.divider} />
      </View>

      <View style={styles.bottomSection}>

        <OtpInputField length={6} onOtpChange={setOtp} />

      
        <View style={styles.resendContainer}>
          {canResend ? (
            <TouchableOpacity onPress={handleResendCode}>
              <Text style={styles.resendText}>Resend code</Text>
            </TouchableOpacity>
          ) : (
            <Text style={styles.timerText}>
              Resend code in {formatTime(timer)}
            </Text>
          )}
        </View>


        <Button
          type="primary"
          title={isLoading ? 'Verifying...' : 'Verify'}
          style={styles.verifyButton}
          onPress={handleVerify}
          disabled={isLoading}
        />
      </View>
    </View>
  );
};

export default ConfirmOtp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#015cd2',
    position: 'relative',
  },
  topRotation: {
    position: 'absolute',
    width: 627.68,
    height: 287.03,
    top: -296.18,
    left: 210.81,
    backgroundColor: '#1F7DF3',
    transform: [{rotate: '-44.75deg'}],
  },
  topSection: {
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: normalize(30),
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: normalize(8),
  },
  otpSentText: {
    fontSize: 18,
    color: '#fff',
    marginBottom: normalize(20),
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginTop: normalize(10),
  },
  bottomSection: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: normalize(30),
    borderTopRightRadius: normalize(30),
    paddingTop: normalize(30),
    paddingHorizontal: normalize(24),
    paddingBottom: normalize(30),
    alignItems: 'center',
  },
  resendContainer: {
    marginTop: normalize(20),
    alignItems: 'center',
  },
  resendText: {
    color: '#015cd2',
    fontSize: 16,
    fontWeight: '500',
    textDecorationLine: 'underline',
  },
  timerText: {
    color: '#666',
    fontSize: 16,
  },
  verifyButton: {
    marginTop: 'auto',
    width: '100%',
  },
});
