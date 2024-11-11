import AsyncStorage from '@react-native-async-storage/async-storage';
import axiosInstance from './axios';

const setHeader = (key: string, value: string) => {
  axiosInstance.defaults.headers.common[key] = value;
};

const removeHeader = (key: string) => {
  if (!axiosInstance.defaults.headers.common[key]) {
    return;
  }
  delete axiosInstance.defaults.headers.common[key];
};

// 인터셉터 설정 추가 -> 로그인 시 토큰이 있는지 확인해서 가져옴
const setupInterceptors = () => {
  const token = AsyncStorage.getItem('accessToken');
  try {
    // 백엔드에서 토큰 검증 후 토큰 갱신 필요할듯...
    // const response = await axiosInstance.get('/tokens/verify');
    // if(response.status === 200){
    //   const newToken = response.data.accessToken;
    //   AsyncStorage.setItem('accessToken', newToken);
    //   setHeader('Authorization', `Bearer ${newToken}`);
    // }
    if (token) {
      setHeader('Authorization', `Bearer ${token}`);
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error('Error setting headers:', error);
    return false;
  }
};

export {setHeader, removeHeader, setupInterceptors};
