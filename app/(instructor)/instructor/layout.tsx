import '@/app/globals.css'
import { AdminProvider } from "@/context/AdminContext";
import SessionWrapper from "@/providers/SessionWrapper"

export default async function RootLayout({ children,}: Readonly<{children: React.ReactNode;}>) {

  return (
    <SessionWrapper>
      <AdminProvider>  
        <main >
          {/* <DashboardNavbar userProfile={userProfile}/> */}
          {children}
        </main>  
      </AdminProvider>
    </SessionWrapper>
  );
}
