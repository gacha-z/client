import { deleteItem, getItem, setItem } from './authSession';

const DEVICE_ID_KEY = 'travel-gacha.device-id';

export async function getDeviceId(): Promise<string | null> {
  return getItem(DEVICE_ID_KEY);
}

export async function saveDeviceId(deviceId: string): Promise<void> {
  await setItem(DEVICE_ID_KEY, deviceId);
}

export async function clearDeviceId(): Promise<void> {
  await deleteItem(DEVICE_ID_KEY);
}
