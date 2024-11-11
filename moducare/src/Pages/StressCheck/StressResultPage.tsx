import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Dimensions, Image, SafeAreaView} from 'react-native';
import {useNavigation, RouteProp} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import ConfirmMark from '../../Components/Common/confirmMark';
import {colors} from '../../constants/colors';
import CustomButton from '../../Components/Common/CustomButton';
import CustomText from '../../Components/Common/CustomText';
import {LineChart} from 'react-native-gifted-charts';
import {getResult, ResultData} from '../../api/stress-check-api';
import {getEncryptStorage} from '../../util';
import {RootStackParamList} from '../../navigate/StackNavigate';
const HEIGHT = Dimensions.get('window').height;
const WIDTH = Dimensions.get('window').width;

export default function StressResultPage({
  route,
}: {
  route: RouteProp<RootStackParamList, 'StressResultPage'>;
}) {
  const [userName, setUserName] = useState('');
  const [isDone, setIsDone] = useState(false);
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const {stressScore} = route.params;
  const [resultData, setResultData] = useState<ResultData[]>([]);

  useEffect(() => {
    const getUserName = async () => {
      const userInfo = await getEncryptStorage('info');
      setUserName(userInfo.name);
    };
    const fetchResultData = async () => {
      const result = await getResult();
      setResultData(result);
    };
    getUserName();
    fetchResultData();
  }, []);

  const getStressImage = (score: number) => {
    if (score >= 20) {
      return require('../../assets/img/Red.png');
    } else if (score >= 13) {
      return require('../../assets/img/Yellow.png');
    } else if (score >= 6) {
      return require('../../assets/img/Green.png');
    } else {
      return require('../../assets/img/Blue.png');
    }
  };
  const handleButtonPress = () => {
    if (!isDone) {
      setIsDone(true);
    } else {
      navigation.navigate('bottomNavigate');
    }
  };

  return (
    <SafeAreaView style={style.container}>
      {!isDone ? (
        <View style={style.DonePage}>
          <ConfirmMark />
          <View style={style.TextContainer}>
            <CustomText
              label={'스트레스 자가진단 결과지가 생성되었어요.'}
              size={18}
            />
            <CustomText label={'바로 확인해 보세요.'} size={18} />
          </View>
        </View>
      ) : (
        <View style={style.ResultPage}>
          <View style={style.ResultTitle}>
            <CustomText
              label={'스트레스 자가 진단 결과지'}
              size={20}
              variant="bold"
            />
          </View>
          <View style={style.ResultContent}>
            <CustomText
              label={`${userName} 님의 스트레스 자가 진단 점수는`}
              size={20}
            />
            <View style={style.ResultScore}>
              <CustomText label={'총점 :'} size={30} variant="bold" />
              <CustomText
                label={`${stressScore} 점`}
                size={30}
                variant="bold"
                color="#AB9385"
              />
            </View>
            <View>
              <Image source={getStressImage(stressScore)} />
            </View>
            <View>
              <View style={style.ResultText}>
                <View style={style.ResultTextHeader}>
                  <CustomText
                    label={'0 ~ 5점 '}
                    size={15}
                    variant="regular"
                    color="#AB9385"
                  />
                </View>
                <CustomText
                  label={': 평균 이하로 특별한 문제가 없어요!'}
                  size={15}
                  variant="regular"
                />
              </View>
              <View style={style.ResultText}>
                <View style={style.ResultTextHeader}>
                  <CustomText
                    label={'6 ~ 12점  '}
                    size={15}
                    variant="regular"
                    color="#AB9385"
                  />
                </View>
                <CustomText
                  label={': 직장을 가진 성인 평균이에요!'}
                  size={15}
                  variant="regular"
                />
              </View>
              <View style={style.ResultText}>
                <View style={style.ResultTextHeader}>
                  <CustomText
                    label={'13 ~ 19점 '}
                    size={15}
                    variant="regular"
                    color="#AB9385"
                  />
                </View>
                <CustomText
                  label={': 조금 높아요~ 스트레스 관리에 신경쓰세요!'}
                  size={15}
                  variant="regular"
                />
              </View>
              <View style={style.ResultText}>
                <View style={style.ResultTextHeader}>
                  <CustomText
                    label={'20점 이상 '}
                    size={15}
                    variant="regular"
                    color="#AB9385"
                  />
                </View>
                <CustomText
                  label={': 위험해요! 스트레스는 두피에게는 적입니다!'}
                  size={15}
                  variant="regular"
                />
              </View>
            </View>
            <View style={style.ResultGraph}>
              <CustomText label={'최근 7건 검사결과'} variant="regular" />
              <LineChart
                initialSpacing={20}
                data={resultData}
                width={WIDTH * 0.75}
                hideRules={true}
                thickness={1}
                hideYAxisText
                textColor={colors.BLACK}
                textFontSize={12}
                textShiftY={-10}
                textShiftX={-3}
              />
            </View>
          </View>
        </View>
      )}
      <View style={style.ButtonContainer}>
        <CustomButton
          label={isDone ? '메인으로' : '확인'}
          size="large"
          onPress={() => handleButtonPress()}
        />
      </View>
    </SafeAreaView>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.WHITE,
  },
  DonePage: {
    top: HEIGHT * 0.3,
    alignSelf: 'center',
    gap: 40,
    width: '80%',
  },
  ResultPage: {
    flex: 1,
    alignItems: 'center',
  },
  ResultTitle: {
    marginTop: 30,
    marginBottom: HEIGHT * 0.1,
  },
  TextContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  ResultContent: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
  },
  ButtonContainer: {
    width: '80%',
    alignSelf: 'center',
    position: 'absolute',
    bottom: 50,
  },
  ResultScore: {
    flexDirection: 'row',
    gap: 10,
  },
  ResultText: {
    flexDirection: 'row',
  },
  ResultTextHeader: {
    width: WIDTH * 0.15,
  },
  ResultGraph: {
    gap: 10,
    marginEnd: 30,
  },
});
