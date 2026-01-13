import { Route, BrowserRouter, Routes, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import './App.css'
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import { injectCSSVariables } from './utils/injectColors';
import { ROUTES } from './constants/routes';

function App() {
  useEffect(() => {
    injectCSSVariables();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path={ROUTES.HOME} element={<LandingPage />} />
        <Route path={ROUTES.LOGIN} element={<Login />} />
        <Route path={ROUTES.SIGNUP} element={<Register />} />
        {/* <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        /> */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App
