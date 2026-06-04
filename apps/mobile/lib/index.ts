/**
 * 앱 전용 얇은 래퍼 (네이티브 연동, API 헬퍼 등).
 * HTTP 클라이언트·queryOptions는 `@travel-gacha/api` 사용.
 */

export { getApiClient, isApiError, ApiError } from '@travel-gacha/api';
