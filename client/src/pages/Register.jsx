import React from 'react';
import { User, Mail, Lock, ArrowRight } from 'lucide-react';

export default function Register() {
  return (
    <div className="max-w-md mx-auto my-12 p-6 bg-white rounded-xl shadow-xs border border-slate-200">
      <div className="text-center space-y-2 mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Create an Account</h1>
        <p className="text-xs text-slate-500">Join the AccessMap community in Ahmedabad.</p>
      </div>

      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
          <div className="relative">
            <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Full Name"
              className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-hidden focus:ring-2 focus:ring-teal-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="email"
              placeholder="user@example.com"
              className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-hidden focus:ring-2 focus:ring-teal-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="password"
              placeholder="••••••••"
              className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-hidden focus:ring-2 focus:ring-teal-500"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-2.5 px-4 bg-teal-600 hover:bg-teal-700 text-white font-medium text-sm rounded-md transition shadow-xs flex items-center justify-center space-x-2"
        >
          <span>Register</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
