import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { retrieveLaunchParams } from '@telegram-apps/sdk-react';
import { formatTelegramUser } from '../../utils/telegram.ts';
import { useGetUserBalanceQuery } from '@/entities/user-balance/api/user-balance.api';
import { useAppDispatch } from '@/store/hooks';
import { setUserProfile } from '@/entities/account/model/account.slice';

const AccountLayout = () => {
  const dispatch = useAppDispatch();
  const launchParams = retrieveLaunchParams();
  const { refetch: refetchBalance } = useGetUserBalanceQuery();

  useEffect(() => {
    if (launchParams?.tgWebAppData?.user) {
      const telegramUser = launchParams.tgWebAppData.user;
      const formattedUser = formatTelegramUser(telegramUser);
      dispatch(setUserProfile(formattedUser));
    }
    refetchBalance();
  }, [refetchBalance, dispatch, launchParams?.tgWebAppData?.user]);

  return (
    <div className={`account-layout`}>
      <Outlet />
    </div>
  );
};

export default AccountLayout;
