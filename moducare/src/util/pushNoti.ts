import notifee, {AndroidImportance} from '@notifee/react-native';
import {colors} from '../constants/colors';
import {Linking} from 'react-native';
const displayNotification = async message => {
  const channelAnoucement = await notifee.createChannel({
    id: 'default',
    name: '카테고리 이름',
    importance: AndroidImportance.HIGH,
  });

  await notifee.displayNotification({
    title: message.data.title,
    body: message.data.body,
    android: {
      channelId: channelAnoucement,
      smallIcon: 'ic_app',
      largeIcon: 'ic_launcher',
      color: colors.MAIN,
      sound: 'sound',
    },
  });

  // 알림 클릭 시 딥링크를 통해 페이지로 이동
  if (message.data.deepLink) {
    // 알림 클릭 시 딥링크 URL을 열기
    console.log('클릭', message.data.deepLink);
    Linking.openURL(message.data.deepLink);
  }
};

export default {
  dispayNoti: remoteMessage => displayNotification(remoteMessage),
};
