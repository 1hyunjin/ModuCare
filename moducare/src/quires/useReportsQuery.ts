import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {
  getLineDiaryData,
  getReportData,
  getReportDetailData,
  getTopDiaryData,
  postHairImg,
} from '../api/report-api';

interface ReportItem {
  idx: number;
  date: string;
  diagnosis: string;
}

export const QueryKey = {
  line: 'lineDiary',
  top: 'topDiary',
  report: 'report',
  reportDetail: 'reportDetail',
};

// 데이터가 없을 경우 더미 데이터
const DefaultImage = [
  {
    img: require('../assets/img/MainCharacter.png'),
    regDate: '2024-01-04',
  },
];

export const useLineDiaryQuery = () => {
  const {data} = useQuery({
    queryKey: [QueryKey.line],
    queryFn: getLineDiaryData,
    select: response => {
      if (response.length === 0) {
        return DefaultImage;
      }
      return response;
    },
  });
  return {data};
};

export const useTopDiaryQuery = () => {
  const {data} = useQuery({
    // data를 구조분해할당으로 받아야 함
    queryKey: [QueryKey.top],
    queryFn: getTopDiaryData,
    select: response => {
      if (response.length === 0) {
        return DefaultImage;
      }
      return response;
    },
  });
  return {data}; // data만 반환하도록 수정
};

export const useReportQuery = () => {
  return useQuery({
    queryKey: [QueryKey.report],
    queryFn: getReportData,
  });
};

export const useReportDetailQuery = (
  id: number,
  options?: {enabled?: boolean},
) => {
  return useQuery({
    queryFn: () => getReportDetailData(id),
    queryKey: [QueryKey.reportDetail, {id}],
    ...options,
  });
};
export const usePostHairImgMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      formData,
      imgType,
    }: {
      formData: FormData;
      imgType: 'line' | 'top';
    }) => postHairImg(formData, imgType),
    onSuccess: (_, {imgType}) => {
      // 이미지 타입에 따른 useQuery 업데이트
      queryClient.invalidateQueries({queryKey: [QueryKey[imgType]]});
    },
    onError: error => {
      console.log(error);
    },
  });
};

export type {ReportItem};
