import React, { useState, useEffect } from 'react';
import { Users, Package, ShoppingBag, CreditCard, Plus, Trash2, Edit } from 'lucide-react';
import { toast } from 'react-toastify';
import api from '../../services/api';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('products');

  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);

  // Modal State
  const [showProductModal, setShowProductModal] = useState(false);
  const [showEditProductModal, setShowEditProductModal] = useState(false);
  const [editProductData, setEditProductData] = useState(null);
  const [newProduct, setNewProduct] = useState({ name: '', price: '', description: '', quantity: '' });

  useEffect(() => {
    fetchData(activeTab);
  }, [activeTab]);

  const fetchData = async (tab) => {
    setLoading(true);
    try {
      if (tab === 'users') {
        const res = await api.user.get('/users');
        setUsers(res.data);
      } else if (tab === 'products') {
        const res = await api.product.get('/products');
        setProducts(res.data);
      } else if (tab === 'orders') {
        const res = await api.order.get('/orders');
        setOrders(res.data);
      } else if (tab === 'payments') {
        const res = await api.payment.get('/payments');
        setPayments(res.data);
      }
    } catch (err) {
      toast.error(`Failed to load ${tab} data. Have you restarted the backend?`);
    } finally {
      setLoading(false);
    }
  };

  // Delete Handlers
  const deleteItem = async (type, id) => {
    if (!window.confirm(`Are you sure you want to delete this ${type}?`)) return;
    try {
      await api[type].delete(`/${type}s/${id}`);
      toast.success(`${type} deleted successfully.`);
      fetchData(activeTab); // refresh
    } catch (err) {
      toast.error(`Failed to delete ${type}`);
    }
  };

  const cancelOrder = async (id) => {
    if (!window.confirm(`Cancel order ${id}?`)) return;
    try {
      await api.order.put(`/orders/cancel/${id}`);
      toast.success(`Order ${id} cancelled successfully.`);
      fetchData('orders'); // refresh
    } catch (err) {
      toast.error(`Failed to cancel order`);
    }
  }

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    try {
      await api.product.post('/products', newProduct);
      toast.success('Product created successfully!');
      setShowProductModal(false);
      setNewProduct({ name: '', price: '', description: '', quantity: '' });
      fetchData('products');
    } catch (err) {
      toast.error('Failed to create product.');
    }
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    try {
      await api.product.put(`/products/${editProductData.id}`, editProductData);
      toast.success('Product updated successfully!');
      setShowEditProductModal(false);
      fetchData('products');
    } catch (err) {
      toast.error('Failed to update product.');
    }
  };

  const setRole = async (authId, role) => {
    if (!window.confirm(`Set role to ${role} for user?`)) return;
    try {
      await api.auth.put(`/auth/roles/${authId}?role=${role}`);
      toast.success(`User role updated to ${role} successfully.`);
    } catch (err) {
      toast.error(`Failed to update role`);
    }
  };

  const renderContent = () => {
    if (loading) return <div className="p-12 text-center text-slate-500">Loading data...</div>;

    switch (activeTab) {
      case 'products':
        return (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">Manage Products</h3>
              <button
                onClick={() => setShowProductModal(true)}
                className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg flex items-center gap-2"
              >
                <Plus size={16} /> Add Product
              </button>
            </div>
            <div className="bg-white rounded-xl border overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 border-b">
                  <tr>
                    <th className="p-4 font-medium">ID</th>
                    <th className="p-4 font-medium">Name</th>
                    <th className="p-4 font-medium">Price</th>
                    <th className="p-4 font-medium">Stock</th>
                    <th className="p-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {products.map(p => (
                    <tr key={p.id} className="hover:bg-slate-50">
                      <td className="p-4 text-slate-500">{p.id}</td>
                      <td className="p-4 font-medium">{p.name}</td>
                      <td className="p-4">LKR {p.price}</td>
                      <td className="p-4">{p.quantity}</td>
                      <td className="p-4 flex gap-2">
                        <button onClick={() => { setEditProductData(p); setShowEditProductModal(true); }} className="p-1.5 text-slate-500 hover:text-primary border rounded"><Edit size={16} /></button>
                        <button onClick={() => deleteItem('product', p.id)} className="p-1.5 text-red-500 hover:bg-red-50 border border-transparent hover:border-red-200 rounded"><Trash2 size={16} /></button>
                      </td>
                    </tr>
                  ))}
                  {products.length === 0 && <tr><td colSpan="5" className="p-8 text-center text-slate-400">No products available.</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        );
      case 'users':
        return (
          <div>
            <h3 className="text-xl font-semibold mb-6">Manage Users</h3>
            <div className="bg-white rounded-xl border overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 border-b">
                  <tr>
                    <th className="p-4 font-medium">Auth ID</th>
                    <th className="p-4 font-medium">Name</th>
                    <th className="p-4 font-medium">Email</th>
                    <th className="p-4 font-medium">Phone</th>
                    <th className="p-4 font-medium">Role Toggles</th>
                    <th className="p-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {users.map(u => (
                    <tr key={u.id} className="hover:bg-slate-50">
                      <td className="p-4 text-slate-500">#{u.authUserId}</td>
                      <td className="p-4 font-medium">{u.name}</td>
                      <td className="p-4">{u.email}</td>
                      <td className="p-4">{u.phone}</td>
                      <td className="p-4 flex gap-1">
                        <button onClick={() => setRole(u.authUserId, 'ADMIN')} className="px-2 py-1 text-xs font-semibold bg-primary/10 text-primary rounded hover:bg-primary/20">Set Admin</button>
                        <button onClick={() => setRole(u.authUserId, 'USER')} className="px-2 py-1 text-xs font-semibold bg-slate-100 text-slate-600 rounded hover:bg-slate-200">Set User</button>
                      </td>
                      <td className="p-4">
                        <button onClick={() => deleteItem('user', u.id)} className="p-1.5 text-red-500 hover:bg-red-50 border border-transparent hover:border-red-200 rounded"><Trash2 size={16} /></button>
                      </td>
                    </tr>
                  ))}
                  {users.length === 0 && <tr><td colSpan="6" className="p-8 text-center text-slate-400">No users available.</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        );
      case 'orders':
        return (
          <div>
            <h3 className="text-xl font-semibold mb-6">Track Orders</h3>
            <div className="bg-white rounded-xl border overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 border-b">
                  <tr>
                    <th className="p-4 font-medium">Order ID</th>
                    <th className="p-4 font-medium">Product Name</th>
                    <th className="p-4 font-medium">Qty</th>
                    <th className="p-4 font-medium">Total Price</th>
                    <th className="p-4 font-medium">Status</th>
                    <th className="p-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {orders.map(o => (
                    <tr key={o.id} className="hover:bg-slate-50">
                      <td className="p-4 text-slate-500">#{o.id}</td>
                      <td className="p-4">{o.productName}</td>
                      <td className="p-4">{o.quantity}</td>
                      <td className="p-4">LKR {o.totalPrice}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${o.status === 'CREATED' ? 'bg-blue-100 text-blue-700' : o.status === 'CANCELLED' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                          {o.status}
                        </span>
                      </td>
                      <td className="p-4 flex gap-2">
                        {o.status !== 'CANCELLED' && (
                          <button onClick={() => cancelOrder(o.id)} className="px-3 py-1 bg-slate-100 text-slate-600 hover:bg-slate-200 border rounded text-xs font-medium">Cancel</button>
                        )}
                        <button onClick={() => deleteItem('order', o.id)} className="p-1 px-2 text-red-500 hover:bg-red-50 border border-transparent hover:border-red-200 rounded text-xs">Delete</button>
                      </td>
                    </tr>
                  ))}
                  {orders.length === 0 && <tr><td colSpan="6" className="p-8 text-center text-slate-400">No orders available.</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        );
      case 'payments':
        return (
          <div>
            <h3 className="text-xl font-semibold mb-6">Payment Activity</h3>
            <div className="bg-white rounded-xl border overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 border-b">
                  <tr>
                    <th className="p-4 font-medium">Payment ID</th>
                    <th className="p-4 font-medium">Order ID</th>
                    <th className="p-4 font-medium">Amount</th>
                    <th className="p-4 font-medium">Method</th>
                    <th className="p-4 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {payments.map(p => (
                    <tr key={p.id} className="hover:bg-slate-50">
                      <td className="p-4 text-slate-500">#{p.id}</td>
                      <td className="p-4">#{p.orderId}</td>
                      <td className="p-4">LKR {p.amount}</td>
                      <td className="p-4">{p.method}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${p.status === 'PAID' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                          {p.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {payments.length === 0 && <tr><td colSpan="5" className="p-8 text-center text-slate-400">No payments available.</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        );
      default: return null;
    }
  };

  return (
    <div className="container mx-auto px-6 py-10 max-w-6xl">
      <h2 className="text-3xl font-serif mb-8 text-slate-900 border-b pb-4">Admin Command Center</h2>

      <div className="flex flex-col md:flex-row gap-8">

        {/* Sidebar Nav */}
        <div className="w-full md:w-64 shrink-0">
          <ul className="space-y-2">
            <li>
              <button
                onClick={() => setActiveTab('products')}
                className={`w-full text-left flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition ${activeTab === 'products' ? 'bg-primary/10 text-primary' : 'text-slate-600 hover:bg-slate-50'}`}
              >
                <Package size={18} /> Manage Products
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab('users')}
                className={`w-full text-left flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition ${activeTab === 'users' ? 'bg-primary/10 text-primary' : 'text-slate-600 hover:bg-slate-50'}`}
              >
                <Users size={18} /> Manage Users
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab('orders')}
                className={`w-full text-left flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition ${activeTab === 'orders' ? 'bg-primary/10 text-primary' : 'text-slate-600 hover:bg-slate-50'}`}
              >
                <ShoppingBag size={18} /> Track Orders
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab('payments')}
                className={`w-full text-left flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition ${activeTab === 'payments' ? 'bg-primary/10 text-primary' : 'text-slate-600 hover:bg-slate-50'}`}
              >
                <CreditCard size={18} /> Payment Activity
              </button>
            </li>
          </ul>
        </div>

        {/* Console View */}
        <div className="flex-1 min-w-0 text-left">
          {renderContent()}
        </div>

      </div>

      {/* Add Product Modal */}
      {showProductModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-8 max-w-md w-full">
            <h3 className="text-2xl font-serif mb-6 text-slate-800">Add New Product</h3>
            <form onSubmit={handleCreateProduct} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Product Name</label>
                <input required type="text" className="w-full border rounded-lg px-3 py-2" value={newProduct.name} onChange={e => setNewProduct({ ...newProduct, name: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Price (LKR)</label>
                  <input required type="number" step="0.01" className="w-full border rounded-lg px-3 py-2" value={newProduct.price} onChange={e => setNewProduct({ ...newProduct, price: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Quantity/Stock</label>
                  <input required type="number" className="w-full border rounded-lg px-3 py-2" value={newProduct.quantity} onChange={e => setNewProduct({ ...newProduct, quantity: e.target.value })} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea required className="w-full border rounded-lg px-3 py-2" rows="3" value={newProduct.description} onChange={e => setNewProduct({ ...newProduct, description: e.target.value })}></textarea>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setShowProductModal(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark">Save Product</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {showEditProductModal && editProductData && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-8 max-w-md w-full text-left">
            <h3 className="text-2xl font-serif mb-6 text-slate-800">Edit Product</h3>
            <form onSubmit={handleUpdateProduct} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Product Name</label>
                <input required type="text" className="w-full border rounded-lg px-3 py-2" value={editProductData.name} onChange={e => setEditProductData({ ...editProductData, name: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Price</label>
                  <input required type="number" step="0.01" className="w-full border rounded-lg px-3 py-2" value={editProductData.price} onChange={e => setEditProductData({ ...editProductData, price: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Quantity/Stock</label>
                  <input required type="number" className="w-full border rounded-lg px-3 py-2" value={editProductData.quantity} onChange={e => setEditProductData({ ...editProductData, quantity: e.target.value })} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea required className="w-full border rounded-lg px-3 py-2" rows="3" value={editProductData.description} onChange={e => setEditProductData({ ...editProductData, description: e.target.value })}></textarea>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setShowEditProductModal(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark">Update Product</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
