import { Text, View } from 'react-native';

import { styles } from './index.css';

type SummaryBoxProps = {
  label: string;
  value: string;
};

export function SummaryBox({ label, value }: SummaryBoxProps) {
  return (
    <View style={styles.summaryBox}>
      <Text style={styles.summaryLabel}>{label}</Text>
      <Text style={styles.summaryValue}>{value}</Text>
    </View>
  );
}
