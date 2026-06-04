# Mobile 앱 아키텍처

> 1차 개발은 **mobile 앱** 중심으로 진행합니다. web은 최소 뼈대만 유지합니다.

## 폴더 구조

```txt
apps/mobile/
├── app/                          # expo-router — 폴더명 = URL
│   ├── _layout.tsx
│   └── (tabs)/
│       ├── _layout.tsx
│       ├── index/                # 홈 — 필요 시 _layout.tsx(Stack) + 하위 화면
│       ├── travel/               # 탭 루트: index/ + (선택) _layout + 상세 폴더
│       ├── select/
│       ├── collection/
│       └── mission-log/
├── components/                   # 컴포넌트: 컴포넌트명/index.tsx + index.css.ts
│   ├── Header/
│   ├── Topbar/
│   ├── TabBar/
│   ├── ScreenLayout/
│   └── HomeStatus/
├── constants/
│   └── tabs.ts
├── app.json
└── metro.config.js
```

## 스타일 · 파일 규칙

**페이지(`app/`)와 컴포넌트(`components/`) 모두 동일한 규칙**을 따릅니다.

| 규칙                         | 설명                                                                            |
| ---------------------------- | ------------------------------------------------------------------------------- |
| 폴더 1개 = 화면/컴포넌트 1개 | `Travel/`, `Header/`처럼 이름 단위로 폴더 생성                                  |
| `index.tsx`                  | UI·로직만. `StyleSheet.create` / 인라인 스타일 객체 **금지**                    |
| `index.css.ts`               | `StyleSheet.create` + `@travel-gacha/ui` 토큰. `export const styles`            |
| import                       | `import { styles } from './index.css'`                                          |
| 동적 스타일                  | Safe area 등 런타임 값만 `style={[styles.foo, { paddingTop: n }]}` 로 배열 결합 |

### 페이지 예시 (`app/(tabs)/travel/`)

```txt
travel/
├── index.tsx       # export default function TravelListScreen()
└── index.css.ts    # export const styles = StyleSheet.create({ ... })
```

expo-router 탭 등록 이름: `<폴더명>/index` → `constants/tabs.ts`의 `tabRouteSegment()` 참고.

### 컴포넌트 예시

```txt
components/Header/
├── index.tsx       # export function Header() { ... }
└── index.css.ts
```

```tsx
import { Header } from '@/components/Header';
```

### 하지 않는 것

- 컴포넌트 파일 안에 `const styles = StyleSheet.create(...)` 정의
- `components/layout/TabBar.tsx`처럼 플랫 단일 파일 배치
- 스타일만을 위한 `.tsx` (스타일은 항상 `.css.ts`)

색·간격 토큰은 `@travel-gacha/ui`의 `colors` 등을 `index.css.ts`에서만 참조합니다.

## 라우팅

expo-router는 **Next App Router처럼** `app/` 아래 파일·폴더로 경로가 자동 생성됩니다.

| 폴더                  | URL            |
| --------------------- | -------------- |
| `(tabs)/index/`       | `/`            |
| `(tabs)/travel/`      | `/travel`      |
| `(tabs)/mission-log/` | `/mission-log` |

`(tabs)`는 URL에 포함되지 않는 **그룹**입니다.

탭 **라벨·순서**는 `constants/tabs.ts` (`tabRouteSegment`, `TABS`).

## `_layout.tsx`란?

Next App Router와 같습니다. **URL이 아니라**, 그 폴더 아래 화면에 공통으로 씌우는 **껍데기(네비게이터)** 입니다.

| 파일                          | 역할                                                                        |
| ----------------------------- | --------------------------------------------------------------------------- |
| `app/_layout.tsx`             | 앱 전체: `AppProviders`, 루트 `Stack` (현재 `(tabs)` 등록)                  |
| `app/(tabs)/_layout.tsx`      | 하단 탭: `Tabs` + `TabBar`, `constants/tabs.ts`의 `TABS`만 탭 버튼으로 노출 |
| `app/(tabs)/<탭>/_layout.tsx` | (선택) **그 탭 안**에서만 쌓이는 `Stack` — 상세·설정 등                     |

`(tabs)`는 **라우트 그룹**이라 URL 경로에 `(tabs)` 문자열이 붙지 않습니다.

```txt
app/_layout.tsx          →  AppProviders + Stack
  └── (tabs)/_layout.tsx →  Tabs + TabBar (5탭)
        ├── index/       →  홈 (탭 루트)
        ├── travel/
        └── ...
```

자식 화면은 **가장 가까운 `_layout` 체인**을 타고 렌더됩니다.  
그래서 `(tabs)/_layout` 아래에 있는 5개 탭 화면은 모두 하단 TabBar를 공유합니다.

