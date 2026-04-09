import { useState, useEffect } from 'react';
import shopApi from '../../services/shopApi';
import { useShop } from '../../contexts/ShopContext';

interface Product {
  id: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
  talentPrice: number;
  category: string;
  stock: number;
}

export default function ShopHome() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const { addToCart, cart } = useShop();

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const [prodRes, catRes] = await Promise.all([
          shopApi.get('/shop/products'),
          shopApi.get('/shop/products/categories'),
        ]);
        setProducts(prodRes.data.products);
        setCategories(catRes.data.categories);
      } catch (error) {
        console.error('상품 로드 실패:', error);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filtered = selectedCategory
    ? products.filter(p => p.category === selectedCategory)
    : products;

  const getCartQty = (productId: string) => {
    const item = cart.find(c => c.productId === productId);
    return item?.quantity || 0;
  };

  if (loading) return <div className="text-center py-12 text-gray-500">상품을 불러오는 중...</div>;

  return (
    <div>
      {categories.length > 1 && (
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          <button
            onClick={() => setSelectedCategory('')}
            className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition ${
              !selectedCategory ? 'bg-amber-500 text-white' : 'bg-white text-gray-600 hover:bg-amber-100 border'
            }`}
          >
            전체
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition ${
                selectedCategory === cat ? 'bg-amber-500 text-white' : 'bg-white text-gray-600 hover:bg-amber-100 border'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="text-center py-12 text-gray-400">등록된 상품이 없습니다.</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {filtered.map(product => {
            const inCart = getCartQty(product.id);
            const outOfStock = product.stock > 0 && product.stock <= inCart;

            return (
              <div key={product.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition">
                <div className="aspect-square bg-gray-100 flex items-center justify-center">
                  {product.imageUrl ? (
                    <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-4xl text-gray-300">🎁</span>
                  )}
                </div>
                <div className="p-3">
                  <h3 className="font-medium text-gray-800 text-sm truncate">{product.name}</h3>
                  {product.description && (
                    <p className="text-xs text-gray-400 mt-0.5 truncate">{product.description}</p>
                  )}
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-amber-600 font-bold text-sm">{product.talentPrice}🪙</span>
                    {product.stock > 0 && (
                      <span className="text-xs text-gray-400">남은 수량: {product.stock}</span>
                    )}
                  </div>
                  <button
                    onClick={() => addToCart({
                      productId: product.id,
                      name: product.name,
                      talentPrice: product.talentPrice,
                      imageUrl: product.imageUrl || undefined,
                      stock: product.stock,
                    })}
                    disabled={outOfStock}
                    className={`w-full mt-2 py-2 rounded-lg text-sm font-medium transition ${
                      outOfStock
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                    }`}
                  >
                    {outOfStock ? '품절' : inCart ? `담김 (${inCart})` : '담기'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
