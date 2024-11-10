import {getEncryptStorage} from '../util';
import axiosInstance from './../util/axios';

type ResponseAiDiagnosis = {
  img: string;
  result: number[];
  headType: number;
  comparison: number;
  manageComment: string;
  date: string;
};

const postAiDiagnosis = async (
  file: FormData,
): Promise<ResponseAiDiagnosis> => {
  try {
    const {data} = await axiosInstance.post(`diagnosis`, file, {
      headers: {'Content-Type': 'multipart/form-data'},
    });

    return data;
  } catch (error) {
    console.log('ai진단 에러', error);
    throw error;
  }
};

type ResponsePick = {
  productImg: string;
  productName: string;
  link: string;
  price: number;
  productType: string[];
};

const getPick = async (headType: number): Promise<ResponsePick[]> => {
  try {
    const {data} = await axiosInstance.get(`elasticSearch/recommend`, {
      headType,
    });

    return data;
  } catch (error) {
    console.log('추천 에러', error);
    throw error;
  }
};

export {postAiDiagnosis, getPick};
export type {ResponseAiDiagnosis, ResponsePick};
