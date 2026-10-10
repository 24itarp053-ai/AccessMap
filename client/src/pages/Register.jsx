import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, ArrowRight, Info, MapPin, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    const cleanName = name.trim();
    const cleanEmail = email.trim();

    if (cleanName.length < 2 || cleanName.length > 100) {
      setErrorMsg('Full Name must be between 2 and 100 characters.');
      return;
    }

    if (!cleanEmail || cleanEmail.length > 255) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    if (password.length < 8 || password.length > 128) {
      setErrorMsg('Password must be between 8 and 128 characters.');
      return;
    }

    setLoading(true);
    const res = await register(cleanName, cleanEmail, password);
    setLoading(false);

    if (res.success) {
      navigate('/');
    } else {
      setErrorMsg(res.error || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="max-w-md mx-auto my-12 px-4 space-y-6 bg-[#fcfaf6]">

      <div className="text-center space-y-2">
        <div className="w-12 h-12 bg-[#132e22] text-[#fcfaf6] rounded-xl flex items-center justify-center mx-auto shadow-xs">
          <MapPin className="w-6 h-6 text-amber-400" />
        </div>
        <h1 className="font-serif text-2xl font-bold text-slate-900">Create an Account</h1>
        <p className="text-xs text-slate-600 font-light">
          Join AccessMap in mapping accessibility across Ahmedabad.
        </p>
      </div>

      <div className="bg-[#f4eedf] p-3.5 rounded-xl border border-[#d8caa8] flex items-start space-x-2.5 text-xs text-slate-800">
        <Info className="w-4 h-4 text-emerald-800 shrink-0 mt-0.5" />
        <div>
          <strong className="block text-slate-900 font-bold">API Registration Notice (`POST /api/auth/register`):</strong>
          <span>Connected to official registration endpoint. Name (2-100 chars), email, and password (8-128 chars) required. Backend assigns standard user role.</span>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#e8e2d8] p-6 sm:p-8 shadow-md space-y-5">

        {errorMsg && (
          <div className="p-3.5 bg-red-50 text-red-900 border border-red-200 rounded-xl text-xs flex items-start space-x-2">
            <AlertCircle className="w-4 h-4 text-red-700 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Full Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Aarav Sharma"
                className="w-full pl-10 pr-3 py-2.5 text-sm border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-800 bg-white"
              />
            </div>
            <span className="text-[11px] text-slate-400">2 – 100 characters</span>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Email Address <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
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
              Password <span className="text-red-500">*</span>
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
            <span className="text-[11px] text-slate-400">8 – 128 characters</span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-[#132e22] hover:bg-[#1b4332] text-white font-bold text-sm rounded-xl transition shadow-xs flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Creating Account...</span>
              </>
            ) : (
              <>
                <span>Register Account (`POST /api/auth/register`)</span>
                <ArrowRight className="w-4 h-4 text-amber-400" />
              </>
            )}
          </button>
        </form>

        <div className="pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-emerald-800 hover:underline">
            Sign in
          </Link>
        </div>
      </div>

    </div>
  );
}
