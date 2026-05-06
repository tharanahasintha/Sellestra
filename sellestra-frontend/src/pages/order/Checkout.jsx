import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ShieldCheck, Truck, Receipt } from 'lucide-react';
import api from '../../services/api';

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state || {};
  const product = state.product || null;
  const quantity = state.quantity || 1;
  const orderId = state.orderId || null;

  // Single item cart view
  const cartItems = product ? [{ ...product, quantity }] : [];
  const [method, setMethod] = useState('payhere'); // payhere or cod

  // Calculations
  const productTotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const transportCost = 300; // 300 LKR
  const serviceCharge = productTotal * 0.10; // 10%
  const finalTotal = productTotal + transportCost + serviceCharge;

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!orderId) {
      toast.error("Invalid Order Session! Please choose a product again.");
      return;
    }

    try {
      if (method === 'cod') {
        // Process COD Payment
        await api.payment.post(`/payments/process?orderId=${orderId}&method=COD`);
        toast.success("Order Placed using Cash on Delivery!");
        navigate('/profile');
      } else {
        // Initiate PayHere
        const payhereRes = await api.payment.post(`/payments/payhere/${orderId}`);
        const paymentData = payhereRes.data;

        if (window.payhere) {
          window.payhere.onCompleted = async function onCompleted(completedOrderId) {
            toast.success("Payment successful!");
            navigate('/profile');
          };
          window.payhere.onDismissed = function onDismissed() {
            toast.error("Payment dismissed.");
          };
          window.payhere.onError = function onError(error) {
            toast.error("Payment error: " + error);
          };
          window.payhere.startPayment(paymentData);
        } else {
          toast.error("PayHere SDK not loaded.");
        }
      }
    } catch (err) {
      toast.error("Failed to place order or process payment.");
    }
  };

  return (
    <div className="container mx-auto px-6 py-12 max-w-6xl text-left border-y-stone-800">
      <h2 className="text-3xl font-serif mb-8 text-slate-800 text-left">Checkout</h2>
      
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Shipping Form */}
        <div className="w-full lg:w-2/3">
          <div className="bg-white border text-left border-slate-200 rounded-xl p-8 mb-8 shadow-sm">
            <h3 className="text-xl font-medium mb-6 border-b pb-4">Shipping Details</h3>
            <form className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-600 mb-1">First Name</label>
                  <input type="text" className="w-full border rounded-lg px-4 py-2" required />
                </div>
                <div>
                  <label className="block text-sm text-slate-600 mb-1">Last Name</label>
                  <input type="text" className="w-full border rounded-lg px-4 py-2" required />
                </div>
              </div>
              <div>
                <label className="block text-sm text-slate-600 mb-1">Address</label>
                <input type="text" className="w-full border rounded-lg px-4 py-2" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-600 mb-1">City</label>
                  <input type="text" className="w-full border rounded-lg px-4 py-2" required />
                </div>
                <div>
                  <label className="block text-sm text-slate-600 mb-1">Postal Code</label>
                  <input type="text" className="w-full border rounded-lg px-4 py-2" required />
                </div>
              </div>
            </form>
          </div>

          <div className="bg-white border text-left border-slate-200 rounded-xl p-8 shadow-sm">
            <h3 className="text-xl font-medium mb-6 border-b pb-4">Payment Method</h3>
            <div className="space-y-4">
              <label className={`flex items-center gap-4 p-4 border rounded-xl cursor-pointer transition ${method === 'payhere' ? 'border-primary bg-primary/5' : 'border-slate-200'}`}>
                <input type="radio" name="payment" checked={method === 'payhere'} onChange={() => setMethod('payhere')} className="w-5 h-5 text-primary focus:ring-primary" />
                <div className="flex items-center gap-3">
                   <ShieldCheck className="text-primary" />
                   <div>
                     <div className="font-semibold text-slate-800">Credit / Debit Card (PayHere)</div>
                     <div className="text-sm text-slate-500">Secure online payment gateway</div>
                   </div>
                </div>
              </label>

              <label className={`flex items-center gap-4 p-4 border rounded-xl cursor-pointer transition ${method === 'cod' ? 'border-primary bg-primary/5' : 'border-slate-200'}`}>
                <input type="radio" name="payment" checked={method === 'cod'} onChange={() => setMethod('cod')} className="w-5 h-5 text-primary focus:ring-primary" />
                <div className="flex items-center gap-3">
                   <Truck className="text-primary" />
                   <div>
                     <div className="font-semibold text-slate-800">Cash on Delivery (COD)</div>
                     <div className="text-sm text-slate-500">Pay when you receive the order</div>
                   </div>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="w-full lg:w-1/3">
          <div className="bg-slate-50 border text-left border-slate-200 rounded-xl p-6 sticky top-28 shadow-sm">
            <h3 className="text-lg font-semibold mb-6 flex items-center gap-2 border-b pb-4">
              <Receipt size={20} /> Order Summary
            </h3>
            
            <div className="space-y-4 mb-6 max-h-64 overflow-y-auto pr-2 custom-scroll">
              {cartItems.map((item) => (
                <div key={item.id} className="flex gap-4 items-center">
                  <div className="w-16 h-16 rounded-md bg-white border overflow-hidden shrink-0">
                    <img src={item.image} alt="item" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-sm text-slate-800 leading-tight mb-1">{item.name}</div>
                    <div className="text-xs text-slate-500">Qty: {item.quantity}</div>
                  </div>
                  <div className="font-semibold text-sm">LKR {(item.price * item.quantity).toFixed(2)}</div>
                </div>
              ))}
            </div>

            <div className="space-y-3 text-sm text-slate-600 border-t pt-4">
              <div className="flex justify-between">
                <span>Product Total</span>
                <span className="font-medium text-slate-800">LKR {productTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Transport Cost</span>
                <span className="font-medium text-slate-800">LKR {transportCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Service Charge (10%)</span>
                <span className="font-medium text-slate-800">LKR {serviceCharge.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex justify-between items-center mt-6 pt-4 border-t border-slate-300">
              <span className="font-medium text-slate-800">Final Total</span>
              <span className="text-2xl font-serif text-primary font-bold">LKR {finalTotal.toFixed(2)}</span>
            </div>

            <button 
              onClick={handlePlaceOrder}
              className="w-full py-4 mt-8 bg-primary text-white text-lg rounded-xl hover:bg-primary-dark transition font-semibold shadow-lg shadow-primary/30"
            >
              {method === 'cod' ? 'Confirm Order' : 'Pay Now'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
