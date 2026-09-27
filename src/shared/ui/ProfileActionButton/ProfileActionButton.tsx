import classNames from 'classnames';
import { CSSProperties, ReactNode } from 'react';

import './profile-action-button.scss';

export type ProfileActionButtonProps = {
  label: string;
  description?: string;
  icon: ReactNode | string;
  onClick?: () => void;
  disabled?: boolean;
  active?: boolean;
  className?: string;
  style?: CSSProperties;
  'data-testid'?: string;
};

export const ProfileActionButton = ({
  label,
  description,
  icon,
  onClick,
  disabled = false,
  active = false,
  className,
  style,
  'data-testid': dataTestId,
}: ProfileActionButtonProps) => {
  const iconNode = typeof icon === 'string' ? <img src={icon} alt="" aria-hidden /> : icon;

  return (
    <button
      type="button"
      data-testid={dataTestId}
      className={classNames(
        'profile-action-button',
        {
          'profile-action-button--disabled': disabled,
          'profile-action-button--active': active,
        },
        className,
      )}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      style={style}
      aria-pressed={active}
    >
      <div className={'profile-action-button__header'}>
      <span className="profile-action-button__icon" aria-hidden>
        {iconNode}
      </span>
        <span className="profile-action-button__title">{label}</span>

      </div>
      <span className="profile-action-button__content">

        {description ? (
          <span className="profile-action-button__subtitle">{description}</span>
        ) : null}
      </span>
    </button>
  );
};

export default ProfileActionButton;
