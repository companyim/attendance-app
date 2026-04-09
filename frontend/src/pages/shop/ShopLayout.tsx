import { useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useShop } from '../../contexts/ShopContext';

export default function ShopLayout() {
  const { student, cart, logout } = useShop();
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => location.pathname === path;

  useEffect(() => {
    if (!student && !location.pathname.includes('/login')) {
      navigate('/shop/login');
    }
  }, [student, location.pathname, navigate]);

  if (!student && !location.pathname.includes('/login')) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/shop" className="flex items-center gap-2">
            <span className="text-2xl">🪙</span>
            <span className="text-lg font-bold text-amber-700">달란트 상점</span>
          </Link>

          {student && (
            <div className="flex items-center gap-3">
              <Link
                to="/shop/cart"
                className={`relative p-2 rounded-lg transition ${isActive('/shop/cart') ? 'bg-amber-100' : 'hover:bg-gray-100'}`}
              >
                🛒
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {cart.length}
                  </span>
                )}
              </Link>
              <div className="text-sm">
                <span className="font-medium">{student.name}</span>
                <span className="text-amber-600 ml-2">{student.talent}🪙</span>
              </div>
              <button onClick={logout} className="text-xs text-gray-400 hover:text-gray-600">
                로그아웃
              </button>
            </div>
          )}
        </div>

        {student && (
          <nav className="max-w-4xl mx-auto px-4 pb-2 flex gap-1">
            {[
              { path: '/shop', label: '상품' },
              { path: '/shop/orders', label: '신청내역' },
              { path: '/', label: '출석부로' },
            ].map(({ path, label }) => (
              <Link
                key={path}
                to={path}
                className={`px-3 py-1.5 rounded-full text-sm transition ${
                  isActive(path) ? 'bg-amber-500 text-white' : 'text-gray-600 hover:bg-amber-100'
                }`}
              >
                {label}
              </Link>
            ))}
          </nav>
        )}
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}
