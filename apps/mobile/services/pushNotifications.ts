import { Platform } from 'react-native';
import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';

import { isApiError, registerDevice, updateDevicePermissions } from '@travel-gacha/api';

import { getDeviceId, saveDeviceId } from './deviceSession';

const getProjectId = (): string | undefined =>
  Constants.expoConfig?.extra?.eas?.projectId ?? Constants.easConfig?.projectId;

/** 요청 없이 현재 OS 알림 권한 상태만 읽는다 — 시스템 다이얼로그를 띄우지 않는다 */
export async function getPushNotificationStatus(): Promise<boolean> {
  if (!Device.isDevice) return false;
  const { status } = await Notifications.getPermissionsAsync();
  return status === 'granted';
}

async function pushExpoToken(memberId: number): Promise<string | null> {
  const projectId = getProjectId();
  if (!projectId) return null;

  const { data: fcmToken } = await Notifications.getExpoPushTokenAsync({ projectId });
  const deviceId = await registerDevice({
    memberId,
    fcmToken,
    osType: Platform.OS === 'ios' ? 'IOS' : 'ANDROID',
    appVersion: Constants.expoConfig?.version,
    notificationEnabled: true
  });
  await saveDeviceId(deviceId);
  return deviceId;
}

async function reportPermissionStatus(memberId: number, granted: boolean): Promise<void> {
  const deviceId = await getDeviceId();
  if (!deviceId) return;

  try {
    await updateDevicePermissions({
      deviceId,
      memberId,
      notificationStatus: granted ? 'GRANTED' : 'DENIED'
    });
  } catch (error) {
    console.warn('[push] 권한 상태 갱신 실패:', isApiError(error) ? error.message : error);
  }
}

/** OS 알림 권한을 요청하고, 승인되면 푸시 토큰을 발급받아 서버에 등록한다 */
export async function requestPushNotificationRegistration(memberId: number): Promise<boolean> {
  if (!Device.isDevice) return false;

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  const status =
    existingStatus === 'granted'
      ? existingStatus
      : (await Notifications.requestPermissionsAsync()).status;
  const granted = status === 'granted';

  if (granted) {
    try {
      await pushExpoToken(memberId);
    } catch (error) {
      console.warn('[push] 기기 등록 실패:', isApiError(error) ? error.message : error);
    }
  }

  await reportPermissionStatus(memberId, granted);
  return granted;
}
