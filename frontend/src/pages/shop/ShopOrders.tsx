import { useState, useEffect } from 'react';
import shopApi from '../../services/shopApi';

interface OrderItem {
  id: string;
  quantity: number;
  priceAtOrder: number;
  product: { name: string; imageUrl: string | null };
}

interface Order {
  id: string;
  status: string;
  totalTalent: number;
  adminMemo: string | null;
  createdAt: string;
  items: OrderItem[];
}

const STATUS_MAP: Record<string, { label: string; color: string }> = {
  pending: { label: '대기중', color: 'bg-yellow-100 text-yellow-700' },
  approved: { label: '승인', color: 'bg-green-100 text-green-700' },
  rejected: { label: '거절', color: 'bg-red-100 text-red-700' },
};

export default function ShopOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await shopApi.get('/shop/orders/my');
        setOrders(res.data.orders);
      } catch (error) {
        console.error('주문 내역 로드 실패:', error);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const formatDate = (d: string) => {
    const date = new Date(d);
    return `${date.getMonth() + 1}/${date.getDate()} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  };

  if (loading) return <div className="text-center py-12 text-gray-500">불러오는 중...</div>;

  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-5xl mb-4">📋</div>
        <p className="text-gray-400">신청 내역이 없습니다.</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-lg font-bold mb-4">신청 내역</h2>
      <div className="space-y-3">
        {orders.map(order => {
          const st = STATUS_MAP[order.status] || STATUS_MAP.pending;
          return (
            <div key={order.id} className="bg-white rounded-xl p-4 shadow-sm border">
              <div className="flex items-center justify-between mb-3">
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${st.color}`}>{st.label}</span>
                <span className="text-xs text-gray-400">{formatDate(order.createdAt)}</span>
              </div>
              <div className="space-y-2">
                {order.items.map(item => (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      {item.product.imageUrl ? <img src={item.product.imageUrl} alt="" className="w-full h-full object-cover rounded-lg" /> : <span className="text-lg">🎁</span>}
                    </div>
                    <span className="text-sm flex-1">{item.product.name}</span>
                    <span className="text-xs text-gray-500">x{item.quantity}</span>
                    <span className="text-sm text-amber-600 font-medium">{item.priceAtOrder * item.quantity}🪙</span>
                  </div>
                ))}
              </div>
              <div className="mt-3 pt-3 border-t flex justify-between items-center">
                <span className="text-sm text-gray-500">합계</span>
                <span className="font-bold text-amber-600">{order.totalTalent}🪙</span>
              </div>
              {order.adminMemo && <p className="mt-2 text-xs text-gray-500 bg-gray-50 p-2 rounded">관리자 메모: {order.adminMemo}</p>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
