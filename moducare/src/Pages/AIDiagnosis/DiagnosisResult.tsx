import React, {useEffect, useState} from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {colors} from '../../constants/colors';
import CustomButtom from '../../Components/Common/CustomButton';
import CustomText from '../../Components/Common/CustomText';
import SvgIconAtom from '../../Components/Common/SvgIconAtom';
import {BarChart, barDataItem} from 'react-native-gifted-charts';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import {RootStackParamList} from '../../navigate/StackNavigate';
import {
  NavigationProp,
  RouteProp,
  useNavigation,
} from '@react-navigation/native';
import {useReportDetailQuery} from '../../quires/useReportsQuery';
import {graphData, getHeadType, getComparisonText} from './resultClass';
import {ResponseAiDiagnosis} from '../../api/ai-api';
import {getEncryptStorage} from '../../util';
type userInfo = {
  name: string;
  birth: string;
  email: string;
};
const DiagnosisResult = ({
  route,
}: {
  route: RouteProp<RootStackParamList, 'aiResult'>;
}) => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const {type, id, diagnosisResult} = route.params;
  const {data: diagnosisData} = useReportDetailQuery(id ?? 0, {
    enabled: type === 'report',
  });
  // const resultData = type === 'diagnosis' ? diagnosisResult : diagnosisData;
  const [resultData, setResultData] = useState<ResponseAiDiagnosis>();
  const [data, setData] = useState<barDataItem[]>([]);
  const [headType, setHeadType] = useState<number>(0);
  const [comparisonText, setComparisonText] = useState<number>(0);

  const careText: string = `첫째, 두피를 깨끗하게 유지하려면 적어도 주 2-3회 샴푸로 세척해줘야 해요. 둘째, 너무 뜨거운 물보다는 미지근한 물을 사용하는 게 좋아요. 셋째, 각질 제거를  위해 주 1회 스크럽이나 두피 마스크를 사용해보세요.\n
또한, 두피도 보습이 필요하니까 두피 전용 오일이나 세럼을 사용해 보습해주는 게 좋고요. 건강한 모발을 위해 균형 잡힌 식사를 하고, 스트레스는 운동이나 명상으로 관리해보세요. 자외선 차단도 잊지 말고, 마지막으로 두피 마사지를 통해 혈액순환을 촉진해주면 도움이 됩니다.`;

  const yAxisTextStyle = {
    fontSize: 12,
    color: '#888',
  };

  const [Info, setInfo] = useState<userInfo>();
  useEffect(() => {
    const getInfo = async () => {
      try {
        const {name, birth, email} = await getEncryptStorage('info');
        // birth && setb
        setInfo(prevInfo => ({
          ...prevInfo,
          name,
          birth,
          email,
        }));
      } catch (error) {
        console.log(error);
      }
    };

    if (type === 'diagnosis') {
      setResultData(diagnosisResult);
    } else {
      setResultData(diagnosisData);
    }
    getInfo();
  }, [type, diagnosisResult, diagnosisData]);

  useEffect(() => {
    if (!resultData) return;

    setData(graphData(resultData.result));
    setHeadType(resultData.headType);
    setComparisonText(resultData.comparison);
  }, [resultData]);

  // pdf
  const htmlContent = `
  <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; }
        p { font-size: 15px; }
		h2 {
          display : flex;
          justify-content: center;
          align-items: center;
          font-size: 40px;
        }
        h3{
         font-size: 30px;   
        }
        h4 {
          font-size: 20px;
        }
        span {
          color : #946038;
        }
        @page {
          margin: 2cm;  // 모든 페이지에 대한 기본 여백 설정
        }
        
        body { 
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 0;
        }
        #paper {
          width: 21cm;
          min-height: 29.7cm;
          padding: 1.5cm;
          page-break-after: always;  // 페이지 나눔 시 처리
        }

        #paper::before {
          content: "";
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(-30deg);
          background-image: url('https://moducare.s3.ap-northeast-2.amazonaws.com/uploads/Logo_spell.png');
          background-repeat: no-repeat;
          background-position: center;
          background-size: 300px;
          width: 100%;
          height: 100%;
          opacity: 0.1;
          z-index: -1;   
          pointer-events: none;
        }

        .RecommendContainer, 
        #pictureContainer,
        #result-graph {
          margin-top: 2cm;
          margin-bottom: 2cm;
        }

        #pictureContainer {
  			display: flex;  /* Flexbox 사용 */
  			justify-content: space-around; /* 양쪽 정렬 */
  			align-items: center; /* 세로 중앙 정렬 */
            gap: 20px;
		}
        
        #pictureContainer div {
          display : flex;
          flex-direction : column;
          align-items: center;
        }
        
        #pictureContainer div {
          display : flex;
          flex-direction : center;
          align-items: center;
        }
  		#result-graph {
  		 display: flex;
  		 flex-direction: row; /* 가로 방향 정렬 */
  		 justify-content: center; /* 중앙 정렬 */
  		 align-items: flex-end; /* 아래쪽 정렬 (막대 그래프처럼 보이도록) */
  		 gap: 50px; /* 막대 사이의 간격 */
		}
  		#result-graph .gb {
  		 display: flex;
  		 flex-direction: column;
  		 align-items: center;
		}        
		#result-graph .bar {
 	 	 width: 30px;
  		 background-color: #72635A; /* 막대 기본 색상 */
  		 border-radius: 5px;
		}

        #pictureContainer img {
          height : 300px;
          border-radius : 10px;
          width : 350px;
        }
        #recommend-text {
  		 display: flex;
         flex-direction: column; /* 가로 방향 정렬 */
  		 align-items: center;
         justify-content:center;
        }
        .manage-comment {
          white-space: pre-line;  // 줄바꿈 보존
          line-height: 1.5;       // 줄간격 조정
        }
      </style>
    </head>
    <body>
      <div id='paper'>
		<h2>
          ModuCare 두피 진단 결과지
      </h2>
      <div id="pictureContainer">
        <div>
          <h3>
            사용자 정보
          </h3>
           <h4>
            사용자 이름 : ${Info?.name}
             <br>
            생년월일 : ${Info?.birth || ''}
             <br>
            이메일 : ${Info?.email || ''}
             <br>
            진단일시 : ${resultData?.date}
          </h4>
        </div>
        <div>
 
          <img class="picture diagnosis" src="${resultData?.img}" alt="...">
        </div>
      </div>
      <div id="pictureContainer">
          <h3>AI 두피 진단 결과 <span>${getHeadType(
            headType,
          )}</span>입니다.</h3>
      </div>
      <div id="result-graph"> 
        <div class="gb">
          <div>
           ${resultData?.result[0]}
          </div>
          <div class="bar tm" style="height: ${
            (resultData?.result[0] ?? 0) * 50
          }px;"></div>
          <h5>
            탈모
          </h5>
        </div>
        <div class="gb">
          <div>
           ${resultData?.result[1]}
          </div>
          <div class="bar bd" style="height: ${
            (resultData?.result[1] ?? 0) * 50
          }px;"></div>
          <h5>
            비듬
          </h5>
        </div>
        <div class="gb">
          <div>
           ${resultData?.result[2]}
          </div>
          <div class="bar yj" style="height: ${
            (resultData?.result[2] ?? 0) * 50
          }px;"></div>
          <h5>
            염증
          </h5>
        </div>
        <div class="gb">
          <div>
           ${resultData?.result[3]}
          </div>
          <div class="bar hb" style="height: ${
            (resultData?.result[3] ?? 0) * 50
          }px;"></div>
          <h5>
            홍반
          </h5>
        </div>
        <div class="gb">
          <div>
           ${resultData?.result[4]}
          </div>
          <div class="bar pj" style="height: ${
            (resultData?.result[4] ?? 0) * 50
          }px;"></div>
          <h5>
            피지
          </h5>
        </div>
        <div class="gb">
          <div>
           ${resultData?.result[5]}
          </div>
          <div class="bar gj" style="height: ${
            (resultData?.result[5] ?? 0) * 50
          }px;"></div>
          <h5>
            각질
          </h5>
        </div>
      </div>
      <div class="RecommendContainer">
        <h4>
          MODU가 관찰한 최근 두피 검사 결과
        </h4>
        <h3>
		 <span>${getComparisonText(comparisonText)}</span>
        </h3>
        <div id="recommend-text">
           	<img style="width: 200px;" class="picture" src="https://moducare.s3.ap-northeast-2.amazonaws.com/uploads/Bot_smiling.png" alt="...">
        </div>
        <h2> MODU가 추천하는 관리비결 </h2>
             <h4 class="manage-comment">
             ${resultData?.manageComment || careText}
             </h4>
             </div>
      </div>
      </div>
    </body>
  </html>
`;
  const generatePDF = async () => {
    try {
      const options = {
        html: htmlContent,
        fileName: `MODUCARE_${Info?.name}_${resultData?.date}`, // PDF 파일 이름
        directory: 'Download', // 파일이 저장될 디렉토리 (기본값은 documents)
      };

      // PDF 생성
      const file = await RNHTMLtoPDF.convert(options);

      // 생성된 PDF 파일 경로 출력
      console.log('PDF 파일 경로:', file.filePath);
    } catch (error) {
      console.error('PDF 생성 오류:', error);
    }
  };
  //
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingHorizontal: 5}}>
        <View style={styles.photoArea}>
          <View style={styles.photoDetailArea}>
            <CustomText label="제공된 두피 사진" size={20} />
            <Image style={styles.photo} source={{uri: resultData?.img}} />
          </View>
          <View style={styles.photoDetailArea}>
            <CustomText label="건강한 두피 사진" size={20} />
            <Image
              style={styles.photo}
              source={require('../../assets/good.png')}
            />
          </View>
        </View>
        <View style={{alignItems: 'center', marginBottom: 20}}>
          <Text style={styles.checkText}>
            AI 두피 진단 결과
            <Text style={styles.checkResult}> {getHeadType(headType)} </Text>
            입니다.
          </Text>
        </View>
        <CustomText label={'두피 상세 분석'} size={16} />
        <View style={styles.ResultGraph}>
          <BarChart
            // 기본
            data={data}
            width={300}
            maxValue={3}
            height={200}
            disablePress // 누루기 동작 비활성화
            // bar
            // initialSpacing={20} // 초기 간격
            // spacing={30} // bar 간격
            barBorderRadius={2}
            // barWidth={12} // bar width
            frontColor={colors.MAIN} // bar 색상
            // x축
            xAxisIndicesColor={'#D9D9D9'} // x축 단계별 표시 색상
            xAxisColor={'#d9d9d9'} // x축 색상
            // y축
            yAxisTextStyle={yAxisTextStyle}
            yAxisThickness={0} // 메인 y축
            noOfSections={3} // 가로 회색줄 갯수
            isAnimated
          />
        </View>
        <View style={styles.checkArea}>
          <View style={{width: '100%'}}>
            <CustomText label="MODU가 관찰한 최근 두피 검사 결과" size={20} />
            <Text style={styles.checkResult}>
              {getComparisonText(comparisonText)}
            </Text>
          </View>
          <SvgIconAtom name="Good" />
        </View>
        <View style={styles.careArea}>
          <CustomText label="MODU가 추천하는 관리비결" size={20} />
          <Text style={styles.careText}>
            {resultData?.manageComment || careText}
          </Text>
        </View>
        <View style={styles.BtnArea}>
          <CustomButtom
            label="나에게 맞는 샴푸 확인하기"
            onPress={() =>
              navigation.navigate('aiPick', {
                type: resultData?.headType ?? 0,
                result: resultData?.result ?? [],
              })
            }
          />
          <CustomButtom label="두피 검진 문서 생성" onPress={generatePDF} />
          <CustomButtom
            label="메인으로"
            onPress={() => navigation.navigate('bottomNavigate')}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.WHITE,
    // alignItems: 'center',
    padding: 15,
  },

  photoArea: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
  },
  photoDetailArea: {
    width: '50%',
    alignItems: 'center',
  },
  photo: {
    width: '100%',
    resizeMode: 'cover',
    height: 150,
    borderRadius: 10,
    marginVertical: 10,
  },

  checkArea: {
    width: '100%',
    alignItems: 'center',
    gap: 20,
  },
  checkText: {
    fontSize: 20,
    fontFamily: 'Pretendard-Bold',
    color: colors.BLACK,
  },
  checkResult: {
    fontSize: 25,
    fontFamily: 'Pretendard-ExtraBold',
    color: colors.MAIN,
  },

  careArea: {
    width: '100%',
    alignItems: 'flex-start',
    marginVertical: 20,
  },
  careText: {
    fontSize: 15,
    fontFamily: 'Pretendard-Medium',
    color: colors.BLACK,
  },

  BtnArea: {
    width: '100%',
    paddingHorizontal: 10,
    gap: 10,
  },
  ResultGraph: {
    gap: 10,
    marginVertical: 20,
    flexDirection: 'row',
    alignSelf: 'center',
    justifyContent: 'center',
  },
});

export default DiagnosisResult;