import { useEffect } from 'react'
import './App.css'
import { HashRouter, Routes, Route } from 'react-router-dom'
import DashboardPage from './pages/DashboardPage';

function RedirectToStaticHome() {
       // If the user navigates to a URL like /dashboard instead of /#/dashboard,
    // HashRouter sees an empty hash and defaults to this root route.
    // We can intercept this and fix the URL automatically.
    const path = window.location.pathname;
    const base = import.meta.env.BASE_URL;
    if (path !== base && path.startsWith(base)) {
      const route = path.slice(base.length);
      window.location.replace(`${base}#/${route}`);
      return;
    }

  useEffect(() => {
    // Redirect to the static /home/index.html to avoid Vite dev server SPA fallback
    window.location.replace(`${import.meta.env.BASE_URL}home/index.html`);
  }, []);
  
  return null;
}

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<RedirectToStaticHome />} />

        <Route path="/dashboard" element={<DashboardPage />} />
      </Routes>
    </HashRouter>
  )
}

export default App
