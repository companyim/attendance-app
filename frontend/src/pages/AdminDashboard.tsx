import { useState, useEffect } from 'react';
import { useNavigate, Routes, Route, NavLink } from 'react-router-dom';
import api from '../services/api';
import DoctrineAttendanceCheck from '../components/attendance/DoctrineAttendanceCheck';
import MassAttendanceCheck from '../components/attendance/MassAttendanceCheck';
import DepartmentAttendanceCheck from '../components/attendance/DepartmentAttendanceCheck';
import StudentManagement from './StudentManagement';
import Statistics from './Statistics';
import AdminShopProducts from './AdminShopProducts';
import AdminShopOrders from './AdminShopOrders';
import Button from '../components/common/Button';

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function checkAuth() {
      try {
        const response = await api.get('/auth/admin/check');
        setIsAuthenticated(response.data.isAdmin);
        if (!response.data.isAdmin) {
          navigate('/admin/login');
        }
      } catch (error) {
        navigate('/admin/login');
      } finally {
        setLoading(false);
      }
    }

    checkAuth();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await api.post('/auth/admin/logout');
      localStorage.removeItem('adminToken');
      navigate('/admin/login');
    } catch (error) {
      localStorage.removeItem('adminToken');
      navigate('/admin/login');
    }
  };

  if (loading) {
    return <div className="p-4">인증 확인 중...</div>;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-md mb-4">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex justify-between items-center mb-3">
            <h1 className="text-xl font-bold">관리자 대시보드</h1>
            <div className="flex gap-2">
              <Button variant="secondary" onClick={() => navigate('/')}>
                학생 조회 화면
              </Button>
            <Button variant="secondary" onClick={handleLogout}>
              로그아웃
            </Button>
            </div>
          </div>
          <nav className="flex gap-4 border-t pt-3">
            <NavLink
              to="/admin/dashboard"
              end
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg ${isActive ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`
              }
            >
              교리출석
            </NavLink>
            <NavLink
              to="/admin/dashboard/mass-attendance"
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg ${isActive ? 'bg-orange-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`
              }
            >
              미사출석
            </NavLink>
            <NavLink
              to="/admin/dashboard/department-attendance"
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg ${isActive ? 'bg-purple-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`
              }
            >
              부서출석
            </NavLink>
            <NavLink
              to="/admin/dashboard/students"
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg ${isActive ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`
              }
            >
              학생 관리
            </NavLink>
            <NavLink
              to="/admin/dashboard/statistics"
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg ${isActive ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`
              }
            >
              통계
            </NavLink>
            <NavLink
              to="/admin/dashboard/shop-products"
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg ${isActive ? 'bg-amber-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`
              }
            >
              상품관리
            </NavLink>
            <NavLink
              to="/admin/dashboard/shop-orders"
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg ${isActive ? 'bg-amber-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`
              }
            >
              신청관리
            </NavLink>
          </nav>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 mb-4">
        <div
          onClick={() => window.open('/shop/login', '_blank')}
          className="bg-gradient-to-r from-amber-400 to-amber-500 rounded-xl p-4 cursor-pointer hover:from-amber-500 hover:to-amber-600 transition shadow-md"
        >
          <div className="flex items-center justify-between text-white">
            <div>
              <h3 className="text-lg font-bold">🪙 달란트 상점 미리보기</h3>
              <p className="text-amber-100 text-sm mt-1">학생이 보는 상점 화면을 새 탭에서 확인합니다</p>
            </div>
            <span className="text-2xl">→</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        <Routes>
          <Route index element={<DoctrineAttendanceCheck />} />
          <Route path="mass-attendance" element={<MassAttendanceCheck />} />
          <Route path="department-attendance" element={<DepartmentAttendanceCheck />} />
          <Route path="students" element={<StudentManagement />} />
          <Route path="statistics" element={<Statistics />} />
          <Route path="shop-products" element={<AdminShopProducts />} />
          <Route path="shop-orders" element={<AdminShopOrders />} />
        </Routes>
      </div>
    </div>
  );
}

