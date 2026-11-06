# HelpDesk Web — Página de Login

Front-end React + TypeScript (Vite) que faz login na API `helpdesk-jrs` e recebe o `access_token`.

## Como rodar

1. Suba a API (em outro terminal):

```bash
cd helpdesk-jrs
json_rest_server run
```

A API sobe em `http://127.0.0.1:5050` (porta definida em `config.yaml`).

2. Rode o front-end:

```bash
cd helpdesk-web
npm install
npm run dev
```

Abra http://localhost:5173

## Contas de teste

| Papel   | E-mail                   | Senha        | Marcar "administrador"? |
|---------|--------------------------|--------------|-------------------------|
| Usuário | usuario@helpdesk.local   | Usuario@123  | Não                     |
| Admin   | admin@helpdesk.local     | Admin@123    | Sim                     |

## Estrutura

- `src/services/auth.ts` — `login()` faz `POST /auth`, guarda o `access_token` no `localStorage`; `authFetch()` envia `Authorization: Bearer <token>`; `getMe()` chama `GET /me`.
- `src/pages/Login.tsx` — formulário com validação, erro de credenciais e estado de carregamento.
- `src/pages/Home.tsx` — tela pós-login: mostra o perfil (`/me`) e o token recebido.
- `.env` — `VITE_API_URL` (endereço da API).
