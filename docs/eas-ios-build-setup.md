# EAS Build — iOS 세팅 체크리스트

> 2026-09-13 기준, `apps/mobile`에 EAS Build로 iOS 빌드를 만들어 App Store Connect(TestFlight)까지 제출하는 파이프라인 구축 완료. 아래는 처음부터 다시 세팅할 경우를 위한 기록.

## 0. 최종 상태 (2026-09-13)

**iOS production 빌드 → App Store Connect(TestFlight) 제출까지 성공.**

### ✅ 완료된 것

1. **EAS 프로젝트 연결**
   - Expo 계정 `kimd0ng` (kdongh0406@gmail.com)
   - `app.json`의 `extra.eas.projectId` / `owner`로 연결
   - `apps/mobile/eas.json`에 `development`/`preview`/`production` 빌드 프로필, `cli.appVersionSource: "remote"`

2. **환경변수**
   - `EXPO_PUBLIC_API_BASE_URL` = `http://ec2-13-125-237-45.ap-northeast-2.compute.amazonaws.com/` (⚠️ 평문 HTTP — 1.6 참고, HTTPS 전환 필요)

3. **iOS 배포 인증서 / Provisioning Profile — 수동 생성 + 로컬 자격증명**
   - **왜 수동인가**: `eas build`/`eas submit`이 Apple Developer Portal에 자동 로그인하려는 단계에서 아래 에러가 반복 발생 — 계정/권한/버전 문제 아님, EAS/`@expo/apple-utils`의 Apple 세션 통신 관련 버그로 추정.
     ```
     Authentication with Apple Developer Portal failed!
     iTunes service key is empty
     ```
   - 우회 방법: OpenSSL로 CSR/개인키를 직접 만들어 Apple Developer 포털에서 `Apple Distribution` 인증서를 발급받고, `.p12`/`.mobileprovision`을 **로컬 파일로 EAS에 연결** (`eas credentials`의 Apple 자동 로그인 경로를 타지 않도록).
   - **주의**: OpenSSL 3.x는 `.p12` 기본 암호화 방식이 macOS 키체인과 호환되지 않음 → export 시 반드시 `-legacy` 옵션 사용.
     ```bash
     openssl genrsa -out ios_distribution.key 2048
     openssl req -new -key ios_distribution.key -out CertificateSigningRequest.certSigningRequest \
       -subj "/emailAddress=<email>/CN=<name>/C=KR"
     # Apple Developer 포털에서 Apple Distribution 인증서 발급 → .cer 다운로드
     openssl x509 -in ios_distribution.cer -inform DER -out ios_distribution.pem -outform PEM
     openssl pkcs12 -export -legacy -inkey ios_distribution.key -in ios_distribution.pem \
       -out ios_distribution.p12 -passout 'pass:<password>'
     ```
   - `apps/mobile/eas.json`의 `build.production.ios.credentialsSource: "local"` + `apps/mobile/credentials.json`(gitignore 대상, 절대경로로 `.p12`/`.mobileprovision` 참조)으로 연결.
   - 인증서/프로파일 실물 파일은 **레포 밖** 로컬 경로(`C:\projects\gachaz\apiKey\`)에 보관.

4. **App Store Connect 제출 — API Key 인증**
   - `eas submit`도 같은 Apple 로그인 버그를 타므로, Apple ID/비밀번호 대신 **App Store Connect API Key**(.p8) 방식 사용.
   - `eas.json`의 `submit.production.ios`에 `ascApiKeyPath`/`ascApiKeyIssuerId`/`ascApiKeyId` 지정.
   - `eas submit`이 "앱 존재 확인" 단계에서도 같은 버그를 타므로 `ascAppId`(App Store Connect의 숫자 Apple ID)를 명시해서 그 단계 자체를 스킵.
   - App Store Connect에 앱 레코드(`dk.gatcha.app`)를 미리 생성해둬야 함.

5. **Apple 요구사항 변경 대응 — Xcode 26(iOS 26 SDK) 강제**
   - 위 1~4까지 세팅 후 첫 제출 시 App Store Connect가 거부:
     ```
     ITMS-90725: SDK version issue. This app was built with the iOS 17.5 SDK.
     All iOS and iPadOS apps must be built with the iOS 26 SDK or later.
     ```
   - `eas.json`의 `build.production.ios.image: "latest"`로 변경해 EAS 빌드 이미지를 Xcode 26으로 전환.
   - 하지만 **Expo SDK 51은 Xcode ≤16.2까지만 지원** (`expo-doctor`가 하드 블로킹) → Expo SDK 자체를 **51 → 57**로 업그레이드해야 했음.

6. **Expo SDK 51 → 57 업그레이드로 발생한 이슈들과 수정 내역**
   - `npx expo install expo@^57.0.0` → `npx expo install --fix`로 관련 패키지 전부 정렬 (React 19.2.3, React Native 0.86.3, expo-router 57.x 등). `pnpm-workspace.yaml`의 `catalogs.expo`에 새 버전 반영, `apps/mobile/package.json`에서 `catalog:expo` 참조로 정리.
   - **`react`/`react-dom`/`@types/react`/`typescript`를 default catalog에서 `catalogs.expo`로 분리**: `apps/web`(Next 14)은 React 18을 그대로 써야 해서, 모바일 전용 버전을 별도 catalog로 분리 (default catalog는 건드리지 않음).
   - **`jotai` 2.x → 3.0.0**: React 19의 JSX 타입 강화로 `packages/store`의 `JotaiProvider` 사용부에서 `TS2786` 타입 에러 발생 → jotai 3.0(React 19 지원)으로 업그레이드. web(React 18)도 peer 범위(`>=18`) 내라 default catalog에서 그대로 공유 가능.
   - **`packages/store`의 `@types/react`를 `catalog:expo`로 분리**: `packages/store`는 모바일에서만 쓰이는데 devDependency가 default catalog(React 18 타입)를 참조하고 있어서, 모바일 컴파일 시 React 18/19 타입 정의가 동시에 로드되며 `ReactElement`/`ReactNode` 타입 충돌 발생 → 모바일과 동일한 `catalog:expo`로 맞춰 해결.
   - **`StyleSheet.absoluteFillObject` 제거됨** (RN 0.86) → `StyleSheet.absoluteFill`로 교체 (`app/(stack)/mission-log-capture/[memberId]/index.css.ts`).
   - **`@react-navigation/bottom-tabs` 직접 참조 불가** — expo-router 57부터 React Navigation을 외부 의존성이 아니라 내부에 자체 번들 → `import ... from '@react-navigation/bottom-tabs'` → `import ... from 'expo-router/tabs'`로 변경 (`components/NavigationBar/index.tsx`, `app/(tabs)/_layout.tsx`의 `Tabs` import도 동일하게 `expo-router/tabs`로). API(`tabBar`, `backBehavior`, `Tabs.Screen` 등)는 동일하게 유지됨.
   - **`tsconfig.json`의 `types: ["expo-router/types", "node"]`** — `expo-router/types` 경로가 SDK 57에서 제거됨 → `["node"]`로 정리 (`.expo/types/**/*.ts` include는 그대로 유지, 타입드 라우트는 정상 동작).
   - `expo-dev-menu@5.0.23`(SDK 51 당시 `expo-dev-client`의 전이 의존성)의 `TARGET_IPHONE_SIMULATOR` Swift 컴파일 에러(Xcode 16.3+/26에서 제거된 레거시 매크로)는 SDK 57 업그레이드로 자연히 해결됨 (한때 `pnpm patch`로 우회했었으나 SDK 업그레이드 후 패치 제거).
   - 검증: `tsc --noEmit`(mobile/web/store/api 전부 통과), `eslint` 통과, `expo export --platform ios`로 전체 JS 번들(1935 모듈) 정상 컴파일 확인.

7. **`app.json`에서 최신 Expo config 스키마에 없는 `ios.appleTeamId` 필드 제거** (`expo doctor` 스키마 검증 에러 수정 — Team ID는 인증서/프로파일 자체에 담겨 있어 불필요).

### 📌 참고 — 인증서/키 파일 보관 위치

`.p12`/`.mobileprovision`/App Store Connect API Key(`.p8`)는 레포 트리 밖(`C:\projects\gachaz\apiKey\`)에 보관하고 `apps/mobile/credentials.json`(gitignore 대상, 절대경로 참조)으로 연결. 인증서 만료일: 2027-09-13.

## 1. ⚠️ TODO — 아직 남은 것

### 1.1 ATS 예외 임시 등록 (HTTP → HTTPS 전환 필요)

`EXPO_PUBLIC_API_BASE_URL`이 현재 평문 HTTP라 `app.json`의 `ios.infoPlist.NSAppTransportSecurity.NSExceptionDomains`에 해당 도메인 예외를 **임시로** 등록해 둔 상태.

**반드시 나중에 되돌려야 함:**

- 백엔드(EC2)에 HTTPS 적용 (ACM + ALB, 또는 Let's Encrypt/Nginx 등)
- `EXPO_PUBLIC_API_BASE_URL`을 `https://`로 변경
- `app.json`에서 `NSAppTransportSecurity` 예외 블록 제거
- App Store 정식 심사 전 반드시 HTTPS로 전환할 것 (평문 HTTP 사용 사유를 심사에서 물어볼 수 있음)

### 1.2 스플래시 스크린 미설정

`app.json` plugins에 `expo-splash-screen`이 없음 → 기본(빈 화면) 스플래시로 빌드됨.

### 1.3 아이콘 사양 확인

`assets/images/icon.png` 하나만 존재. iOS는 1024×1024, 알파 채널 없는 PNG를 요구함 — 실제 치수/알파 채널 미확인 상태.

### 1.4 App Store 심사 제출

TestFlight 업로드까지는 완료. 정식 심사 제출은 App Store Connect에서 스크린샷/설명/심사 노트 작성 후 별도 진행 필요.

### 1.5 `eas-cli` 버전 고정

로컬에 전역 설치된 `eas-cli`가 20.1.0(구버전). 최신(24.x)에서도 동일한 Apple 인증 버그가 재현됨을 확인했으므로 버전 문제는 아니지만, 재현성을 위해 `apps/mobile` 또는 루트 devDependency로 버전 고정 권장.

### 1.6 development/preview 프로필 credentials 미설정

`production` 프로필만 `credentialsSource: "local"`로 설정함. `development`/`preview` 프로필로 빌드하려면 동일하게 로컬 자격증명 설정이 필요 (또는 별도 Ad Hoc 인증서/프로파일 생성).
