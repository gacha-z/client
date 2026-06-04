type EnvRecord = Record<string, string | undefined>;

const readProcessEnv = (): EnvRecord => {
  const globalProcess = (globalThis as typeof globalThis & { process?: { env?: EnvRecord } })
    .process;

  return globalProcess?.env ?? {};
};

const readEnv = (name: string): string | undefined => {
  const value = readProcessEnv()[name];
  return value && value.length > 0 ? value : undefined;
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
