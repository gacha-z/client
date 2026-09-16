export type DiaryVisibility = 'PRIVATE' | 'TEAM' | 'PUBLIC';

/** 날짜별 목록 조회(GET /trips/{tripId}/diaries) 응답 — 본문(content)을 포함하지 않는다 */
export type DiaryListItem = {
  id: string;
  tripId: string;
  memberId: string;
  memberNickname: string;
  diaryDate: string;
};

/** 단건 상세 조회/생성/수정 응답 — 본문을 포함한다 */
export type DiaryDetail = {
  id: string;
  tripId: string;
  memberId: string;
  memberNickname: string;
  content: string;
  diaryDate: string;
};
