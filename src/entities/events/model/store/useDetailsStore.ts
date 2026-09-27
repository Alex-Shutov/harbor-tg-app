import { useDispatch, useSelector } from 'react-redux';
import {
  setEventDetailsData,
  clearEventDetailsData,
  selectEventDetailsType,
  selectEventDetailsData,
} from './details.slice.ts';
import { IEventDetails } from '../types/details.domain.types.ts';
import { EPageType } from '@shared/constants';

export const useEventDetailsStore = () => {
  const dispatch = useDispatch();
  const data = useSelector(selectEventDetailsData);
  const type = useSelector(selectEventDetailsType);

  return {
    data,
    type,
    setData: (data: IEventDetails, type: EPageType) => {
      dispatch(setEventDetailsData({ data, type }));
    },
    clearData: () => {
      dispatch(clearEventDetailsData());
    },
  };
};
