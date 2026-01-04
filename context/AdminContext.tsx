'use client'
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AdminStats } from '@/types/admin';
import { Module } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { signIn, useSession } from "next-auth/react"
import { toast } from '@/hooks/use-toast';
import { newModule } from '@/lib/types';

interface AdminContextType {
  isAuthenticated: boolean;
  users: User[];
  modules: Module[];
  stats: AdminStats;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  addUser: (user: Omit<User, 'id'>) => void;
  updateUser: (id: string, user: Partial<User>) => void;
  deleteUser: (id: string) => void;
  addModule: (module: newModule) => Promise<{ savedModule?: any, status: string } | undefined>;
  updateModule: (
    id: string,
    module: Partial<Module>
  ) => Promise<{ updatedModule?: Module; status: string } | undefined>;
  deleteModule: (id: string) => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

// Mock data
// const mockUsers: User[] = [
//   {
//     id: '1',
//     name: 'Sarah Johnson',
//     email: 'sarah@example.com',
//     joinDate: '2024-01-15',
//     progress: 75,
//     modulesCompleted: 3,
//     totalModules: 4,
//     lastActive: '2024-01-20',
//     status: 'active'
//   },
//   {
//     id: '2',
//     name: 'Michael Chen',
//     email: 'michael@example.com',
//     joinDate: '2024-01-10',
//     progress: 45,
//     modulesCompleted: 2,
//     totalModules: 4,
//     lastActive: '2024-01-19',
//     status: 'active'
//   },
//   {
//     id: '3',
//     name: 'Emily Davis',
//     email: 'emily@example.com',
//     joinDate: '2024-01-05',
//     progress: 90,
//     modulesCompleted: 4,
//     totalModules: 4,
//     lastActive: '2024-01-18',
//     status: 'inactive'
//   }
// ];

// const mockModules: Module[] = [
//   {
//     id: '1',
//     module: 'module-1',
//     completed: false,
//     unlocked: true,
//     icon: 'Users',
//     title: 'Why Focus on Cervical Cancer',
//     description: 'Learn the global, regional, and local impact of cervical cancer and why it matters.',
//     order: 1,
//     introVideo: 'https://cdn.example.com/module-1-intro.mp4',
//     sections: [
//       {
//         id: 'section-1-1',
//         title: 'Reasons to Focus on Cervical Cancer',
//         description: 'Why cervical cancer is a global health priority.',
//         order: 1,
//         learningCards: [
//           {
//             id: 'card-1',
//             title: 'Global Statistics',
//             content: 'Every year, around 266,000 women die from cervical cancer worldwide. Most of these deaths can be prevented.',
//             infographic: '/images/placeholder.svg'
//           },
//           {
//             id: 'card-2',
//             title: 'HPV and Disease Timeline',
//             content: 'Almost all cervical cancer is caused by long-lasting infection with HPV. The disease usually develops over 10–20 years.',
//             infographic: '/images/placeholder.svg'
//           }
//         ],
//         quizzes: []
//       }
//     ],
//     postTest: [
//       {
//         id: 'posttest-1',
//         question: 'What virus is the main cause of cervical cancer?',
//         options: ['HIV', 'HBV', 'HPV', 'EBV'],
//         correct: 'HPV'
//       }
//     ]
//   }
// ];

export function AdminProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [isLoading, setIsLoading] = useState(false)
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [checkedAuth, setCheckedAuth] = useState(false);
  const { data: session, status } = useSession()

