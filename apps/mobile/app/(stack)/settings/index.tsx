import { useEffect, useState } from 'react';
import { Alert, Linking, Pressable, Text, View } from 'react-native';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useAtom, useSetAtom } from 'jotai';

import {
  currentMemberQueryOptions,
  deleteMember,
  isApiError,
  updateMember
} from '@travel-gacha/api';
import {
  logoutAtom,
  permissionSettingsAtom,
  resetSettingsAtom,
  userProfileAtom,
  withdrawAccountAtom
} from '@travel-gacha/store';
import { colors } from '@travel-gacha/ui';
import { ArrowDownIcon } from '@/components/icons';
import { ScreenLayout } from '@/components/ScreenLayout';
import { clearSessionAfterWithdrawal, signOut } from '@/services/auth';
import { getDevMemberId } from '@/services/authSession';
import { clearDeviceId } from '@/services/deviceSession';
import {
  getCameraPermissionGranted,
  getLocationPermissionGranted,
  requestCameraPermission,
  requestLocationPermission
} from '@/services/permissions';
import {
  getPushNotificationStatus,
  requestPushNotificationRegistration
} from '@/services/pushNotifications';
import { AccountConfirmModal } from './components/AccountConfirmModal';
import { PermissionToggle } from './components/PermissionToggle';
import { ProfileEditModal } from './components/ProfileEditModal';
import { styles } from './index.css';

type ConfirmationType = 'logout' | 'withdrawal' | null;

