import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card, Field, PrimaryButton, GhostButton } from '../components/UI';
import { searchCaseCodes, SearchResult } from '../api';
import { colors, spacing, font, radius } from '../theme';

export default function SearchTicketScreen() {
  const [input, setInput] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  const run = async () => {
    const codes = input
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);
    if (codes.length === 0) {
      Alert.alert('Thiếu dữ liệu', 'Nhập ít nhất một mã hồ sơ để tra cứu.');
      return;
    }
    setLoading(true);
    setResults(await searchCaseCodes(codes));
    setLoading(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.wrap} keyboardShouldPersistTaps="handled">
      <Card>
        <View style={styles.headerRow}>
          <View style={styles.titleRow}>
            <Ionicons name="scan" size={20} color={colors.primary} />
            <Text style={styles.title}>Tra Cứu Hồ Sơ Gốc</Text>
          </View>
          <GhostButton
            title="Xóa"
            icon="trash-outline"
            onPress={() => {
              setInput('');
              setResults([]);
            }}
          />
        </View>

        <Field
          label="Danh sách mã hồ sơ (mỗi dòng 1 mã)"
          placeholder={'VD:\n123/QĐ-THADS\n456/QĐ-THADS'}
          value={input}
          onChangeText={setInput}
          editable={!loading}
          multiline
          style={styles.textarea}
        />
        <PrimaryButton
          title={loading ? 'Đang tra cứu...' : 'Tra cứu'}
          icon="radio"
          loading={loading}
          disabled={!input.trim()}
          onPress={run}
        />
      </Card>

      {results.map((r, i) => (
        <Card key={i} style={styles.resultCard}>
          <View style={styles.resultHeader}>
            <Text style={styles.caseCode}>{r.caseCode}</Text>
            <Ionicons
              name={r.found ? 'checkmark-circle' : 'close-circle'}
              size={18}
              color={r.found ? colors.success : colors.danger}
            />
          </View>
          <Row label="Người phải THA" value={r.obligor} />
          <Row label="Cơ quan" value={r.org} />
          <Row label="Trạng thái" value={r.status} />
        </Card>
      ))}
    </ScrollView>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { padding: spacing.lg, gap: spacing.lg },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  title: { color: colors.text, fontSize: font.h2, fontWeight: '900' },
  textarea: { minHeight: 110, textAlignVertical: 'top' },
  resultCard: { gap: spacing.sm },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  caseCode: { color: colors.text, fontSize: font.h3, fontWeight: '800' },
  row: { flexDirection: 'row', justifyContent: 'space-between', gap: spacing.md },
  rowLabel: { color: colors.textFaint, fontSize: font.small },
  rowValue: { color: colors.text, fontSize: font.small, fontWeight: '600', flex: 1, textAlign: 'right' },
});
