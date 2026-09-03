import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useAtom, useSetAtom } from 'jotai';

import {
  logoutAtom,
  permissionSettingsAtom,
  resetSettingsAtom,
  userProfileAtom,
  withdrawAccountAtom,
  type PermissionSettings
} from '@travel-gacha/store';
import { colors } from '@travel-gacha/ui';
import { ArrowDownIcon } from '@/components/icons';
import { ScreenLayout } from '@/components/ScreenLayout';
import { mockLogout, mockWithdrawAccount } from '@/mocks/auth';
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
  const saveProfile = (update: Pick<typeof profile, 'nickname' | 'age'>) => {
    setProfile((current) => ({ ...current, ...update }));
    setProfileEditorVisible(false);
  };

  const updatePermission = (key: keyof PermissionSettings, value: boolean) => {
    setPermissions((current) => ({ ...current, [key]: value }));
  };

  const handleLogout = async () => {
    if (pendingAction) return;

    setPendingAction('logout');
    try {
      await mockLogout();
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
      await mockWithdrawAccount();
      resetSettings();
      setConfirmationType(null);
      withdrawAccount();
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
              <Text style={styles.profileMeta}>
                {profile.gender} {profile.age}세
              </Text>
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
                  onValueChange={(value) => updatePermission('camera', value)}
                />
                <PermissionToggle
                  label="GPS"
                  value={permissions.location}
                  onValueChange={(value) => updatePermission('location', value)}
                />
                <PermissionToggle
                  label="앱 푸시 알림"
                  value={permissions.pushNotification}
                  onValueChange={(value) => updatePermission('pushNotification', value)}
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
