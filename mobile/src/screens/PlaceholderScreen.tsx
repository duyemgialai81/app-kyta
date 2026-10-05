import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, font, radius } from '../theme';

// Màn dùng chung cho các tính năng chưa port UI.
// Vẫn điều hướng tới được -> chứng minh khung app chạy đủ 24 mục.
export default function PlaceholderScreen({ title }: { title: string }) {
  return (
    <View style={styles.wrap}>
      <View style={styles.badge}>
        <Ionicons name="construct-outline" size={34} color={colors.primary} />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.desc}>
        Tính năng này đã có trong bản desktop. Phần giao diện mobile đang được
        chuyển dần. Logic xử lý sẽ nối vào backend ở giai đoạn sau.
      </Text>
      <View style={styles.tag}>
        <Ionicons name="time-outline" size={13} color={colors.warning} />
        <Text style={styles.tagText}>Đang phát triển</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
    gap: spacing.lg,
  },
  badge: {
    width: 80,
    height: 80,
    borderRadius: radius.xl,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: colors.text,
    fontSize: font.h1,
    fontWeight: '900',
    textAlign: 'center',
  },
  desc: {
    color: colors.textMuted,
    fontSize: font.body,
    textAlign: 'center',
    lineHeight: 21,
    maxWidth: 320,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: 'rgba(245,158,11,0.12)',
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  tagText: {
    color: colors.warning,
    fontSize: font.small,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
});
