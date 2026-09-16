import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { colors } from '@travel-gacha/ui';
import { AnchoredMenu } from '@/components/AnchoredMenu';
import { MoreIcon } from '@/components/icons';

import { styles } from './index.css';

export type DiaryCardData = {
  id: string;
  memberNickname: string;
  content: string;
  diaryDate: string;
  isOwn: boolean;
};

type DiaryCardProps = {
  diary: DiaryCardData;
  onEdit: () => void;
  onDelete: () => void;
};

export function DiaryCard({ diary, onEdit, onDelete }: DiaryCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.authorRow}>
          <View style={styles.avatar} />
          <Text style={styles.authorName}>{diary.memberNickname}</Text>
        </View>
        {diary.isOwn ? (
          <AnchoredMenu
            open={menuOpen}
            onClose={() => setMenuOpen(false)}
            offset={2}
            menuStyle={styles.menu}
            trigger={
              <Pressable style={styles.moreButton} onPress={() => setMenuOpen(true)} hitSlop={8}>
                <MoreIcon size={18} color={colors.grey400} />
              </Pressable>
            }
          >
            <Pressable
              style={styles.menuItem}
              onPress={() => {
                setMenuOpen(false);
                onEdit();
              }}
            >
              <Text style={styles.menuItemText}>수정하기</Text>
            </Pressable>
            <Pressable
              style={styles.menuItem}
              onPress={() => {
                setMenuOpen(false);
                onDelete();
              }}
            >
              <Text style={styles.menuItemTextDanger}>삭제하기</Text>
            </Pressable>
          </AnchoredMenu>
        ) : null}
      </View>
      <Text style={styles.content} numberOfLines={3}>
        {diary.content}
      </Text>
      <Text style={styles.createdAt}>{diary.diaryDate}</Text>
    </View>
  );
}
