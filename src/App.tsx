import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LandingPage } from './components/LandingPage';
import { CandidateDashboard } from './components/CandidateDashboard';
import { EmployerDashboard } from './components/EmployerDashboard';
import { PremiumFeatures } from './components/PremiumFeatures';
import { BillboardAds } from './components/BillboardAds';
import { JobDetailPage } from './components/JobDetailPage';
import { BackendDemo } from './components/BackendDemo';
import { AdminPanel } from './components/AdminPanel';
import { PricingPage } from './components/PricingPage';
import { ResetPasswordModal } from './components/ResetPasswordModal';
import { ResetPasswordPage } from './components/ResetPasswordPage';
import { LicensingPage } from './components/LicensingPage';
import { DigitalDocumentationPage } from './components/DigitalDocumentationPage';
import { InsurancePage } from './components/InsurancePage';
import { Button } from './components/ui/button';
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner@2.0.3';
import { ErrorBoundary } from './components/ErrorBoundary';
import { DebugPanel } from './components/DebugPanel';

function AppContent() {
  const { user, isAuthenticated, loading, isAdmin } = useAuth();
  const [currentPage, setCurrentPage] = useState('landing');
  const [resetToken, setResetToken] = useState<string | null>(null);
  const [showResetModal, setShowResetModal] = useState(false);
  const [showResetPage, setShowResetPage] = useState(false);

  // Check for reset token in URL on mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('reset-token');
    
    if (token) {
      console.log('✅ Reset token detected:', token);
      setResetToken(token);
      setShowResetPage(true);
      
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
      toast.success('🔐 Loading password reset...');
    }
  }, []);

  // Auto-navigate to dashboard when user logs in
  useEffect(() => {
    if (isAuthenticated && user) {
      if (currentPage === 'landing') {
        // Admin gets sent to admin panel
        if (isAdmin) {
          setCurrentPage('backend-demo');
        } else if (user.role === 'candidate') {
          setCurrentPage('candidate-dashboard');
        } else if (user.role === 'employer') {
          setCurrentPage('employer-dashboard');
        }
      }
    }
  }, [isAuthenticated, user, isAdmin]);

  // Role-based page access check
  const canAccessPage = (page: string): boolean => {
    // Admin can access everything
    if (isAdmin) return true;
    
    // Public pages
    if (['landing', 'pricing', 'licensing', 'digital-docs', 'insurance'].includes(page)) {
      return true;
    }
    
    // Premium is accessible to all authenticated users
    if (page === 'premium') {
      return isAuthenticated;
    }
    
    // Backend demo is admin only
    if (page === 'backend-demo') return isAdmin;
    
    // Candidate dashboard is for candidates only
    if (page === 'candidate-dashboard') {
      return isAuthenticated && user?.role === 'candidate';
    }
    
    // Employer dashboard is for employers only
    if (page === 'employer-dashboard') {
      return isAuthenticated && user?.role === 'employer';
    }
    
    return false;
  };

  // Redirect if user tries to access unauthorized page
  useEffect(() => {
    if (!loading && !canAccessPage(currentPage)) {
      setCurrentPage('landing');
    }
  }, [currentPage, isAuthenticated, user, loading]);

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'landing':
        return <LandingPage onNavigate={setCurrentPage} onOpenResetModal={(token: string) => {
          setResetToken(token);
          setShowResetModal(true);
        }} />;
      case 'candidate-dashboard':
        return <CandidateDashboard onNavigate={setCurrentPage} />;
      case 'employer-dashboard':
        return <EmployerDashboard onNavigate={setCurrentPage} />;
      case 'premium':
        return <PremiumFeatures onNavigate={setCurrentPage} />;
      case 'billboard':
        return <BillboardAds onNavigate={setCurrentPage} />;
      case 'pricing':
        return <PricingPage onNavigate={setCurrentPage} />;
      case 'licensing':
        return <LicensingPage onNavigate={setCurrentPage} />;
      case 'digital-docs':
        return <DigitalDocumentationPage onNavigate={setCurrentPage} />;
      case 'insurance':
        return <InsurancePage onNavigate={setCurrentPage} />;
      case 'backend-demo':
        return <AdminPanel 
          onNavigate={setCurrentPage}
          onOpenResetModal={(token: string) => {
            console.log('🔑 App.tsx received reset token:', token);
            setResetToken(token);
            setShowResetModal(true);
          }}
        />;
      default:
        return <LandingPage onNavigate={setCurrentPage} onOpenResetModal={(token: string) => {
          setResetToken(token);
          setShowResetModal(true);
        }} />;
    }
  };

  // If reset token detected in URL, show full-page reset form IMMEDIATELY
  // This check MUST come BEFORE the loading check!
  if (showResetPage && resetToken) {
    return (
      <div className="min-h-screen bg-white">
        <Toaster />
        <ResetPasswordPage
          token={resetToken}
          onSuccess={() => {
            setShowResetPage(false);
            setResetToken(null);
            setCurrentPage('landing');
            toast.success('Sada se možete prijaviti sa novom lozinkom!');
          }}
        />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Učitavanje...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Toaster />
      <DebugPanel />
      {renderCurrentPage()}
      
      {resetToken && showResetModal && (
        <ResetPasswordModal
          open={showResetModal}
          onClose={() => {
            setShowResetModal(false);
            setResetToken(null);
          }}
          resetToken={resetToken}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ErrorBoundary>
  );
}