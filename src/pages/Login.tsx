import { useState, type FormEvent } from 'react';
import { login } from '../services/auth';

interface LoginProps {
  onLogin: (token: string) => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [admin, setAdmin] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');

    if (!email.trim() || !password) {
      setError('Informe e-mail e senha.');
      return;
    }

    setLoading(true);
    try {
      const auth = await login({ email: email.trim(), password, ...(admin && { admin: true }) });
      onLogin(auth.access_token);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha no login.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="login-page">
      <form className="card login-card" onSubmit={handleSubmit} noValidate>
        <h1>HelpDesk</h1>
        <p className="subtitle">Entre com sua conta</p>

        <label htmlFor="email">E-mail</label>
        <input
          id="email"
          type="email"
          autoComplete="username"
          placeholder="usuario@helpdesk.local"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label htmlFor="password">Senha</label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <label className="checkbox">
          <input type="checkbox" checked={admin} onChange={(e) => setAdmin(e.target.checked)} />
          Entrar como administrador
        </label>

        {error && <p className="error" role="alert">{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? 'Entrando…' : 'Entrar'}
        </button>
      </form>
    </main>
  );
}
