# 🚀 Deployment Guide for Render

## 📋 Prerequisites

1. **Supabase Account**: Tạo project trên Supabase
2. **Render Account**: Đăng ký tài khoản Render
3. **GitHub Repository**: Code đã được push lên GitHub

## 🔧 Backend Deployment (Render)

### Bước 1: Tạo Web Service trên Render

1. Đăng nhập vào [Render Dashboard](https://dashboard.render.com)
2. Click **"New +"** → **"Web Service"**
3. Connect GitHub repository: `Tiendat2703/21BLEEN_NEW`
4. Cấu hình:
   - **Name**: `bleen-backend`
   - **Environment**: `Node`
   - **Branch**: `main`
   - **Root Directory**: `/` (để trống)
   - **Build Command**: `npm install`
   - **Start Command**: `node server2.js`

### Bước 2: Environment Variables

Thêm các biến môi trường sau:

```bash
NODE_ENV=production
PORT=10000
SUPABASE_SERVICE_KEY=your_supabase_service_key
JWT_SECRET=your_jwt_secret_key
ADMIN_USERNAME=admin
ADMIN_PASSWORD_HASH=your_bcrypt_hashed_password
FRONTEND_URL=https://your-frontend-app.onrender.com
```

### Bước 3: Tạo Admin Password Hash

```bash
# Cài đặt bcrypt
npm install bcrypt

# Tạo hash cho password
node -e "const bcrypt = require('bcrypt'); console.log(bcrypt.hashSync('your_password', 10));"
```

## 🌐 Frontend Deployment (Vercel) - ĐÃ DEPLOY

### ✅ Frontend đã deploy thành công
- **URL**: [https://21bleen-eight.vercel.app/](https://21bleen-eight.vercel.app/)
- **Platform**: Vercel
- **Status**: ✅ Live

### 🔧 Cấu hình Environment Variables trên Vercel

1. Vào [Vercel Dashboard](https://vercel.com/dashboard)
2. Chọn project `21bleen-eight`
3. Vào **Settings** → **Environment Variables**
4. Thêm:
   ```bash
   VITE_API_URL=https://your-backend.onrender.com
   ```

### 🔄 Redeploy sau khi thêm Environment Variables

1. Vào **Deployments** tab
2. Click **"Redeploy"** trên deployment mới nhất
3. Hoặc push code mới để trigger auto-deploy

## 🔗 Cấu hình URLs

### Backend URL
- Render sẽ cung cấp URL: `https://bleen-backend.onrender.com`
- Sử dụng URL này cho `VITE_API_URL`

### Frontend URL  
- Render sẽ cung cấp URL: `https://bleen-frontend.onrender.com`
- Sử dụng URL này cho `FRONTEND_URL` trong backend

## 🔄 Cập nhật CORS

Sau khi có URLs, cập nhật `server2.js`:

```javascript
const allowedOrigins = [
  'http://localhost:5173', 
  'http://127.0.0.1:5173',
  'https://bleen-frontend.onrender.com' // Thêm URL frontend
];
```

## 🧪 Testing

### Test Backend
```bash
curl https://bleen-backend.onrender.com/api/health
```

### Test Frontend
Truy cập: `https://bleen-frontend.onrender.com`

### Test Admin
Truy cập: `https://bleen-frontend.onrender.com/admin`

## 🐛 Troubleshooting

### Lỗi CORS
- Kiểm tra `FRONTEND_URL` trong backend
- Đảm bảo frontend URL được thêm vào `allowedOrigins`

### Lỗi Database
- Kiểm tra `SUPABASE_SERVICE_KEY`
- Kiểm tra Supabase project settings

### Lỗi Authentication
- Kiểm tra `JWT_SECRET`
- Kiểm tra `ADMIN_PASSWORD_HASH`

## 📝 Notes

- **Free Plan**: Render free plan có thể sleep sau 15 phút không hoạt động
- **Cold Start**: Lần đầu truy cập có thể chậm do cold start
- **Environment Variables**: Luôn cập nhật environment variables khi thay đổi URLs
