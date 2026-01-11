'use client'
import React, { useState } from 'react';
import { useAdmin } from '@/context/AdminContext';
import { AdminLogin } from '@/components/AdminLogin';
import { AdminDashboard } from '@/components/AdminDashboard';
import { UsersManagement } from '@/components/UsersManagement';
import { UserDetails } from '@/components/UserDetails';
import { useRouter } from 'next/navigation';

type AdminView = 'dashboard' | 'users' | 'userDetails' | 'modules';

export default function AdminPage() {
  // const router = useRouter()
  const { isAuthenticated } = useAdmin();
  // const [currentView, setCurrentView] = useState<AdminView>('dashboard');
  // const [selectedUserId, setSelectedUserId] = useState<string>('');

  if (!isAuthenticated) {
    return <AdminLogin />;
  }

}