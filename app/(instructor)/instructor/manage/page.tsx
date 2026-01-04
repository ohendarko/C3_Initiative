'use client'
import React, { useState } from 'react';
import { useAdmin } from '@/context/AdminContext';
import { AdminLogin } from '@/components/AdminLogin';
import { AdminDashboard } from '@/components/AdminDashboard';
import { UsersManagement } from '@/components/UsersManagement';
import { UserDetails } from '@/components/UserDetails';

type AdminView = 'dashboard' | 'users' | 'userDetails' | 'modules';

export default function AdminPage() {
  const { isAuthenticated } = useAdmin();
  const [currentView, setCurrentView] = useState<AdminView>('dashboard');
  const [selectedUserId, setSelectedUserId] = useState<string>('');

  // if (!isAuthenticated) {
  //   return <AdminLogin />;
  // }

  const handleViewUsers = () => {
    setCurrentView('users');
  };

  const handleViewUser = (userId: string) => {
    setSelectedUserId(userId);
    setCurrentView('userDetails');
  };

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
    setSelectedUserId('');
  };

  const handleBackToUsers = () => {
    setCurrentView('users');
    setSelectedUserId('');
  };

  const handleViewModules = () => {
    // This could be expanded to show a modules management page
    console.log('View modules - feature can be expanded');
  };

  switch (currentView) {
    case 'users':
      return (
        <UsersManagement 
          onBack={handleBackToDashboard}
          onViewUser={handleViewUser}
        />
      );
    case 'userDetails':
      return (
        <UserDetails 
          userId={selectedUserId}
          onBack={handleBackToUsers}
        />
      );
    case 'modules':
      // Could add a ModulesManagement component here
      return (
        <AdminDashboard 
          onViewUsers={handleViewUsers}
          onViewModules={handleViewModules}
        />
      );
    default:
      return (
        <AdminDashboard 
          onViewUsers={handleViewUsers}
          onViewModules={handleViewModules}
        />
      );
  }
}