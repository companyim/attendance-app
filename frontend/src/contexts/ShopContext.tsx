import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import shopApi from '../services/shopApi';

interface StudentInfo {
  id: string;
  name: string;
  baptismName: string;
  grade: string;
  talent: number;
}

interface CartItem {
  productId: string;
  name: string;
  talentPrice: number;
  imageUrl?: string;
  quantity: number;
  stock: number;
}

interface ShopContextType {
  student: StudentInfo | null;
  cart: CartItem[];
  cartTotal: number;
  login: (name: string, baptismName: string) => Promise<void>;
  logout: () => void;
  refreshStudent: () => Promise<void>;
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
}

const ShopContext = createContext<ShopContextType | null>(null);

export function ShopProvider({ children }: { children: ReactNode }) {
  const [student, setStudent] = useState<StudentInfo | null>(() => {
    const saved = localStorage.getItem('studentInfo');
    return saved ? JSON.parse(saved) : null;
  });
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('shopCart');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('shopCart', JSON.stringify(cart));
  }, [cart]);

  const cartTotal = cart.reduce((sum, item) => sum + item.talentPrice * item.quantity, 0);

  const login = async (name: string, baptismName: string) => {
    const res = await shopApi.post('/student-auth/login', { name, baptismName });
    localStorage.setItem('studentToken', res.data.token);
    localStorage.setItem('studentInfo', JSON.stringify(res.data.student));
    setStudent(res.data.student);
  };

  const logout = () => {
    localStorage.removeItem('studentToken');
    localStorage.removeItem('studentInfo');
    localStorage.removeItem('shopCart');
    setStudent(null);
    setCart([]);
  };

  const refreshStudent = async () => {
    try {
      const res = await shopApi.get('/student-auth/me');
      localStorage.setItem('studentInfo', JSON.stringify(res.data));
      setStudent(res.data);
    } catch { /* ignore */ }
  };

  const addToCart = (item: Omit<CartItem, 'quantity'>) => {
    setCart(prev => {
      const existing = prev.find(c => c.productId === item.productId);
      if (existing) {
        return prev.map(c =>
          c.productId === item.productId ? { ...c, quantity: c.quantity + 1 } : c
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(c => c.productId !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev => prev.map(c => (c.productId === productId ? { ...c, quantity } : c)));
  };

  const clearCart = () => setCart([]);

  return (
    <ShopContext.Provider
      value={{ student, cart, cartTotal, login, logout, refreshStudent, addToCart, removeFromCart, updateQuantity, clearCart }}
    >
      {children}
    </ShopContext.Provider>
  );
}

export function useShop() {
  const ctx = useContext(ShopContext);
  if (!ctx) throw new Error('useShop must be used within ShopProvider');
  return ctx;
}
