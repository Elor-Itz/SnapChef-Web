'use client';

import React, { useState, useEffect } from 'react';
import AppLink from './AppLink';
import Image from 'next/image';
import Login from './Login';
import { UserIcon, ChevronDownIcon } from '@heroicons/react/24/solid';

interface User {
  username: string;
  role: string;
}

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [showAdminMenu, setShowAdminMenu] = useState(false);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await fetch('/api/auth/me', {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setUser({
          username: data.user.username,
          role: data.user.role
        });
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    }
  };

  const handleLoginSuccess = (userData: User) => {
    setUser(userData);
    setIsLoginOpen(false);
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });
      setUser(null);
      setShowAdminMenu(false);

      if (
        window.location.pathname.includes('/admin') ||
        window.location.pathname.includes('/ingredients')
      ) {
        window.location.href = '/';
      }
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const toggleAdminMenu = () => {
    setShowAdminMenu((prev) => !prev);
  };

  return (
    <>
      <nav className="navbar p-4">
        <div className="container mx-auto flex justify-between items-center">
          {/* Logo and Brand */}
          <AppLink href="/" className="flex items-center space-x-3 font-berlin">
            <Image
              src="/images/icon.png"
              alt="SnapChef Logo"
              width={48}
              height={48}
              priority
            />
            <span className="text-4xl font-bold">SnapChef</span>
          </AppLink>

          {/* Navigation Links */}
          <ul className="flex space-x-6 font-berlin items-center">
            <li>
              <AppLink href="/api" className="hover:text-[#ffb89d] transition-colors">
                API
              </AppLink>
            </li>
            <li>
              <AppLink href="/about" className="hover:text-[#ffb89d] transition-colors">
                About
              </AppLink>
            </li>

            {/* Admin Menu */}
            {user?.role === 'admin' && (
              <li className="relative">
                <button
                  onClick={toggleAdminMenu}
                  className="flex items-center gap-2 hover:text-[#ffb89d] transition-colors"
                >
                  Admin
                  <ChevronDownIcon className="h-4 w-4" />
                </button>
                {showAdminMenu && (
                  <div className="absolute top-full left-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-50">
                    <AppLink
                      href="/admin"
                      className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                    >
                      Admin Dashboard
                    </AppLink>
                    <AppLink
                      href="/ingredients"
                      className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                    >
                      Manage Ingredients
                    </AppLink>
                    <button
                      onClick={() => alert('Logs feature will be added soon')}
                      className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100 rounded-b-lg"
                    >
                      Logs
                    </button>
                  </div>
                )}
              </li>
            )}

            {/* User Status */}
            {user ? (
              <li>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-full text-sm transition-colors"
                >
                  Logout
                </button>
              </li>
            ) : (
              <li>
                <button
                  onClick={() => setIsLoginOpen(true)}
                  className="hover:text-[#ffb89d] transition-colors"
                >
                  Log In
                </button>
              </li>
            )}
          </ul>
        </div>
      </nav>

      {/* Login Modal */}
      <Login
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </>
  );
}