import React, { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator, SafeAreaView } from 'react-native';
import PropTypes from 'prop-types';
import * as SplashScreen from 'expo-splash-screen';

const AutoLogin = ({ setUser, setInitializing }) => {
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const name = await AsyncStorage.getItem('username');
        const password = await AsyncStorage.getItem('password');

        if (token) {
          setUser({ token });
          console.log(name)
          console.log(password)
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Error checking token:', error);
        setUser(null);
      } finally {
        setInitializing(false);
        SplashScreen.hideAsync();
      }
    };

    checkLoginStatus();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color="#0000ff" />
    </SafeAreaView>
  );
};

AutoLogin.propTypes = {
  setUser: PropTypes.func.isRequired,
  setInitializing: PropTypes.func.isRequired,
};

export default AutoLogin;
