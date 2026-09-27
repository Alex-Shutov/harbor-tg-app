import { useLocation, useNavigate } from 'react-router-dom';

import { ProfileActionButton } from '@/shared/ui';

import { profileActionsConfig } from '../model/profileActions';

import './profile-action-grid.scss';

export const ProfileActionGrid = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="profile-action-grid">
      {profileActionsConfig.map((action) => (
        <ProfileActionButton
          key={action.id}
          label={action.label}
          description={action.description}
          icon={action.icon}
          onClick={() => navigate(action.to)}
          active={location.pathname.startsWith(action.to)}
          disabled={action.disabled}
          data-testid={`profile-action-${action.id}`}
        />
      ))}
    </div>
  );
};
