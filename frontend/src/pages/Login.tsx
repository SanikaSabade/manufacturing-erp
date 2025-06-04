import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login: React.FC = () => {
  const { login, user, loading, error } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, password);
  };

  useEffect(() => {
    if (user){ navigate('/dashboard');
    console.log("Success")}
  }, [user, navigate]);


  return (
    <div className="min-h-screen flex">
      <div className="w-1/2 bg-white flex flex-col justify-center items-start p-16">
        <h1 className="text-4xl font-light text-gray-700 mb-2">Hello,</h1>
        <h2 className="text-5xl font-bold text-indigo-700 mb-6">Welcome!</h2>
        <p className="text-gray-600 max-w-md mb-12">
          To the Manufacturing ERP
        </p>
        <img
          src="/erp.png" 
          alt="Illustration"
          className="w-3/4 rounded-2xl"
        />
      </div>

      <div className="w-1/2 bg-gradient-to-br from-[#1e1e2f] to-[#2e2e48] flex justify-center items-center">
        <form onSubmit={handleSubmit} className="bg-[#3f3f66] rounded-xl p-10 w-full max-w-md shadow-lg">
          <div className="flex justify-center mb-6">
            <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center text-2xl text-[#3f3f66]">
              👤
            </div>
          </div>
          <div className="text-white">
            <div className="mb-4">
              <label className="flex items-center space-x-2">
                <span>📧</span>
                <input
                  type="email"
                  className="w-full p-2 ml-2 rounded bg-transparent border-b border-white placeholder-white outline-none"
                  placeholder="Email ID"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </label>
            </div>
            <div className="mb-4">
              <label className="flex items-center space-x-2">
                <span>🔑</span>
                <input
                  type="password"
                  className="w-full p-2 ml-2 rounded bg-transparent border-b border-white placeholder-white outline-none"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </label>
            </div>
            <div className="flex justify-between text-sm mb-6">
             
              <button type="button" className="text-indigo-300 hover:underline ">
                Forgot Password?
              </button>
            </div>
            {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-500 to-blue-600 text-white py-2 rounded font-semibold hover:opacity-90 transition"
            >
              {loading ? 'Logging in...' : 'LOGIN'}
            </button>
            
            <div className="flex justify-center gap-6 text-white text-2xl mb-4">
              <i className="fab fa-google"></i>
              <i className="fab fa-instagram"></i>
              <i className="fab fa-twitter"></i>
            </div>
            <p className="text-center text-gray-300 text-sm">
              Not a User?{' '}
              <a href="/signup" className="text-orange-400 font-medium hover:underline">
                Create an Account
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
