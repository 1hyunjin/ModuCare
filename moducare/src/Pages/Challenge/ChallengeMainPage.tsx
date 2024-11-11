import * as React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Pressable,
  Text,
  TextInput,
  Image,
} from 'react-native';
import CustomButtom from '../../Components/Common/CustomButton';
import {SafeAreaView} from 'react-native-safe-area-context';
import CustomText from '../../Components/Common/CustomText';
import SvgIconAtom from '../../Components/Common/SvgIconAtom';
import Entypo from 'react-native-vector-icons/Entypo';
import {colors} from '../../constants/colors';
import SmallList from './../../Components/Challenge/SmallList';
import SlideModal from '../../Components/Common/SlideModal';
import {
  getChallengeList,
  getListType,
  getMyChallengeList,
  getMyListType,
  postCreateChallenge,
} from '../../api/challenge-api';
import {Alert} from 'react-native';
import {setEncryptStorage} from '../../util';
import {
  CameraOptions,
  launchImageLibrary,
  ImageLibraryOptions,
} from 'react-native-image-picker';
import {useFocusEffect} from '@react-navigation/native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

interface Action {
  title: string;
  type: 'capture' | 'library';
  options: CameraOptions | ImageLibraryOptions;
}

const options: Action = {
  title: 'Select Image',
  type: 'library',
  options: {
    selectionLimit: 1,
    mediaType: 'photo',
    includeBase64: false,
  },
};

