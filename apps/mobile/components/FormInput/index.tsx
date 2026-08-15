import { useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';

import { colors } from '@travel-gacha/ui';
import { AnchoredMenu } from '@/components/AnchoredMenu';
import { ArrowDownIcon } from '@/components/icons';

import { styles } from './index.css';

type BaseProps = {
  label?: string;
};

type TextFieldProps = BaseProps & {
  variant: 'text';
  value: string;
  placeholder?: string;
  onChangeText: (value: string) => void;
};

type DateFieldProps = BaseProps & {
  variant: 'date';
  value: string;
  expanded?: boolean;
  onPress?: () => void;
};

type SelectOption = {
  label: string;
  value: number;
};

type TimeFieldProps = BaseProps & {
  variant: 'time';
  value: number;
  options: SelectOption[];
  onValueChange: (value: number) => void;
};

type NumberFieldProps = BaseProps & {
  variant: 'number';
  value: number;
  suffix?: string;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
};

export type FormInputProps = TextFieldProps | DateFieldProps | TimeFieldProps | NumberFieldProps;

export function FormInput(props: FormInputProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  if (props.variant === 'text') {
    return (
      <View style={styles.field}>
        {props.label && <Text style={styles.label}>{props.label}</Text>}
        <TextInput
          value={props.value}
          placeholder={props.placeholder}
          placeholderTextColor={colors.grey300}
          onChangeText={props.onChangeText}
          style={styles.textInput}
        />
      </View>
    );
  }

  if (props.variant === 'number') {
    const min = props.min ?? 1;
    const max = props.max ?? 10;
    const decreaseDisabled = props.value <= min;
    const increaseDisabled = props.value >= max;

    return (
      <View style={styles.numberInput}>
        {props.label && <Text style={styles.innerLabel}>{props.label}</Text>}
        <View style={styles.numberControls}>
          <Pressable
            accessibilityLabel={`${props.label ?? '값'} 줄이기`}
            accessibilityState={{ disabled: decreaseDisabled }}
            disabled={decreaseDisabled}
            onPress={() => props.onChange(Math.max(min, props.value - 1))}
            style={styles.stepButton}
          >
            <View style={[styles.downTriangle, decreaseDisabled && styles.downTriangleDisabled]} />
          </Pressable>
          <Text style={styles.numberValue}>{props.value}</Text>
          {props.suffix && <Text style={styles.suffix}>{props.suffix}</Text>}
          <Pressable
            accessibilityLabel={`${props.label ?? '값'} 늘리기`}
            accessibilityState={{ disabled: increaseDisabled }}
            disabled={increaseDisabled}
            onPress={() => props.onChange(Math.min(max, props.value + 1))}
            style={styles.stepButton}
          >
            <View style={[styles.upTriangle, increaseDisabled && styles.upTriangleDisabled]} />
          </Pressable>
        </View>
      </View>
    );
  }

  if (props.variant === 'date') {
    return (
      <Pressable
        accessibilityState={{ expanded: props.expanded }}
        onPress={props.onPress}
        style={styles.selectInput}
      >
        {props.label && <Text style={styles.innerLabel}>{props.label}</Text>}
        <View style={styles.selectValueRow}>
          <Text style={styles.selectValue}>{props.value}</Text>
          <View style={[styles.arrowIcon, props.expanded && styles.arrowIconExpanded]}>
            <ArrowDownIcon size={14} color={colors.grey300} />
          </View>
        </View>
      </Pressable>
    );
  }

  const selectedOption = props.options.find((option) => option.value === props.value);

  return (
    <AnchoredMenu
      open={menuOpen}
      onClose={() => setMenuOpen(false)}
      align="left"
      fullWidth
      style={styles.menuAnchor}
      menuStyle={styles.menu}
      trigger={
        <Pressable
          accessibilityState={{ expanded: menuOpen }}
          onPress={() => setMenuOpen(true)}
          style={[styles.selectInput, styles.timeSelectInput]}
        >
          {props.label && <Text style={styles.innerLabel}>{props.label}</Text>}
          <View style={styles.selectValueRow}>
            <Text style={styles.selectValue}>{selectedOption?.label ?? '-'}</Text>
            <View style={[styles.arrowIcon, menuOpen && styles.arrowIconExpanded]}>
              <ArrowDownIcon size={14} color={colors.grey300} />
            </View>
          </View>
        </Pressable>
      }
    >
      <ScrollView style={styles.optionScroll} nestedScrollEnabled>
        {props.options.map((option) => {
          const selected = option.value === props.value;
          return (
            <Pressable
              key={option.value}
              onPress={() => {
                props.onValueChange(option.value);
                setMenuOpen(false);
              }}
              style={[styles.option, selected && styles.selectedOption]}
            >
              <Text style={[styles.optionText, selected && styles.selectedOptionText]}>
                {option.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </AnchoredMenu>
  );
}
