import React, {useRef, useState} from 'react';
import {Pressable, StyleSheet, View, Image} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {colors} from '../../constants/colors';
import CustomText from '../../Components/Common/CustomText';
import usePermission from '../../hook/usePermission';
import {useNavigation} from '@react-navigation/native';
import {Camera, useCameraDevice} from 'react-native-vision-camera';
import CustomButtom from '../../Components/Common/CustomButton';
import {postAiDiagnosis} from '../../api/ai-api';

const DiagnosisCamera = () => {
  const navigation = useNavigation();
  usePermission('CAM');

  const cameraRef = useRef<Camera>(null);
  const device = useCameraDevice('back');
  const [imageUri, setImageUri] = useState<string | null>(null); // 사진 URI 상태

  // 사진 촬영 함수
  const handleTakePhoto = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePhoto({
          flash: 'off',
        });
        setImageUri(`file://` + photo.path); // 사진 URI를 상태로 설정
        console.log(photo.path); // 콘솔에서 경로 확인
      } catch (error) {
        console.error('사진 촬영 실패:', error);
      }
    }
  };

  const handleAiDiagnosis = async () => {
    //검사진행
    const formData = new FormData();
    formData.append('file', {
      uri: imageUri, // 사진 URI
      type: 'image/jpeg', // 이미지 파일 타입 (예시로 jpeg 사용)
      name: 'photo.jpg', // 파일명
    });
    await postAiDiagnosis(formData);
  };

  // 이미지 삭제 함수
  const handleImageDelete = () => {
    setImageUri(null);
  };
  return (
    <SafeAreaView style={styles.container}>
      <CustomText label="두피가 잘 나오게 사진을 찍어주세요." size={20} />
      {imageUri ? (
        <>
          {/* 사진 촬영 후 이미지 보여주기 */}
          <View style={styles.cameraArea}>
            <Image source={{uri: imageUri}} style={styles.capturedImage} />
          </View>
          <View style={styles.PhotoBtnArea}>
            <CustomButtom
              label="재 촬영"
              size="small"
              onPress={handleImageDelete}
            />
            <CustomButtom
              label="검사 진행"
              size="small"
              onPress={() => navigation.navigate('aiResult')}
            />
          </View>
        </>
      ) : (
        <>
          {/* 사진을 찍지 않았을 때 카메라 화면 보여주기 */}
          <View style={styles.cameraArea}>
            <Camera
              ref={cameraRef} // ref를 Camera에 연결
              style={styles.cameraStyle}
              device={device}
              isActive={true}
              focusable={true}
              photo={true}
            />
          </View>
          <Pressable style={styles.BtnArea} onPress={handleTakePhoto} />
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.WHITE,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  cameraArea: {
    borderWidth: 1,
    borderColor: colors.WHITE,
    width: '100%',
    height: 300,
    marginVertical: 10,
    justifyContent: 'center',
    alignItems: 'center', // 카메라 영역 가운데 정렬
  },
  cameraStyle: {
    width: '100%',
    height: '100%',
  },
  BtnArea: {
    width: 80,
    height: 80,
    borderWidth: 8,
    borderRadius: 50,
    borderColor: colors.MAIN,
    backgroundColor: colors.WHITE,
    marginTop: 50,
    elevation: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  capturedImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover', // 이미지 크기에 맞게 조정
  },
  PhotoBtnArea: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 50,
    marginTop: 50,
    elevation: 4,
  },
});

export default DiagnosisCamera;
