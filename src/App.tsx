import { useCallback, useState } from 'react';
import Login from './pages/Login';
import Home from './pages/Home';
import { getToken, logout } from './services/auth';

export default function App() {
  const [token, setToken] = useState<string | null>(getToken());

  const handleLogout = useCallback(() => {
    logout();
    setToken(null);
  }, []);

  return token ? <Home token={token} onLogout={handleLogout} /> : <Login onLogin={setToken} />;
}
