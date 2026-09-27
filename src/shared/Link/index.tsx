import { Link } from 'react-router-dom';

interface CustomLinkProps {
  to: string;
  onClick?: () => void;
  disabled?: boolean;
  children: React.ReactNode;
  className?: string;
}
const CustomLink: React.FC<CustomLinkProps> = ({
                                                 to,
                                                 onClick,
                                                 disabled = false,
                                                 children,
                                                 className = ''
                                               }) => {
  if (disabled) {
    return (
      <a
        style={{cursor:disabled ? 'not-allowed' : ''}}
        className={`disabled-link ${className}`}
        onClick={(e) => e.preventDefault()}
      >
        {children}
      </a>
    );
  }

  return (
    <Link
      to={to}
      onClick={onClick}
      className={className}
    >
      {children}
    </Link>
  );
};

export default CustomLink