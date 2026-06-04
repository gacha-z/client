import type { AppPlatform } from '@travel-gacha/types';

export const platformLabel = (platform: AppPlatform): string => {
  if (platform === 'mobile') return 'Travel Gacha Mobile';
  return 'Travel Gacha Web';
};