export default function ChallengeMainPage({navigation}) {
  const [isModal, setIsModal] = React.useState(false);
  const [myList, setMyList] = React.useState<getMyListType[] | []>([]);
  const [allList, setAllList] = React.useState<getListType[] | []>([]);
  const [title, setTitle] = React.useState<string>('');
  //챌린지 생성 이미지 관련
  const [imgConfig, setImgConfig] = React.useState<any>(null);

  const openImageLibrary = async () => {
    console.log('ww');
    const images = await launchImageLibrary(options);
    if (images.assets) {
      setImgConfig(images);
    }
  };

  const imageUpload = async () => {
    if (title === '') {
      Alert.alert('챌린지 생성 오류', '챌린지명을 작성해주세요!');
      return;
    }
    Alert.alert('업로드');

    // 1. S3 업로드
    if (imgConfig === null) {
      const formData = new FormData();
      formData.append('title', title);
      await postCreateChallenge(formData);
      // await postCreateChallenge(title, '');
      const myData = await getMyChallengeList();
      setMyList(myData);
    } else {
      // await upLoadImgToS3(imgConfig);
      const file = imgConfig.assets[0];
      const uri = file.uri; // 이미지 URI
      const fileName = file.fileName; // 이미지 파일명
      const type = file.type; // 이미지 타입

      // FormData 생성
      const formData = new FormData();
      formData.append('title', title);
      formData.append('file', {
        uri: uri,
        type: type,
        name: fileName,
      });

      await postCreateChallenge(formData);
      const myData = await getMyChallengeList();
      setMyList(myData);
    }
    // 2. 초기화
    setImgConfig(null);
    setTitle('');
    // 3. 모달 닫기
    setIsModal(false);
  };

  const handleOpenModal = () => {
    setIsModal(true);
  };

  const handleCloseModal = () => {
    setIsModal(false);
    setImgConfig(null);
    setTitle('');
  };

  const handleMoveFeedPage = (data: getMyListType) => {
    setEncryptStorage('isDone', data.isDone);
    navigation.navigate('challenge_feed', {
      id: data.challengeId,
      title: data.challengeName,
      type: 'myChallenge',
    });
  };

  const handleImgDelete = () => {
    setImgConfig(null);
  };

  const getListCompo = async () => {
    const myData = await getMyChallengeList();
    const allData = await getChallengeList();
    setMyList(myData);
    setAllList(allData);
  };
  useFocusEffect(
    React.useCallback(() => {
      console.log('qq');
      getListCompo();
    }, []),
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mainArea}>
        <View style={styles.topArea}>
          <SvgIconAtom name={'Challenge'} />
          <View>
            <CustomText size={20} label="챌린지를 통해" />
            <CustomText size={20} label="모두와 함께 두피를 지켜요." />
          </View>
        </View>
        <View style={styles.ListArea}>
          <View style={styles.ListTitle}>
            <CustomText label="진행중인 챌린지 목록" size={20} />
          </View>
          <ScrollView showsVerticalScrollIndicator={false}>
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
        <View style={styles.BottomListArea}>
          <View style={styles.ListTitle}>
            <CustomText label="챌린지 목록 살펴보기" size={20} />
            <Pressable onPress={() => navigation.navigate('challenge_list')}>
              <Entypo name="chevron-right" color={colors.BLACK} size={25} />
            </Pressable>
          </View>
          <View>
            {allList.length !== 0 ? (
              allList.slice(0, 3).map((data, index) => (
                <SmallList
                  key={index}
                  title={data.challengeName}
                  uri={data.challengeImg}
                  onPress={() =>
                    navigation.navigate('challenge_feed', {
                      id: data.challengeId,
                      title: data.challengeName,
                      type: 'allChallenge',
                    })
                  }
                />
              ))
            ) : (
              <CustomText label="개설된 챌린지가 없어요" />
            )}
          </View>
        </View>
      </View>
      <View>
        <CustomButtom label="챌린지 생성하기" onPress={handleOpenModal} />
      </View>
      <SlideModal visible={isModal} onClose={handleCloseModal}>
        <View style={styles.ModalView}>
          {imgConfig !== null ? (
            <View style={styles.imageContainer}>
              <Pressable style={styles.closeBtn} onPress={handleImgDelete}>
                <FontAwesome name="close" size={20} color={'#ffffff'} />
              </Pressable>
              <Image
                source={{uri: imgConfig?.assets?.[0].uri}}
                style={{width: 150, height: 150}}
              />
            </View>
          ) : (
            <Pressable
              style={styles.UploadArea}
              onPress={() => openImageLibrary()}>
              <SvgIconAtom name="Camera" style={{margin: 'auto'}} />
              <Text style={styles.UploadText}>
                챌린지 방 대표이미지를 공유해볼까요?
              </Text>
            </Pressable>
          )}

          <TextInput
            style={styles.InputArea}
            placeholder="챌린지 제목을 작성해주세요."
            value={title}
            onChangeText={setTitle}
          />
          <CustomButtom label="챌린지 생성하기" onPress={imageUpload} />
        </View>
      </SlideModal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  mainArea: {
    flex: 0.9,
  },
  topArea: {
    gap: 10,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignContent: 'center',
    marginBottom: 20,
  },
  listBoxArea: {
    gap: 10,
  },
  ListArea: {
    flex: 0.5,
    elevation: 4,
    borderRadius: 10,
    backgroundColor: '#fff',
    marginBottom: 20,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  BottomListArea: {
    flex: 0.36,
    elevation: 4,
    borderRadius: 10,
    backgroundColor: '#fff',
    marginBottom: 20,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  ListTitle: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginBottom: 10,
  },
  ModalView: {
    gap: 20,
  },
  UploadArea: {
    marginTop: 20,
  },
  UploadText: {
    textAlign: 'center',
    color: colors.MAIN,
    fontSize: 14,
    fontFamily: 'Pretendard-Medium',
  },
  InputArea: {
    backgroundColor: colors.WHITE_GRAY,
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  imageContainer: {
    position: 'relative',
    alignItems: 'center',
    margin: 10,
    marginVertical: 20,
  },
  closeBtn: {
    width: 30,
    height: 30,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.MAIN,
    position: 'absolute',
    right: 0,
    margin: 5,
    zIndex: 1000,
  },
});
