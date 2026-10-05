# Kế hoạch chuyển FPT-IS sang iOS & Android (full tính năng)

> Mục tiêu: Đưa toàn bộ tính năng của app Electron desktop hiện tại lên iOS + Android,
> giữ đầy đủ chức năng, và **build/phát hành qua GitHub (GitHub Actions + EAS)**.
>
> Trạng thái tài liệu: bản nháp v1 — 2026-10-05.

---

## 0. Tóm tắt điều hành (đọc cái này trước)

App hiện tại **không thể "đổi target" sang mobile** vì phần lõi mạnh nhất chạy bằng
Node.js + Puppeteer trong tiến trình Electron `main` — những thứ iOS/Android cấm.

Giải pháp bắt buộc là **tách kiến trúc làm 2 phần**:

```
┌───────────────────────────┐        HTTPS / WebSocket        ┌──────────────────────────────┐
│  App mobile (React Native  │  ───────── REST API ─────────►  │  Backend server (Node.js)     │
│  / Expo)                   │                                 │  - Toàn bộ logic main.js      │
│  - Chỉ UI + nhập liệu      │  ◄──── kết quả / log realtime ─ │  - axios gọi API FPT          │
│  - Gọi API lên server      │                                 │  - Puppeteer (Chrome headless)│
└───────────────────────────┘                                 │  - Quản lý token, license     │
                                                               └──────────────────────────────┘
                                                                     chạy trên VPS / cloud 24/7
```

- **Tái dùng được:** logic React (hooks, state, hàm xử lý dữ liệu) trong `src/app/`.
- **Viết lại:** toàn bộ UI (HTML/CSS/Tailwind/Radix/MUI → component React Native).
- **Dời lên server:** toàn bộ `electron/main.js`.
- **Không thể giữ nguyên trải nghiệm trên mobile** (xem mục 3): auto-mở trình duyệt,
  ghi shortcut desktop, đọc UUID phần cứng Windows, auto-update kiểu Electron.

---

## 1. Kiểm kê tính năng hiện tại (từ electron/main.js)

### Nhóm A — Gọi API thuần (axios). **Dời lên server dễ, giữ 100%.**
| IPC handler | Chức năng |
|---|---|
| `dashboard-api-request` | Login / get-user / tạo-xóa dashboard |
| `manage-license`, `activate-key`, `get-license-url` | Quản lý bản quyền |
| `extract-deep-casecode` | Quét sâu mã hồ sơ toàn quốc |
| `batch-extract-tickets`, `batch-extract-doc-codes` | Bóc ticket / mã hồ sơ hàng loạt |
| `update-account-info`, `change-user-password` | Sửa tài khoản, đổi mật khẩu |
| `process-transfer-tickets`, `extend-tickets` | Điều chuyển / gia hạn hồ sơ |
| `process-recall-node`, `process-regoto-processing` | Recall / về trạng thái xử lý |
| `change-case-code`, `process-batch-authority` | Đổi mã, cấp quyền VIP |
| `search-multiple-tickets`, `batch-search-receipts` | Tra cứu hàng loạt |
| `process-callback-event`, `process-call-log-history` | Callback / lịch sử gọi lệnh |
| `process-update-money`, `process-deep-scan-hotro` | Update tiền / quét sâu hỗ trợ |
| `process-batch-delete-enforcement` | Xóa hồ sơ hàng loạt |
| `ask-ai-assistant` | Trợ lý AI |
| `fetch-aka247-tickets`, `start/stop-auto-polling` | AKA247 realtime (polling) |

### Nhóm B — Puppeteer (cần Chrome headless trên server). **Dời được, nhưng đổi UX.**
| IPC handler | Ghi chú |
|---|---|
| `fetchMasterToken` | Puppeteer login lấy token → chạy headless trên server OK |
| `login-aka247-via-browser` | Tương tự |
| `auto-login-browser` | **Vấn đề UX** — xem mục 3.1 |
| `open-ticket-browser` | Mở trình duyệt tại máy — trên mobile đổi thành mở link/WebView |

### Nhóm C — Hệ điều hành / Desktop-only. **Không mang sang mobile được.**
| IPC handler | Lý do |
|---|---|
| `get-local-key`, `get-computer-hostname`, `check-is-admin` | Đọc UUID/hostname Windows (`wmic`, registry) |
| `get-local-telemetry` | Cấu hình phần cứng máy |
| `apply-desktop-icon` | Ghi shortcut `.lnk` ra Desktop Windows |
| `start-download`, `quit-and-install` | Auto-update Electron (mobile dùng App Store/Play) |

---

## 2. Stack công nghệ đề xuất

### 2.1 Mobile app
- **Expo (React Native)** — lý do: build iOS **không cần máy Mac** nhờ **EAS Build** (build trên cloud của Expo),
  tích hợp thẳng GitHub Actions. Đây là con đường "dùng GitHub để build" khả thi nhất.
