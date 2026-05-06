import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { ShoppingCart, Heart, LogOut } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  return (
    <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-md border-b border-slate-200 z-50 h-20 flex items-center">
      <div className="container mx-auto px-6 flex justify-between items-center">
        
        {/* Logo */}
        <NavLink to="/" className="text-2xl tracking-[2px]">
          <span className="font-serif text-slate-800">SELL</span>
          <span className="font-serif text-primary">estra</span>
        </NavLink>

        {/* Navigation Actions */}
        <div className="flex items-center gap-4">
          
          <NavLink to="/" className="hidden md:block font-medium text-slate-600 hover:text-primary transition mr-2">
            Home
          </NavLink>

          <NavLink to="/products" className="hidden md:block font-medium text-slate-600 hover:text-primary transition mr-4">
            Shop All
          </NavLink>

          {/* Icons */}
          <NavLink to="/cart" className="relative flex items-center justify-center p-2 border border-slate-300 rounded-md text-slate-500 hover:border-primary hover:text-primary transition h-10 w-10">
            <ShoppingCart size={20} strokeWidth={1.5} />
            <span className="absolute -top-2 -right-2 bg-primary text-white text-[0.7rem] font-semibold w-5 h-5 rounded-full flex items-center justify-center">0</span>
          </NavLink>

          {/* Conditional Rendering based on Auth */}
          {user ? (
            <>
              {user.role === 'ADMIN' && (
                <NavLink to="/admin" className="bg-primary/10 text-primary text-xs font-bold px-3 py-1.5 rounded hover:bg-primary/20 transition flex items-center">
                  ADMIN DASHBOARD
                </NavLink>
              )}
              <NavLink to="/profile" className="font-medium text-slate-600 hover:text-primary transition mx-2">
                My Profile
              </NavLink>
              <button 
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-red-600 border border-red-200 rounded-md hover:bg-red-50 transition h-10"
              >
                <LogOut size={18} /> <span className="hidden sm:inline">Logout</span>
              </button>
            </>
          ) : (
            <NavLink to="/login" className="px-6 py-2 border border-slate-300 rounded-md font-medium text-slate-800 hover:border-primary hover:text-primary transition h-10 flex items-center ml-2">
              Sign In
            </NavLink>
          )}

        </div>
      </div>
    </nav>
  );
};

export default Navbar;
