import { Text, View } from 'react-native';

import { Bigbutton } from '@/components/Bigbutton';
import { DiaryCard } from '@/components/DiaryCard';
import { MemberStatusPill } from '@/components/MemberStatusPill';
import { MissionSelectCard } from '@/components/MissionSelectCard';
import { PhotoTargetCard } from '@/components/PhotoTargetCard';
import { ScreenLayout } from '@/components/ScreenLayout';

import { styles } from './index.css';

const SAMPLE_THUMBNAIL = 'https://picsum.photos/seed/gachaz/246/153';

/** 임시 확인용 화면 — 신규 컴포넌트 5종을 한 번에 렌더링한다. 검수 후 삭제 예정. */
export default function ComponentPreviewScreen() {
  return (
    <ScreenLayout title="컴포넌트 미리보기" showHeader={false} showBack scrollable>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Bigbutton</Text>
        <Bigbutton label="미션 시작하기" onPress={() => {}} />
        <Bigbutton label="여행 종료하기" variant="dark" onPress={() => {}} />
        <Bigbutton label="미션 완료" disabled onPress={() => {}} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>MissionSelectCard</Text>
        <View style={styles.row}>
          <MissionSelectCard
            imageUri={SAMPLE_THUMBNAIL}
            placeName="경포해변"
            description="미션 내용이 들어갑니다. 미션 내용이 들어갑니다."
            address="상세주소 어쩌구 저쩌구"
            reward="🌊 파도 조각 x 1"
            status="default"
            onRetry={() => {}}
          />
          <MissionSelectCard
            imageUri={SAMPLE_THUMBNAIL}
            placeName="경포해변"
            description="미션 내용이 들어갑니다. 미션 내용이 들어갑니다."
            address="상세주소 어쩌구 저쩌구"
            reward="🌊 파도 조각 x 1"
            status="active"
            onRetry={() => {}}
          />
          <MissionSelectCard
            imageUri={SAMPLE_THUMBNAIL}
            placeName="경포해변"
            description="미션 내용이 들어갑니다. 미션 내용이 들어갑니다."
            address="상세주소 어쩌구 저쩌구"
            reward="🌊 파도 조각 x 1"
            status="inProgress"
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>MemberStatusPill</Text>
        <View style={styles.row}>
          <MemberStatusPill name="이정선" statusLabel="미션 미인증" variant="unverified" />
          <MemberStatusPill name="이정선" statusLabel="미션 인증" variant="verified" />
          <MemberStatusPill name="이정선" statusLabel="미션 인증" variant="ghost" />
          <MemberStatusPill
            name="이정선"
            statusLabel="미션 인증"
            variant="kickable"
            onPressKick={() => {}}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>PhotoTargetCard</Text>
        <PhotoTargetCard name="이정선" time="09:00" onPress={() => {}} />
        <PhotoTargetCard name="이정선" time="09:00" ready onPress={() => {}} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>DiaryCard</Text>
        <DiaryCard
          authorName="이정선"
          title="꺄올 여행이 너무 재밌다링"
          body="ㅎㅇㅎㅇ 여행 너무 재밌다 오늘은 1일 차 ㄷㄷㅎㅇㅎㅇ 여행 너무 재밌다 오늘은 1일 차 ㄷㄷ"
          dateTime="2025.09.21 23:50"
          onPress={() => {}}
        />
      </View>
    </ScreenLayout>
  );
}
