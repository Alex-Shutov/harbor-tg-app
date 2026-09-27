import { ProfileActionGrid } from '@/widgets/profile';
import { useAppSelector } from '@/store/hooks';
import { selectUserProfile } from '@/entities/account/model/account.slice';
import { User } from 'lucide-react';
import './AccountPage.scss';

const AccountPage = () => {
  const userProfile = useAppSelector(selectUserProfile);

  return (
    <div className="account-page">
      <div className={'profile__top-widget'}>
        <div className="profile-header">
          <div className="profile-avatar profile-avatar--placeholder" aria-hidden>
            <User size={40} strokeWidth={1.5} />
          </div>
          <div className="profile-info">
            <h2>{userProfile.displayName}</h2>
            <span className="username">{userProfile.username}</span>
          </div>
        </div>
        <ProfileActionGrid />
      </div>
    </div>
  );
};

export default AccountPage;
