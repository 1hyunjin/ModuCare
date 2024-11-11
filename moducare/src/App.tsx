import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import RootNavigate from './navigate/RootNavigate';
import {QueryClientProvider} from '@tanstack/react-query';
import queryClinet from './util/queryClient';
import messaging from '@react-native-firebase/messaging';
import pushNoti from './util/pushNoti';
import notifee, {AuthorizationStatus} from '@notifee/react-native';
import {setEncryptStorage} from './util';
import {Linking} from 'react-native';

const DEEPLINK_PREFIX_URL = ['moducare://'];

const deepLinksConfig = {
  screens: {
    MainPage: 'main',
    bottomNavigate: {
      screens: {
        챌린지: '챌린지',
      },
    },
    ai: 'ai',
  },
};

const linking = {
  prefixes: DEEPLINK_PREFIX_URL,
  config: deepLinksConfig,
  async getInitialURL() {
    const url = await Linking.getInitialURL();
    if (url != null) {
      return url;
    }
  },
};

messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('[Background Remote Message]', remoteMessage);
  pushNoti.dispayNoti(remoteMessage);
});

export default function App() {
  const requestNotificationPermission = async () => {
    // 사용자에게 알림 권한 허용을 요청한다, 설정된 권한 상태를 반환한다
    const settings = await notifee.requestPermission();

    // 권한 상태는 settings.authorizationStatus로 확인할 수 있다
    if (settings.authorizationStatus >= AuthorizationStatus.DENIED) {
      return true;
    } else {
      return false;
    }
  };
  const getFcmToken = async () => {
    const fcmToken = await messaging().getToken();
    console.log('[FCM Token] ', fcmToken);
    setEncryptStorage('fcmToken', fcmToken);
  };

  React.useEffect(() => {
    requestNotificationPermission();
    getFcmToken();
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      // console.log('[Remote Message] ', JSON.stringify(remoteMessage));
      pushNoti.dispayNoti(remoteMessage);
    });

    return unsubscribe;
  }, []);

  return (
    <QueryClientProvider client={queryClinet}>
      <NavigationContainer linking={linking}>
        <RootNavigate />
      </NavigationContainer>
    </QueryClientProvider>
  );
}
