import { useState, useEffect, useRef } from 'react';
import api from '../services/api';
import Modal from '../components/common/Modal';
import Button from '../components/common/Button';

interface Product {
  id: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
  talentPrice: number;
  category: string;
  stock: number;
  isActive: boolean;
}

const DEFAULT_CATEGORIES = ['문구', '간식', '장난감', '쿠폰', '기타'];

export default function AdminShopProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState({
    name: '',
    description: '',
    imageUrl: '',
    talentPrice: '',
    category: '기타',
    stock: '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchProducts = async () => {
    try {
      const res = await api.get('/shop/products?activeOnly=false');
      setProducts(res.data.products);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  const openModal = (product?: Product) => {
    if (product) {
      setEditing(product);
      setForm({
        name: product.name,
        description: product.description || '',
        imageUrl: product.imageUrl || '',
        talentPrice: String(product.talentPrice),
        category: product.category,
        stock: String(product.stock),
      });
    } else {
      setEditing(null);
      setForm({ name: '', description: '', imageUrl: '', talentPrice: '', category: '기타', stock: '' });
    }
    setError('');
    setIsModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('image', file);

      const res = await api.post('/upload/image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setForm(prev => ({ ...prev, imageUrl: res.data.url }));
    } catch (err: any) {
      setError(err.response?.data?.error || '이미지 업로드에 실패했습니다.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const data = {
        ...form,
        talentPrice: parseInt(form.talentPrice, 10),
        stock: parseInt(form.stock, 10) || 0,
      };

      if (editing) {
        await api.put(`/shop/products/${editing.id}`, data);
      } else {
        await api.post('/shop/products', data);
      }
      setIsModalOpen(false);
      fetchProducts();
    } catch (err: any) {
      setError(err.response?.data?.error || '저장에 실패했습니다.');
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (product: Product) => {
    try {
      await api.put(`/shop/products/${product.id}`, { isActive: !product.isActive });
      fetchProducts();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;
    try {
      await api.delete(`/shop/products/${id}`);
      fetchProducts();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">상품 관리</h2>
        <Button onClick={() => openModal()}>상품 추가</Button>
      </div>

      {loading ? (
        <div className="text-center py-8">로딩 중...</div>
      ) : products.length === 0 ? (
        <div className="text-center py-8 text-gray-400">등록된 상품이 없습니다.</div>
      ) : (
        <div className="space-y-2">
          {products.map(product => (
            <div key={product.id} className={`bg-white rounded-lg shadow-sm p-4 border ${!product.isActive ? 'opacity-50' : ''}`}>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                  {product.imageUrl ? (
                    <img src={product.imageUrl} alt="" className="w-full h-full object-cover rounded-lg" />
                  ) : (
                    <span className="text-2xl">🎁</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">{product.name}</h3>
                    <span className="text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-600">{product.category}</span>
                    {!product.isActive && <span className="text-xs px-2 py-0.5 rounded bg-red-100 text-red-600">비활성</span>}
                  </div>
                  <p className="text-sm text-gray-500">
                    <span className="text-amber-600 font-medium">{product.talentPrice}🪙</span>
                    <span className="ml-2">재고: {product.stock > 0 ? `${product.stock}개` : '무제한'}</span>
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="secondary" onClick={() => toggleActive(product)}>
                    {product.isActive ? '비활성' : '활성'}
                  </Button>
                  <Button variant="secondary" onClick={() => openModal(product)}>수정</Button>
                  <Button variant="danger" onClick={() => handleDelete(product.id)}>삭제</Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editing ? '상품 수정' : '상품 추가'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">상품명 *</label>
            <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full p-2 border rounded-lg" required />
          </div>
          <div>
            <label className="block mb-1 font-medium">설명</label>
            <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="w-full p-2 border rounded-lg" rows={2} />
          </div>
          <div>
            <label className="block mb-1 font-medium">상품 이미지</label>
            <div className="space-y-2">
              {form.imageUrl && (
                <div className="relative w-32 h-32 rounded-lg overflow-hidden border">
                  <img src={form.imageUrl} alt="미리보기" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, imageUrl: '' })}
                    className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full text-xs flex items-center justify-center hover:bg-red-600"
                  >
                    X
                  </button>
                </div>
              )}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm hover:bg-blue-100 transition disabled:opacity-50"
                >
                  {uploading ? '업로드 중...' : '파일 선택'}
                </button>
                <input
                  type="text"
                  value={form.imageUrl}
                  onChange={e => setForm({ ...form, imageUrl: e.target.value })}
                  className="flex-1 p-2 border rounded-lg text-sm"
                  placeholder="또는 이미지 URL 직접 입력"
                />
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 font-medium">달란트 가격 *</label>
              <input type="number" value={form.talentPrice} onChange={e => setForm({ ...form, talentPrice: e.target.value })} className="w-full p-2 border rounded-lg" min="1" required />
            </div>
            <div>
              <label className="block mb-1 font-medium">재고 (0=무제한)</label>
              <input type="number" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} className="w-full p-2 border rounded-lg" min="0" />
            </div>
          </div>
          <div>
            <label className="block mb-1 font-medium">카테고리</label>
            <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="w-full p-2 border rounded-lg">
              {DEFAULT_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          {error && <div className="text-red-600 text-sm">{error}</div>}
          <div className="flex gap-2 justify-end">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>취소</Button>
            <Button type="submit" isLoading={saving}>저장</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
