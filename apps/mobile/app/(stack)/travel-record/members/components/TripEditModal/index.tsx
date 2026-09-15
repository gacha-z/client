import { useEffect, useState } from 'react';
import { Text, TextInput, View } from 'react-native';

import type { TripDetail } from '@travel-gacha/types';
import { colors } from '@travel-gacha/ui';
import { Modal } from '@/components/Modal';

import { styles } from './index.css';

export type TripEditFormValues = {
  title: string;
  startDate: string;
  endDate: string;
  memberLimit: string;
  missionMin: string;
  missionMax: string;
  missionStartTime: string;
};

type TripEditModalProps = {
  visible: boolean;
  trip: TripDetail;
  loading?: boolean;
  onClose: () => void;
  onSave: (values: TripEditFormValues) => void;
};

const toFormValues = (trip: TripDetail): TripEditFormValues => ({
  title: trip.title,
  startDate: trip.startDate,
  endDate: trip.endDate,
  memberLimit: String(trip.memberLimit),
  missionMin: String(trip.missionMin),
  missionMax: String(trip.missionMax),
  missionStartTime: trip.missionStartAt.slice(11, 16)
});

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const TIME_PATTERN = /^\d{2}:\d{2}$/;

export function TripEditModal({
  visible,
  trip,
  loading = false,
  onClose,
  onSave
}: TripEditModalProps) {
  const [values, setValues] = useState<TripEditFormValues>(() => toFormValues(trip));

  useEffect(() => {
    if (!visible) return;
    setValues(toFormValues(trip));
  }, [trip, visible]);

  const update = (key: keyof TripEditFormValues) => (value: string) =>
    setValues((current) => ({ ...current, [key]: value }));

  const memberLimitNumber = Number(values.memberLimit);
  const missionMinNumber = Number(values.missionMin);
  const missionMaxNumber = Number(values.missionMax);

  const isValid =
    values.title.trim().length > 0 &&
    DATE_PATTERN.test(values.startDate) &&
    DATE_PATTERN.test(values.endDate) &&
    TIME_PATTERN.test(values.missionStartTime) &&
    Number.isInteger(memberLimitNumber) &&
    memberLimitNumber >= trip.joinedMemberCount &&
    Number.isInteger(missionMinNumber) &&
    missionMinNumber >= 1 &&
    Number.isInteger(missionMaxNumber) &&
    missionMaxNumber >= missionMinNumber;

  const handleSave = () => {
    if (!isValid) return;
    onSave(values);
  };

  return (
    <Modal
      visible={visible}
      title="여행 정보 수정"
      confirmText="저장하기"
      confirmDisabled={!isValid || loading}
      confirmLoading={loading}
      closeOnBackdropPress={!loading}
      onClose={onClose}
      onConfirm={handleSave}
    >
      <View style={styles.form}>
        <View style={styles.field}>
          <Text style={styles.fieldLabel}>여행 제목</Text>
          <TextInput
            accessibilityLabel="여행 제목 수정"
            value={values.title}
            onChangeText={update('title')}
            placeholder="여행 제목을 입력해주세요"
            placeholderTextColor={colors.grey300}
            style={styles.input}
          />
        </View>
        <View style={styles.row}>
          <View style={[styles.field, styles.rowField]}>
            <Text style={styles.fieldLabel}>시작일</Text>
            <TextInput
              accessibilityLabel="여행 시작일 수정"
              value={values.startDate}
              onChangeText={update('startDate')}
              placeholder="YYYY-MM-DD"
              placeholderTextColor={colors.grey300}
              style={styles.input}
            />
          </View>
          <View style={[styles.field, styles.rowField]}>
            <Text style={styles.fieldLabel}>종료일</Text>
            <TextInput
              accessibilityLabel="여행 종료일 수정"
              value={values.endDate}
              onChangeText={update('endDate')}
              placeholder="YYYY-MM-DD"
              placeholderTextColor={colors.grey300}
              style={styles.input}
            />
          </View>
        </View>
        <View style={styles.field}>
          <Text style={styles.fieldLabel}>정원</Text>
          <TextInput
            accessibilityLabel="여행 정원 수정"
            keyboardType="number-pad"
            value={values.memberLimit}
            onChangeText={(value) => update('memberLimit')(value.replace(/[^0-9]/g, ''))}
            style={styles.input}
          />
        </View>
        <View style={styles.row}>
          <View style={[styles.field, styles.rowField]}>
            <Text style={styles.fieldLabel}>하루 최소 미션</Text>
            <TextInput
              accessibilityLabel="하루 최소 미션 수 수정"
              keyboardType="number-pad"
              value={values.missionMin}
              onChangeText={(value) => update('missionMin')(value.replace(/[^0-9]/g, ''))}
              style={styles.input}
            />
          </View>
          <View style={[styles.field, styles.rowField]}>
            <Text style={styles.fieldLabel}>하루 최대 미션</Text>
            <TextInput
              accessibilityLabel="하루 최대 미션 수 수정"
              keyboardType="number-pad"
              value={values.missionMax}
              onChangeText={(value) => update('missionMax')(value.replace(/[^0-9]/g, ''))}
              style={styles.input}
            />
          </View>
        </View>
        <View style={styles.field}>
          <Text style={styles.fieldLabel}>첫 미션 시각</Text>
          <TextInput
            accessibilityLabel="첫 미션 시각 수정"
            value={values.missionStartTime}
            onChangeText={update('missionStartTime')}
            placeholder="HH:MM"
            placeholderTextColor={colors.grey300}
            style={styles.input}
          />
        </View>
      </View>
    </Modal>
  );
}
