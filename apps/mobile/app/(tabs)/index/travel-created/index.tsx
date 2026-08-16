import { useCallback, useEffect, useRef, useState } from 'react';
import { Pressable, Share, Text, View } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { useRouter } from 'expo-router';
import { useAtomValue, useSetAtom } from 'jotai';

import { resetTravelCreationAtom, travelCreationAtom } from '@travel-gacha/store';
import { Bigbutton } from '@/components/Bigbutton';
import { ScreenLayout } from '@/components/ScreenLayout';
import { Toast, type ToastVariant } from '@/components/Toast';
import {
  formatKoreanDateRange,
  formatMissionTime,
  getTravelPartyLabel,
  getTravelPartyType,
  getTravelRoomTitle
} from '@/utils';

import { styles } from './index.css';

type ToastState = { message: string; variant: ToastVariant } | null;

const INVITATION_LINK_PLACEHOLDER = '(임시 링크)';

export default function TravelCreatedScreen() {
  const router = useRouter();
  const travelCreation = useAtomValue(travelCreationAtom);
  const resetTravelCreation = useSetAtom(resetTravelCreationAtom);
  const [copied, setCopied] = useState(false);
  const [isCopying, setIsCopying] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [toast, setToast] = useState<ToastState>(null);
  const movingHomeRef = useRef(false);
  const copyingRef = useRef(false);
  const sharingRef = useRef(false);
  const request = travelCreation.step === 'created' ? travelCreation.request : null;
  const region = travelCreation.step === 'created' ? travelCreation.selectedRegion : null;
  const dismissToast = useCallback(() => setToast(null), []);

  useEffect(() => {
    if (movingHomeRef.current) return;

    if (travelCreation.step === 'form') {
      router.replace('/travel-create');
      return;
    }

    if (travelCreation.step === 'candidates') router.replace('/region-candidates');
  }, [router, travelCreation.step]);

  if (!request || !region) return null;

  const invitationLink = INVITATION_LINK_PLACEHOLDER;
  const roomTitle = getTravelRoomTitle(request.title);
  const partyType = getTravelPartyType(request.memberCount);
  const partyLabel = getTravelPartyLabel(partyType);
  const missionTimeLabel = formatMissionTime(request.firstMissionHour, request.firstMissionMinute);

  const showToast = (message: string, variant: ToastVariant) => {
    setToast({ message, variant });
  };

  const handleCopyLink = async () => {
    if (copyingRef.current) return;

    copyingRef.current = true;
    setIsCopying(true);

    try {
      const copySucceeded = await Clipboard.setStringAsync(invitationLink);
      if (!copySucceeded) throw new Error('Clipboard copy failed');

      setCopied(true);
      showToast('초대 링크를 복사했어요.', 'success');
    } catch {
      setCopied(false);
      showToast('링크를 복사하지 못했어요. 다시 시도해주세요.', 'error');
    } finally {
      copyingRef.current = false;
      setIsCopying(false);
    }
  };

  const handleShareLink = async () => {
    if (sharingRef.current) return;

    sharingRef.current = true;
    setIsSharing(true);

    try {
      const result = await Share.share({
        title: `${request.title} 초대`,
        message: invitationLink
      });

      if (result.action === Share.sharedAction) {
        showToast('초대 링크를 공유했어요.', 'success');
      }
    } catch {
      showToast('링크를 공유하지 못했어요. 다시 시도해주세요.', 'error');
    } finally {
      sharingRef.current = false;
      setIsSharing(false);
    }
  };

  const handleMoveHome = () => {
    movingHomeRef.current = true;
    router.dismissAll();
    resetTravelCreation();
  };

  return (
    <View style={styles.screen}>
      <ScreenLayout title="여행 생성 완료" headerActions showTopbar={false} scrollable>
        <View style={styles.content}>
          <View style={styles.hero}>
            <View style={styles.heroCircleLeft} />
            <View style={styles.heroCircleRight} />
            <View style={styles.ticket}>
              <Text style={styles.ticketBadge}>여행 준비 완료</Text>
              <Text style={styles.ticketTitle}>{roomTitle}</Text>
            </View>
          </View>

          <View style={styles.intro}>
            <Text style={styles.heading}>여행 계획이 생성되었습니다!</Text>
            {partyType === 'solo' ? (
              <Text style={styles.description}>
                이제 여행방에서 미션과 일정을 확인할 수 있어요.{`\n`}첫 미션은 설정한 시각에 맞춰
                둘째 날부터 도착합니다.
              </Text>
            ) : (
              <Text style={styles.description}>
                이제 함께 떠날 사람에게 초대 링크를 공유해보세요!{`\n`}친구가 들어오면 같은
                여행방에서 미션과 일정을 함께 확인할 수 있어요.
              </Text>
            )}
          </View>

          <View style={styles.infoCard}>
            <View style={styles.infoHeader}>
              <Text style={styles.infoTitle}>여행방 정보</Text>
              <Text style={styles.statusBadge}>{partyLabel}</Text>
            </View>
            <View style={styles.infoRows}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>여행 제목</Text>
                <Text style={styles.infoValue}>{request.title}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>여행 날짜</Text>
                <Text style={styles.infoValue}>
                  {formatKoreanDateRange(request.startDate, request.endDate)}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>선택 지역</Text>
                <Text style={styles.infoValue}>{region?.name ?? '-'}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>하루 미션</Text>
                <Text style={styles.infoValue}>
                  최소 {request.minimumMissionCount}개 ~ 최대 {request.maximumMissionCount}개
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>첫 미션 시각</Text>
                <Text style={styles.infoValue}>{missionTimeLabel}</Text>
              </View>
            </View>
          </View>

          {partyType === 'group' ? (
            <View style={styles.invitationCard}>
              <Text style={styles.invitationTitle}>여행 멤버 초대하기</Text>
              <View style={styles.linkBox}>
                <Text style={styles.linkText} numberOfLines={1}>
                  {invitationLink}
                </Text>
                <Pressable
                  accessibilityRole="button"
                  accessibilityState={{ busy: isCopying, disabled: isCopying }}
                  disabled={isCopying}
                  style={styles.copyButton}
                  onPress={() => void handleCopyLink()}
                >
                  <Text style={styles.copyText}>
                    {isCopying ? '복사 중' : copied ? '복사됨' : '복사하기'}
                  </Text>
                </Pressable>
              </View>
              <Bigbutton
                label="링크 공유하기"
                variant="dark"
                loading={isSharing}
                onPress={() => void handleShareLink()}
              />
            </View>
          ) : null}

          <Bigbutton label="홈으로" onPress={handleMoveHome} />
        </View>
      </ScreenLayout>
      <Toast
        visible={Boolean(toast)}
        message={toast?.message ?? ''}
        variant={toast?.variant}
        onDismiss={dismissToast}
      />
    </View>
  );
}
