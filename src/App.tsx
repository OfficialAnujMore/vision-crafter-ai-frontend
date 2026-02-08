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
import { Toaster } from 'sonner';
import './styles/Toast.css'
import Editor from './pages/Editor';
import { authService } from './services/api/authService';

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
      <GlobalLoader />
      <Toaster
        position="top-right"
        expand={false}
        richColors
        closeButton
        toastOptions={{
          style: {
            background: 'white',
            border: '1px solid #e5e7eb',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            padding: '16px',
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
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </MainLayout>
      </BrowserRouter>
    </LoaderProvider>
  );
}

export default App
