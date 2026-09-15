import { useState } from 'react';
import { Pressable, Share, Text, View } from 'react-native';
import * as Clipboard from 'expo-clipboard';

import type { TripMember } from '@travel-gacha/types';

import { styles } from './index.css';

type MemberInviteSectionProps = {
  tripTitle: string;
  inviteCode?: string;
  members: TripMember[];
  isOwner: boolean;
  onPressKick: (member: TripMember) => void;
};

/** 여행 시작 전(중앙 탭 idle 상태)에 노출되는 멤버 초대 + (방장 한정) 강퇴 섹션 */
export function MemberInviteSection({
  tripTitle,
  inviteCode,
  members,
  isOwner,
  onPressKick
}: MemberInviteSectionProps) {
  const [copied, setCopied] = useState(false);
  const invitationLink = inviteCode ? `https://travel-gacha.app/trip/${inviteCode}` : '';
  const kickableMembers = members.filter((member) => member.role !== 'OWNER');

  const handleCopyLink = async () => {
    if (!invitationLink) return;
    const succeeded = await Clipboard.setStringAsync(invitationLink);
    setCopied(succeeded);
  };

  const handleShareLink = async () => {
    if (!invitationLink) return;
    await Share.share({ title: `${tripTitle} 초대`, message: invitationLink });
  };

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>여행 멤버 초대하기</Text>
      <Text style={styles.sectionHint}>
        미션이 곧 시작돼요. 그 전에 함께할 멤버를 초대해보세요!
      </Text>

      <View style={styles.linkBox}>
        <Text style={styles.linkText} numberOfLines={1}>
          {invitationLink || '초대 코드를 불러오는 중이에요.'}
        </Text>
        <Pressable
          style={styles.copyButton}
          disabled={!invitationLink}
          onPress={() => void handleCopyLink()}
        >
          <Text style={styles.copyLabel}>{copied ? '복사됨' : '복사하기'}</Text>
        </Pressable>
      </View>
      <Pressable
        style={styles.shareButton}
        disabled={!invitationLink}
        onPress={() => void handleShareLink()}
      >
        <Text style={styles.shareLabel}>링크 공유하기</Text>
      </Pressable>

      {isOwner && kickableMembers.length > 0 ? (
        <View style={styles.memberList}>
          {kickableMembers.map((member) => (
            <View key={member.id} style={styles.memberRow}>
              <Text style={styles.memberName}>{member.name}</Text>
              <Pressable style={styles.kickButton} onPress={() => onPressKick(member)}>
                <Text style={styles.kickLabel}>강퇴</Text>
              </Pressable>
            </View>
          ))}
        </View>
      ) : null}
    </View>
  );
}
