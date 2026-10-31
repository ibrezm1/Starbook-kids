import React from 'react';
import { StarbookProvider, useStarbook } from './context/StarbookContext';
import Header from './components/common/Header';
import ToastContainer from './components/common/ToastContainer';
import KidView from './components/kid/KidView';
import ParentDashboard from './components/parent/ParentDashboard';
import ModalRoot from './components/modals/ModalRoot';

function AppContent() {
  const { currentView } = useStarbook();

  return (
    <div className="min-h-screen pb-16">
      <Header />
      <main className="max-w-5xl mx-auto px-4 py-6">
        {currentView === 'kid' ? <KidView /> : <ParentDashboard />}
      </main>
      <ModalRoot />
      <ToastContainer />
    </div>
  );
}

export default function App() {
  return (
    <StarbookProvider>
      <AppContent />
    </StarbookProvider>
  );
}

