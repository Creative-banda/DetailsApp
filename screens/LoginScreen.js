import React, { useState, useRef } from 'react';
import { Animated, View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';
import CustomAlert from '../components/CustomAlert';

const Login = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const scaleEmail = useRef(new Animated.Value(1)).current;
  const scalePassword = useRef(new Animated.Value(1)).current;

  const handleFocus = (scale) => {
    Animated.spring(scale, {
      toValue: 1.1,
      useNativeDriver: true,
    }).start();
  };
  const handleBlur = (scale) => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };
  const handleLogin = async () => {
    const authData = {
      username: email,
      password: password
    };
    setLoading(true);
    try {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("user-agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36");

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: JSON.stringify(authData),
        redirect: "follow"
      };
      const response = await fetch("https://orchids.letseduvate.com/qbox/erp_user/login/", requestOptions);
      const data = await response.json();
      if (response.ok) {
        if (data.status_code === 200) {
          const token = data.result.user_details.token;
          await AsyncStorage.setItem('token', token);
          navigation.replace('Home');
        } else if (data.status_code === 401) {
          setAlertMessage('Your account is not present');
          setAlertVisible(true);
        } else {
          setAlertMessage('An unknown error occurred');
          setAlertVisible(true);
        }
      } else {
        setAlertMessage('An unknown error occurred');
        setAlertVisible(true);
      }
    } catch (error) {
      setAlertMessage('Please try again later');
      setAlertVisible(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 100}
    >
      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        keyboardShouldPersistTaps="handled"
        style={{ flex: 1 }}
      >
        <View style={styles.innerContainer}>
          <View style={[styles.circle, styles.circle1]}></View>
          <View style={[styles.circle, styles.circle2]}></View>
          <StatusBar style="auto" />
          <View style={styles.logoContainer}>
            <Image source={require('../assets/LoginIcon.png')} style={styles.logo} />
          </View>
          <Text style={styles.Header}>Login </Text>
          <Animated.View style={{ transform: [{ scale: scaleEmail }], width: '100%' }}>
            <TextInput
              style={styles.input}
              placeholder="ERP Number"
              value={email}
              onChangeText={setEmail}
              placeholderTextColor="#999"
              editable={!loading}
              onFocus={() => handleFocus(scaleEmail)}
              onBlur={() => handleBlur(scaleEmail)}
            />
          </Animated.View>
          <Animated.View style={{ transform: [{ scale: scalePassword }] }}>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!isPasswordVisible}
                placeholderTextColor="#999"
                editable={!loading}
                onFocus={() => handleFocus(scalePassword)}
                onBlur={() => handleBlur(scalePassword)}
              />
              <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
                <Icon
                  name={isPasswordVisible ? 'eye' : 'eye-slash'}
                  size={23}
                  color="#999" style={styles.HideShow}
                />
              </TouchableOpacity>
            </View>
          </Animated.View>
          <TouchableOpacity style={[styles.ButtonContainer, loading && styles.buttonDisabled]} onPress={handleLogin} disabled={loading}>
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.ButtonText}>Login</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
      <CustomAlert
        visible={alertVisible}
        message={alertMessage}
        onClose={() => setAlertVisible(false)}
      />
    </KeyboardAvoidingView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  innerContainer: {
    paddingVertical: 30,
    paddingHorizontal: 30,
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  circle: {
    position: 'absolute',
    backgroundColor: '#46D6AA',
    opacity: 0.3,
  },
  circle1: {
    width: 300,
    height: 300,
    borderRadius: 150,
    top: -50,
    left: -80,
  },
  circle2: {
    position : 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    bottom: -100,
    right: -80,
  },
  Header: {
    alignSelf: 'flex-start',
    paddingTop: 20,
    paddingVertical: 20,
    fontSize: 35,
    fontFamily: 'Ubuntu',
    fontWeight: '600',
  },
  input: {
    padding: 5,
    marginVertical: 10,
    borderBottomWidth: 1,
    width:'100%',
    paddingHorizontal: 10,
  },
  ButtonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
    borderRadius: 20,
    marginTop: 20,
    width: '100%',
    paddingVertical: 10,
  },
  buttonDisabled: {
    backgroundColor: '#A5D6A7',
  },
  ButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontFamily: 'Poppins',
  },
  ForgetButton: {
    color: "#181BCF",
    marginTop: 10,
    fontWeight: 'bold',
  },
  FooterContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  CreateButton: {
    color: '#181BCF',
    fontWeight: 'bold',
    marginLeft: 5,
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 40,
    borderRadius: 75,
  },
  logoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width : '100%',
    borderColor: '#ddd',
    marginVertical: 20,
  },
  HideShow: {
    position : 'absolute',
    right :5,
    bottom : 1
  },
});

export default Login;
