# API 연동 계획

`docs/api-endpoint-status.md` 기준 미연동 17개 엔드포인트 중 이번 계획에서 다룰 범위와 순서를 정리한다.

- 작성 시점: 2026-09-16
- 대상: 9개 엔드포인트 (Trip 멤버 관리 5 + Setlog 2 + Device 푸시 2)
- 제외: Diary 6개, Batch 2개 (사유는 하단 참고)
- 구현 순서: **Phase 1 (Trip 멤버 관리) → Phase 2 (Setlog 실데이터 전환) → Phase 3 (Device 푸시 알림)**
  - Phase 3(Device)은 `expo-notifications`/`expo-device` 네이티브 의존성 추가로 EAS 개발 빌드 재생성이 필요해서, 순수 JS/RN 레벨인 Phase 1·2를 먼저 끝내 Expo Go/기존 개발 빌드로 빠르게 반복할 수 있게 마지막에 배치한다.

---

## Phase 1: Trip 멤버 관리

### 대상 API

| Method | Path                                        | 설명           |
| ------ | ------------------------------------------- | -------------- |
| POST   | `/api/v1/trips/join`                        | 여행 참여      |
| POST   | `/api/v1/trips/{tripId}/leave`              | 여행 나가기    |
| DELETE | `/api/v1/trips/{tripId}/members/{memberId}` | 팀원 강퇴      |
| PATCH  | `/api/v1/trips/{tripId}/owner`              | 방장 위임      |
| PATCH  | `/api/v1/trips/{tripId}`                    | 여행 정보 수정 |

### API 레이어 (`packages/api/src/queries/trip.ts`)

- `joinTrip`, `leaveTrip`, `kickTripMember`, `transferTripOwner`, `updateTrip` 함수 추가 (기존 `createTrip`/`cancelTrip` 패턴 — `unwrap` + `ApiEnvelope` 사용)
- `packages/types`에 필요한 요청 타입 추가 (예: `TripUpdateRequest`)
- 멤버/오너 변경 관련 mutation은 성공 시 `tripDetailQueryKey`, `tripMembersQueryKey` invalidate

### 화면 작업

1. **여행 참여 (join)**
   - 홈 탭(`(tabs)/index`)에 "여행 참여" 진입점 추가 (기존 "여행 만들기" 옆)
   - 초대코드 입력 모달/화면 신규 작성 → `joinTrip` 호출 → 성공 시 여행 상세로 이동

2. **여행중 관리자 페이지** (신규 stack 화면, 오너 전용)
   - `(stack)/travel-record/members` (가칭) 신설
   - `travel-record`의 "여행 멤버" 섹션 헤더에 "관리" 버튼 추가 → 이 화면으로 진입 (오너에게만 노출)
   - 강퇴 + 방장 위임 + 여행 정보 수정, 3개 액션 모두 포함
   - "여행중" 여부는 `TripStatus`에 별도 상태가 없으므로(`CREATED`/`CANCELLED`/`COMPLETED`뿐) `startDate`~`endDate` 날짜 비교로 판단 — `useTodayMission` 훅의 날짜 판단 로직 재사용

3. **여행 시작 전 멤버 초대 화면 개편**
   - `mission-select` 탭(중앙 버튼)의 `isIdle` 상태 플레이스홀더("미션이 곧 시작돼요")를 `travel-created`의 "여행 멤버 초대하기" 카드와 같은 형태의 섹션으로 교체/확장
   - 이 섹션에 강퇴 액션 추가 (오너에게만 노출)

4. **나가기 (leave)**
   - `travel-record`에 비오너 멤버 전용 버튼 추가 (기존 "여행 취소하기" 버튼과 같은 위치/스타일, 비오너에게만 노출)
   - 확인 모달 → `leaveTrip` 호출 → 성공 시 여행 목록으로 이동

---

## Phase 2: Setlog 실데이터 전환

### 대상 API

| Method | Path                                  | 설명               |
| ------ | ------------------------------------- | ------------------ |
| GET    | `/api/v1/trips/{tripId}/setlogs`      | 여행별 셋로그 목록 |
| GET    | `/api/v1/setlogs/{setlogId}/download` | 셋로그 다운로드    |

### 작업

- `packages/api/src/queries/setlog.ts`에 `tripSetlogsQueryOptions`, `downloadSetlog` 추가 (기존 `missionSetlogsQueryOptions` 패턴)
- `travel-record`의 `TravelRecord` 컴포넌트가 `TRAVEL_RECORD_MOCK`으로 채우던 일자/미션 목록을 `tripSetlogsQueryOptions` 실데이터로 교체
- `MissionCard`에 다운로드 액션 추가 → `downloadSetlog` 연동
- `TRAVEL_RECORD_MOCK` 및 관련 mock 유틸 정리(더 이상 참조되지 않으면 제거)

---

## Phase 3: Device 푸시 알림

### 대상 API

| Method | Path                                     | 설명                    |
| ------ | ---------------------------------------- | ----------------------- |
| POST   | `/api/v1/devices`                        | 기기 등록/갱신          |
| PATCH  | `/api/v1/devices/{deviceId}/permissions` | 디바이스 권한 상태 갱신 |

### 의존성

- `expo-notifications`, `expo-device`를 `pnpm-workspace.yaml` catalog에 추가
- `app.json`에 푸시 관련 네이티브 설정(플러그인 등) 추가 → EAS 개발 빌드 재생성 필요

### 작업

- `packages/api/src/queries/device.ts` 신설: `registerDevice`, `updateDevicePermissions`
- 앱 시작 시(또는 로그인 직후) OS 알림 권한 요청 → 승인 시 Expo Push Token 발급 → `registerDevice` 호출
- `apps/mobile/app/(stack)/settings`의 "앱 푸시 알림" 토글(`permissionSettingsAtom`)을 실제 OS 권한 상태와 동기화하고, 토글 변경 시 `updateDevicePermissions` 호출
- 포그라운드 복귀 시 토큰/권한 상태 재확인 로직 고려

---

## 범위 제외

- **Diary (6개)**: `packages/api`에 대응 query 파일이 없고, 목록/상세/작성/AI초안생성 화면 자체가 없다. API 연동이 아니라 신규 기능 설계가 선행돼야 해서 이번 계획에서 제외, 별도 기획으로 진행.
- **Batch (2개)**: `/batch/diary-reminders`, `/batch/trip-region-images`는 서버 크론/운영 트리거로 보이며 클라이언트가 직접 호출할 지점이 없어 제외.

## 완료 후

- 각 Phase 구현 완료 시 `docs/api-endpoint-status.md`의 연동 현황 표를 갱신 (사용자가 직접 진행 예정)
