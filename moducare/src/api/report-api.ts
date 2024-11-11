import axiosInstance from '../util/axios';
import Config from 'react-native-config';

const getLineDiaryData = async () => {
  try {
    const response = await axiosInstance.get('diaries/line');
    console.log('이마 리포트 호출 성공 ', response.data);
    const mappedData = response.data.map((item: any) => ({
      ...item,
      img: {uri: item.img},
    }));
    console.log('이마 리포트 호출 성공 ', mappedData);
    return mappedData;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getTopDiaryData = async () => {
  // const data = await axiosInstance.get('/diaries/top');
  // return data;
  try {
    const response = await axiosInstance.get('diaries/top');
    console.log('정수리 리포트 호출 성공 ', response.data);
    const mappedData = response.data.map((item: any) => ({
      ...item,
      img: {uri: item.img},
    }));
    console.log('정수리 리포트 호출 성공 ', mappedData);
    return mappedData;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getReportData = async () => {
  // const data = await axiosInstance.get('/diagnosis');
  // return data;
  try {
    const response = await axiosInstance.get('diagnosis');
    console.log('리포트 호출 성공 ', response.data);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getReportDetailData = async (id: number) => {
  try {
    const response = await axiosInstance.get(`/diagnosis/${id}`);
    console.log('리포트 상세 호출 성공 ', response.data);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const postHairImg = async (formData: FormData, imgType: string | undefined) => {
  console.log('시작 !!!', formData, imgType);
  try {
    const data = await axiosInstance.post('diaries', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      params: {
        type: imgType,
      },
    });

    console.log('사진 업로드 성공 ', data);
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export {
  getLineDiaryData,
  getTopDiaryData,
  getReportData,
  getReportDetailData,
  postHairImg,
};
