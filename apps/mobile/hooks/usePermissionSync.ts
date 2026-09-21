import { useEffect } from 'react';
import { AppState, type AppStateStatus } from 'react-native';
import { useSetAtom } from 'jotai';

import { permissionSettingsAtom } from '@travel-gacha/store';
import { getCameraPermissionGranted, getLocationPermissionGranted } from '@/services/permissions';
import { getPushNotificationStatus } from '@/services/pushNotifications';

async function readPermissionSettings() {
  const [camera, location, pushNotification] = await Promise.all([
    getCameraPermissionGranted(),
    getLocationPermissionGranted(),
    getPushNotificationStatus()
  ]);
  return { camera, location, pushNotification };
}

/**
 * OS 설정 앱에서 권한을 직접 바꾸고 돌아와도(백그라운드 → 포그라운드 전환 시 OS가 'active' 이벤트를
 * 보내준다) permissionSettingsAtom이 실제 권한 상태와 어긋나지 않도록 앱 전역에서 동기화한다.
 */
export function usePermissionSync() {
  const setPermissions = useSetAtom(permissionSettingsAtom);

  useEffect(() => {
    let mounted = true;

    const sync = () => {
      void readPermissionSettings().then((status) => {
        if (mounted) setPermissions(status);
      });
    };

    sync();

    const handleAppStateChange = (nextState: AppStateStatus) => {
      if (nextState === 'active') sync();
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      mounted = false;
      subscription.remove();
    };
  }, [setPermissions]);
}
