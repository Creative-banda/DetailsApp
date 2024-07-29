import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

import Login from './screens/LoginScreen';
import Home from './screens/HomeScreen';
import DetailScreen from './screens/DetailScreen';
import ClassTimings from './screens/ClassTiming';
import AutoLogin from './components/autologin';

const Stack = createStackNavigator();

const App = () => {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState(null);
  const [fontsLoaded, setFontsLoaded] = useState(false);

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('token');
      setUser(null);
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const loadFonts = async () => {
    await Font.loadAsync({
      'Ubuntu': require('./assets/fonts/Ubuntu-Bold.ttf'),
      'Poppins': require('./assets/fonts/Poppins-Bold.ttf'),
    });
  };

  useEffect(() => {
    async function prepare() {
      try {
        await SplashScreen.preventAutoHideAsync();
        await loadFonts();
      } catch (e) {
        console.warn(e);
      } finally {
        setFontsLoaded(true);
        await SplashScreen.hideAsync();
      }
    }

    prepare();
  }, []);

  if (initializing) {
    return <AutoLogin setUser={setUser} setInitializing={setInitializing} />;
  }

  if (!fontsLoaded) {
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={user ? "Home" : "Login"}>
        <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
        <Stack.Screen name="Home" options={{ headerShown: false }}>
          {props => <Home {...props} setUser={setUser} />}
        </Stack.Screen>
        <Stack.Screen name="DetailScreen" options={{ headerShown: false }}>
          {props => <DetailScreen {...props} logout={logout} />}
        </Stack.Screen>
        <Stack.Screen name="ClassTimings" component={ClassTimings} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
