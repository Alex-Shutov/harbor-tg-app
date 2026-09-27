import { Suspense } from 'react';
import './styles/App.scss';

import {
  Navigate,
  Route,
  Routes,
} from 'react-router-dom';
import MainPage from './pages/Main';
import {
  useLaunchParams,
  miniApp
} from '@telegram-apps/sdk-react';
import { AppRoot } from '@telegram-apps/telegram-ui';
import EstablishmentPage from './pages/Establishment';
import { LoadingProvider } from './providers/LoadingProvider.tsx';
import NavBarLayout from './layouts/NavBarLayout';
import EventsPage from './pages/Events';
import EstablishmentsPage from './pages/Establishments';
import OutletLayout from './layouts/Establishment/EstablishmentLayout';
import EstablishmentPageLayout from './layouts/Establishment/EstablishmentPageLayout';
import Selection from "./pages/Selection";
import AccountLayout from './layouts/AccountLayout';
import AccountPage from './pages/Account';
import Favorites from './pages/Account/components/Favorites';
import useDisableVerticalScroll from './hooks/useDisableVerticalScroll.ts';
import Loader from './shared/Loader';
import { useMobileFullscreen } from './hooks/useMobileFullscreen.ts';
import FullSizeLayout from './layouts/FullSizeLayout';
import Dosug from './pages/Dosug';
import DosugPage from './pages/Dosug/components/DosugPage';
import { SubscriptionProvider } from './providers/SubscriptionProvider.tsx';
import { BackButtonProvider } from './providers/BackButtonProvider.tsx';
import { CaptchaProvider } from './providers/CaptchaProvider.tsx';
import EventPage from '@pages/Event';
import PromocodesPage from '@pages/Promocodes/ui/PromocodesPage.tsx';
import { Raffles } from '@pages/Raffles';
import { TasksPage, TaskChatPage } from '@pages/Tasks';
import TelegramVersionLayout from '@/layouts/TelegramVersionLayout';

function App() {
  const lp = useLaunchParams();

  useMobileFullscreen();
  useDisableVerticalScroll()

  return (
    <AppRoot
      appearance={miniApp?.isDark?.() ? 'dark' : 'light'}
      platform={['macos', 'ios'].includes(lp.tgWebAppPlatform) ? 'ios' : 'base'}
    >
      <LoadingProvider>
        <CaptchaProvider>
        <BackButtonProvider hiddenPaths={['/subscription']}>
        <SubscriptionProvider>
        <Suspense fallback={<Loader/>}>
        <Routes>
          <Route element={<TelegramVersionLayout/>}>
          <Route element={<FullSizeLayout/>}>
          <Route  path={'/'} element={<NavBarLayout/>}>

            <Route index element={<MainPage />} />
            <Route path={'establishments'} element={<EstablishmentsPage />} />
            <Route path={'leisure'} element={<Dosug />} />
            <Route path={'events'} element={<EventsPage />} />
            <Route path={'/profile'} element={<AccountLayout/>} >
              <Route index element={<AccountPage/>}></Route>
              <Route element={<OutletLayout/>}>
              <Route path={'favorites'} element={<Favorites/>}></Route>
              <Route path={'promocodes'} element={<PromocodesPage/>}></Route>
              <Route path={'tasks'} element={<TasksPage/>}></Route>
              <Route path={'tasks/chat/:taskId'} element={<TaskChatPage/>}></Route>
              <Route path={'raffles'} element={<Raffles/>}></Route>
              </Route>
            </Route>
          </Route>
          <Route path={'selection/:type/:id'} element={<Selection/>}/>

          <Route path={'establishment'} element={<OutletLayout/>}>
            <Route path={`:id`} element={<OutletLayout/>}>
              <Route index element={<EstablishmentPageLayout><EstablishmentPage/></EstablishmentPageLayout>}/>
            </Route>
          </Route>
          <Route path={'event'} element={<OutletLayout/>}>
            <Route path={`:id`} element={<OutletLayout/>}>
              <Route index element={<EstablishmentPageLayout><EventPage/></EstablishmentPageLayout>}/>
            </Route>
          </Route>

          <Route path={'leisure'} element={<OutletLayout/>}>
            <Route path={`:id`} element={<OutletLayout/>}>
              <Route index element={<EstablishmentPageLayout><DosugPage/></EstablishmentPageLayout>}/>
            </Route>
          </Route>
          </Route>
          </Route>

          <Route path={'*'} element={<Navigate to={'/'} />} />

        </Routes>
        </Suspense>
        </SubscriptionProvider>
        </BackButtonProvider>
        </CaptchaProvider>

      </LoadingProvider>
    </AppRoot>

  );
}

export default App;
