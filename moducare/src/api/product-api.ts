import axiosInstance from '../util/axios';
import Config from 'react-native-config';

interface LatestProduct {
  link: string;
  imgSrc: string;
}

const getLastestProduct = async (): Promise<LatestProduct> => {
  try {
    const response = await axiosInstance.get(`product/latest`);
    console.log('최근 상품 호출 성공 ', response);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const postLastestProduct = async (
  imgSrc: string,
  link: string,
): Promise<LatestProduct> => {
  try {
    const response = await axiosInstance.post(`product/latest`, {
      imgSrc,
      link,
    });
    console.log('최근 상품 저장 성공 ', response.data);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export {getLastestProduct, postLastestProduct};
export type {LatestProduct};
