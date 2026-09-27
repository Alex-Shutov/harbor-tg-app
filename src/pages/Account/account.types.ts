import { SpotCategory } from '@/shared/types/common.types';

export interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
}

export interface UserProfile {
  id: number;
  displayName: string;
  username: string;
  photoUrl: string | null;
}

export interface AccountCategory {
  id: number;
  title: string;
  serialNumber: number;
  innerCategories?: SpotCategory[];
}
