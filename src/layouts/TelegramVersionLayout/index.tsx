import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import './layout.scss'
import { getTelegramWebAppVersion, isVersionSupported, MIN_REQUIRED_VERSION } from '@utils/telegramVersion.ts';
import { UpdateRequiredModal } from '@components/UpdateRequiredModal';

const Index = () => {
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [currentVersion, setCurrentVersion] = useState<string | null>(null);

  useEffect(() => {
    const version = getTelegramWebAppVersion();
    setCurrentVersion(version);
    const supported = isVersionSupported();
    if (!supported) {
      setShowUpdateModal(true);
    }
  }, []);
  return (
    <div>
      <UpdateRequiredModal
        setIsOpen={setShowUpdateModal}
        isOpen={showUpdateModal}
        minVersion={MIN_REQUIRED_VERSION}
        currentVersion={currentVersion}
      />
      <Outlet />
    </div>
  );
};

export default Index;