  const stats: AdminStats = {
    totalUsers: users.length,
    activeUsers: users.filter(u => u.status === 'active').length,
    totalModules: modules.length > 0 ? modules.length : 0,
    avgProgress: users.reduce((acc, user) => acc + user.progress || 0 , 0) / users.length
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    
    const verifyAdmin = async () => {
      // if (status === 'loading') return;

      if (status === 'unauthenticated') {
        router.replace('/not-found');
        return;
      }

      try {
        const check = await fetch(`/api/user/check?email=${email}`);
        const user = await check.json();

        if (user?.admin) {
          setIsAdmin(true);
          setCheckedAuth(true);

        } else {
          toast({
            title: 'Login failed. Invalid username / password!',
            description: "Please check your credentials and try again.",
            variant: 'destructive',
          });
          router.replace('/learn');
        }
      } catch (err) {
        console.error(err);
        router.replace('/learn');
      } finally {
        setCheckedAuth(true);
      }
    };

    verifyAdmin();
    

    const res = await signIn("credentials", {
      redirect: false,
      email: email,
      password: password,
    });

    if (res?.error) {
      toast({
        title: 'Login failed. Invalid username / password!',
        description: "Please check your credentials and try again.",
        variant: 'destructive',
      });
      setIsLoading(false);
      console.log(res.error)
      // alert('Check your credentials and try again')
    } else {
      if (status === 'unauthenticated') {
        setIsLoading(false);
        router.push("/learn");
      }
      setIsAuthenticated(true);
      localStorage.setItem('adminAuth', 'true');
      toast({
        title: 'Login successful',
        description: 'Welcome to C3 Dashboard',
        variant: 'success',
        duration: 2000,
      });
      setIsLoading(true);
      router.push('/instructor/manage')
    }
    // Simple mock authentication
    // if (email === 'admin@example.com' && password === 'admin123') {
    //   setIsAuthenticated(true);
    //   localStorage.setItem('adminAuth', 'true');
    //   // router.push('/instructor/manage')
    //   return true;
    // }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('adminAuth');
    router.push('/instructor')
  };

  const addUser = (user: Omit<User, 'id'>) => {
    const newUser = { ...user, id: Date.now().toString() };
    setUsers(prev => [...prev, newUser]);
  };

  const updateUser = (id: string, updatedUser: Partial<User>) => {
    setUsers(prev => prev.map(user => user.id === id ? { ...user, ...updatedUser } : user));
  };

  const deleteUser = (id: string) => {
    setUsers(prev => prev.filter(user => user.id !== id));
  };

  const addModule = async (module: newModule): Promise<{ savedModule?: any, status: string } | undefined> => {
  try {
    const res = await fetch("/api/admin/modules", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(module),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Failed to create module")
    }

    const savedModule = await res.json();
    setModules(prev => [...prev, savedModule]);

    return {savedModule, status: 'successful'};

  } catch (error) {
    console.error("Error adding module:", error);
    return { status: 'error' };
  }
};


  const updateModule = async (
    id: string,
    updatedData: Partial<Module>
  ): Promise<{ updatedModule?: Module; status: string } | undefined> => {
    try {
      const res = await fetch(`/api/admin/modules/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });

      if (!res.ok) throw new Error("Failed to update module");

      const updatedModule: Module = await res.json();

      // Update local state
      setModules((prev) =>
        prev.map((module) => (module.id === id ? updatedModule : module))
      );

      return { updatedModule, status: "success" };
    } catch (error) {
      console.error("Error updating module:", error);
      return { status: "error" };
    }
  };



  const deleteModule = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/modules`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (!res.ok) {
        throw new Error("Failed to delete module");
      }

      setModules(prev => prev.filter(module => module.id !== id));
    } catch (error) {
      console.error("Delete error:", error);
    }
  };


  useEffect(() => {
    const authStatus = localStorage.getItem('adminAuth');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    } else {
      router.push('/instructor')
    }
  }, []);

  useEffect(() => {
    const fetchUsers = async() => {
      try {
        const res = await fetch('/api/admin/users')
        const users = await res.json()
        setUsers(users)
      } catch (error) {
        console.error(error)
      }
    }
    fetchUsers();

    const fetchModules = async() => {
      try {
        const res = await fetch('/api/admin/modules')
        const modules = await res.json()
        setModules(modules)
      } catch (error) {
        console.error(error)
      }
    }

    fetchModules();

  },[])

  return (
    <AdminContext.Provider value={{
      isAuthenticated,
      users,
      modules,
      stats,
      login,
      logout,
      addUser,
      updateUser,
      deleteUser,
      addModule,
      updateModule,
      deleteModule
    }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}
