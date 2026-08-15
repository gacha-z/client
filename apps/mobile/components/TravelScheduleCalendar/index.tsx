import { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { colors } from '@travel-gacha/ui';
import { AnchoredMenu } from '@/components/AnchoredMenu';
import { BackIcon, SolidCaretIcon } from '@/components/icons';
import {
  addMonths,
  buildCalendar,
  canMoveToPreviousMonth,
  isBeforeDay,
  isSameDay,
  startOfDay,
  startOfMonth
} from '@/utils';

import { styles } from './index.css';

const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const VISIBLE_FUTURE_YEAR_COUNT = 10;

type TravelScheduleCalendarProps = {
  initialStartDate?: Date | null;
  initialEndDate?: Date | null;
  onRangeChange?: (startDate: Date | null, endDate: Date | null) => void;
};

export function TravelScheduleCalendar({
  initialStartDate = null,
  initialEndDate = null,
  onRangeChange
}: TravelScheduleCalendarProps) {
  const today = useMemo(() => startOfDay(new Date()), []);
  const selectableInitialStart =
    initialStartDate && !isBeforeDay(initialStartDate, today) ? initialStartDate : null;
  const selectableInitialEnd =
    initialEndDate && !isBeforeDay(initialEndDate, today) ? initialEndDate : null;
  const [visibleMonth, setVisibleMonth] = useState(() =>
    startOfMonth(selectableInitialStart ?? today)
  );
  const [rangeStart, setRangeStart] = useState<Date | null>(selectableInitialStart);
  const [rangeEnd, setRangeEnd] = useState<Date | null>(selectableInitialEnd);
  const [monthMenuOpen, setMonthMenuOpen] = useState(false);
  const [yearMenuOpen, setYearMenuOpen] = useState(false);
  const calendarDays = useMemo(() => buildCalendar(visibleMonth), [visibleMonth]);
  const canGoBack = canMoveToPreviousMonth(visibleMonth, today);
  const yearOptions = useMemo(
    () =>
      Array.from(
        {
          length: visibleMonth.getFullYear() - today.getFullYear() + VISIBLE_FUTURE_YEAR_COUNT + 1
        },
        (_, index) => today.getFullYear() + index
      ),
    [today, visibleMonth]
  );
  const monthOptions = MONTHS.map((label, value) => ({ label, value })).filter(
    ({ value }) => visibleMonth.getFullYear() > today.getFullYear() || value >= today.getMonth()
  );

  const moveMonth = (amount: number) => {
    if (amount < 0 && !canGoBack) return;
    setVisibleMonth((current) => addMonths(current, amount));
  };

  const selectMonth = (month: number) => {
    setVisibleMonth(new Date(visibleMonth.getFullYear(), month, 1));
    setMonthMenuOpen(false);
  };

  const selectYear = (year: number) => {
    const month =
      year === today.getFullYear()
        ? Math.max(visibleMonth.getMonth(), today.getMonth())
        : visibleMonth.getMonth();
    setVisibleMonth(new Date(year, month, 1));
    setYearMenuOpen(false);
  };

  const selectDate = (date: Date) => {
    if (isBeforeDay(date, today)) return;

    if (!rangeStart || rangeEnd) {
      setRangeStart(date);
      setRangeEnd(null);
      onRangeChange?.(date, null);
      return;
    }

    if (isBeforeDay(date, rangeStart)) {
      setRangeStart(date);
      setRangeEnd(rangeStart);
      onRangeChange?.(date, rangeStart);
      return;
    }

    setRangeEnd(date);
    onRangeChange?.(rangeStart, date);
  };

  return (
    <View style={styles.card}>
      <Text style={styles.title}>여행 일정을 선택해주세요!</Text>
      <View style={styles.monthControls}>
        <Pressable
          accessibilityLabel="이전 달"
          accessibilityState={{ disabled: !canGoBack }}
          disabled={!canGoBack}
          hitSlop={10}
          onPress={() => moveMonth(-1)}
          style={[styles.arrowButton, !canGoBack && styles.disabledArrowButton]}
        >
          <BackIcon size={24} color={canGoBack ? colors.grey900 : colors.grey200} />
        </Pressable>
        <View style={styles.selectGroup}>
          <AnchoredMenu
            open={monthMenuOpen}
            onClose={() => setMonthMenuOpen(false)}
            align="left"
            menuStyle={styles.selectMenu}
            trigger={
              <Pressable
                accessibilityState={{ expanded: monthMenuOpen }}
                style={styles.selectBox}
                onPress={() => {
                  setYearMenuOpen(false);
                  setMonthMenuOpen((open) => !open);
                }}
              >
                <Text style={styles.selectText}>{MONTHS[visibleMonth.getMonth()]}</Text>
                <View style={[styles.caretDown, monthMenuOpen && styles.caretUp]}>
                  <SolidCaretIcon size={10} color={colors.grey900} />
                </View>
              </Pressable>
            }
          >
            <ScrollView style={styles.selectMenuScroll} nestedScrollEnabled>
              {monthOptions.map(({ label, value }) => (
                <Pressable
                  key={label}
                  style={[
                    styles.selectOption,
                    value === visibleMonth.getMonth() && styles.selectOptionSelected
                  ]}
                  onPress={() => selectMonth(value)}
                >
                  <Text style={styles.selectOptionText}>{label}</Text>
                </Pressable>
              ))}
            </ScrollView>
          </AnchoredMenu>
          <AnchoredMenu
            open={yearMenuOpen}
            onClose={() => setYearMenuOpen(false)}
            align="left"
            menuStyle={styles.selectMenu}
            trigger={
              <Pressable
                accessibilityState={{ expanded: yearMenuOpen }}
                style={styles.selectBox}
                onPress={() => {
                  setMonthMenuOpen(false);
                  setYearMenuOpen((open) => !open);
                }}
              >
                <Text style={styles.selectText}>{visibleMonth.getFullYear()}</Text>
                <View style={[styles.caretDown, yearMenuOpen && styles.caretUp]}>
                  <SolidCaretIcon size={10} color={colors.grey900} />
                </View>
              </Pressable>
            }
          >
            <ScrollView style={styles.selectMenuScroll} nestedScrollEnabled>
              {yearOptions.map((year) => (
                <Pressable
                  key={year}
                  style={[
                    styles.selectOption,
                    year === visibleMonth.getFullYear() && styles.selectOptionSelected
                  ]}
                  onPress={() => selectYear(year)}
                >
                  <Text style={styles.selectOptionText}>{year}</Text>
                </Pressable>
              ))}
            </ScrollView>
          </AnchoredMenu>
        </View>
        <Pressable
          accessibilityLabel="다음 달"
          hitSlop={10}
          onPress={() => moveMonth(1)}
          style={styles.arrowButton}
        >
          <View style={styles.arrowRight}>
            <BackIcon size={24} color={colors.grey900} />
          </View>
        </Pressable>
      </View>
      <View style={styles.weekRow}>
        {WEEKDAYS.map((weekday) => (
          <Text key={weekday} style={styles.weekday}>
            {weekday}
          </Text>
        ))}
      </View>
      <View style={styles.daysGrid}>
        {calendarDays.map(({ date, key, isCurrentMonth }) => {
          const isDisabled = isBeforeDay(date, today);
          const isStart = rangeStart ? isSameDay(date, rangeStart) : false;
          const isEnd = rangeEnd ? isSameDay(date, rangeEnd) : false;
          const isInRange = rangeStart && rangeEnd ? date > rangeStart && date < rangeEnd : false;
          const isEdge = isStart || isEnd;

          return (
            <View key={key} style={styles.dayCell}>
              <Pressable
                accessibilityLabel={`${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`}
                accessibilityState={{ disabled: isDisabled }}
                disabled={isDisabled}
                onPress={() => selectDate(date)}
                style={[styles.dayButton, isInRange && styles.rangeDay, isEdge && styles.rangeEdge]}
              >
                <Text
                  style={[
                    styles.dayText,
                    !isCurrentMonth && styles.outsideDayText,
                    isDisabled && styles.disabledDayText,
                    isEdge && styles.rangeEdgeText
                  ]}
                >
                  {date.getDate()}
                </Text>
              </Pressable>
            </View>
          );
        })}
      </View>
    </View>
  );
}
