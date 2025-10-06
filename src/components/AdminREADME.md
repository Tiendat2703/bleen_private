# Admin Panel - Hướng dẫn sử dụng

## Tổng quan
Trang admin được tạo để quản lý tài khoản người dùng trong hệ thống. Admin có thể tạo tài khoản mới và quản lý danh sách người dùng hiện có.

## Truy cập Admin Panel
- URL: `/admin`
- Đăng nhập bằng username và mật khẩu admin từ file .env

## Cấu hình Admin Credentials
Trong file `.env`, cần có:
```env
ADMIN_USERNAME=admin
ADMIN_PASSWORD_HASH=your_hashed_password
```

## Tính năng chính

### 1. Tạo tài khoản mới
- **Email người dùng**: Nhập email của người dùng
- **Mã xác thực**: Tạo mã 6 chữ số (có thể tự nhập hoặc tạo ngẫu nhiên)
- **Xác nhận mã**: Nhập lại mã xác thực để đảm bảo chính xác
- Sau khi tạo thành công, hệ thống sẽ trả về URL: `{domain}/{userId}/unlock`

### 2. Quản lý người dùng
- **Xem danh sách**: Hiển thị tất cả người dùng với thông tin:
  - Email
  - User ID
  - Ngày tạo
  - URL truy cập
- **Tìm kiếm**: Tìm kiếm người dùng theo email
- **Copy URL**: Sao chép URL truy cập của người dùng
- **Xóa người dùng**: Chức năng xóa chưa được triển khai (cần thêm endpoint)

## API Endpoints được sử dụng

### Admin Authentication
```
POST /api/admin/login/simple
Body: { username, password }
Response: { success, token, message }
```

### User Management
```
POST /api/auth/register
Headers: { Authorization: Bearer {token} }
Body: { email, passcode }
Response: { success, user: { id, user_id, email, created_at }, message }

GET /api/users/all
Headers: { Authorization: Bearer {token} }
Response: { success, users: [...] }
```

## Cấu trúc dữ liệu

### User Object
```javascript
{
  id: number,
  user_id: string,
  email: string,
  passcode: string,
  created_at: string
}
```

## Bảo mật
- Admin phải đăng nhập với credentials từ .env
- Token JWT được sử dụng cho authentication
- Tất cả API calls đều yêu cầu Authorization header
- Tự động đăng xuất khi token hết hạn

## Responsive Design
- Hỗ trợ đầy đủ trên mobile và desktop
- Giao diện thân thiện với người dùng
- Loading states và error handling

## Lưu ý
- Chức năng xóa người dùng chưa được triển khai (cần thêm endpoint DELETE)
- Admin credentials được lưu trong file .env
- Server cần chạy để admin panel hoạt động
