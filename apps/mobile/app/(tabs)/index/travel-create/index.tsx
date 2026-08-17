import { useCallback, useRef, useState, type ReactNode } from 'react';
import { Text, View } from 'react-native';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { useSetAtom } from 'jotai';

import { confirmTravelCreationAtom, resetTravelCreationAtom } from '@travel-gacha/store';
import { Bigbutton } from '@/components/Bigbutton';
import { FormInput } from '@/components/FormInput';
import { MemberSelector } from '@/components/MemberSelector';
import { Modal } from '@/components/Modal';
import { ScreenLayout } from '@/components/ScreenLayout';
import { TravelScheduleCalendar } from '@/components/TravelScheduleCalendar';
import {
  TRAVEL_HOUR_OPTIONS,
  TRAVEL_MINUTE_OPTIONS,
  TRAVEL_MISSION_COUNT_LIMITS
} from '@/constants';
import { RandomIcon } from '@/components/icons';
import { useTravelCreateForm } from '@/hooks';
import { formatTravelDate } from '@/utils';

import { styles } from './index.css';

const getParam = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : value;

type FormSectionProps = {
  title: string;
  description?: string;
  children: ReactNode;
};

function FormSection({ title, description, children }: FormSectionProps) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {description && <Text style={styles.sectionDescription}>{description}</Text>}
      </View>
      {children}
    </View>
  );
}

export default function TravelCreateScreen() {
  const router = useRouter();
  const confirmTravelCreation = useSetAtom(confirmTravelCreationAtom);
  const resetTravelCreation = useSetAtom(resetTravelCreationAtom);
  const generatingRef = useRef(false);
  const params = useLocalSearchParams<{ startDate?: string; endDate?: string }>();
  const {
    startDate,
    endDate,
    title,
    missionCount,
    missionTime,
    memberCount,
    activeDateField,
    formComplete,
    missionTimeLabel,
    setTitle,
    setMemberCount,
    setMissionHour,
    setMissionMinute,
    handleMissionCountChange,
    handleDateRangeChange,
    toggleDateField,
    createRequest
  } = useTravelCreateForm({
    initialStartDate: getParam(params.startDate),
    initialEndDate: getParam(params.endDate)
  });
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [isGeneratingCandidates, setIsGeneratingCandidates] = useState(false);

  useFocusEffect(
    useCallback(() => {
      resetTravelCreation();
    }, [resetTravelCreation])
  );

  const handleConfirmCreate = () => {
    if (generatingRef.current) return;

    const request = createRequest();
    if (!request) return;

    generatingRef.current = true;
    setIsGeneratingCandidates(true);

    confirmTravelCreation(request);
    setConfirmationOpen(false);
    router.push('/region-candidates');
  };

  const handleOpenConfirmation = () => {
    generatingRef.current = false;
    setIsGeneratingCandidates(false);
    setConfirmationOpen(true);
  };

  return (
    <ScreenLayout title="여행 생성" headerActions showTopbar={false} scrollable>
      <View style={styles.content}>
        <FormSection
          title="여행 정보를 입력해주세요!"
          description="입력한 여행 정보를 바탕으로 어울리는 지역 후보 3곳을 추천해드려요."
        >
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>선택한 여행 날짜</Text>
            <View style={styles.row}>
              <FormInput
                variant="date"
                label="시작"
                value={formatTravelDate(startDate)}
                expanded={activeDateField === 'start'}
                onPress={() => toggleDateField('start')}
              />
              <FormInput
                variant="date"
                label="종료"
                value={formatTravelDate(endDate)}
                expanded={activeDateField === 'end'}
                onPress={() => toggleDateField('end')}
              />
            </View>
            {activeDateField && (
              <TravelScheduleCalendar
                initialStartDate={startDate}
                initialEndDate={endDate}
                onRangeChange={handleDateRangeChange}
              />
            )}
          </View>
          <FormInput
            variant="text"
            label="여행 제목"
            value={title}
            placeholder="예: 강원도 즉흥 여행"
            onChangeText={setTitle}
          />
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>하루 미션 수</Text>
            <View style={styles.row}>
              <FormInput
                variant="number"
                label="최소"
                value={missionCount.min}
                suffix="개"
                min={TRAVEL_MISSION_COUNT_LIMITS.min}
                max={missionCount.max}
                onChange={(value) => handleMissionCountChange('min', value)}
              />
              <FormInput
                variant="number"
                label="최대"
                value={missionCount.max}
                suffix="개"
                min={missionCount.min}
                max={TRAVEL_MISSION_COUNT_LIMITS.max}
                onChange={(value) => handleMissionCountChange('max', value)}
              />
            </View>
          </View>
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>첫 미션 받을 시각</Text>
            <View style={styles.row}>
              <FormInput
                variant="time"
                value={missionTime.hour}
                options={TRAVEL_HOUR_OPTIONS}
                onValueChange={setMissionHour}
              />
              <FormInput
                variant="time"
                value={missionTime.minute}
                options={TRAVEL_MINUTE_OPTIONS}
                onValueChange={setMissionMinute}
              />
            </View>
            <Text style={styles.hint}>
              여행 둘째 날부터 선택한 시각에 첫 미션 알림을 보내드려요!
            </Text>
          </View>
        </FormSection>

        <FormSection title="여행 인원을 선택해주세요!">
          <MemberSelector value={memberCount} onChange={setMemberCount} />
        </FormSection>

        <Bigbutton
          icon={<RandomIcon />}
          label="랜덤 지역 3곳 추천 받기"
          disabled={!formComplete}
          onPress={handleOpenConfirmation}
        />
      </View>
      <Modal
        visible={confirmationOpen}
        onClose={() => {
          if (!isGeneratingCandidates) setConfirmationOpen(false);
        }}
        title="여행 정보를 확인해주세요!"
        confirmText="생성하기"
        onConfirm={handleConfirmCreate}
        confirmLoading={isGeneratingCandidates}
        closeOnBackdropPress={!isGeneratingCandidates}
        showCloseButton={false}
      >
        <View style={styles.confirmationDetails}>
          <Text style={styles.confirmationText}>여행 제목: {title.trim()}</Text>
          <Text style={styles.confirmationText}>
            하루 미션 수: {missionCount.min}~{missionCount.max}개
          </Text>
          <Text style={styles.confirmationText}>첫 미션 받을 시각: {missionTimeLabel}</Text>
          <Text style={styles.confirmationText}>여행 인원: {memberCount}명</Text>
          <Text style={styles.confirmationText}>
            여행 날짜: {formatTravelDate(startDate)}~{formatTravelDate(endDate)}
          </Text>
        </View>
      </Modal>
    </ScreenLayout>
  );
}
