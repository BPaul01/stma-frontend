import './App.css'
import { useEffect } from 'react'
import { HashRouter, Routes, Route } from 'react-router-dom'
import { Amplify } from 'aws-amplify';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import TaskPage from './pages/TaskPage';
import ProtectedRoute from './components/ProtectedRoute';

Amplify.configure({
   Auth: {
      Cognito: {
         userPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID,
         userPoolClientId: import.meta.env.VITE_COGNITO_CLIENT_ID,
         // region: import.meta.env.VITE_AWS_REGION
      }
   }
});

function RedirectToStaticHome() {
   // If the user navigates to a URL like /dashboard instead of /#/dashboard,
   // HashRouter sees an empty hash and defaults to this root route.
   // We can intercept this and fix the URL automatically.

   useEffect(() => {
      const path = window.location.pathname;
      const base = import.meta.env.BASE_URL;

      if (path !== base && path.startsWith(base)) {
         const route = path.slice(base.length);
         window.location.replace(`${base}#/${route}`);
         return;
      }

      // Redirect to the static /home/index.html to avoid Vite dev server SPA fallback
      window.location.replace(`${base}home/index.html`);
   }, []);

   return null;
}

function App() {
   return (
      <Authenticator.Provider>
         <HashRouter>
            <Routes>
               <Route path="/" element={<RedirectToStaticHome />} />
               <Route path="/login" element={<LoginPage />} />

               <Route
                  path="/dashboard"
                  element={
                     <ProtectedRoute>
                        <DashboardPage />
                     </ProtectedRoute>
                  }
               />
               <Route
                  path="/task/:id"
                  element={
                     <ProtectedRoute>
                        <TaskPage />
                     </ProtectedRoute>
                  }
               />
            </Routes>
         </HashRouter>
      </Authenticator.Provider>
   )
}

export default App
