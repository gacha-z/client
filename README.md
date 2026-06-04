# 여행가챠 (Travel Gacha)

Turborepo + pnpm 모노레포. **모바일(Expo)** 을 1차 개발 대상으로 하고, **웹(Next.js)** 은 공유 패키지를 쓰는 최소 뼈대만 유지합니다.

## 기술 스택

| 영역       | 스택                                                       |
| ---------- | ---------------------------------------------------------- |
| Monorepo   | Turborepo, pnpm (catalog)                                  |
| Mobile     | Expo SDK 51, expo-router, React Native                     |
| Web        | Next.js 14 App Router                                      |
| 상태 / API | Jotai, TanStack Query, Axios                               |
| 스타일     | `@travel-gacha/ui` 토큰 + RN `StyleSheet` (`index.css.ts`) |

## 요구 사항

- Node.js 18+
- [pnpm](https://pnpm.io/) 9 (`packageManager` 필드 기준)

## 시작하기

```bash
pnpm install
```

환경 변수 (모바일 API):

```bash
cp apps/mobile/.env.example apps/mobile/.env
# EXPO_PUBLIC_API_BASE_URL=https://your-api.example.com
```

### 개발 서버

```bash
# 모바일 (Expo) — 주 개발 대상
pnpm dev:mobile

# 캐시 초기화 후 실행 (설정 변경 후)
pnpm --filter mobile dev:clear

# 웹 (Next.js)
pnpm dev:web
```

Expo 실행 후 터미널에서 `i`(iOS), `a`(Android), `w`(web)로 플랫폼을 선택합니다. iOS 실기기/시뮬레이터는 **Expo Go SDK 51** 과 맞춰 주세요.

### 기타 스크립트

| 명령                | 설명                               |
| ------------------- | ---------------------------------- |
| `pnpm build`        | 전 워크스페이스 빌드               |
| `pnpm typecheck`    | TypeScript 검사                    |
| `pnpm lint`         | ESLint                             |
| `pnpm format`       | Prettier 포맷 (`.prettierrc.json`) |
| `pnpm format:check` | Prettier 검사만                    |

에디터: `.vscode/settings.json` — 저장 시 Prettier (`esbenp.prettier-vscode` 확장 권장)

## 저장소 구조

```txt
apps/
  mobile/          # Expo 앱 (expo-router, 5탭)
  web/             # Next.js (최소)
packages/
  api/             # Axios 클라이언트, queryOptions
  store/           # Jotai, AppProviders, QueryClient
  ui/              # theme / colors (공통)
  types/           # 공유 타입
  utils/           # 공유 유틸
  eslint-config/   # ESLint 공유 설정
  typescript-config/
docs/              # 아키텍처 문서
```

## 모바일 앱 요약

- **라우팅**: `app/` 폴더 = URL (Next App Router와 유사). 하단 탭은 `app/(tabs)/` 아래 5개.
- **탭 정의**: `apps/mobile/constants/tabs.ts` — TabBar에 보이는 화면만 등록. 탭이 아닌 상세·모달 화면은 여기에 넣지 않음.
- **스타일**: 페이지·컴포넌트마다 폴더 하나 + `index.tsx` + `index.css.ts` (스타일은 TSX에 두지 않음).

| 탭 경로        | 라벨      |
| -------------- | --------- |
| `/`            | 홈        |
| `/travel`      | 여행 목록 |
| `/select`      | 증강      |
| `/collection`  | 도감 목록 |
| `/mission-log` | 미션 로그 |

## 문서

- [모노레포 구조](./docs/monorepo-architecture.md)
- [모바일 앱 (라우팅, 스타일, 탭 vs 하위 화면)](./docs/mobile-architecture.md)

## 워크스페이스 패키지 import

```tsx
import { theme, colors } from '@travel-gacha/ui';
import { AppProviders } from '@travel-gacha/store';
import { getApiClient } from '@travel-gacha/api';
```

모바일 앱 내부는 `@/*` → `apps/mobile` 루트 (`tsconfig` paths).
