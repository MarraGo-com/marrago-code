import GlobalNavigation from '@/components/layout/header/GlobalNavigation';
import Footer from '@/themes/adventure/ui/Footer';
import React from 'react';
// import MobileBottomNav from '@/components/layout/MobileBottomNav'; // If you use it

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <GlobalNavigation />
      
      <main style={{ minHeight: '80vh' }}>
         {children}
      </main>
      
      <Footer />
      {/* <MobileBottomNav /> */}
    </>
  );
}