import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { colors } from '@travel-gacha/ui';
import { AnchoredMenu } from '@/components/AnchoredMenu';
import { TinyIcon } from '@/components/TravelPrimitives';
import { TRAVEL_VIEW_MODE_OPTIONS } from '@/constants';
import type { TravelViewMode } from '@/types';

import { styles } from './index.css';

export function TravelListToolbar() {
  const [viewMode, setViewMode] = useState<TravelViewMode>('list');
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption =
    TRAVEL_VIEW_MODE_OPTIONS.find((option) => option.value === viewMode) ??
    TRAVEL_VIEW_MODE_OPTIONS[0];

  return (
    <View style={styles.toolbar}>
      <AnchoredMenu
        open={isOpen}
        onClose={() => setIsOpen(false)}
        align="left"
        style={styles.dropdownWrap}
        menuStyle={styles.dropdownMenu}
        trigger={
          <Pressable style={styles.selectButton} onPress={() => setIsOpen((open) => !open)}>
            <TinyIcon name={selectedOption.icon} size={14} color={colors.grey400} />
            <Text style={styles.selectText}>{selectedOption.label}</Text>
            <TinyIcon name="chevronDown" size={12} color={colors.grey400} />
          </Pressable>
        }
      >
        <View>
          {TRAVEL_VIEW_MODE_OPTIONS.map((option) => {
            const isSelected = option.value === viewMode;

            return (
              <Pressable
                key={option.value}
                style={[styles.dropdownItem, isSelected && styles.dropdownItemSelected]}
                onPress={() => {
                  setViewMode(option.value);
                  setIsOpen(false);
                }}
              >
                <TinyIcon
                  name={option.icon}
                  size={14}
                  color={isSelected ? colors.grey600 : colors.grey400}
                />
                <Text style={[styles.dropdownText, isSelected && styles.dropdownTextSelected]}>
                  {option.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </AnchoredMenu>
    </View>
  );
}
