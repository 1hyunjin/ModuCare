import * as React from 'react';
import {View, StyleSheet, ScrollView, Image, Dimensions} from 'react-native';
import ItemBox from '../Components/ItemBox/ItemBox';
import CustomText from '../Components/Common/CustomText';
import CustomButton from '../Components/Common/CustomButton';
import {colors} from '../constants/colors';
import {useNavigation} from '@react-navigation/native';
import SmallList from '../Components/Challenge/SmallList';
import WeatherInfo from '../Components/Weather/WeatherInfo';
import MainCarousel from '../Components/Carousel/MainCarousel';

const WINDOW_WIDTH = Dimensions.get('window').width;
const WINDOW_HEIGHT = Dimensions.get('window').height;
export default function MainPage() {
  const navigation = useNavigation<any>();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.contentContainer}>
        <View style={styles.headerTextContainer}>
          <CustomText label="두피 사진을 통하여" size={20} />
          <CustomText label="AI가 두피 상태를 확인해 드려요." size={20} />
        </View>
        <Image
          style={styles.helloImage}
          source={require('../assets/img/MainCharacter.png')}
        />

        <CustomButton
          label="AI 자가 진단 시작"
          size="large"
          onPress={() => navigation.navigate('ai')}
        />
        <WeatherInfo />
        <ItemBox>
          <CustomText label="진행중인 챌린지 정보" size={20} />
          <View style={styles.challengeBox}>
            <View style={styles.challengeBoxItem}>
              <ScrollView showsVerticalScrollIndicator={false}>
                <SmallList isFinish={true} />
                <SmallList isPhoto={true} />
                <SmallList />
              </ScrollView>
            </View>
          </View>
        </ItemBox>

        <View>
          <MainCarousel />
        </View>
        <View style={{height: WINDOW_HEIGHT * 0.1}} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  contentContainer: {
    margin: 20,
    alignItems: 'center',
    gap: 20,
  },
  headerTextContainer: {
    marginStart: 20,
    alignSelf: 'flex-start',
  },
  headerText: {
    fontSize: 20,
    marginStart: 20,
    fontWeight: 'bold',
  },
  boxHeaderText: {
    fontSize: 20,

    fontWeight: 'bold',
  },
  helloImage: {
    width: 200,
    height: 200,
  },
  startButton: {
    width: WINDOW_WIDTH * 0.9,
  },
  weatherBoxImage: {
    width: 70,
    height: 70,
  },
  weatherBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 20,
  },
  weatherBoxItem: {
    alignItems: 'center',
    gap: 5,
  },
  challengeBox: {
    height: WINDOW_HEIGHT * 0.17,
    gap: 10,
    margin: 10,
  },
  challengeBoxItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  challengeBoxImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  challengeBoxText: {
    marginStart: 10,
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.BLACK,
  },
  challengeBoxArrow: {
    marginLeft: 'auto',
  },
});
