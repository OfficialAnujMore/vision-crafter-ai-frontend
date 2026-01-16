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

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const accessToken = localStorage.getItem('access_token');

  if (!accessToken) {
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
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </MainLayout>
      </BrowserRouter>
    </LoaderProvider>
  );
}

export default App