## 5탭

| route          | 라벨      |
| -------------- | --------- |
| `/`            | 홈        |
| `/travel`      | 여행 목록 |
| `/select`      | 증강      |
| `/collection`  | 도감 목록 |
| `/mission-log` | 미션 로그 |

## 탭 vs 탭 밖 화면

**TabBar에 보이는 것** = `constants/tabs.ts`의 `TABS`뿐 (`TabBar`가 `TABS`만 그림).

| 추가하려는 것                  | `tabs.ts`        | 파일 위치                                        |
| ------------------------------ | ---------------- | ------------------------------------------------ |
| 하단 탭 6개째 등               | ✅ `TABS`에 추가 | `app/(tabs)/<이름>/index/`                       |
| 홈·여행 등 **탭 안** 상세/설정 | ❌ 추가 안 함    | `app/(tabs)/<탭>/_layout.tsx`(Stack) + 하위 폴더 |
| 온보딩·글쓰기 등 **탭 밖**     | ❌ 추가 안 함    | `app/<화면>/` + `app/_layout.tsx` Stack          |

**탭에 안 보이고, 버튼으로 들어가는 화면**은 아래 둘 중 하나로 추가합니다.

### 0) 홈(`index`) 탭에서만 화면이 늘어날 때 — 추천

하단 탭 개수는 그대로 두고, **홈(/)에서만** 설정·공지 등으로 이동할 때:

```txt
app/(tabs)/index/
├── _layout.tsx          # Stack (탭 안 네비게이터)
├── index/               # 홈 목록 — 탭 루트 (지금 화면)
│   ├── index.tsx
│   └── index.css.ts
└── settings/            # 예: /settings — TabBar에 안 뜸
    ├── index.tsx
    └── index.css.ts
```

```tsx
// app/(tabs)/index/_layout.tsx
import { Stack } from 'expo-router';

export default function HomeStackLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
```

```tsx
// app/(tabs)/index/index/index.tsx
import { router } from 'expo-router';

router.push('/settings');
```

`(tabs)/_layout.tsx`는 계속 `tabRouteSegment('index')` → `index/index` **하나만** 탭으로 등록합니다.  
`settings`는 **index 스택의 자식**이라 `tabs.ts`·TabBar에 넣지 않습니다.

### 1) 탭 안 스택 (다른 탭도 동일) — 추천

상세·설정처럼 **특정 탭에서만** 깊어지는 화면:

```txt
app/(tabs)/travel/
├── _layout.tsx          # Stack
├── index/               # 목록 (탭 루트) → /travel
│   ├── index.tsx
│   └── index.css.ts
└── [id]/                # 상세 → /travel/123 (TabBar에 안 뜸)
    ├── index.tsx
    └── index.css.ts
```

```tsx
// travel/index/index.tsx
import { router } from 'expo-router';

router.push(`/travel/${id}`);
```

`(tabs)/_layout.tsx`는 지금처럼 `TABS`만 `Tabs.Screen` 등록. `travel/[id]`는 **travel 스택 자식**이라 탭 바 목록에 안 붙습니다.

### 2) 탭 밖 루트 스택 (전체 화면, 하단 탭 숨김)

로그인·작성처럼 **앱 전역** 플로우 (예전 `WRITE`, `POST_DETAIL`):

```txt
app/
├── _layout.tsx          # Stack: (tabs) + 기타
├── (tabs)/...
└── write/               # /write
    └── index.tsx
```

```tsx
// app/_layout.tsx
<Stack>
  <Stack.Screen name="(tabs)" />
  <Stack.Screen name="write/index" />
</Stack>
```

```tsx
router.push('/write');
```

### (tabs) 직하위에 두면 안 되는 경우

`app/(tabs)/travel-detail/`처럼 **탭 그룹 바로 아래**에 파일을 추가하면 탭 라우트로 잡힐 수 있습니다.  
상세는 **`travel/` 안 스택** 또는 **`app/` 루트 스택**에 두세요.

`(tabs)/_layout`에 자동 등록되는 화면을 탭에서 숨기려면:

```tsx
<Tabs.Screen name="some-route/index" options={{ href: null }} />
```

## 화면 이동

```tsx
import { router } from 'expo-router';

router.push('/travel'); // 탭 루트
router.push('/travel/abc'); // 탭 안 스택 상세
router.push('/write'); // 탭 밖
router.back();
```

## Path alias

`@/*` → `apps/mobile` 루트

```tsx
import { ScreenLayout } from '@/components/ScreenLayout';
import { styles } from './index.css';
```
