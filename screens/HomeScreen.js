import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet, Alert, Image, Animated, Modal } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { StatusBar } from 'expo-status-bar';
import PropTypes from 'prop-types';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreen = ({ navigation, setUser }) => {
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const headerAnim = useRef(new Animated.Value(-300)).current;

  useEffect(() => {
    Animated.timing(headerAnim, {
      toValue: 0,
      duration: 1000,
      useNativeDriver: true,
    }).start();

  }, []);

  const handleLogout = async () => {
    try {
      setLoading(true);
      await AsyncStorage.multiRemove(['userLoggedIn', 'username', 'password', 'token']);
      setUser(null);
      navigation.replace('Login');
    } catch (error) {
      console.error('Error logging out:', error);
      Alert.alert('Logout Failed', 'An error occurred while logging out. Please try again.');
    } finally {
      setLoading(false);
      setModalVisible(false);
    }
  };


  const handleDetails = () => {
    navigation.navigate('DetailScreen');
  };

  const handleTiming = () => {
    navigation.navigate('ClassTimings');
  };

  return (
    <LinearGradient colors={['#ffffff', '#f0f0f0']} style={styles.container}>
      <View style={[styles.circle, styles.circle1]}></View>
      <View style={[styles.circle, styles.circle2]}></View>
      <StatusBar style="dark" />
      <Animated.View style={[styles.header, { transform: [{ translateX: headerAnim }] }]}>
        <Text style={styles.headerText}>Home Screen</Text>
        <TouchableOpacity style={styles.logoutButton} onPress={() => setModalVisible(true)}>
          <Text style={styles.logoutButtonText}>Logout</Text>
          <Icon name="log-out-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </Animated.View>

      <View style={styles.logoContainer}>
        <Image source={require('../assets/icon.png')} style={styles.logo} />
        <Text style={styles.welcomeText}>Check Out OIS Details</Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleTiming}>
          <Text style={styles.buttonText}>View Class Timings</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.buttonBlue} onPress={handleDetails}>
          <Text style={styles.buttonText}>Principal Details</Text>
        </TouchableOpacity>
      </View>

      {loading && (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color="#fff" />
        </View>
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Confirm Logout</Text>
            <Image source={require('../assets/logout_icon.png')} style={styles.logout_logo} />
            <Text style={styles.modalMessage}>Are you sure you want to logout?</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity style={[styles.modalButton, styles.confirmButton]} onPress={handleLogout}>
                <Text style={styles.modalButtonText}>Yes</Text>
              </TouchableOpacity>


              <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={() => setModalVisible(false)}>
                <Text style={styles.modalButtonText}>No</Text>
              </TouchableOpacity>

            </View>
          </View>
        </View>
      </Modal>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Built by STEM Team of Orchids</Text>
      </View>
    </LinearGradient>
  );
};

HomeScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
  setUser: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    position: 'relative',
  },
  circle: {
    position: 'absolute',
    opacity: 0.3,
  },
  circle1: {
    width: 300,
    height: 300,
    borderRadius: 150,
    top: -100,
    left: -50,
    backgroundColor: '#46D6AA',
  },
  circle2: {
    width: 300,
    height: 300,
    borderRadius: 150,
    bottom: -100,
    right: -80,
    backgroundColor: '#46D6AA',
  },
  header: {
    marginTop: 60,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    fontFamily: 'Ubuntu',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#344955',
    fontSize: 30,
    fontFamily: 'Ubuntu',
    fontWeight: '600',
  },
  logoutButton: {
    flexDirection: 'row',
    backgroundColor: '#FF686B',
    padding: 10,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#fff',
    marginRight: 5,
    fontWeight: 'bold',
    fontFamily: 'Poppins',
  },
  logoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 150,
    height: 150,
  },

  logout_logo: {
    width: 150,
    height: 150,
    marginBottom: 10
  },
  welcomeText: {
    marginTop: 20,
    fontSize: 22,
    fontWeight: 'bold',
    color: '#344955',
    textAlign: 'center',
    fontFamily: 'Poppins',
    fontWeight: '600',
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  button: {
    width: '80%',
    paddingVertical: 15,
    borderRadius: 25,
    backgroundColor: '#66BFBF',
    alignItems: 'center',
    marginBottom: 20,
    elevation: 3,
  },
  buttonBlue: {
    width: '80%',
    paddingVertical: 15,
    borderRadius: 25,
    backgroundColor: '#4D9DE0',
    alignItems: 'center',
    marginBottom: 20,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Poppins',
  },
  loading: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -25 }, { translateY: -25 }],
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#344955',
  },
  modalMessage: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
    color: '#344955',
    fontWeight:'600'
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 10,
    marginHorizontal: 5,
    borderRadius: 5,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#E05744',
  },
  confirmButton: {
    backgroundColor: '#3ADB6B',
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  footer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    backgroundColor: '#C7C7C7',
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  footerText: {
    color: '#000000',
    fontSize: 18,
    fontFamily: 'Poppins',
    fontWeight: '500',
  }
});

export default HomeScreen;