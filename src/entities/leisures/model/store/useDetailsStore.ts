import { useDispatch, useSelector } from 'react-redux';
import {
  setLeisureDetailsData,
  clearLeisureDetailsData,
  selectLeisureDetailsType,
  selectLeisureDetailsData,
} from './details.slice';
import { ILeisureDetails } from '../types/details.domain.types';
import { EPageType } from '@shared/constants';

export const useLeisureDetailsStore = () => {
  const dispatch = useDispatch();
  const data = useSelector(selectLeisureDetailsData);
  const type = useSelector(selectLeisureDetailsType);

  return {
    data,
    type,
    setData: (data: ILeisureDetails, type: EPageType) => {
      dispatch(setLeisureDetailsData({ data, type }));
    },
    clearData: () => {
      dispatch(clearLeisureDetailsData());
    },
  };
};
