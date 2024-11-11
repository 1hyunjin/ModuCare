import axios from 'axios';
import axiosInstance from '../util/axios';
import Config from 'react-native-config';

type ResultData = {
  data: {
    value: number;
    dataPointText: string;
    label: string;
  }[];
};

const postResult = async (stressScore: number): Promise<void> => {
  try {
    const {data} = await axiosInstance.post(`${Config.API_URL}stress`, {
      score: stressScore,
    });

    console.log(data);
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getResult = async (): Promise<ResultData[]> => {
  try {
    const {data} = await axiosInstance.get(`${Config.API_URL}stress/recent`);

    return data.map((item: ResultData) => ({
      ...item,
      label: new Date(new Date(item.label).getTime() + 9 * 60 * 60 * 1000)
        .toISOString()
        .slice(5, 10), // "2024-03-21T13:00:00.000Z" -> "03-21"
    }));
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export {postResult, getResult};
export type {ResultData};
