const normalizeEnv = (value: string | undefined): string | undefined =>
  value && value.length > 0 ? value : undefined;

const readEnv = (
  name: 'NEXT_PUBLIC_API_BASE_URL' | 'EXPO_PUBLIC_API_BASE_URL'
): string | undefined => {
  const value =
    typeof process === 'undefined'
      ? undefined
      : name === 'NEXT_PUBLIC_API_BASE_URL'
        ? process.env.NEXT_PUBLIC_API_BASE_URL
        : process.env.EXPO_PUBLIC_API_BASE_URL;

  return normalizeEnv(value);
};

/** Web: `NEXT_PUBLIC_API_BASE_URL`, Mobile: `EXPO_PUBLIC_API_BASE_URL` (.env 참고) */
export function getApiBaseUrl(): string {
  const url = readEnv('NEXT_PUBLIC_API_BASE_URL') ?? readEnv('EXPO_PUBLIC_API_BASE_URL');

  if (!url) {
    throw new Error(
      'API base URL is not set. Add NEXT_PUBLIC_API_BASE_URL (web) or EXPO_PUBLIC_API_BASE_URL (mobile) to .env'
    );
  }

  return url.replace(/\/$/, '');
}
