import { useState } from 'react';
import { apiCall } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import eyeIcon from '../../images/Setting Page/Untitled_icon/flowbite_eye-outline.svg';

function PasswordSection() {
  const { token } = useAuth();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleOldPasswordChange = (e) => {
    const value = e.target.value;
    // Only allow 4 digits
    if (value.length <= 4 && /^\d*$/.test(value)) {
      setOldPassword(value);
      setError('');
    }
  };

  const handleNewPasswordChange = (e) => {
    const value = e.target.value;
    // Only allow 4 digits
    if (value.length <= 4 && /^\d*$/.test(value)) {
      setNewPassword(value);
      setError('');
    }
  };

  const handleSave = async () => {
    // Validate
    if (oldPassword.length !== 4) {
      setError('Mật khẩu cũ phải có đúng 4 chữ số');
      return;
    }

    if (newPassword.length !== 4) {
      setError('Mật khẩu mới phải có đúng 4 chữ số');
      return;
    }

    if (oldPassword === newPassword) {
      setError('Mật khẩu mới phải khác mật khẩu cũ');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/auth/change-passcode', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          oldPasscode: oldPassword,
          newPasscode: newPassword
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success('Đổi mật khẩu thành công');
        setSuccess('Đã đổi mật khẩu thành công');
        
        // Clear inputs
        setOldPassword('');
        setNewPassword('');
        
        setTimeout(() => setSuccess(''), 3000);
      } else {
        throw new Error(data.message || 'Đổi mật khẩu thất bại');
      }
    } catch (err) {
      console.error('Change password error:', err);
      setError(err.message || 'Lỗi khi đổi mật khẩu');
      toast.error('Đổi mật khẩu thất bại: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-light-mint rounded-3xl p-6 border-2 border-primary-teal">
      <h2 className="text-primary-teal font-heading text-xl md:text-2xl mb-4">
        Đổi mật khẩu
      </h2>

      {/* Old Password Input */}
      <div className="mb-4">
        <label className="block text-primary-teal font-body text-sm font-semibold mb-2">
          Mật khẩu cũ
        </label>
        <div className="relative">
          <input
            type={showOldPassword ? 'text' : 'password'}
            value={oldPassword}
            onChange={handleOldPasswordChange}
            placeholder="••••"
            maxLength={4}
            disabled={isLoading}
            className="w-full bg-white rounded-lg px-4 py-3 pr-12 text-primary-teal font-body text-lg focus:outline-none focus:ring-2 focus:ring-primary-teal disabled:opacity-50"
          />
          <button
            type="button"
            onClick={() => setShowOldPassword(!showOldPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2"
            disabled={isLoading}
          >
            <img src={eyeIcon} alt="Toggle visibility" className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* New Password Input */}
      <div className="mb-4">
        <label className="block text-primary-teal font-body text-sm font-semibold mb-2">
          Mật khẩu mới
        </label>
        <div className="relative">
          <input
            type={showNewPassword ? 'text' : 'password'}
            value={newPassword}
            onChange={handleNewPasswordChange}
            placeholder="••••"
            maxLength={4}
            disabled={isLoading}
            className="w-full bg-white rounded-lg px-4 py-3 pr-12 text-primary-teal font-body text-lg focus:outline-none focus:ring-2 focus:ring-primary-teal disabled:opacity-50"
          />
          <button
            type="button"
            onClick={() => setShowNewPassword(!showNewPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2"
            disabled={isLoading}
          >
            <img src={eyeIcon} alt="Toggle visibility" className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Error and Success Messages */}
      {error && (
        <p className="text-red-500 text-sm mb-4">{error}</p>
      )}
      {success && (
        <p className="text-green-600 text-sm mb-4">{success}</p>
      )}

      {/* Submit Button */}
      <button
        onClick={handleSave}
        disabled={isLoading || !oldPassword || !newPassword}
        className="w-full bg-primary-teal text-white font-body text-lg py-3 rounded-lg hover:bg-accent-green transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Đang xử lý...' : 'Đổi mật khẩu'}
      </button>

      {/* Info Text */}
      <p className="text-primary-teal text-xs mt-3 opacity-70">
        Lưu ý: Mật khẩu phải có đúng 4 chữ số
      </p>
    </div>
  );
}

export default PasswordSection;

















