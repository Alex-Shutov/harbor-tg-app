import { Outlet, useLocation } from 'react-router-dom';
import NavBar from '../../components/NavBar';
import './layout.scss';
import { Suspense, useLayoutEffect, useState } from 'react';
import Loader from '../../shared/Loader';

const NavBarLayout = () => {
  const location = useLocation();
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  const isChatPage = location.pathname.includes('chat');

  useLayoutEffect(() => {
    if (!window.visualViewport) return;

    const handleViewportResize = () => {
      const viewport = window.visualViewport;
      if (viewport) {
        const isKeyboardOpen = viewport.height < window.screen.availHeight * 0.7;
        setIsKeyboardVisible(isKeyboardOpen);
      }
    };

    window.visualViewport.addEventListener('resize', handleViewportResize);

    return () => {
      window.visualViewport?.removeEventListener('resize', handleViewportResize);
    };
  }, []);

  const hideNavbar = isChatPage;
  const hideNavBarOnKeyboard = isKeyboardVisible;

  return (
    <div className={`navbar-layout ${isChatPage && 'chat-layout'}`}>
      <Suspense fallback={<Loader />}>
        <Outlet />
      </Suspense>
      <div className={`navbar-container ${hideNavBarOnKeyboard ? 'hide-navbar' : ''} ${hideNavbar ? 'hidden' : ''}`}>
        <NavBar />
      </div>
    </div>
  );
};

export default NavBarLayout;
