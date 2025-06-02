'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Login from './Login';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

interface User {
  username: string;
  role: string;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children, requireAdmin = false }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showLogin, setShowLogin] = useState(false);
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
    setShowLogin(false);
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  // If admin required and no user logged in
  if (requireAdmin && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Access Restricted</h2>
          <p className="text-gray-600 mb-6">
            This page is for administrators only. Please log in to access the content.
          </p>
          <button
            onClick={() => setShowLogin(true)}
            className="bg-[#ff7a59] text-white px-6 py-3 rounded-md hover:bg-[#e86a4d] transition-colors"
          >
            Login as Admin
          </button>
          <div className="mt-4">
            <button
              onClick={() => router.push('/')}
              className="text-gray-500 hover:text-gray-700 underline"
            >
              Back to Home
            </button>
          </div>
        </div>
        
        <Login
          isOpen={showLogin}
          onClose={() => setShowLogin(false)}
          onLoginSuccess={handleLoginSuccess}
        />
      </div>
    );
  }

  // If admin required and user logged in but not admin
  if (requireAdmin && user && user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
          <h2 className="text-2xl font-bold mb-4 text-red-600">No Permission</h2>
          <p className="text-gray-600 mb-6">
            Hello {user.username}, you don't have admin permission to access this page.
          </p>
          <button
            onClick={() => router.push('/')}
            className="bg-gray-500 text-white px-6 py-3 rounded-md hover:bg-gray-600 transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  // If everything is okay - show content
  return <>{children}</>;
};

export default AuthGuard;