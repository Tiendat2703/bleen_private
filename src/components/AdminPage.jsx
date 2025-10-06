import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { apiCall } from '../utils/api';
import CreateUser from './CreateUser';
import UserManagement from './UserManagement';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('create');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('adminToken');
    console.log('Checking auth with token:', token ? 'exists' : 'missing');
    
    // Quick bypass for development - remove in production
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('bypass') === 'true') {
      console.log('Bypass mode enabled');
      setIsAuthenticated(true);
      setIsLoading(false);
      return;
    }
    
    if (!token) {
      console.log('No token found, redirecting to login');
      navigate('/admin');
      return;
    }

    // Check token expiration locally first
    try {
      const tokenParts = token.split('.');
      if (tokenParts.length === 3) {
        const payload = JSON.parse(atob(tokenParts[1]));
        const currentTime = Math.floor(Date.now() / 1000);
        
        if (payload.exp && payload.exp < currentTime) {
          console.log('Token expired locally, redirecting to login');
          localStorage.removeItem('adminToken');
          toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
          navigate('/admin');
          return;
        }
        
        // Check if token expires in next 5 minutes
        if (payload.exp && (payload.exp - currentTime) < 300) {
          toast.warning('Phiên đăng nhập sẽ hết hạn trong 5 phút. Vui lòng đăng nhập lại.');
        }
      }
    } catch (tokenError) {
      console.error('Token validation error:', tokenError);
      localStorage.removeItem('adminToken');
      navigate('/admin');
      return;
    }

    try {
      console.log('Making auth check request...');
      // Try to make a request that requires admin authentication
      const { response, data } = await apiCall('/api/users/all', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('Auth check response:', response.status, response.ok);

      if (response.ok) {
        console.log('Auth successful, setting authenticated to true');
        setIsAuthenticated(true);
      } else if (response.status === 401 || response.status === 403) {
        console.log('Auth failed, removing token and redirecting');
        localStorage.removeItem('adminToken');
        toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
        navigate('/admin');
      } else {
        console.log('Other error, still allowing access');
        // For other errors, still allow access but show warning
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Auth check error:', error);
      console.log('Network error, still allowing access');
      // If network error, still allow access
      setIsAuthenticated(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin');
  };

  const handleUserCreated = (user) => {
    // Có thể thêm logic để refresh danh sách người dùng nếu cần
    console.log('User created:', user);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-teal"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">Quản trị viên</span>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
              >
                Đăng xuất
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow-sm">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('create')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'create'
                    ? 'border-primary-teal text-primary-teal'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Tạo tài khoản
              </button>
              <button
                onClick={() => setActiveTab('manage')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'manage'
                    ? 'border-primary-teal text-primary-teal'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Quản lý người dùng
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'create' && (
              <CreateUser onUserCreated={handleUserCreated} />
            )}
            {activeTab === 'manage' && (
              <UserManagement />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
