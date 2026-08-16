import { atom } from 'jotai';

import type { RegionCandidate, TravelCreateRequest } from '@travel-gacha/types';

export type TravelCreationState =
  | { step: 'form' }
  | { step: 'candidates'; request: TravelCreateRequest }
  | {
      step: 'created';
      request: TravelCreateRequest;
      selectedRegion: RegionCandidate;
    };

const initialTravelCreationState: TravelCreationState = { step: 'form' };

/** 여행 생성의 현재 단계와 단계별 필수 데이터를 함께 관리한다. */
export const travelCreationAtom = atom<TravelCreationState>(initialTravelCreationState);

/** 입력 확인 후 지역 후보 선택 단계로 이동한다. */
export const confirmTravelCreationAtom = atom(null, (_get, set, request: TravelCreateRequest) => {
  set(travelCreationAtom, { step: 'candidates', request });
});

/** 선택한 지역을 확정하고 여행 생성 완료 단계로 이동한다. */
export const completeTravelCreationAtom = atom(null, (get, set, region: RegionCandidate) => {
  const state = get(travelCreationAtom);
  if (state.step === 'form') return;

  set(travelCreationAtom, {
    step: 'created',
    request: state.request,
    selectedRegion: region
  });
});

/** 여행 생성 플로우의 모든 임시 데이터를 초기화한다. */
export const resetTravelCreationAtom = atom(null, (_get, set) => {
  set(travelCreationAtom, initialTravelCreationState);
});
