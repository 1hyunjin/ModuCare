import AuthStackNavigate from './AuthStackNavigate';
import StackNavigate from './StackNavigate';
import React, {useEffect} from 'react';
import useAuthStore from '../store/useAuthStore';
<<<<<<< HEAD
import {setupInterceptors} from '../util/headers';
const RootNavigate = () => {
  // 앱 시작 시 토큰 소지 여부를 인터셉터로 확인
  useEffect(() => {
    const checkToken = async () => {
      const isSuccess = await setupInterceptors();
      if (isSuccess) {
        useAuthStore.getState().setIsLoggedIn(true);
        console.log('토큰 설정 성공');
      }
    };
    checkToken();
  }, []);

  return (
    <>
      {useAuthStore.getState().isLoggedIn ? (
        <StackNavigate />
      ) : (
        <AuthStackNavigate />
      )}
    </>
  );
=======
import useAuth from '../hook/useAuth';
import SplashScreen from 'react-native-splash-screen';
const RootNavigate = () => {
  // const {isLoggedIn} = useAuthStore(state => state as {isLoggedIn: boolean});

  // return <>{isLoggedIn ? <StackNavigate /> : <AuthStackNavigate />}</>;

  const {isLogin, isLoginLoading} = useAuth();

  useEffect(() => {
    if (!isLoginLoading) {
      setTimeout(() => {
        SplashScreen.hide();
      }, 500);
    }
  }, [isLoginLoading]);

  return <>{isLogin ? <StackNavigate /> : <AuthStackNavigate />}</>;
>>>>>>> 2b7dfb09b9dd445a3407478bc174cfcba480c8de
};

export default RootNavigate;