- Điều hướng: `expo-router` hoặc `react-navigation`.
- UI: `nativewind` (Tailwind cho React Native) để tái dùng tư duy class hiện tại,
  hoặc `tamagui` / `react-native-paper`.
- Gọi API: giữ `axios` (chạy được trên RN).
- Realtime log (thay cho `win.webContents.send`): `socket.io-client` hoặc SSE.

### 2.2 Backend server
- **Node.js + Express (hoặc Fastify)** — bê gần như nguyên code từ `electron/main.js`.
- `puppeteer` (bản full, không phải `puppeteer-core`) hoặc `puppeteer-core` + Chrome cài sẵn trên server.
- `socket.io` để đẩy log tiến trình về app realtime.
- Xác thực: JWT cho từng người dùng (thay cho license theo UUID máy — xem mục 3.3).
- Hosting: 1 VPS Linux (2 vCPU / 4GB RAM trở lên vì Puppeteer tốn RAM), hoặc
  Docker trên Render / Railway / Fly.io.

### 2.3 Build & phát hành
- **GitHub repo** chứa 2 thư mục: `/mobile` (Expo) và `/server` (Node).
- **GitHub Actions** chạy:
  - CI cho server (lint, test, build Docker image).
  - EAS Build cho mobile (iOS `.ipa` + Android `.aab`/`.apk`).
- Phát hành: **EAS Submit** đẩy lên App Store Connect + Google Play.

---

## 3. Những điểm KHÔNG thể bê nguyên & cách xử lý

### 3.1 `auto-login-browser` (Vô tài khoản khách)
**[Inference]** Hiện mở Chrome thật trên máy user để họ dùng phiên đã login.
Trên mobile không mở/điều khiển được trình duyệt ngoài. Lựa chọn:
- **(a)** Server dùng Puppeteer lấy token → trả token về app → app mở **WebView** trong ứng dụng,
  bơm cookie/token vào WebView để hiển thị phiên đã đăng nhập. *(Khả thi nhưng cần kiểm chứng
  việc set cookie cross-domain trong WebView — chưa xác nhận.)*
- **(b)** Giữ tính năng này **chỉ ở bản desktop**, bản mobile ẩn đi.

### 3.2 `open-ticket-browser`, `apply-desktop-icon`
- Mở ticket: đổi sang mở `Linking.openURL(url)` hoặc WebView trong app.
- Ghi shortcut desktop: **bỏ** trên mobile (khái niệm không tồn tại).

