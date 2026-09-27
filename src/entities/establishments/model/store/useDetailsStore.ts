import { useDispatch, useSelector } from 'react-redux';
import {
  setDetailsData,
  clearDetailsData,
  selectDetailsType,
  selectDetailsData,
} from './details.slice.ts';
import { IEstablishmentDetails } from '../types/details.domain.types';
import { EPageType } from '@/shared/constants/types.constants';

/**
 * Hook: управление состоянием заведения из Redux
 */
export const useEstablishmentDetailsStore = () => {
  const dispatch = useDispatch();
  const data = useSelector(selectDetailsData);
  const type = useSelector(selectDetailsType);

  return {
    data,
    type,
    setData: (data: IEstablishmentDetails, type: EPageType) => {
      dispatch(setDetailsData({ data, type }));
    },
    clearData: () => {
      //@ts-ignore
      dispatch(clearDetailsData());
    },
  };
};
