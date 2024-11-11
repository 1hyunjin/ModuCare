import React from 'react';
import {useLatestProductQuery} from '../../quires/useProductQuery';
import {useNavigation} from '@react-navigation/native';
import MyCarousel from './CarouselCard';
import {Linking} from 'react-native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

type RootStackParamList = {
  challenge: undefined;
  stress: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function MainCarousel() {
  const navigation = useNavigation<NavigationProp>();
  const {data: latestProductData} = useLatestProductQuery();

  // 메인 캐러셀은 여기서 저장
  const CarouselData = [
    {
      id: 1,
      title: '최신 챌린지',
      img: require('../../assets/img/Challenge.png'),
      buttonLabel: '보러가기',
      buttonOnPress: () => {
        navigation.navigate('challenge');
      },
    },
    {
      id: 2,
      title: '스트레스 진단',
      img: require('../../assets/img/StressCheck.png'),
      buttonLabel: '보러가기',
      buttonOnPress: () => {
        navigation.navigate('stress');
      },
    },
    {
      id: 3,
      title: '최근 본 상품',
      img: latestProductData
        ? {uri: latestProductData.imgSrc}
        : require('../../assets/img/ProductIcon.png'),
      buttonLabel: latestProductData ? '보러가기' : '최근 본 상품이 없어요',
      buttonOnPress: () => {
        if (latestProductData) {
          Linking.openURL(latestProductData.link);
        } else {
          console.log('최근 본 상품이 없어요!');
        }
      },
    },
  ];

  return <MyCarousel data={CarouselData} isMain={true} />;
}
