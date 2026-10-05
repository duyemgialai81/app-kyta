// ============================================================================
// LỚP API — điểm tách giữa UI và backend.
//
// Hiện tại USE_MOCK = true: mọi hàm trả về dữ liệu giả (mock) sau một khoảng
// delay để mô phỏng mạng. Khi backend server sẵn sàng (xem MIGRATION_PLAN.md),
// chỉ cần:
//   1. Đặt USE_MOCK = false
//   2. Đặt SERVER_URL trỏ tới server thật
//   3. Thay phần gọi mock bằng fetch() tới endpoint tương ứng
// UI phía trên KHÔNG phải sửa gì.
// ============================================================================

export const USE_MOCK = true;
export const SERVER_URL = 'https://your-backend.example.com';

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));
const rand = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

export type ExtractionResult = {
  docNum: string;
  ticketId: string;
  status: 'success' | 'error' | 'pending';
};

export type SearchResult = {
  caseCode: string;
  obligor: string;
  org: string;
  status: string;
  found: boolean;
};

export type DashboardCard = {
  id: string;
  label: string;
  count: number;
};

// --- Mock: Dashboard tổng quan ------------------------------------------------
export async function getDashboardCards(): Promise<DashboardCard[]> {
  await delay(400);
  return [
    { id: 'pending', label: 'Hồ sơ chờ xử lý', count: rand(20, 120) },
    { id: 'today', label: 'Ticket hôm nay', count: rand(5, 60) },
    { id: 'done', label: 'Đã hoàn thành', count: rand(100, 900) },
    { id: 'error', label: 'Lỗi cần kiểm tra', count: rand(0, 15) },
  ];
}

// --- Mock: Trích xuất Ticket ID hàng loạt ------------------------------------
// Trả về kết quả cho từng mã. Khi lên server: POST /tickets/extract
export async function extractTickets(
  email: string,
  docNumbers: string[],
  onProgress?: (r: ExtractionResult) => void
): Promise<ExtractionResult[]> {
  const results: ExtractionResult[] = [];
  for (const docNum of docNumbers) {
    await delay(rand(250, 600));
    const ok = Math.random() > 0.15;
    const r: ExtractionResult = ok
      ? { docNum, ticketId: `TK${rand(100000, 999999)}`, status: 'success' }
      : { docNum, ticketId: 'Không tìm thấy', status: 'error' };
    results.push(r);
    onProgress?.(r);
  }
  return results;
}

// --- Mock: Tra cứu hồ sơ gốc -------------------------------------------------
export async function searchCaseCodes(caseCodes: string[]): Promise<SearchResult[]> {
  await delay(700);
  const orgs = ['THADS Hà Nội', 'THADS TP.HCM', 'THADS Đà Nẵng', 'THADS Cần Thơ'];
  const names = ['Nguyễn Văn A', 'Trần Thị B', 'Lê Văn C', 'Phạm Thị D'];
  const statuses = ['Đang thi hành', 'Chờ phát hành', 'Đã hoàn thành', 'Bị trả lại'];
  return caseCodes.map((caseCode) => {
    const found = Math.random() > 0.2;
    return {
      caseCode,
      obligor: found ? names[rand(0, names.length - 1)] : '—',
      org: found ? orgs[rand(0, orgs.length - 1)] : '—',
      status: found ? statuses[rand(0, statuses.length - 1)] : 'Không tìm thấy',
      found,
    };
  });
}
