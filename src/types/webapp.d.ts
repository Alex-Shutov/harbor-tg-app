declare global {
  interface Window {
    Telegram?: {
      WebApp?: {
        version?: string;
        isVerticalSwipesEnabled: boolean;
        openTelegramLink?: (link: string) => void;

        LocationManager?: {
          init: (callback?: (success: boolean) => void) => void;
          getLocation: (
            callback: (location: LocationData | null) => void,
          ) => void;
          openSettings: () => void;
          isInited: boolean;
          isLocationAvailable: boolean;
          isAccessRequested: boolean;
          isAccessGranted: boolean;
        };
        ready?: () => void;
        isExpanded?: boolean;
        viewportHeight?: number;
        viewportStableHeight?: number;
        MainButton?: {
          show: () => void;
          hide: () => void;
          enable: () => void;
          disable: () => void;
          text: string;
        };
      };
    };
  }

  interface LocationData {
    latitude: number;
    longitude: number;
    altitude: number | null;
    course: number | null;
    speed: number | null;
    horizontal_accuracy: number | null;
    vertical_accuracy: number | null;
    course_accuracy: number | null;
    speed_accuracy: number | null;
  }
}

export {};