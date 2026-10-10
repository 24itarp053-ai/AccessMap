import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MapPin, ShieldAlert, User as UserIcon, Menu, X, Info, FileText, CheckSquare, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Accessibility Map', path: '/map' },
    { name: 'Report a Barrier', path: '/report' },
    { name: 'My Reports', path: '/my-reports' },
    { name: 'Admin Portal', path: '/admin' },
    { name: 'About', path: '/about' },
  ];

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-50 bg-[#fcfaf6]/90 backdrop-blur-md border-b border-[#e8e2d8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">

          {/* Brand Logo */}
          <Link
            to="/"
            className="flex items-center space-x-3 group focus:outline-hidden focus-visible:ring-2 focus-visible:ring-emerald-800 rounded-lg p-1"
          >
            <div className="w-10 h-10 bg-[#132e22] text-[#fcfaf6] rounded-lg flex items-center justify-center shadow-xs group-hover:bg-[#1b4332] transition">
              <MapPin className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-[#121824] block leading-tight">
                Access<span className="text-emerald-800">Map</span>
              </span>
              <span className="text-[10px] uppercase font-semibold tracking-wider text-amber-800/80 block">
                Ahmedabad Civic Initiative
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navLinks.map((link) => {
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3.5 py-2 rounded-lg text-sm font-medium transition ${
                    active
                      ? 'bg-[#132e22] text-[#fcfaf6] shadow-xs font-semibold'
                      : 'text-slate-700 hover:text-emerald-900 hover:bg-[#f4eedf]'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Auth Controls */}
          <div className="hidden md:flex items-center space-x-3">
            {isAuthenticated && user ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 px-3 py-1.5 bg-[#f4eedf] rounded-lg border border-[#d8caa8] text-xs font-semibold text-slate-800">
                  <UserIcon className="w-4 h-4 text-emerald-800" />
                  <span className="max-w-[120px] truncate">{user.name || user.email}</span>
                  {user.isMock && (
                    <span className="text-[9px] font-bold px-1.5 py-0.5 bg-amber-200 text-amber-900 rounded uppercase">
                      Demo
                    </span>
                  )}
                </div>

                <button
                  onClick={logout}
                  className="px-3 py-2 text-xs font-bold text-red-800 hover:text-red-900 hover:bg-red-50 rounded-lg transition flex items-center gap-1 border border-red-200"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Log Out</span>
                </button>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-emerald-900 hover:bg-[#f4eedf] rounded-lg transition"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4.5 py-2 text-sm font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg shadow-xs transition border border-emerald-950"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
              className="p-2.5 rounded-lg text-slate-700 hover:text-slate-950 hover:bg-[#f4eedf] focus:outline-hidden focus-visible:ring-2 focus-visible:ring-emerald-800"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#e8e2d8] bg-[#fcfaf6] px-4 pt-3 pb-6 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-4 py-2.5 rounded-lg text-base font-medium ${
                isActive(link.path)
                  ? 'bg-[#132e22] text-[#fcfaf6] font-semibold'
                  : 'text-slate-800 hover:bg-[#f4eedf]'
              }`}
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-4 border-t border-[#e8e2d8] flex flex-col space-y-2">
            {isAuthenticated && user ? (
              <div className="space-y-2">
                <div className="flex items-center space-x-2 px-3 py-2 bg-[#f4eedf] rounded-lg border border-[#d8caa8] text-xs font-semibold text-slate-800">
                  <UserIcon className="w-4 h-4 text-emerald-800" />
                  <span>Logged in as <strong>{user.name || user.email}</strong></span>
                  {user.isMock && <span className="text-[9px] font-bold px-1.5 py-0.5 bg-amber-200 text-amber-900 rounded uppercase">Demo</span>}
                </div>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-center py-2.5 text-xs font-bold text-red-800 bg-red-50 border border-red-200 rounded-lg"
                >
                  Log Out
                </button>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 text-sm font-medium text-slate-800 bg-[#f4eedf] rounded-lg"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 text-sm font-semibold text-white bg-emerald-800 rounded-lg"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
