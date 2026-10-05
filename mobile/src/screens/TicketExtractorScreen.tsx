import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card, Field, PrimaryButton, GhostButton, StatusPill } from '../components/UI';
import { extractTickets, ExtractionResult } from '../api';
import { colors, spacing, font, radius } from '../theme';

// Chuẩn hóa mã QĐ-THADS, bê nguyên logic từ TicketExtractor.tsx bản desktop.
function normalizeDocs(raw: string): string[] {
  const out: string[] = [];
  raw.split('\n').forEach((line) => {
    const clean = line.trim().toUpperCase();
    if (!clean) return;
    const regex = /\d+\/(QĐ|QD)-THADS/gi;
    const matches = clean.match(regex);
    if (matches) matches.forEach((m) => out.push(m.replace('QD', 'QĐ')));
    else if (/^\d+$/.test(clean)) out.push(`${clean}/QĐ-THADS`);
    else if (/^\d+\/(QĐ|QD)$/.test(clean)) out.push(`${clean.replace('QD', 'QĐ')}-THADS`);
  });
  return Array.from(new Set(out));
}

export default function TicketExtractorScreen() {
  const [email, setEmail] = useState('');
  const [docList, setDocList] = useState('');
  const [results, setResults] = useState<ExtractionResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [log, setLog] = useState('Hệ thống sẵn sàng tiếp nhận lệnh...');

  const start = async () => {
    const docs = normalizeDocs(docList);
    if (!email.trim() || docs.length === 0) {
      Alert.alert('Lỗi dữ liệu', 'Vui lòng nhập Email và danh sách mã hợp lệ!');
      return;
    }
    if (docs.length > 20) {
      Alert.alert('Vượt giới hạn', 'Tối đa 20 mã mỗi lần chạy để đảm bảo an toàn API.');
      return;
    }
    setLoading(true);
    setLog('Khởi động động cơ API quét ngầm...');
    setResults(docs.map((d) => ({ docNum: d, ticketId: 'Đang đợi API...', status: 'pending' })));
    await extractTickets(email.trim(), docs, (r) => {
      setResults((prev) => prev.map((it) => (it.docNum === r.docNum ? r : it)));
    });
    setLoading(false);
    setLog('Hoàn tất tiến trình lấy Ticket ID!');
  };

  const clearAll = () => {
    setEmail('');
    setDocList('');
    setResults([]);
    setLog('Hệ thống đã reset.');
  };

  return (
    <ScrollView contentContainerStyle={styles.wrap} keyboardShouldPersistTaps="handled">
      <Card>
        <View style={styles.headerRow}>
          <View style={styles.titleRow}>
            <Ionicons name="search" size={20} color={colors.primary} />
            <Text style={styles.title}>Trích Xuất Ticket ID</Text>
          </View>
          <GhostButton title="Làm mới" icon="trash-outline" onPress={clearAll} />
        </View>

        <Field
          label="1. Tài khoản quản trị"
          placeholder="Email lấy quyền..."
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          editable={!loading}
        />

        <Field
          label="2. Danh sách Mã cần quét (tối đa 20)"
          placeholder={'VD:\n123/QĐ-THADS\n456'}
          value={docList}
          onChangeText={setDocList}
          editable={!loading}
          multiline
          style={styles.textarea}
        />

        <PrimaryButton
          title={loading ? 'Đang quét dữ liệu...' : 'Bắt đầu quét'}
          icon="flash"
          loading={loading}
          disabled={!docList.trim() || !email.trim()}
          onPress={start}
        />

        <View style={styles.logBox}>
          <Ionicons name="terminal-outline" size={14} color={colors.primary} />
          <Text style={styles.logText} numberOfLines={1}>
            {log}
          </Text>
        </View>
      </Card>

      <Card>
        <Text style={styles.sectionTitle}>Bộ đệm kết quả</Text>
        {results.length === 0 ? (
          <Text style={styles.empty}>Chờ dữ liệu phản hồi...</Text>
        ) : (
          results.map((r, i) => (
            <View key={i} style={styles.row}>
              <Text style={styles.rowIndex}>{i + 1}</Text>
              <View style={styles.rowMid}>
                <Text style={styles.docNum}>{r.docNum}</Text>
                <Text
                  style={[
                    styles.ticketId,
                    r.status === 'success' && { color: colors.primary },
                  ]}
                >
                  {r.ticketId}
                </Text>
              </View>
              <StatusPill status={r.status} />
            </View>
          ))
        )}
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrap: { padding: spacing.lg, gap: spacing.lg },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  title: { color: colors.text, fontSize: font.h2, fontWeight: '900' },
  textarea: { minHeight: 120, textAlignVertical: 'top' },
  logBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.inputBg,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  logText: { color: colors.textMuted, fontSize: font.small, flex: 1 },
  sectionTitle: {
    color: colors.textMuted,
    fontSize: font.small,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  empty: {
    color: colors.textFaint,
    textAlign: 'center',
    paddingVertical: spacing.xxl,
    textTransform: 'uppercase',
    letterSpacing: 2,
    fontSize: font.small,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.cardBorder,
  },
  rowIndex: { color: colors.textFaint, fontWeight: '800', width: 20 },
  rowMid: { flex: 1, gap: 2 },
  docNum: { color: colors.text, fontWeight: '700', fontSize: font.body },
  ticketId: { color: colors.textMuted, fontSize: font.small, fontFamily: 'monospace' },
});
