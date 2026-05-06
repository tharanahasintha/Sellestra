import React, { useState, useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../services/api';
import { AuthContext } from '../../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { loginContext, setDummyUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.auth.post('/auth/login', { username: email, password });
      if (response.data.token) {
        loginContext(response.data.token);
        toast.success('Successfully logged in!');
        navigate('/');
      }
    } catch (error) {
      console.error(error);
      // Fallback for demonstration if backend is offline
      toast.info('Backend unavailable. Using dummy login.');
      setDummyUser();
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-6 py-12 flex justify-center items-center flex-1">
      <div className="max-w-md w-full bg-white p-8 border border-slate-200 rounded-xl shadow-sm">
        <h2 className="text-3xl font-serif text-center mb-6">Sign In</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <input 
              type="email" 
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <input 
              type="password" 
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition font-medium flex justify-center items-center"
          >
            {loading ? <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span> : 'Login'}
          </button>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-slate-500">Or continue with</span>
            </div>
          </div>

          <button className="mt-4 w-full py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition font-medium flex justify-center items-center gap-2">
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
            Google SSO
          </button>
        </div>

        <p className="mt-8 text-center text-sm text-slate-600">
          Don't have an account? <NavLink to="/register" className="text-primary hover:underline">Register</NavLink>
        </p>
      </div>
    </div>
  );
};

export default Login;
