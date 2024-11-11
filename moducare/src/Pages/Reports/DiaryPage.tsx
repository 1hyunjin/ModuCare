import {
  View,
  StyleSheet,
  Pressable,
  Dimensions,
  Alert,
  Image,
} from 'react-native';
import React, {useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {colors} from '../../constants/colors';
import MyCarousel from '../../Components/Carousel/CarouselCard';
import CustomButton from '../../Components/Common/CustomButton';
import SlideModal from '../../Components/Common/SlideModal';
import SvgIconAtom from '../../Components/Common/SvgIconAtom';
import CustomText from '../../Components/Common/CustomText';
import {
  launchImageLibrary,
  ImageLibraryOptions,
} from 'react-native-image-picker';
import {
  useLineDiaryQuery,
  usePostHairImgMutation,
  useTopDiaryQuery,
} from '../../quires/useReportsQuery';
import PopupModal, {useAlert} from '../../Components/Common/PopupModal';

const WIDTH = Dimensions.get('window').width;

const options: ImageLibraryOptions = {
  selectionLimit: 1,
  mediaType: 'photo',
  includeBase64: false,
};

export default function DiaryPage() {
  const {data: lineDiaryData} = useLineDiaryQuery();
  const {data: topDiaryData} = useTopDiaryQuery();
  const {mutate: postHairImgMutation} = usePostHairImgMutation();
  const {showAlert} = useAlert();

  const [modalVisible, setModalVisible] = useState(false);
  const [isLine, setIsLine] = useState(false);
  const [imgType, setImgType] = useState<'line' | 'top'>();
  const [imgConfig, setImgConfig] = useState<any>(null);

  const openImageLibrary = async (type: 'line' | 'top') => {
    const images = await launchImageLibrary(options);
    if (images.assets) {
      setImgConfig(images);
      setImgType(type);
    }
  };

  const imageUpload = async () => {
    if (!imgConfig?.assets || !imgType) {
      showAlert('사진을 선택해주세요');
      return;
    }

    try {
      // 1. formData 생성
      const formData = new FormData();
      formData.append('file', {
        uri: imgConfig?.assets?.[0].uri,
        type: imgConfig?.assets?.[0].type,
        name: imgConfig?.assets?.[0].fileName,
      });

      // 2. 업로드 된 이미지 정보 전송
      await postHairImgMutation({formData, imgType});

      // 3. 초기화
      setImgType(undefined);
      setImgConfig(null);
      showAlert('사진이 업로드 되었습니다.');
      // 4. 모달 닫기
      setModalVisible(false);
    } catch (error) {
      console.error('이미지 업로드 실패:', error);
      showAlert('이미지 업로드에 실패했습니다.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <CustomText label="머리 빠짐 유무를" size={24} />
        <CustomText label="사진을 통해 체크해보세요" size={24} />
      </View>
      <View>
        <MyCarousel
          isMain={false}
          data={isLine ? lineDiaryData : topDiaryData}
        />
      </View>
      <View style={styles.buttonGroup}>
        <View style={styles.gallaryButtonGroup}>
          <CustomButton
            label="정수리"
            variant={isLine ? 'outlined' : 'filled'}
            size="small"
            onPress={() => {
              setIsLine(!isLine);
            }}
          />
          <CustomButton
            label="이마 라인"
            variant={isLine ? 'filled' : 'outlined'}
            size="small"
            onPress={() => {
              setIsLine(!isLine);
            }}
          />
        </View>
        <CustomButton
          label="오늘의 사진 올리기"
          variant="filled"
          onPress={() => {
            setModalVisible(!modalVisible);
          }}
        />
      </View>
      <SlideModal visible={modalVisible} onClose={() => setModalVisible(false)}>
        <View>
          {imgConfig ? (
            <View style={styles.imageContainer}>
              <Image
                source={{uri: imgConfig?.assets?.[0].uri}}
                style={styles.image}
              />
            </View>
          ) : (
            <>
              <View style={styles.modalContent}>
                <Pressable
                  onPress={() => openImageLibrary('top')}
                  style={styles.modalItem}>
                  <SvgIconAtom name="Camera" size={50} />
                  <CustomText
                    label="정수리 사진 업로드"
                    variant="regular"
                    size={14}
                  />
                </Pressable>
                <Pressable
                  onPress={() => openImageLibrary('line')}
                  style={styles.modalItem}>
                  <SvgIconAtom name="Camera" size={50} />
                  <CustomText
                    label="이마 라인 사진 업로드"
                    variant="regular"
                    size={14}
                  />
                </Pressable>
              </View>
            </>
          )}
          <View style={styles.buttonContainer}>
            <CustomButton
              label="사진 업로드"
              variant="filled"
              onPress={imageUpload}
            />
          </View>
        </View>
      </SlideModal>
      <PopupModal visible={alertModal.visible} onClose={closeAlert}>
        <CustomText label={alertModal.message} />
      </PopupModal>
      <View style={styles.bottomSpace} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    flex: 1,
    backgroundColor: colors.WHITE,
  },
  header: {
    alignItems: 'center',
    margin: 20,
  },
  headerText: {
    fontSize: 24,
    fontFamily: 'Pretendard-Bold',
    textAlign: 'center',
  },
  reportIcon: {
    width: 80,
    height: 100,
  },
  reportList: {
    margin: 20,
    gap: 12,
  },
  reportCard: {
    borderWidth: 1,
    borderColor: colors.SUB,
  },
  reportCardItem: {
    flexDirection: 'row',
    gap: 20,
  },
  gallaryButtonGroup: {
    flexDirection: 'row',
    alignContent: 'space-between',
    marginBottom: 20,
  },
  buttonGroup: {
    width: WIDTH * 0.9,
    alignSelf: 'center',
  },
  modalItem: {
    alignItems: 'center',
  },
  modalContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    margin: 40,
  },
  bottomSpace: {
    height: 100,
  },
  buttonContainer: {
    marginBottom: 20,
  },
  imageContainer: {
    alignItems: 'center',
    margin: 10,
    marginVertical: 20,
  },
  image: {
    width: 150,
    height: 150,
  },
});
