import React from 'react';
import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import SvgIconAtom from '../Components/Common/SvgIconAtom';
import {colors} from '../constants/colors';
import NaverLogin, {NaverLoginResponse} from '@react-native-seoul/naver-login';
import useAuthStore from '../store/useAuthStore';
import {getEncryptStorage} from '../util';
import {initializeKakaoSDK} from '@react-native-kakao/core';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import useAuth from '../hook/useAuth';

initializeKakaoSDK('585639d392d8089816cb2f337aea44d9');

const LoginPage = ({navigation}: {navigation: any}) => {
  const {loginMutation} = useAuth();

  const {setNaverLoginSuccess, setNaverLoginFailure} = useAuthStore(
    state =>
      state as {
        setNaverLoginSuccess: (
          value: NaverLoginResponse['successResponse'],
        ) => void;
        setNaverLoginFailure: (
          value: NaverLoginResponse['failureResponse'],
        ) => void;
      },
  );
  const onNaverLogin = async () => {
    const {failureResponse, successResponse} = await NaverLogin.login();
    setNaverLoginSuccess(successResponse);
    setNaverLoginFailure(failureResponse);
    if (successResponse) {
      const fcmToken = await getEncryptStorage('fcmToken');
      loginMutation.mutate({
        fcmToken,
        accessToken: successResponse.accessToken,
        registerId: 'naver',
      });
    } else {
      console.log('네이버 로그인 실패', failureResponse);
    }
  };

  const onGoogleLogin = async () => {
    await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true})
      .then(res => console.log('hasPlayServices', res))
      .catch(err => console.log('hasPlayServices', err));
    try {
      const userInfo = await GoogleSignin.signIn();
      const fcmToken = await getEncryptStorage('fcmToken');
      if (userInfo?.data?.idToken && fcmToken) {
        const accessToken = userInfo.data.idToken;
        loginMutation.mutate({
          fcmToken,
          accessToken,
          registerId: 'google',
        });
      }
    } catch (error: any) {
      console.log('Message', error.message);
    }
  };

  return (
    <>
      <SafeAreaView style={styles.container}>
        <View style={styles.mainArea}>
          <SvgIconAtom style={{margin: 'auto'}} name="Logo" />
          <View style={styles.btnArea}>
            <Pressable
              style={[styles.btn, styles.kakao]}
              onPress={() => navigation.navigate('kakaoLogin')}>
              <SvgIconAtom name="Kakao" />
              <Text style={styles.kakaoText}>카카오 로그인</Text>
              <View />
            </Pressable>
            {/* <Pressable
              style={[styles.btn, styles.naver]}
              onPress={() => navigation.navigate('naverLogin')}>
              <SvgIconAtom name="Naver" />
              <Text style={styles.naverText}>네이버 로그인 테스트</Text>
              <View />
            </Pressable> */}
            <Pressable
              style={[styles.btn, styles.naver]}
              onPress={onNaverLogin}>
              <SvgIconAtom name="Naver" />
              <Text style={styles.naverText}>네이버 로그인</Text>
              <View />
            </Pressable>
            <Pressable
              style={[styles.btn, styles.google]}
              onPress={onGoogleLogin}>
              <Image
                style={styles.googleImg}
                source={require('../assets/img/Google.png')}
              />
              <Text style={styles.googleText}>구글 로그인</Text>
              <View />
            </Pressable>
          </View>
        </View>
        <View style={styles.ImgArea}>
          <SvgIconAtom name="MainSVG" />
        </View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignContent: 'center',
    borderColor: 'red',
    backgroundColor: colors.WHITE,
  },
  mainArea: {
    flex: 0.9,
    justifyContent: 'flex-end',
  },
  btnArea: {
    marginVertical: 20,
    gap: 10,
  },
  btn: {
    height: 40,
    width: 250,
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderRadius: 10,
    margin: 'auto',
    elevation: 4,
  },
  kakaoText: {
    fontSize: 15,
    fontFamily: 'Pretendard-Bold',
    color: colors.BLACK,
    alignSelf: 'center',
  },
  naverText: {
    fontSize: 15,
    fontFamily: 'Pretendard-Bold',
    color: colors.WHITE,
    alignSelf: 'center',
  },
  kakao: {
    backgroundColor: '#FEE500',
  },
  naver: {
    backgroundColor: '#03C75A',
  },
  google: {
    borderColor: '#4285F4',
    borderWidth: 1,
    alignItems: 'center',
    gap: 20,
    backgroundColor: colors.WHITE,
  },
  googleImg: {
    width: 25,
    height: 25,
  },
  googleText: {
    fontSize: 15,
    fontFamily: 'Pretendard-Bold',
    color: colors.BLACK,
    alignSelf: 'center',
  },
  ImgArea: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default LoginPage;
