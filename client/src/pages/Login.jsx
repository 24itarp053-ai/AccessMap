import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Lock, ArrowRight, Info, MapPin } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLoginDemo = (e) => {
    e.preventDefault();
    alert("Frontend Auth Demo: Live backend server authentication will be triggered once your teammate's server is connected.");
  };

  return (
    <div className="max-w-md mx-auto my-12 px-4 space-y-6 bg-[#fcfaf6]">
      
      <div className="text-center space-y-2">
        <div className="w-12 h-12 bg-[#132e22] text-[#fcfaf6] rounded-xl flex items-center justify-center mx-auto shadow-xs">
          <MapPin className="w-6 h-6 text-amber-400" />
        </div>
        <h1 className="font-serif text-2xl font-bold text-slate-900">Sign In to AccessMap</h1>
        <p className="text-xs text-slate-600 font-light">
          Access your barrier submissions and community verification history.
        </p>
      </div>

      {/* Backend Status Notice */}
      <div className="bg-[#f4eedf] p-3.5 rounded-xl border border-[#d8caa8] flex items-start space-x-2.5 text-xs text-slate-800">
        <Info className="w-4 h-4 text-emerald-800 shrink-0 mt-0.5" />
        <div>
          <strong className="block text-slate-900 font-bold">API Authentication Notice:</strong>
          <span>This UI component is configured for JWT handling via `client/src/services/api.js`. Live login endpoint `/api/auth/login` will link automatically when the backend server is running.</span>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#e8e2d8] p-6 sm:p-8 shadow-md space-y-5">
        <form onSubmit={handleLoginDemo} className="space-y-4">
          
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@example.com"
                className="w-full pl-10 pr-3 py-2.5 text-sm border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-800 bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-3 py-2.5 text-sm border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-800 bg-white"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 bg-[#132e22] hover:bg-[#1b4332] text-white font-bold text-sm rounded-xl transition shadow-xs flex items-center justify-center space-x-2"
          >
            <span>Sign In</span>
            <ArrowRight className="w-4 h-4 text-amber-400" />
          </button>
        </form>

        <div className="pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
          Don't have an account yet?{' '}
          <Link to="/register" className="font-bold text-emerald-800 hover:underline">
            Register here
          </Link>
        </div>
      </div>

    </div>
  );
}
