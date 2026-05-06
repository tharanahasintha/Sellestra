import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingCart, ArrowLeft } from 'lucide-react';
import { toast } from 'react-toastify';
import api from '../../services/api';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await api.product.get(`/products/${id}`);
        // Support mapping if response.data doesn't use `stock` but `quantity` internally
        setProduct(response.data);
      } catch (err) {
        setError("Failed to load product details.");
      } finally {
        setLoading(false);
      }
    };
    fetchProductDetails();
  }, [id]);

  const handleAddToCart = async () => {
    try {
      const orderRes = await api.order.post(`/orders?productId=${product.id}&qty=${quantity}`);
      const orderId = orderRes.data.id;
      
      // Reduce stock implicitly
      await api.product.put(`/products/reduce/${product.id}?qty=${quantity}`);

      toast.success("Order initiated! Redirecting to payment...");
      navigate('/checkout', { state: { orderId, product, quantity } });
    } catch (err) {
      toast.error("Failed to place order. Please try again.");
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>;
  if (error) return <div className="text-center py-20 text-red-500 font-medium">{error}</div>;
  if (!product) return <div className="text-center py-20">Product not found.</div>;

  return (
    <div className="container mx-auto px-6 py-12 text-left">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 hover:text-primary mb-8 transition font-medium">
        <ArrowLeft size={18} /> Back to Products
      </button>

      <div className="flex flex-col md:flex-row gap-12 bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
        {/* Image Gallery */}
        <div className="w-full md:w-1/2 rounded-xl overflow-hidden bg-slate-50 aspect-[4/5]">
          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
        </div>

        {/* Product Info */}
        <div className="w-full md:w-1/2 flex flex-col text-left">
          <div className="text-sm text-primary font-bold tracking-widest uppercase mb-2">Sellestra Exclusive</div>
          <h1 className="text-4xl font-serif text-slate-900 mb-4">{product.name}</h1>
          <div className="text-3xl font-medium text-primary mb-6">LKR {product.price}</div>
          
          <div className="prose prose-slate mb-8 max-w-none">
            <p className="text-slate-600 leading-relaxed text-lg">{product.description}</p>
          </div>
          
          <div className="mb-8">
            <span className={`text-sm font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {product.stock > 0 ? `${product.stock} in Stock` : 'Out of Stock'}
            </span>
          </div>

          <div className="flex items-center gap-6 mt-auto border-t border-slate-100 pt-8">
            <div className="flex items-center border border-slate-300 rounded-lg">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-4 py-3 text-slate-600 hover:bg-slate-50 transition border-r"
              >-</button>
              <span className="px-6 font-medium">{quantity}</span>
              <button 
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                className="px-4 py-3 text-slate-600 hover:bg-slate-50 transition border-l"
              >+</button>
            </div>

            <button 
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="flex-1 flex justify-center items-center gap-2 bg-primary text-white py-4 px-8 rounded-lg hover:bg-primary-dark transition font-medium text-lg disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-primary/20"
            >
              <ShoppingCart size={20} /> Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
