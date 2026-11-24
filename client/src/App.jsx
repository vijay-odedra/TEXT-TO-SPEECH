import React, { useState, useEffect } from 'react';
import Dashboard from './pages/Dashboard';
import { useTheme } from './hooks/useTheme';
import api from './services/api';
import './App.css';

function App() {
  const [backendConnected, setBackendConnected] = useState(true);
  const { theme, toggleTheme } = useTheme();

  // Heartbeat check for backend API
  useEffect(() => {
    const verifyBackend = async () => {
      try {
        const res = await api.checkHealth();
        setBackendConnected(res.connected);
      } catch {
        setBackendConnected(false);
      }
    };

    verifyBackend();
    const interval = setInterval(verifyBackend, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="vocalix-app-root">
      <Dashboard
        backendConnected={backendConnected}
        theme={theme}
        onToggleTheme={toggleTheme}
      />
    </div>
  );
}

export default App;
