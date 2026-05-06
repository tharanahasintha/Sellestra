import React, { useState, useEffect, useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, Plus, Edit, Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';
import api from '../../services/api';
import { AuthContext } from '../../context/AuthContext';

const ProductCard = ({ product, user, handleDelete }) => {
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
    <div className="group bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition duration-300">
      <NavLink to={`/products/${product.id}`} className="block relative aspect-square bg-slate-100 overflow-hidden">
        <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
      </NavLink>
      <div className="p-5 flex flex-col items-start text-left">
        <div className="flex justify-between items-start w-full mb-2">
          <NavLink to={`/products/${product.id}`} className="font-semibold text-lg text-slate-800 hover:text-primary transition">
            {product.name}
          </NavLink>
        </div>
        <div className="flex justify-between w-full items-center mb-4">
          <div className="font-serif text-xl text-primary font-medium">LKR {product.price}</div>
          <div className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-1 rounded">
            Avail: {product.quantity != null ? product.quantity : (product.stock || 0)}
          </div>
        </div>
        
        <div className="flex items-center w-full gap-2 mb-3">
           <button 
             onClick={() => setQuantity(Math.max(1, quantity - 1))}
             className="px-2 py-1 bg-slate-100 text-slate-600 rounded hover:bg-slate-200"
           >-</button>
           <span className="font-medium text-sm w-4 text-center">{quantity}</span>
           <button 
             onClick={() => setQuantity(Math.min(product.quantity || product.stock || 99, quantity + 1))}
             className="px-2 py-1 bg-slate-100 text-slate-600 rounded hover:bg-slate-200"
           >+</button>
        </div>

        <div className="flex gap-2 w-full mt-auto">
          <button onClick={handleAddToCart} className="flex-1 flex justify-center items-center gap-2 bg-slate-900 text-white py-2 rounded-lg hover:bg-primary transition font-medium text-sm">
            <ShoppingCart size={16} /> Add to Cart
          </button>
          
          {user?.role === 'ADMIN' && (
            <>
              <button className="p-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-100 transition">
                <Edit size={16} />
              </button>
              <button onClick={() => handleDelete(product.id)} className="p-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition">
                <Trash2 size={16} />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm.trim()) {
        fetchSearch(searchTerm);
      } else {
        fetchProducts();
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const fetchSearch = async (term) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.product.get(`/products/search?name=${encodeURIComponent(term)}`);
      setProducts(response.data);
    } catch (err) {
      setError("Failed to search products.");
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.product.get('/products');
      setProducts(response.data);
    } catch (error) {
      setError("Failed to load products.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if(!window.confirm("Delete this product?")) return;
    try {
      await api.product.delete(`/products/${id}`);
      setProducts((current) => current.filter(p => p.id !== id));
      toast.success("Product deleted.");
    } catch (error) {
      toast.error("Failed to delete product.");
    }
  };

  const filteredProducts = products;

  return (
    <div className="container mx-auto px-6 py-12 text-left">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h2 className="text-3xl font-serif text-slate-800">Shop Collection</h2>
        
        <div className="flex w-full md:w-auto gap-4">
          <div className="relative w-full md:w-64">
            <input 
              type="text" 
              placeholder="Search products..." 
              className="w-full pl-10 pr-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
          </div>

          {user?.role === 'ADMIN' && (
            <button className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-full hover:bg-primary-dark transition font-medium whitespace-nowrap">
              <Plus size={18} /> Add Product
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : error ? (
        <div className="flex justify-center flex-col items-center py-20 text-red-500">
           <div className="text-xl font-medium">{error}</div>
           <button onClick={fetchProducts} className="mt-4 px-4 py-2 border rounded-full hover:bg-slate-50 transition text-slate-800">Retry</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} user={user} handleDelete={handleDelete} />
          ))}
          {filteredProducts.length === 0 && (
            <div className="col-span-full text-center py-12 text-slate-500 font-medium text-lg">No products found.</div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductList;
