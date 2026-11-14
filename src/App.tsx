/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { TopBar } from './components/shared/TopBar';
import { BottomNav } from './components/shared/BottomNav';
import { ToastContainer } from './components/shared/Toast';
import { OfflineIndicator } from './components/shared/OfflineIndicator';

import { LoginScreen } from './screens/LoginScreen';
import { DashboardScreen } from './screens/DashboardScreen';
import { ClosetScreen } from './screens/ClosetScreen';
import { AddGarmentScreen } from './screens/AddGarmentScreen';
import { GarmentDetailScreen } from './screens/GarmentDetailScreen';
import { StatsScreen } from './screens/StatsScreen';
import { PassItOnScreen } from './screens/PassItOnScreen';
import { StyleguideScreen } from './screens/StyleguideScreen';

function MainLayout() {
  const { user } = useApp();
  const [currentRoute, setCurrentRoute] = useState<string>('dashboard');
  const [selectedGarmentId, setSelectedGarmentId] = useState<string | undefined>(undefined);
  const [isLoggedOut, setIsLoggedOut] = useState<boolean>(false);

  // If user signed out, show login
  if (isLoggedOut) {
    return (
      <LoginScreen
        onSuccess={() => {
          setIsLoggedOut(false);
          setCurrentRoute('dashboard');
        }}
      />
    );
  }

  const navigateTo = (route: string, garmentId?: string) => {
    if (garmentId) {
      setSelectedGarmentId(garmentId);
    }
    setCurrentRoute(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Determine top bar title
  const getPageTitle = () => {
    switch (currentRoute) {
      case 'dashboard':
        return 'Wear More';
      case 'wardrobe':
        return 'My Closet';
      case 'add':
        return 'Add Garment';
      case 'detail':
        return 'Piece Details';
      case 'stats':
        return 'Wardrobe Stats';
      case 'pass-it-on':
        return 'Pass It On';
      case 'styleguide':
        return 'Styleguide';
      default:
        return 'Wear More';
    }
  };

  return (
    <div className="min-h-screen bg-bg text-ink flex flex-col antialiased">
      <OfflineIndicator />

      {/* Desktop Left Rail Navigation (1024px and up) */}
      <BottomNav
        activeRoute={currentRoute}
        onNavigate={(route) => navigateTo(route)}
      />

      {/* Main Content Area: Offset by 64 (16rem) on desktop */}
      <div className="flex-1 flex flex-col lg:pl-64">
        {/* Top App Bar */}
        <TopBar
          title={getPageTitle()}
          onNavigate={(route) => navigateTo(route)}
          onSignOut={() => setIsLoggedOut(true)}
        />

        {/* Content Container (Center column max 480px on phone/tablet, expanding up to 960px on desktop) */}
        <main className="flex-1 w-full max-w-md lg:max-w-4xl mx-auto px-4 py-5">
          {currentRoute === 'dashboard' && (
            <DashboardScreen onNavigate={navigateTo} />
          )}

          {currentRoute === 'wardrobe' && (
            <ClosetScreen onNavigate={navigateTo} />
          )}

          {currentRoute === 'add' && (
            <AddGarmentScreen
              onBack={() => navigateTo('wardrobe')}
              onSaved={(newId) => navigateTo('detail', newId)}
            />
          )}

          {currentRoute === 'detail' && selectedGarmentId && (
            <GarmentDetailScreen
              garmentId={selectedGarmentId}
              onBack={() => navigateTo('wardrobe')}
              onNavigate={navigateTo}
            />
          )}

          {currentRoute === 'stats' && (
            <StatsScreen onNavigate={navigateTo} />
          )}

          {currentRoute === 'pass-it-on' && (
            <PassItOnScreen
              initialGarmentId={selectedGarmentId}
              onBack={() => navigateTo('wardrobe')}
              onNavigateToCloset={() => navigateTo('wardrobe')}
            />
          )}

          {currentRoute === 'styleguide' && (
            <StyleguideScreen onBack={() => navigateTo('dashboard')} />
          )}
        </main>
      </div>

      {/* Toast Notification Container */}
      <ToastContainer />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
