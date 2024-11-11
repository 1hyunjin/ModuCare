import * as React from 'react';
import {View, StyleSheet, ScrollView, Image, Dimensions} from 'react-native';
import ItemBox from '../Components/ItemBox/ItemBox';
import CustomText from '../Components/Common/CustomText';
import CustomButton from '../Components/Common/CustomButton';
import {colors} from '../constants/colors';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import SmallList from '../Components/Challenge/SmallList';
import WeatherInfo from '../Components/Weather/WeatherInfo';
import MainCarousel from '../Components/Carousel/MainCarousel';
import {getMyChallengeList, getMyListType} from '../api/challenge-api';
import {RootStackParamList} from '../navigate/StackNavigate';
import {setEncryptStorage} from '../util';

const WINDOW_WIDTH = Dimensions.get('window').width;
const WINDOW_HEIGHT = Dimensions.get('window').height;
export default function MainPage() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [myList, setMyList] = React.useState<getMyListType[] | []>([]);

  const handleMoveFeedPage = (data: getMyListType) => {
    setEncryptStorage('isDone', data.isDone);
    navigation.navigate('challenge_feed', {
      id: data.challengeId,
      title: data.challengeName,
      type: 'myChallenge',
    });
  };

  const getListCompo = async () => {
    const myData = await getMyChallengeList();
    setMyList(myData);
  };
  useFocusEffect(
    React.useCallback(() => {
      getListCompo();
    }, []),
  );

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
              <ScrollView
                showsVerticalScrollIndicator={false}
                nestedScrollEnabled={true}>
                {myList.length !== 0 ? (
                  myList.map((data, index) => (
                    <SmallList
                      key={index}
                      title={data.challengeName}
                      uri={data.challengeImg}
                      isFinish={data.isDone}
                      onPress={() => handleMoveFeedPage(data)}
                    />
                  ))
                ) : (
                  <CustomText label="진행중인 챌린지가 없어요" />
                )}
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
    height: WINDOW_HEIGHT * 0.2,
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
