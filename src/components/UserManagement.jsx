import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    // Check server health first
    checkServerHealth();
    loadUsers();
  }, [currentPage]);

  const checkServerHealth = async () => {
    try {
      const response = await fetch('/api/health');
      const data = await response.json();
      console.log('Server health check:', data);
    } catch (error) {
      console.error('Server health check failed:', error);
      toast.warning('Server có thể không chạy. Kiểm tra server2.js');
    }
  };

  const loadUsers = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('adminToken');
      console.log('Loading users with token:', token ? 'exists' : 'missing');
      
      const response = await fetch('/api/users/all', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('Users API response status:', response.status);
      const data = await response.json();
      console.log('Users API response data:', data);

      if (response.ok && data.success) {
        // Filter users based on search term
        let filteredUsers = data.users || data.data || [];
        if (searchTerm) {
          filteredUsers = filteredUsers.filter(user => 
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }
        
        setUsers(filteredUsers);
        setTotalPages(Math.ceil(filteredUsers.length / itemsPerPage));
        console.log('Users loaded successfully:', filteredUsers.length);
      } else {
        console.error('Users API error:', data);
        if (response.status === 401 || response.status === 403) {
          toast.error('Token không hợp lệ. Vui lòng đăng nhập lại.');
          localStorage.removeItem('adminToken');
        } else {
          toast.error(data.message || 'Không thể tải danh sách người dùng');
        }
      }
    } catch (error) {
      console.error('Load users error:', error);
      console.log('Network error details:', error.message);
      
      // Fallback: Show mock data for development
      if (error.message.includes('fetch failed')) {
        console.log('Using mock data due to network error');
        setUsers([
          {
            id: 1,
            user_id: 'user_123456789_123',
            email: 'demo@example.com',
            created_at: new Date().toISOString()
          }
        ]);
        setTotalPages(1);
        toast.warning('Đang sử dụng dữ liệu demo (server không kết nối được)');
      } else {
        toast.error('Lỗi kết nối server: ' + error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    loadUsers();
  };

  const handleDeleteUser = async (userId) => {
    toast.info('Chức năng xóa người dùng chưa được triển khai');
    // TODO: Implement delete user endpoint in server
    // if (!window.confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
    //   return;
    // }

    // try {
    //   const response = await fetch(`/api/admin/users/${userId}`, {
    //     method: 'DELETE',
    //     headers: {
    //       'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
    //     }
    //   });

    //   const data = await response.json();

    //   if (response.ok && data.success) {
    //     toast.success('Xóa người dùng thành công');
    //     loadUsers();
    //   } else {
    //     toast.error(data.message || 'Xóa người dùng thất bại');
    //   }
    // } catch (error) {
    //   console.error('Delete user error:', error);
    //   toast.error('Lỗi kết nối server');
    // }
  };

  const copyUserUrl = (userId) => {
    const url = `${window.location.origin}/${userId}/unlock`;
    navigator.clipboard.writeText(url);
    toast.success('Đã copy URL vào clipboard');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Quản lý người dùng</h2>
        <div className="text-sm text-gray-500">
          Tổng: {users.length} người dùng
        </div>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-teal focus:border-transparent"
            placeholder="Tìm kiếm theo email..."
          />
          <button
            type="submit"
            className="px-4 py-2 bg-primary-teal text-white rounded-lg hover:bg-accent-green transition-colors"
          >
            Tìm kiếm
          </button>
        </div>
      </form>

      {/* Users Table */}
      {isLoading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-teal"></div>
        </div>
      ) : users.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          Không có người dùng nào
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày tạo
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  URL
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {user.email}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.user_id}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(user.created_at)}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button
                      onClick={() => copyUserUrl(user.user_id)}
                      className="text-primary-teal hover:text-accent-green transition-colors"
                    >
                      Copy URL
                    </button>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      className="text-red-600 hover:text-red-900 transition-colors"
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-6 space-x-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Trước
          </button>
          
          <span className="px-3 py-1 text-sm text-gray-600">
            Trang {currentPage} / {totalPages}
          </span>
          
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Sau
          </button>
        </div>
      )}
    </div>
  );
}
