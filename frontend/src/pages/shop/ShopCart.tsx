import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useShop } from '../../contexts/ShopContext';
import shopApi from '../../services/shopApi';

export default function ShopCart() {
  const { cart, cartTotal, student, updateQuantity, removeFromCart, clearCart, refreshStudent } = useShop();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const insufficientTalent = student ? student.talent < cartTotal : false;

  const handleSubmit = async () => {
    if (!student || cart.length === 0) return;
    setError('');
    setSubmitting(true);

    try {
      await shopApi.post('/shop/orders', {
        items: cart.map(item => ({ productId: item.productId, quantity: item.quantity })),
      });
      clearCart();
      await refreshStudent();
      setSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.error || '신청 중 오류가 발생했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="text-center py-12">
        <div className="text-5xl mb-4">✅</div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">신청 완료!</h2>
        <p className="text-gray-500 mb-6">관리자 승인 후 달란트가 차감됩니다.</p>
        <div className="flex gap-3 justify-center">
          <button onClick={() => navigate('/shop/orders')} className="px-6 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition">신청내역 보기</button>
          <button onClick={() => navigate('/shop')} className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition">계속 쇼핑</button>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-5xl mb-4">🛒</div>
        <p className="text-gray-400 mb-4">장바구니가 비어있습니다.</p>
        <button onClick={() => navigate('/shop')} className="px-6 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition">상품 보러가기</button>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-lg font-bold mb-4">장바구니</h2>
      <div className="space-y-3 mb-6">
        {cart.map(item => (
          <div key={item.productId} className="bg-white rounded-xl p-4 shadow-sm border flex items-center gap-4">
            <div className="w-14 h-14 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
              {item.imageUrl ? <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover rounded-lg" /> : <span className="text-2xl">🎁</span>}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-sm truncate">{item.name}</h3>
              <p className="text-amber-600 text-sm">{item.talentPrice}🪙</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => updateQuantity(item.productId, item.quantity - 1)} className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 text-sm flex items-center justify-center">-</button>
              <span className="text-sm w-6 text-center">{item.quantity}</span>
              <button onClick={() => updateQuantity(item.productId, item.quantity + 1)} disabled={item.stock > 0 && item.quantity >= item.stock} className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 text-sm flex items-center justify-center disabled:opacity-30">+</button>
            </div>
            <div className="text-right">
              <p className="font-bold text-sm text-amber-700">{item.talentPrice * item.quantity}🪙</p>
              <button onClick={() => removeFromCart(item.productId)} className="text-xs text-red-400 hover:text-red-600">삭제</button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl p-4 shadow-sm border mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-600">합계</span>
          <span className="text-xl font-bold text-amber-600">{cartTotal}🪙</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-500">내 달란트</span>
          <span className={student && insufficientTalent ? 'text-red-500 font-medium' : 'text-gray-700'}>{student?.talent || 0}🪙</span>
        </div>
        {insufficientTalent && <p className="text-red-500 text-xs mt-2">달란트가 부족합니다. ({cartTotal - (student?.talent || 0)}개 부족)</p>}
      </div>

      {error && <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4">{error}</div>}

      <button onClick={handleSubmit} disabled={submitting || insufficientTalent} className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-xl transition disabled:opacity-50">
        {submitting ? '신청 중...' : `${cartTotal}🪙 신청하기`}
      </button>
    </div>
  );
}
