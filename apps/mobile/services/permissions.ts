import { Camera } from 'expo-camera';
import * as Location from 'expo-location';

import { isApiError, updateDevicePermissions } from '@travel-gacha/api';

import { getDeviceId } from './deviceSession';

async function reportPermissionStatus(
  memberId: number,
  key: 'cameraStatus' | 'locationStatus',
  granted: boolean
): Promise<void> {
  const deviceId = await getDeviceId();
  if (!deviceId) return;

  try {
    await updateDevicePermissions({
      deviceId,
      memberId,
      [key]: granted ? 'GRANTED' : 'DENIED'
    });
  } catch (error) {
    console.warn(`[permissions] ${key} 갱신 실패:`, isApiError(error) ? error.message : error);
  }
}

/** 요청 없이 현재 카메라 권한 상태만 읽는다 */
export async function getCameraPermissionGranted(): Promise<boolean> {
  const { status } = await Camera.getCameraPermissionsAsync();
  return status === 'granted';
}

/** 이미 결정된 권한이면 시스템 다이얼로그 없이, 아니면 요청 다이얼로그를 띄운다 */
export async function requestCameraPermission(memberId?: number): Promise<boolean> {
  const { status: existingStatus } = await Camera.getCameraPermissionsAsync();
  const status =
    existingStatus === 'granted'
      ? existingStatus
      : (await Camera.requestCameraPermissionsAsync()).status;
  const granted = status === 'granted';

  if (memberId !== undefined) await reportPermissionStatus(memberId, 'cameraStatus', granted);
  return granted;
}

/** 요청 없이 현재 위치 권한 상태만 읽는다 */
export async function getLocationPermissionGranted(): Promise<boolean> {
  const { status } = await Location.getForegroundPermissionsAsync();
  return status === 'granted';
}

/** 이미 결정된 권한이면 시스템 다이얼로그 없이, 아니면 요청 다이얼로그를 띄운다 */
export async function requestLocationPermission(memberId?: number): Promise<boolean> {
  const { status: existingStatus } = await Location.getForegroundPermissionsAsync();
  const status =
    existingStatus === 'granted'
      ? existingStatus
      : (await Location.requestForegroundPermissionsAsync()).status;
  const granted = status === 'granted';

  if (memberId !== undefined) await reportPermissionStatus(memberId, 'locationStatus', granted);
  return granted;
}
