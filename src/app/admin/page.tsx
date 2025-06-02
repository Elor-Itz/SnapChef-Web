'use client';

import React, { useState, useEffect } from 'react';
import AuthGuard from '../../components/AuthGuard';
import AdminDashboard from '../../components/AdminDashboard';

interface User {
  username: string;
  role: string;
}

const AdminPage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

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

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });
      setUser(null);
      window.location.href = '/';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <AuthGuard requireAdmin={true}>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          {user && (
            <AdminDashboard 
              user={user} 
              onLogout={handleLogout}
            />
          )}
        </div>
      </div>
    </AuthGuard>
  );
};

export default AdminPage;