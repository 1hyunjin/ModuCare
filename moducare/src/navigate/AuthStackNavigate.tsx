import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import LoginPage from '../Pages/LoginPage';
import KakaoLoginPage from '../Pages/KakaoLoginPage';
import OkPage from '../Pages/OkPage';
import NaverLoginButton from '../Pages/NaverLoginPage';

const AuthStackNavigate = () => {
  const Stack = createStackNavigator();
  return (
    <Stack.Navigator initialRouteName="login">
      {/* <Stack.Screen
        name="splash"
        component={SplashPage}
        options={{headerShown: false, animationEnabled: false}}
      /> */}
      <Stack.Screen
        name="login"
        component={LoginPage}
        options={{headerShown: false, animationEnabled: false}}
      />
      <Stack.Screen
        name="kakaoLogin"
        component={KakaoLoginPage}
        options={{headerShown: false, animationEnabled: true}}
      />
      <Stack.Screen
        name="ok"
        component={OkPage}
        options={{headerShown: false, animationEnabled: true}}
      />
      <Stack.Screen
        name="naverLogin"
        component={NaverLoginButton}
        options={{headerShown: false, animationEnabled: true}}
      />
      {/* <Stack.Screen
        name="bottomNavigate"
        component={BottomNavBar}
        options={{headerShown: false, animationEnabled: false}}
      /> */}
    </Stack.Navigator>
  );
};

export default AuthStackNavigate;
