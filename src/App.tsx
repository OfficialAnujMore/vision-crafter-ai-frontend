import { Route, BrowserRouter, Routes, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import './App.css'
import LandingPage from './pages/LandingPage';
import SignUp from './pages/SignUp';
import Dashboard from './pages/Dashboard';
import MainLayout from './layouts/MainLayout';
import { injectCSSVariables } from './utils/injectColors';
import { ROUTES } from './constants/routes';
import { LoaderProvider } from './components/LoaderContext';
import GlobalLoader from './components/Loader';
import { TokenProvider } from './context/tokenContext';
import { Toaster } from 'sonner';
import './styles/Toast.css'
import Editor from './pages/Editor';
import Profile from './pages/Profile';
import { authService } from './services/api/authService';
import FaintDotGrid from './components/FaintDotGrid';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = authService.isAuthenticated();

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.SIGNUP} replace />;
  }

  return <>{children}</>;
};

function App() {
  useEffect(() => {
    injectCSSVariables();
  }, []);

  return (
    <LoaderProvider>
      <TokenProvider>
      <FaintDotGrid/>
      <GlobalLoader />
      <Toaster
        position="bottom-right"
        expand={false}
        closeButton
        toastOptions={{
          style: {
            background: 'rgba(30, 30, 30, 0.85)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.45)',
            padding: '16px 20px',
          },
        }}
      />
      <BrowserRouter>
        <MainLayout>
          <Routes>
            <Route path={ROUTES.HOME} element={<LandingPage />} />
            <Route path={ROUTES.SIGNUP} element={<SignUp />} />
            <Route
              path={ROUTES.DASHBOARD}
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path={ROUTES.EDITOR}
              element={
                <ProtectedRoute>
                  <Editor />
                </ProtectedRoute>
              }
            />
            <Route
              path={ROUTES.PROFILE}
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </MainLayout>
      </BrowserRouter>
      </TokenProvider>
    </LoaderProvider>
  );
}

export default App
