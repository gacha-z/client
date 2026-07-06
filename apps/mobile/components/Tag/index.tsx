import { Text, View } from 'react-native';

import { colors } from '@travel-gacha/ui';
import { CoffeeIcon } from '@/components/icons/collection';

import { styles } from './index.css';

type TagIconName = 'coffee';

type TagProps = {
  label: string;
  icon?: TagIconName;
};

function TagIcon({ name }: { name: TagIconName }) {
  // 도감 아이템 전용 아이콘은 추후 기획에 따라 여기에서 계속 확장합니다.
  // 아메리카노 아이템에 대해서만 임시 아이콘을 추가합니다.
  switch (name) {
    case 'coffee':
      return <CoffeeIcon size={12} color={colors.blue700} />;
    default:
      return null;
  }
}

export function Tag({ label, icon }: TagProps) {
  return (
    <View style={styles.tag}>
      {icon && (
        <View style={styles.icon}>
          <TagIcon name={icon} />
        </View>
      )}
      <Text style={styles.text}>{label}</Text>
    </View>
  );
}
