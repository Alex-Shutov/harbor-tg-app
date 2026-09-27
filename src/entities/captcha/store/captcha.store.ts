import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ICaptchaRequirements } from '../types/captcha.types';

interface ICaptchaState {
  requirements: ICaptchaRequirements | null;
}

// Инициализируем с дефолтными значениями, чтобы не блокировать приложение при загрузке
const initialState: ICaptchaState = {
  requirements: {
    captchaRequiredForLogin: false,
    captchaRequiredForTask: false,
    captchaRequiredForGiveaway: false,
    captchaRequiredForBookingTelegram: false,
    captchaRequiredForWaitingListTelegram: false,
  },
};

const captchaSlice = createSlice({
  name: 'captcha',
  initialState,
  reducers: {
    setCaptchaRequirements: (state, action: PayloadAction<ICaptchaRequirements>) => {
      state.requirements = action.payload;
    },
    clearCaptchaRequirements: (state) => {
      state.requirements = null;
    },
  },
});

export const { setCaptchaRequirements, clearCaptchaRequirements } = captchaSlice.actions;
export const captchaReducer = captchaSlice.reducer;

