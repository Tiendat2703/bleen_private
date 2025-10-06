import { useState } from 'react';
import { toast } from 'react-toastify';

export default function CreateUser({ onUserCreated }) {
  const [formData, setFormData] = useState({
    email: '',
    full_name: '',
    passcode: '',
    confirmPasscode: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [createdUser, setCreatedUser] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const generatePasscode = () => {
    const passcode = Math.floor(100000 + Math.random() * 900000).toString();
    setFormData(prev => ({
      ...prev,
      passcode,
      confirmPasscode: passcode
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.passcode !== formData.confirmPasscode) {
      toast.error('Mã xác thực không khớp');
      return;
    }

    if (formData.passcode.length !== 4) {
      toast.error('Mã xác thực phải có 4 chữ số');
      return;
    }

    // Check token validity before making request
    const token = localStorage.getItem('adminToken');
    console.log('Retrieved token from localStorage:', token ? 'exists' : 'missing');
    if (!token) {
      toast.error('Token không tồn tại. Vui lòng đăng nhập lại.');
      return;
    }

    // Check token expiration
    try {
      const tokenParts = token.split('.');
      if (tokenParts.length === 3) {
        const payload = JSON.parse(atob(tokenParts[1]));
        const currentTime = Math.floor(Date.now() / 1000);
        
        if (payload.exp && payload.exp < currentTime) {
          toast.error('Token đã hết hạn. Vui lòng đăng nhập lại.');
          localStorage.removeItem('adminToken');
          return;
        }
      }
    } catch (tokenError) {
      console.error('Token validation error:', tokenError);
      toast.error('Token không hợp lệ. Vui lòng đăng nhập lại.');
      localStorage.removeItem('adminToken');
      return;
    }

    setIsLoading(true);

    try {
      console.log('Creating user with token:', token ? 'exists' : 'missing');
      console.log('Request data:', { email: formData.email, full_name: formData.full_name, passcode: formData.passcode });
      
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          email: formData.email,
          full_name: formData.full_name,
          passcode: formData.passcode
        }),
      });

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);
      console.log('User data:', data.data);

      if (response.ok && data.success) {
        const userData = data.data;
        const userUrl = `${window.location.origin}/${userData.user_id}/unlock`;
        
        toast.success('Tạo tài khoản thành công!');
        
        // Hiển thị URL cho user
        const urlMessage = `URL đăng nhập: ${userUrl}`;
        console.log(urlMessage);
        
        // Copy URL vào clipboard
        navigator.clipboard.writeText(userUrl).then(() => {
          toast.info('URL đã được copy vào clipboard!');
        }).catch(() => {
          toast.info(urlMessage);
        });
        
        setCreatedUser(userData);
        setFormData({
          email: '',
          full_name: '',
          passcode: '',
          confirmPasscode: ''
        });
        if (onUserCreated) {
          onUserCreated(userData);
        }
      } else {
        if (response.status === 401 || response.status === 403) {
          toast.error('Token không hợp lệ hoặc đã hết hạn. Vui lòng đăng nhập lại.');
          localStorage.removeItem('adminToken');
        } else {
          toast.error(data.message || 'Tạo tài khoản thất bại');
        }
      }
    } catch (error) {
      console.error('Create user error:', error);
      toast.error('Lỗi kết nối server');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Tạo tài khoản mới</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email người dùng
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-teal focus:border-transparent"
            placeholder="user@example.com"
            required
          />
        </div>

        <div>
          <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 mb-2">
            Họ và tên
          </label>
          <input
            type="text"
            id="full_name"
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-teal focus:border-transparent"
            placeholder="Nguyễn Văn A"
            required
          />
        </div>

        <div>
          <label htmlFor="passcode" className="block text-sm font-medium text-gray-700 mb-2">
            Mã xác thực (4 chữ số)
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              id="passcode"
              name="passcode"
              value={formData.passcode}
              onChange={handleChange}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-teal focus:border-transparent"
              placeholder="1234"
              maxLength="4"
              pattern="[0-9]{4}"
              required
            />
            <button
              type="button"
              onClick={generatePasscode}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Tạo ngẫu nhiên
            </button>
          </div>
        </div>

        <div>
          <label htmlFor="confirmPasscode" className="block text-sm font-medium text-gray-700 mb-2">
            Xác nhận mã xác thực
          </label>
          <input
            type="text"
            id="confirmPasscode"
            name="confirmPasscode"
            value={formData.confirmPasscode}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-teal focus:border-transparent"
            placeholder="1234"
            maxLength="4"
            pattern="[0-9]{4}"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-primary-teal text-white py-2 px-4 rounded-lg font-medium hover:bg-accent-green transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Đang tạo...' : 'Tạo tài khoản'}
        </button>
      </form>

      {/* Hiển thị URL sau khi tạo thành công */}
      {createdUser && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <h3 className="text-lg font-semibold text-green-800 mb-2">✅ Tài khoản đã được tạo thành công!</h3>
          <div className="space-y-2">
            <div className="text-sm text-gray-700">
              <strong>Email:</strong> {createdUser.email}
            </div>
            <div className="text-sm text-gray-700">
              <strong>Họ tên:</strong> {createdUser.full_name}
            </div>
            <div className="text-sm text-gray-700">
              <strong>User ID:</strong> {createdUser.user_id}
            </div>
            <div className="mt-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                URL đăng nhập:
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={`${window.location.origin}/${createdUser.user_id}/unlock`}
                  readOnly
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm"
                />
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(`${window.location.origin}/${createdUser.user_id}/unlock`);
                    toast.success('URL đã được copy!');
                  }}
                  className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
                >
                  Copy
                </button>
              </div>
            </div>
            <div className="mt-2">
              <button
                onClick={() => setCreatedUser(null)}
                className="text-sm text-gray-500 hover:text-gray-700 underline"
              >
                Tạo tài khoản mới
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
