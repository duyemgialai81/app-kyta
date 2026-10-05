import React, { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Modal,
  ScrollView,
  StatusBar as RNStatusBar,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { MENU, MENU_TITLES } from './src/menu';
import { colors, spacing, font, radius } from './src/theme';
import DashboardScreen from './src/screens/DashboardScreen';
import TicketExtractorScreen from './src/screens/TicketExtractorScreen';
import SearchTicketScreen from './src/screens/SearchTicketScreen';
import PlaceholderScreen from './src/screens/PlaceholderScreen';

function renderScreen(tabId: string) {
  switch (tabId) {
    case 'create':
      return <DashboardScreen />;
    case 'extract':
      return <TicketExtractorScreen />;
    case 'search-ticket':
      return <SearchTicketScreen />;
    default:
      return <PlaceholderScreen title={MENU_TITLES[tabId] ?? 'Tính năng'} />;
  }
}

export default function App() {
  const [activeTab, setActiveTab] = useState('create');
  const [drawerOpen, setDrawerOpen] = useState(false);

  const select = (id: string) => {
    setActiveTab(id);
    setDrawerOpen(false);
  };

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <SafeAreaView style={styles.root} edges={['top', 'left', 'right']}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={() => setDrawerOpen(true)} hitSlop={10} style={styles.menuBtn}>
            <Ionicons name="menu" size={24} color={colors.text} />
          </Pressable>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {MENU_TITLES[activeTab]}
          </Text>
          <View style={styles.brandDot} />
        </View>

        {/* Nội dung màn hình đang chọn */}
        <View style={styles.body}>{renderScreen(activeTab)}</View>

        {/* Drawer (sidebar trượt) */}
        <Modal visible={drawerOpen} transparent animationType="fade" onRequestClose={() => setDrawerOpen(false)}>
          <Pressable style={styles.overlay} onPress={() => setDrawerOpen(false)} />
          <SafeAreaView style={styles.drawer} edges={['top', 'left', 'bottom']}>
            <View style={styles.drawerHeader}>
              <View style={styles.logoBox}>
                <Ionicons name="layers" size={22} color="#fff" />
              </View>
              <View>
                <Text style={styles.logoTitle}>FPT IS</Text>
                <Text style={styles.logoSub}>Mobile · mock build</Text>
              </View>
            </View>
            <ScrollView contentContainerStyle={styles.drawerList}>
              {MENU.map((item) => {
                const active = item.id === activeTab;
                return (
                  <Pressable
                    key={item.id}
                    onPress={() => select(item.id)}
                    style={({ pressed }) => [
                      styles.navItem,
                      active && styles.navItemActive,
                      pressed && !active && { backgroundColor: colors.bgElevated },
                    ]}
                  >
                    <Ionicons
                      name={item.icon}
                      size={18}
                      color={active ? colors.primary : colors.textMuted}
                    />
                    <Text
                      style={[styles.navLabel, active && { color: colors.text, fontWeight: '800' }]}
                      numberOfLines={1}
                    >
                      {item.label}
                    </Text>
                    {item.ready ? (
                      <View style={styles.readyDot} />
                    ) : (
                      <Ionicons name="ellipse-outline" size={10} color={colors.textFaint} />
                    )}
                  </Pressable>
                );
              })}
            </ScrollView>
          </SafeAreaView>
        </Modal>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg, paddingTop: RNStatusBar.currentHeight ? 0 : 0 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.cardBorder,
    backgroundColor: colors.bgElevated,
  },
  menuBtn: { padding: 2 },
  headerTitle: { flex: 1, color: colors.text, fontSize: font.h2, fontWeight: '900' },
  brandDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.primary },
  body: { flex: 1 },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: colors.overlay },
  drawer: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 290,
    backgroundColor: colors.bg,
    borderRightWidth: 1,
    borderRightColor: colors.cardBorder,
  },
  drawerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.cardBorder,
  },
  logoBox: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoTitle: { color: colors.text, fontSize: font.h1, fontWeight: '900' },
  logoSub: { color: colors.textFaint, fontSize: font.tiny, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1 },
  drawerList: { padding: spacing.md, gap: 4 },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
  },
  navItemActive: { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.cardBorder },
  navLabel: { flex: 1, color: colors.textMuted, fontSize: font.body },
  readyDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: colors.success },
});
