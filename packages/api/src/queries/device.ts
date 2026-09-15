import { getApiClient, unwrap, type ApiEnvelope } from '../client';

export type DeviceOsType = 'IOS' | 'ANDROID';

export type DevicePermissionStatus = 'GRANTED' | 'DENIED' | 'UNDETERMINED';

type DeviceRegisterResponse = {
  deviceId: number;
};

export type RegisterDeviceParams = {
  memberId: number;
  fcmToken: string;
  osType: DeviceOsType;
  appVersion?: string;
  notificationEnabled?: boolean;
};

/** 기기 등록/갱신 — 동일 기기가 다시 호출하면 서버에서 기존 레코드를 갱신한다 */
export const registerDevice = async ({
  memberId,
  fcmToken,
  osType,
  appVersion,
  notificationEnabled
}: RegisterDeviceParams): Promise<string> => {
  const response = await unwrap(
    getApiClient().post<ApiEnvelope<DeviceRegisterResponse>>(
      '/api/v1/devices',
      { fcmToken, osType, appVersion, notificationEnabled },
      { params: { userId: memberId } }
    )
  );
  return String(response.deviceId);
};

type DevicePermissionResponse = {
  devicePermissionId: number;
  deviceId: number;
  locationStatus?: string | null;
  cameraStatus?: string | null;
  notificationStatus?: string | null;
  updatedAt: string;
};

export type UpdateDevicePermissionsParams = {
  deviceId: string;
  memberId: number;
  locationStatus?: DevicePermissionStatus;
  cameraStatus?: DevicePermissionStatus;
  notificationStatus?: DevicePermissionStatus;
};

/** 부분 업데이트 — 값을 넘기지 않은 권한 필드는 서버에 저장된 기존 값이 유지된다 */
export const updateDevicePermissions = async ({
  deviceId,
  memberId,
  locationStatus,
  cameraStatus,
  notificationStatus
}: UpdateDevicePermissionsParams): Promise<void> => {
  await unwrap(
    getApiClient().patch<ApiEnvelope<DevicePermissionResponse>>(
      `/api/v1/devices/${deviceId}/permissions`,
      { locationStatus, cameraStatus, notificationStatus },
      { params: { userId: memberId } }
    )
  );
};
