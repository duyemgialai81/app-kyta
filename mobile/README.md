# FPT-IS Mobile (bản dựng UI + mock data)

App Expo (React Native) — giai đoạn 1: **giao diện mobile chạy được với dữ liệu giả**,
để kiểm tra pipeline build iOS/Android qua GitHub trước khi ghép backend thật.

## Trạng thái hiện tại
- ✅ Khung app + điều hướng đủ 25 mục (sidebar trượt).
- ✅ Màn đã port UI thật (dùng mock): **Bảng Điều Khiển**, **Trích Xuất Ticket**, **Tra Cứu Hồ Sơ**.
- ⏳ Các mục còn lại dùng màn "Đang phát triển" chung — vẫn mở được.
- 🔌 Toàn bộ dữ liệu đi qua `src/api.ts` (`USE_MOCK = true`). Khi có server, đổi
  `USE_MOCK = false` + `SERVER_URL`, thay phần mock bằng `fetch()`. UI không phải sửa.

## Chạy thử tại máy (dev)
```bash
cd mobile
npm install
npx expo start         # quét QR bằng app Expo Go trên điện thoại
# hoặc: npm run android / npm run ios (cần máy ảo/thiết bị)
```

## Build ra file cài (iOS .ipa / Android .aab/.apk) — KHÔNG cần máy Mac

Dùng **EAS Build** (build trên cloud của Expo):

```bash
npm install -g eas-cli
eas login
cd mobile
eas build:configure          # tạo projectId, điền vào app.json > extra.eas.projectId
eas build --platform android --profile preview   # ra APK cài thử
eas build --platform ios --profile preview       # cần tài khoản Apple Developer
```

## Build tự động qua GitHub Actions
1. Tạo **Expo access token**: https://expo.dev → Account → Access Tokens.
2. Vào repo GitHub → **Settings → Secrets and variables → Actions** → thêm
   secret tên `EXPO_TOKEN`.
3. Push nhánh `main` (thư mục `mobile/**`) hoặc chạy tay workflow
   **"Mobile EAS Build"** trong tab Actions, chọn platform + profile.
4. File build tải về từ trang https://expo.dev (mục Builds của project).

> iOS: cần **Apple Developer Program ($99/năm)**. Android: cần tài khoản
> **Google Play ($25 một lần)** nếu muốn phát hành lên store (build APK test thì không cần).

## Cấu trúc
```
mobile/
  App.tsx              # khung + điều hướng (drawer, header)
  src/
    api.ts             # LỚP TÁCH backend — đổi mock -> server ở đây
    menu.ts            # danh sách 25 mục (bê từ Sidebar desktop)
    theme.ts           # màu / spacing
    components/UI.tsx  # Card, Field, Button, StatusPill...
    screens/           # từng màn hình
```

## Bước tiếp theo
Xem `../MIGRATION_PLAN.md` — dựng backend server và nối `src/api.ts` vào.
