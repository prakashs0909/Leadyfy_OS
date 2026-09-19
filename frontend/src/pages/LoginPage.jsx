import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Zap, Lock, Mail, ShieldAlert, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('owner@leadyfy.com');
  const [password, setPassword] = useState('Password123!');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(email, password);
      if (user.role === 'CLIENT') {
        navigate('/client-portal');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoFill = (demoEmail) => {
    setEmail(demoEmail);
    setPassword('Password123!');
  };

  return (
    <div className="min-h-screen bg-[#09090B] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Subtle Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center z-10">
        <div className="mx-auto w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-xl shadow-amber-500/20 mb-4">
          <Zap className="w-8 h-8 text-black fill-black" />
        </div>
        <h2 className="text-3xl font-extrabold tracking-tight text-zinc-100">LEADYFY OS</h2>
        <p className="mt-1 text-xs uppercase tracking-widest text-amber-500 font-bold">
          Agency Management & Operations
        </p>
        <p className="mt-2 text-xs text-zinc-400 max-w-sm mx-auto">
          Manage clients, production, creators, content and operations in one place.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md z-10">
        <div className="bg-[#111111] py-8 px-6 shadow-2xl border border-zinc-800 rounded-2xl sm:px-10">
          {error && (
            <div className="mb-4 p-3 bg-rose-950/50 border border-rose-800/60 rounded-xl text-rose-300 text-xs flex items-center space-x-2">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-500 transition"
                  placeholder="name@leadyfy.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-500 transition"
                  placeholder="••••••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center space-x-2 py-3 px-4 rounded-xl shadow-lg bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold text-xs uppercase tracking-wider hover:from-amber-400 hover:to-amber-500 transition duration-200 disabled:opacity-50"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In to LEADYFY OS'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Preset Accounts */}
          <div className="mt-8 pt-6 border-t border-zinc-800">
            <p className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider text-center mb-3">
              One-Click Demo Account Credentials
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleDemoFill('owner@leadyfy.com')}
                className="p-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-lg text-left transition text-xs"
              >
                <div className="font-bold text-amber-400 text-[11px]">Owner</div>
                <div className="text-[10px] text-zinc-400 font-mono">owner@leadyfy.com</div>
              </button>

              <button
                onClick={() => handleDemoFill('admin@leadyfy.com')}
                className="p-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-lg text-left transition text-xs"
              >
                <div className="font-bold text-purple-400 text-[11px]">Admin</div>
                <div className="text-[10px] text-zinc-400 font-mono">admin@leadyfy.com</div>
              </button>

              <button
                onClick={() => handleDemoFill('employee@leadyfy.com')}
                className="p-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-lg text-left transition text-xs"
              >
                <div className="font-bold text-blue-400 text-[11px]">Employee</div>
                <div className="text-[10px] text-zinc-400 font-mono">employee@leadyfy.com</div>
              </button>

              <button
                onClick={() => handleDemoFill('client@leadyfy.com')}
                className="p-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-lg text-left transition text-xs"
              >
                <div className="font-bold text-emerald-400 text-[11px]">Client Portal</div>
                <div className="text-[10px] text-zinc-400 font-mono">client@leadyfy.com</div>
              </button>
            </div>
            <p className="text-[10px] text-zinc-500 text-center mt-3 font-mono">
              Password for all demo accounts: Password123!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
