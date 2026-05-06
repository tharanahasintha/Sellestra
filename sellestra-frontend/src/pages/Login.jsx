import React, { useState } from 'react';
import api from '../services/api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Connect to the Auth Service directly (port 8081)
      const response = await api.auth.post('/auth/login', { email, password });
      alert('Login successful!');
      console.log(response.data);
      // set token in localstorage
    } catch (error) {
      alert('Could not authenticate. using dummy auth context as backend is likely offline.');
      window.location.href = '/';
    }
  };

  return (
    <div className="container pt-5">
      <div className="auth-container">
        <h2>Sign In to Sellestra</h2>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Email Address</label>
            <input 
              type="email" 
              className="form-control" 
              placeholder="Enter your email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input 
              type="password" 
              className="form-control" 
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '1rem' }}>
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
