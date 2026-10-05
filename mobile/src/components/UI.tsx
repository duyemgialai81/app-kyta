import React from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  TextInputProps,
  ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing, font } from '../theme';

export function Card({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: ViewStyle;
}) {
  return <View style={[styles.card, style]}>{children}</View>;
}

export function SectionLabel({ children }: { children: React.ReactNode }) {
  return <Text style={styles.sectionLabel}>{children}</Text>;
}

export function Field(props: TextInputProps & { label?: string }) {
  const { label, style, ...rest } = props;
  return (
    <View style={{ gap: spacing.sm }}>
      {label ? <SectionLabel>{label}</SectionLabel> : null}
      <TextInput
        placeholderTextColor={colors.textFaint}
        style={[styles.input, style]}
        {...rest}
      />
    </View>
  );
}

export function PrimaryButton({
  title,
  onPress,
  loading,
  disabled,
  icon,
}: {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
}) {
  const off = disabled || loading;
  return (
    <Pressable
      onPress={onPress}
      disabled={off}
      style={({ pressed }) => [
        styles.button,
        off && styles.buttonOff,
        pressed && !off && styles.buttonPressed,
      ]}
    >
      {loading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <>
          {icon ? <Ionicons name={icon} size={18} color="#fff" /> : null}
          <Text style={styles.buttonText}>{title}</Text>
        </>
      )}
    </Pressable>
  );
}

export function GhostButton({
  title,
  onPress,
  icon,
}: {
  title: string;
  onPress: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.ghost, pressed && { opacity: 0.6 }]}
    >
      {icon ? <Ionicons name={icon} size={15} color={colors.textMuted} /> : null}
      <Text style={styles.ghostText}>{title}</Text>
    </Pressable>
  );
}

export function StatusPill({ status }: { status: 'success' | 'error' | 'pending' }) {
  const map = {
    success: { c: colors.success, i: 'checkmark-circle' as const, t: 'OK' },
    error: { c: colors.danger, i: 'close-circle' as const, t: 'Lỗi' },
    pending: { c: colors.pending, i: 'ellipsis-horizontal-circle' as const, t: 'Đợi' },
  }[status];
  return (
    <View style={[styles.pill, { borderColor: map.c }]}>
      <Ionicons name={map.i} size={13} color={map.c} />
      <Text style={[styles.pillText, { color: map.c }]}>{map.t}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderColor: colors.cardBorder,
    borderWidth: 1,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.md,
  },
  sectionLabel: {
    color: colors.textMuted,
    fontSize: font.tiny,
    fontWeight: '800',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  input: {
    backgroundColor: colors.inputBg,
    borderColor: colors.cardBorder,
    borderWidth: 1,
    borderRadius: radius.md,
    color: colors.text,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    fontSize: font.body,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  buttonOff: { backgroundColor: colors.cardBorder },
  buttonPressed: { backgroundColor: colors.primaryDark },
  buttonText: {
    color: '#fff',
    fontSize: font.body,
    fontWeight: '800',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  ghost: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  ghostText: {
    color: colors.textMuted,
    fontSize: font.tiny,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderWidth: 1,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    alignSelf: 'flex-start',
  },
  pillText: { fontSize: font.tiny, fontWeight: '800' },
});