export default function SettingsScreen() {
  const [profile, setProfile] = useAtom(userProfileAtom);
  const [permissions, setPermissions] = useAtom(permissionSettingsAtom);
  const logout = useSetAtom(logoutAtom);
  const withdrawAccount = useSetAtom(withdrawAccountAtom);
  const resetSettings = useSetAtom(resetSettingsAtom);
  const [permissionsExpanded, setPermissionsExpanded] = useState(false);
  const [profileEditorVisible, setProfileEditorVisible] = useState(false);
  const [confirmationType, setConfirmationType] = useState<ConfirmationType>(null);
  const [pendingAction, setPendingAction] = useState<Exclude<ConfirmationType, null> | null>(null);
  const memberId = getDevMemberId();
  const memberQuery = useQuery(currentMemberQueryOptions(memberId));
  const profileMutation = useMutation({
    mutationFn: updateMember,
    onSuccess: (member) => {
      setProfile((current) => ({ ...current, nickname: member.nickname, age: member.age }));
      setProfileEditorVisible(false);
    },
    onError: (error) => {
      Alert.alert(
        '프로필 수정 실패',
        isApiError(error) ? error.message : '잠시 후 다시 시도해주세요.'
      );
    }
  });

  useEffect(() => {
    if (!memberQuery.data) return;
    setProfile((current) => ({
      ...current,
      nickname: memberQuery.data.nickname,
      age: memberQuery.data.age
    }));
  }, [memberQuery.data, setProfile]);

  useEffect(() => {
    let mounted = true;
    void Promise.all([
      getCameraPermissionGranted(),
      getLocationPermissionGranted(),
      getPushNotificationStatus()
    ]).then(([camera, location, pushNotification]) => {
      if (mounted) setPermissions({ camera, location, pushNotification });
    });
    return () => {
      mounted = false;
    };
  }, [setPermissions]);

  const saveProfile = (update: Pick<typeof profile, 'nickname' | 'age'>) => {
    if (!memberId) {
      Alert.alert('프로필 수정 실패', '회원 ID를 찾을 수 없어요. 다시 로그인해주세요.');
      return;
    }
    profileMutation.mutate({ memberId, ...update });
  };

  const confirmOpenSettings = (title: string, message: string) => {
    Alert.alert(title, message, [
      { text: '취소', style: 'cancel' },
      { text: '설정으로 이동', onPress: () => void Linking.openSettings() }
    ]);
  };

  const handleToggleCamera = async (value: boolean) => {
    if (!value) {
      confirmOpenSettings(
        '카메라 권한 끄기',
        '카메라 권한은 기기 설정에서 끌 수 있어요. 설정 화면으로 이동할까요?'
      );
      return;
    }

    const granted = await requestCameraPermission(memberId);
    setPermissions((current) => ({ ...current, camera: granted }));
    if (!granted) {
      confirmOpenSettings(
        '카메라 권한이 꺼져있어요',
        '기기 설정에서 카메라 접근 권한을 허용해주세요.'
      );
    }
  };

  const handleToggleLocation = async (value: boolean) => {
    if (!value) {
      confirmOpenSettings(
        'GPS 권한 끄기',
        '위치 권한은 기기 설정에서 끌 수 있어요. 설정 화면으로 이동할까요?'
      );
      return;
    }

    const granted = await requestLocationPermission(memberId);
    setPermissions((current) => ({ ...current, location: granted }));
    if (!granted) {
      confirmOpenSettings('GPS 권한이 꺼져있어요', '기기 설정에서 위치 접근 권한을 허용해주세요.');
    }
  };

  const handleTogglePushNotification = async (value: boolean) => {
    if (!memberId) return;

    if (!value) {
      confirmOpenSettings(
        '앱 푸시 알림 끄기',
        '앱 알림 권한은 기기 설정에서 끌 수 있어요. 설정 화면으로 이동할까요?'
      );
      return;
    }

    const granted = await requestPushNotificationRegistration(memberId);
    setPermissions((current) => ({ ...current, pushNotification: granted }));
    if (!granted) {
      confirmOpenSettings('알림 권한이 꺼져있어요', '기기 설정에서 앱 알림 권한을 허용해주세요.');
    }
  };

  const handleLogout = async () => {
    if (pendingAction) return;

    setPendingAction('logout');
    try {
      await signOut();
      setConfirmationType(null);
      logout();
    } finally {
      setPendingAction(null);
    }
  };

  const handleWithdrawal = async () => {
    if (pendingAction) return;

    setPendingAction('withdrawal');
    try {
      if (!memberId) throw new Error('회원 ID를 찾을 수 없어요. 다시 로그인해주세요.');
      await deleteMember(memberId);
      await clearSessionAfterWithdrawal();
      await clearDeviceId();
      resetSettings();
      setConfirmationType(null);
      withdrawAccount();
    } catch (error) {
      Alert.alert(
        '회원 탈퇴 실패',
        isApiError(error) || error instanceof Error ? error.message : '잠시 후 다시 시도해주세요.'
      );
    } finally {
      setPendingAction(null);
    }
  };

  return (
    <ScreenLayout title="설정" scrollable>
      <View style={styles.container}>
        <View style={styles.profileSection}>
          <View style={styles.profileRow}>
            <View style={styles.avatar}>
              <View style={styles.avatarHead} />
              <View style={styles.avatarBody} />
            </View>
            <View style={styles.profileCopy}>
              <Text style={styles.nickname}>{profile.nickname}</Text>
              <Text style={styles.profileMeta}>{profile.email}</Text>
              <Text style={styles.profileMeta}>{profile.age}세</Text>
            </View>
          </View>

          <Pressable
            accessibilityRole="button"
            onPress={() => setProfileEditorVisible(true)}
            style={({ pressed }) => [styles.profileEditButton, pressed && styles.pressed]}
          >
            <Text style={styles.profileEditLabel}>프로필 수정</Text>
          </Pressable>
        </View>

        <View style={styles.menuSection}>
          <View style={styles.settingsSection}>
            <Pressable
              accessibilityRole="button"
              accessibilityState={{ expanded: permissionsExpanded }}
              onPress={() => setPermissionsExpanded((current) => !current)}
              style={styles.sectionHeader}
            >
              <Text style={styles.sectionTitle}>권한 설정</Text>
              <View style={permissionsExpanded && styles.arrowExpanded}>
                <ArrowDownIcon size={16} color={colors.black} />
              </View>
            </Pressable>

            {permissionsExpanded && (
              <View style={styles.permissionList}>
                <PermissionToggle
                  label="카메라"
                  value={permissions.camera}
                  onValueChange={(value) => void handleToggleCamera(value)}
                />
                <PermissionToggle
                  label="GPS"
                  value={permissions.location}
                  onValueChange={(value) => void handleToggleLocation(value)}
                />
                <PermissionToggle
                  label="앱 푸시 알림"
                  value={permissions.pushNotification}
                  onValueChange={(value) => void handleTogglePushNotification(value)}
                />
              </View>
            )}
          </View>

          <View style={styles.accountActions}>
            <Pressable
              accessibilityRole="button"
              onPress={() => setConfirmationType('logout')}
              style={({ pressed }) => [styles.accountAction, pressed && styles.pressed]}
            >
              <Text style={styles.accountActionLabel}>로그아웃</Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              onPress={() => setConfirmationType('withdrawal')}
              style={({ pressed }) => [styles.accountAction, pressed && styles.pressed]}
            >
              <Text style={[styles.accountActionLabel, styles.withdrawalLabel]}>회원 탈퇴</Text>
            </Pressable>
          </View>
        </View>
      </View>

      <ProfileEditModal
        visible={profileEditorVisible}
        profile={profile}
        loading={profileMutation.isPending}
        onClose={() => setProfileEditorVisible(false)}
        onSave={saveProfile}
      />

      <AccountConfirmModal
        visible={confirmationType === 'logout'}
        title="로그아웃 하시겠습니까?"
        loading={pendingAction === 'logout'}
        onClose={() => setConfirmationType(null)}
        onConfirm={handleLogout}
      />

      <AccountConfirmModal
        visible={confirmationType === 'withdrawal'}
        title="회원 탈퇴하시겠습니까?"
        description="탈퇴하면 모든 여행 기록과 도감 정보가 삭제되며 되돌릴 수 없습니다."
        danger
        loading={pendingAction === 'withdrawal'}
        onClose={() => setConfirmationType(null)}
        onConfirm={handleWithdrawal}
      />
    </ScreenLayout>
  );
}