### 3.3 License theo UUID phần cứng
**[Inference]** Hiện `getHardwareKey()` dùng UUID máy Windows/Mac. Mobile không có UUID
ổn định tương đương (Apple cấm lấy định danh thiết bị cố định). → Chuyển mô hình license
sang **tài khoản + JWT** trên server (mỗi user 1 license, không gắn máy). Lưu ý tại
[electron/main.js:130](electron/main.js#L130) cổng license hiện đã bị vô hiệu hóa
(`createWindow()` gọi ngay, phần dưới không chạy) — cần quyết định có khôi phục license không.

### 3.4 Auto-update
- Bỏ `electron-updater`. iOS/Android cập nhật qua App Store / Play Store.
- Cập nhật nóng phần JS: có thể dùng **EAS Update** (OTA) nếu cần.

### 3.5 Secrets đang hard-code (phải sửa trước khi lên server)
`electron/main.js` đang chứa **thông tin nhạy cảm dạng plaintext**: webhook Discord,
tài khoản token (`TOKEN_EMAIL`/`TOKEN_PASS`), mật khẩu auto-login, master password
tại [src/app/App.tsx:71](src/app/App.tsx#L71).
→ **Bắt buộc** chuyển hết sang biến môi trường `.env` phía server, không commit lên GitHub,
đưa vào **GitHub Secrets**. (Lưu ý bảo mật: các secret này hiện đã nằm trong lịch sử repo
nếu từng commit — nên coi như đã lộ và xoay vòng/đổi mới.)

---

## 4. Lộ trình thực hiện theo giai đoạn

### Giai đoạn 0 — Chuẩn bị (0.5–1 tuần)
- [ ] Tạo monorepo: `/server`, `/mobile`, giữ `/electron` + `/src` cũ để tham chiếu.
- [ ] Gom toàn bộ secret ra `.env`, thêm `.env` vào `.gitignore`, xoay vòng secret đã lộ.
- [ ] Dựng 1 VPS/thử Render để test deploy server.

### Giai đoạn 1 — Backend server (2–4 tuần)
- [ ] Dựng Express, mỗi IPC handler nhóm A → 1 endpoint REST (giữ nguyên logic axios).
- [ ] Nhóm B: cài Puppeteer + Chrome trên server, chuyển `fetchMasterToken` v.v.
- [ ] Thay `win.webContents.send(...)` → `socket.io` emit log theo `jobId`.
- [ ] Thêm JWT auth; viết lại license theo tài khoản (mục 3.3).
- [ ] Dockerfile + deploy thử; test từng endpoint bằng Postman.

### Giai đoạn 2 — Mobile app (3–5 tuần)
- [ ] `npx create-expo-app`, cấu hình `expo-router` + `nativewind`.
- [ ] Dựng khung: Sidebar/Tab → bottom-tab hoặc drawer của mobile.
- [ ] Viết lại từng tab trong `src/app/components/tabs/*` sang component RN
      (tái dùng logic, thay JSX HTML → `<View>/<Text>/<TextInput>`).
- [ ] Lớp API client gọi server + nghe log realtime qua socket.
- [ ] Xử lý các tính năng mục 3 (WebView, Linking…).

### Giai đoạn 3 — Build qua GitHub (1–2 tuần)
- [ ] Tạo tài khoản Expo + `eas.json`.
- [ ] Workflow GitHub Actions cho server (xem mục 5).
- [ ] Workflow EAS Build cho iOS + Android.
- [ ] Tài khoản **Apple Developer ($99/năm)** + **Google Play ($25 một lần)**.
- [ ] Build nội bộ (TestFlight / Internal testing) → sửa lỗi → phát hành.

### Giai đoạn 4 — Hoàn thiện
- [ ] Test trên thiết bị thật iOS + Android.
- [ ] Giám sát server (RAM Puppeteer, timeout), logging, rate-limit.

**[Speculation]** Tổng thời gian ước lượng cho 1 dev: **~2–3 tháng**. Đây là ước tính thô,
phụ thuộc số tab và độ phức tạp, chưa được kiểm chứng.

---

## 5. Mẫu GitHub Actions

### 5.1 Build mobile bằng EAS (`.github/workflows/eas-build.yml`)
```yaml
name: EAS Build (iOS + Android)
on:
  push:
    branches: [main]
    paths: ['mobile/**']
  workflow_dispatch:
jobs:
  build:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: mobile
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: npm, cache-dependency-path: mobile/package-lock.json }
      - uses: expo/expo-github-action@v8
        with:
          eas-version: latest
          token: ${{ secrets.EXPO_TOKEN }}   # lấy từ expo.dev → Access Tokens
      - run: npm ci
      # Build cả 2 nền tảng trên cloud EAS (iOS không cần máy Mac)
      - run: eas build --platform all --non-interactive --no-wait
```
> Cần: tạo `EXPO_TOKEN` trong **Settings → Secrets → Actions** của repo.
> Chứng chỉ iOS/Android do EAS quản lý tự động (`eas credentials`).

### 5.2 CI + Docker cho server (`.github/workflows/server.yml`)
```yaml
name: Server CI
on:
  push:
    paths: ['server/**']
jobs:
  build:
    runs-on: ubuntu-latest
    defaults: { run: { working-directory: server } }
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: npm, cache-dependency-path: server/package-lock.json }
      - run: npm ci
      - run: npm test --if-present
      - run: docker build -t fpt-is-server .
```

### 5.3 (Tuỳ chọn) Build iOS/Android bằng chính runner của GitHub
- Android: `ubuntu-latest` + `./gradlew assembleRelease` (sau khi `expo prebuild`).
- iOS: **bắt buộc** `macos-latest` runner + Xcode + chứng chỉ ký — phức tạp hơn EAS nhiều.
  → Khuyến nghị dùng **EAS Build (5.1)** cho iOS thay vì tự dựng.

---

## 6. Checklist quyết định cần chốt trước khi bắt đầu

- [ ] Có khôi phục hệ thống license không? (hiện đang tắt) → nếu có, chốt mô hình JWT.
- [ ] Tính năng `auto-login-browser` trên mobile: chọn phương án 3.1 (a) hay (b)?
- [ ] Ngân sách: VPS hàng tháng + Apple Developer $99/năm + Google Play $25.
- [ ] Ai giữ tài khoản Apple/Google/Expo?
- [ ] Giữ song song bản desktop Electron không, hay bỏ hẳn?

---

## 7. Rủi ro & lưu ý

- **[Inference]** Puppeteer trên server tốn RAM và dễ bị FPT đổi giao diện/API làm hỏng selector.
  Rủi ro này đã tồn tại ở bản desktop, lên server không tăng thêm nhưng tập trung hơn.
- **[Unverified]** Apple App Store có thể từ chối app "tự động hoá tài khoản bên thứ ba" nếu
  xét là vi phạm điều khoản — cần kiểm chứng với nghiệp vụ cụ thể trước khi submit.
- Secrets đã hard-code phải được coi là đã lộ — xoay vòng toàn bộ.
```
