import React, { useEffect, useState } from 'react';
import { ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../services/api';

const ProductCard = ({ product }) => {
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();

  const handleAddToCart = async () => {
    try {
      const orderRes = await api.order.post(`/orders?productId=${product.id}&qty=${quantity}`);
      const orderId = orderRes.data.id;
      
      await api.product.put(`/products/reduce/${product.id}?qty=${quantity}`);

      toast.success("Order initiated! Redirecting to payment...");
      navigate('/checkout', { state: { orderId, product, quantity } });
    } catch (err) {
      toast.error("Failed to place order. Please try again.");
    }
  };

  return (
    <div className="product-card">
      <img src={product.image || 'https://via.placeholder.com/250x250?text=Sellestra'} alt={product.name} className="card-image" />
      <div className="card-body">
        <h3 className="card-title">{product.name}</h3>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <div className="card-price" style={{ marginBottom: 0 }}>LKR {product.price}</div>
          <div style={{ fontSize: '12px', fontWeight: '500', color: '#64748b', background: '#f1f5f9', padding: '2px 8px', borderRadius: '4px' }}>
            Avail: {product.quantity != null ? product.quantity : (product.stock || 0)}
          </div>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
           <button 
             onClick={() => setQuantity(Math.max(1, quantity - 1))}
             style={{ padding: '2px 8px', background: '#f1f5f9', borderRadius: '4px', border: '1px solid #e2e8f0', cursor: 'pointer' }}
           >-</button>
           <span style={{ fontSize: '14px', fontWeight: '500', width: '20px', textAlign: 'center' }}>{quantity}</span>
           <button 
             onClick={() => setQuantity(Math.min(product.quantity || product.stock || 99, quantity + 1))}
             style={{ padding: '2px 8px', background: '#f1f5f9', borderRadius: '4px', border: '1px solid #e2e8f0', cursor: 'pointer' }}
           >+</button>
        </div>

        <button className="btn btn-primary" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }} onClick={handleAddToCart}>
          <ShoppingCart size={18} /> Add to Cart
        </button>
      </div>
    </div>
  );
};

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.product.get('/products');
        setProducts(response.data);
      } catch (err) {
        console.error("Backend fetch failed:", err);
        setError("Failed to load products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) return <div className="container" style={{paddingTop: '3rem', textAlign: 'center'}}>Loading products...</div>;
  if (error) return <div className="container" style={{paddingTop: '3rem', textAlign: 'center', color: 'red'}}>{error}</div>;

  return (
    <div className="container">
      <h2 style={{ marginTop: '2rem', marginBottom: '1rem', color: 'var(--color-primary-dark)' }}>All Products</h2>
      <div className="product-grid">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default Products;
