import { useEffect, useState } from 'react';
import { getMe, type User } from '../services/auth';

interface HomeProps {
  token: string;
  onLogout: () => void;
}

export default function Home({ token, onLogout }: HomeProps) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    getMe().then(setUser).catch(onLogout);
  }, [token, onLogout]);

  return (
    <main className="login-page">
      <section className="card">
        <h1>Login realizado ✅</h1>
        {user ? (
          <p>
            Olá, <strong>{user.name}</strong> ({user.email}) — perfil: <strong>{user.role}</strong>
          </p>
        ) : (
          <p>Carregando perfil…</p>
        )}

        <label htmlFor="token">access_token recebido da API</label>
        <textarea id="token" readOnly value={token} rows={6} />

        <button type="button" onClick={onLogout}>Sair</button>
      </section>
    </main>
  );
}
