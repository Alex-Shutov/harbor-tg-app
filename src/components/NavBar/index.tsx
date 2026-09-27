import { useEffect, useState } from 'react';
import { CalendarDays, House, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import './NavBar.scss';

import CustomLink from '../../shared/Link';

const NavBar = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<string>('home');

  useEffect(() => {
    const path = location.pathname;
    if (path === '/') {
      setActiveTab('home');
    } else if (path.startsWith('/events')) {
      setActiveTab('events');
    } else if (path.startsWith('/profile')) {
      setActiveTab('profile');
    }
  }, [location.pathname]);

  return (
    <div className={'bottomNavBar'}>
      <div className={'links'}>
      <Link to="/" className={activeTab === 'home' ? 'active' : ''} onClick={() => setActiveTab('home')}>
        <House size={24} strokeWidth={1.75} />
        <span>Главная</span>
      </Link>
      <CustomLink className={activeTab === 'events' ? 'active' : ''}  to="/events" onClick={() => setActiveTab('events')}>
        <CalendarDays size={24} strokeWidth={1.75} />
        <span>Афиша</span>
      </CustomLink>
      <Link to="/profile" className={activeTab === 'profile' ? 'active' : ''} onClick={() => setActiveTab('profile')}>
        <User size={24} strokeWidth={1.75} />
        <span>Профиль</span>
      </Link>
      </div>
    </div>
  );
};

export default NavBar;
