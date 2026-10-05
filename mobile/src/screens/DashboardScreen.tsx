import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../components/UI';
import { getDashboardCards, DashboardCard, USE_MOCK } from '../api';
import { colors, spacing, font, radius } from '../theme';

const ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  pending: 'hourglass-outline',
  today: 'today-outline',
  done: 'checkmark-done-outline',
  error: 'warning-outline',
};
const TINTS: Record<string, string> = {
  pending: colors.warning,
  today: colors.primary,
  done: colors.success,
  error: colors.danger,
};

export default function DashboardScreen() {
  const [cards, setCards] = useState<DashboardCard[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    setCards(await getDashboardCards());
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <ScrollView
      contentContainerStyle={styles.wrap}
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={load} tintColor={colors.primary} />
      }
    >
      {USE_MOCK && (
        <View style={styles.mockNote}>
          <Ionicons name="flask-outline" size={14} color={colors.warning} />
          <Text style={styles.mockText}>Đang chạy dữ liệu giả (mock) — kéo xuống để làm mới</Text>
        </View>
      )}

      <View style={styles.grid}>
        {cards.map((c) => (
          <Card key={c.id} style={styles.statCard}>
            <View style={[styles.statIcon, { borderColor: TINTS[c.id] }]}>
              <Ionicons name={ICONS[c.id] ?? 'ellipse-outline'} size={20} color={TINTS[c.id]} />
            </View>
            <Text style={styles.statCount}>{c.count}</Text>
            <Text style={styles.statLabel}>{c.label}</Text>
          </Card>
        ))}
      </View>

      <Card>
        <Text style={styles.cardTitle}>Chào mừng tới FPT-IS Mobile</Text>
        <Text style={styles.cardBody}>
          Đây là bản dựng thử nghiệm giao diện di động. Toàn bộ số liệu đang là
          dữ liệu giả để kiểm tra app build & chạy được trên iOS/Android. Khi
          backend sẵn sàng, các màn hình sẽ tự lấy dữ liệu thật qua cùng lớp API.
        </Text>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrap: { padding: spacing.lg, gap: spacing.lg },
  mockNote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: 'rgba(245,158,11,0.1)',
    borderRadius: radius.md,
    padding: spacing.md,
  },
  mockText: { color: colors.warning, fontSize: font.small, fontWeight: '700', flex: 1 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  statCard: { flexGrow: 1, flexBasis: '45%', gap: spacing.sm },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statCount: { color: colors.text, fontSize: 30, fontWeight: '900' },
  statLabel: { color: colors.textMuted, fontSize: font.small, fontWeight: '600' },
  cardTitle: { color: colors.text, fontSize: font.h2, fontWeight: '900' },
  cardBody: { color: colors.textMuted, fontSize: font.body, lineHeight: 21 },
});
