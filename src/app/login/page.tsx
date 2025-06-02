'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Login from '../../components/Login';
import Link from 'next/link';

interface User {
  username: string;
  role: string;
}

export default function LoginPage() {
  const [user, setUser] = useState<User | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

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
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSuccess = (userData: User) => {
    setUser(userData);
    setShowLoginModal(false);
    // Redirect to appropriate page based on role
    if (userData.role === 'admin') {
      router.push('/admin');
    } else {
      router.push('/');
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleGoToAdmin = () => {
    router.push('/admin');
  };

  const handleGoToIngredients = () => {
    router.push('/ingredients');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  // If user is logged in, show dashboard
  if (user) {
    return (
      <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Hello {user.username}!</h1>
            <p className="text-lg text-gray-600 mb-2">
              You are logged in as {user.role === 'admin' ? 'Admin' : 'User'}
            </p>
            <p className="text-center sm:text-left mb-8">
              Choose what you would like to do:
            </p>
          </div>

          <div className="flex flex-col gap-4 items-center sm:items-start">
            {user.role === 'admin' && (
              <>
                <button
                  onClick={handleGoToAdmin}
                  className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-[#ff7a59] text-white gap-2 hover:bg-[#e86a4d] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 min-w-[200px]"
                >
                  Admin Dashboard
                </button>
                
                <button
                  onClick={handleGoToIngredients}
                  className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-blue-500 text-white gap-2 hover:bg-blue-600 font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 min-w-[200px]"
                >
                  Manage Ingredients
                </button>
              </>
            )}
            
            <Link
              href="/"
              className="rounded-full border border-solid border-gray-300 transition-colors flex items-center justify-center bg-white text-gray-800 gap-2 hover:bg-gray-100 font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 min-w-[200px]"
            >
              Home Page
            </Link>
            
            <button
              onClick={handleLogout}
              className="rounded-full border border-solid border-red-300 transition-colors flex items-center justify-center bg-red-500 text-white gap-2 hover:bg-red-600 font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 min-w-[200px]"
            >
              Logout
            </button>
          </div>
        </main>
      </div>
    );
  }

  // If user is not logged in, show login page
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <h1 className="text-2xl font-bold">Welcome to SnapChef</h1>
        <p className="text-center sm:text-left">
          Log in to manage your ingredients and recipes.
        </p>

        <div className="flex flex-col gap-4 items-center sm:items-start">
          <button
            onClick={() => setShowLoginModal(true)}
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-[#ff7a59] text-white gap-2 hover:bg-[#e86a4d] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
          >
            Login / Register
          </button>
          
          <Link
            href="/"
            className="rounded-full border border-solid border-gray-300 transition-colors flex items-center justify-center bg-white text-gray-800 gap-2 hover:bg-gray-100 font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
          >
            Back to Home
          </Link>
        </div>
      </main>

      <Login
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
}