import { useState, useEffect } from 'react';
import api from '../services/api';
import Button from '../components/common/Button';

interface OrderItem {
  id: string;
  quantity: number;
  priceAtOrder: number;
  product: { name: string };
}

interface Order {
  id: string;
  status: string;
  totalTalent: number;
  adminMemo: string | null;
  createdAt: string;
  student: { name: string; baptismName: string | null; grade: string; talent: number };
  items: OrderItem[];
}

const STATUS_FILTER = [
  { value: '', label: '전체' },
  { value: 'pending', label: '대기중' },
  { value: 'approved', label: '승인' },
  { value: 'rejected', label: '거절' },
];

const STATUS_STYLE: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  approved: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
};

const STATUS_LABEL: Record<string, string> = {
  pending: '대기중',
  approved: '승인',
  rejected: '거절',
};

export default function AdminShopOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [processing, setProcessing] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      const params = filter ? `?status=${filter}` : '';
      const res = await api.get(`/shop/orders${params}`);
      setOrders(res.data.orders);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, [filter]);

  const handleApprove = async (id: string) => {
    if (!confirm('이 신청을 승인하시겠습니까? 학생의 달란트가 차감됩니다.')) return;
    setProcessing(id);
    try {
      await api.put(`/shop/orders/${id}/approve`);
      fetchOrders();
    } catch (err: any) {
      alert(err.response?.data?.error || '승인 처리에 실패했습니다.');
    } finally {
      setProcessing(null);
    }
  };

  const handleReject = async (id: string) => {
    const memo = prompt('거절 사유를 입력하세요 (선택)');
    setProcessing(id);
    try {
      await api.put(`/shop/orders/${id}/reject`, { adminMemo: memo });
      fetchOrders();
    } catch (err: any) {
      alert(err.response?.data?.error || '거절 처리에 실패했습니다.');
    } finally {
      setProcessing(null);
    }
  };

  const formatDate = (d: string) => {
    const date = new Date(d);
    return `${date.getMonth() + 1}/${date.getDate()} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  };

  const pendingCount = orders.filter(o => o.status === 'pending').length;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold">신청 관리</h2>
          {pendingCount > 0 && (
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">{pendingCount}건 대기</span>
          )}
        </div>
      </div>

      <div className="flex gap-2 mb-4">
        {STATUS_FILTER.map(f => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`px-3 py-1.5 rounded-full text-sm ${filter === f.value ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-8">로딩 중...</div>
      ) : orders.length === 0 ? (
        <div className="text-center py-8 text-gray-400">신청 내역이 없습니다.</div>
      ) : (
        <div className="space-y-3">
          {orders.map(order => (
            <div key={order.id} className="bg-white rounded-lg shadow-sm p-4 border">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${STATUS_STYLE[order.status]}`}>
                    {STATUS_LABEL[order.status]}
                  </span>
                  <span className="font-medium">{order.student.name}</span>
                  {order.student.baptismName && <span className="text-gray-400 text-sm">({order.student.baptismName})</span>}
                  <span className="text-gray-400 text-xs">{order.student.grade}</span>
                  <span className="text-amber-600 text-xs">보유 {order.student.talent}🪙</span>
                </div>
                <span className="text-xs text-gray-400">{formatDate(order.createdAt)}</span>
              </div>

              <div className="space-y-1 mb-3">
                {order.items.map(item => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span>{item.product.name} x{item.quantity}</span>
                    <span className="text-amber-600">{item.priceAtOrder * item.quantity}🪙</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-3 border-t">
                <span className="font-bold text-amber-600">합계 {order.totalTalent}🪙</span>
                {order.status === 'pending' && (
                  <div className="flex gap-2">
                    <Button onClick={() => handleApprove(order.id)} isLoading={processing === order.id} disabled={order.student.talent < order.totalTalent}>
                      {order.student.talent < order.totalTalent ? '달란트 부족' : '승인'}
                    </Button>
                    <Button variant="danger" onClick={() => handleReject(order.id)} isLoading={processing === order.id}>거절</Button>
                  </div>
                )}
              </div>

              {order.adminMemo && <p className="mt-2 text-xs text-gray-500 bg-gray-50 p-2 rounded">메모: {order.adminMemo}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
