// Servico de autenticacao com o JSON REST Server (JRS)
// POST /auth  -> { access_token, refresh_token, type: "Bearer" }

export const API_URL = import.meta.env.VITE_API_URL ?? 'http://127.0.0.1:5050';

const TOKEN_KEY = 'helpdesk:access_token';

export interface LoginRequest {
  email: string;
  password: string;
  admin?: boolean; // true => JRS procura em "adm_users"
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  type: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export async function login(data: LoginRequest): Promise<AuthResponse> {
  let response: Response;
  try {
    response = await fetch(`${API_URL}/auth`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  } catch {
    throw new Error('Não foi possível conectar à API. O json_rest_server está rodando?');
  }

  if (response.status === 403 || response.status === 401) {
    throw new Error('E-mail ou senha inválidos.');
  }
  if (!response.ok) {
    throw new Error(`Erro inesperado da API (${response.status}).`);
  }

  const auth = (await response.json()) as AuthResponse;
  localStorage.setItem(TOKEN_KEY, auth.access_token);
  return auth;
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function logout(): void {
  localStorage.removeItem(TOKEN_KEY);
}

// fetch que ja envia "Authorization: Bearer <token>"
export async function authFetch(path: string, init: RequestInit = {}): Promise<Response> {
  const token = getToken();
  const headers = new Headers(init.headers);
  if (token) headers.set('Authorization', `Bearer ${token}`);
  const response = await fetch(`${API_URL}${path}`, { ...init, headers });
  if (response.status === 401 || response.status === 403) {
    // token ausente/expirado (jwtExpire: 3600s)
    if (path === '/me') logout();
  }
  return response;
}

export async function getMe(): Promise<User> {
  const response = await authFetch('/me');
  if (!response.ok) throw new Error('Sessão expirada. Faça login novamente.');
  return (await response.json()) as User;
}
