import { useEffect } from 'react'
import './App.css'
import { HashRouter, Routes, Route } from 'react-router-dom'

function RedirectToStaticHome() {
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
      </Routes>
    </HashRouter>
  )
}

export default App
