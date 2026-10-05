import { Ionicons } from '@expo/vector-icons';

// Danh sách menu được bê từ Sidebar.tsx của bản desktop (baseMenuItems).
// Mỗi item map sang 1 màn hình. 'ready' = đã port UI thật, còn lại dùng
// PlaceholderScreen (màn "đang phát triển") nhưng vẫn điều hướng được.

export type MenuItem = {
  id: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  ready?: boolean;
};

export const MENU: MenuItem[] = [
  { id: 'create', label: 'Bảng Điều Khiển', icon: 'grid-outline', ready: true },
  { id: 'autologin', label: 'Tài Khoản Khách', icon: 'globe-outline' },
  { id: 'extract', label: 'Trích Xuất Ticket', icon: 'search-outline', ready: true },
  { id: 'HoSo', label: 'Trích Xuất Hồ Sơ', icon: 'document-text-outline' },
  { id: 'deep-scan', label: 'Lấy Ticket eQD', icon: 'radio-outline' },
  { id: 'batch-search-receipts', label: 'Ticket Biên Lai', icon: 'receipt-outline' },
  { id: 'assignee-extractor', label: 'Tìm MHS bằng ticket', icon: 'person-outline' },
  { id: 'quickOpen', label: 'Mở Ticket Nhanh', icon: 'open-outline' },
  { id: 'receiptManager', label: 'Hợp Đồng & Biên Lai', icon: 'reader-outline' },
  { id: 'accountEditor', label: 'Cán Bộ (eAccount)', icon: 'people-outline' },
  { id: 'transfer', label: 'Điều Chuyển Hàng Loạt', icon: 'send-outline' },
  { id: 'search-ticket', label: 'Tra Cứu Gốc (Radar)', icon: 'scan-outline', ready: true },
  { id: 'node-trigger', label: 'Kích Hoạt Chuyển Bước', icon: 'play-forward-outline' },
  { id: 'ticket-extender', label: 'Gia Hạn Biên Lai', icon: 'calendar-outline' },
  { id: 'update-money', label: 'Update Lại Tiền', icon: 'cash-outline' },
  { id: 'recall-node', label: 'Thu Hồi Luồng (Recall)', icon: 'arrow-undo-outline' },
  { id: 'regoto-processing', label: 'Ép Trạng Thái Xử Lý', icon: 'refresh-outline' },
  { id: 'change-case-code', label: 'Đổi Mã Hồ Sơ', icon: 'create-outline' },
  { id: 'call-log', label: 'Lịch Sử Gọi Lệnh', icon: 'time-outline' },
  { id: 'ai-assistant', label: 'Trợ Lý AI Oracle', icon: 'sparkles-outline' },
  { id: 'Aka247Tab', label: 'AKA247', icon: 'pulse-outline' },
  { id: 'batch-delete-enforcement', label: 'Xóa Hồ Sơ Hàng Loạt', icon: 'trash-outline' },
  { id: 'change-password', label: 'Cấp Lại Mật Khẩu', icon: 'key-outline' },
  { id: 'authority-assign', label: 'Phân Quyền Hồ Sơ', icon: 'shield-outline' },
  { id: 'license-manager', label: 'Quản Lý Bản Quyền App', icon: 'ribbon-outline' },
];

export const MENU_TITLES: Record<string, string> = Object.fromEntries(
  MENU.map((m) => [m.id, m.label])
);
