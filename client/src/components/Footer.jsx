import React from 'react';
import { Heart, MapPin, Accessibility } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 mt-auto border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span className="p-1.5 bg-teal-600 text-white rounded-md">
              <Accessibility className="w-5 h-5" />
            </span>
            <span className="font-semibold text-white tracking-tight">AccessMap Ahmedabad</span>
            <span className="text-xs text-slate-400">| Smart & Inclusive Communities</span>
          </div>

          <p className="text-sm text-slate-400 flex items-center gap-1">
            Built with <Heart className="w-4 h-4 text-red-500 fill-red-500 inline" /> for social impact & urban inclusion.
          </p>

          <p className="text-xs text-slate-500">
            &copy; {new Date().getFullYear()} AccessMap Team. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
