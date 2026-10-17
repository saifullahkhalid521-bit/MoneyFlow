# MoneyFlow — Local Development Guide

## 1. Prerequisites
- **Node.js**: v20+ (detected on current system: `v24.15.0`)
- **Package Manager**: npm 10+ (detected on current system: `npm 11.12.1`)
- **Database**: PostgreSQL 15+ (local instance or cloud database such as Neon / Supabase)

> **Windows PowerShell Execution Policy Note:**
> In Windows PowerShell, if you encounter the error `npm.ps1 cannot be loaded because running scripts is disabled on this system`, either:
> 1. Run commands explicitly using `npm.cmd` and `npx.cmd`:
>    ```powershell
>    npm.cmd run dev
>    ```
> 2. Or permit signed scripts in PowerShell for your current user:
>    ```powershell
>    Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
>    ```

---

## 2. Monorepo Architecture with npm Workspaces
MoneyFlow uses native npm workspaces. The root `package.json` coordinates all packages:
- `apps/web`: React SPA frontend
- `apps/api`: Node.js + Express backend
- `packages/shared`: Shared types, Zod schemas, and business constants

### Installing All Dependencies
From the repository root:
```powershell
npm.cmd install
```
This installs dependencies across the root, `apps/web`, `apps/api`, and `packages/shared`, automatically linking workspace packages.

---

## 3. Database Configuration

Create `apps/api/.env` based on `apps/api/.env.example`:

```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
JWT_SECRET=super-secret-development-jwt-key-replace-in-production
JWT_EXPIRES_IN=7d

# Choose either local or cloud PostgreSQL:
# 1. Local PostgreSQL:
DATABASE_URL="postgresql://postgres:password@localhost:5432/moneyflow?schema=public"

# 2. Or Free Cloud PostgreSQL (e.g. Neon.tech / Supabase):
# DATABASE_URL="postgresql://user:pass@ep-cool-fog-12345.us-east-2.aws.neon.tech/moneyflow?sslmode=require"
```

### Running Migrations and Seeding
Once `DATABASE_URL` is configured:
```powershell
npm.cmd run prisma:migrate -w @moneyflow/api
npm.cmd run prisma:seed -w @moneyflow/api
```

To inspect the database visually using Prisma Studio:
```powershell
npm.cmd run prisma:studio -w @moneyflow/api
```

---

## 4. Running the Development Environment

You can start both frontend and backend concurrently from the root:
```powershell
npm.cmd run dev
```

Or run them individually in separate terminals:
- **API Dev Server:**
  ```powershell
  npm.cmd run dev -w @moneyflow/api
  ```
  Runs at: `http://localhost:5000/api/v1` (Health check: `http://localhost:5000/api/v1/health`)

- **Web Frontend:**
  ```powershell
  npm.cmd run dev -w @moneyflow/web
  ```
  Runs at: `http://localhost:5173`

---

## 5. Quality Assurance Commands

Run these checks before committing code:

| Command | Action |
| :--- | :--- |
| `npm.cmd run lint` | Run ESLint across all workspaces |
| `npm.cmd run typecheck` | Run `tsc --noEmit` across all workspaces |
| `npm.cmd run test` | Run automated test suites |
| `npm.cmd run build` | Validate production bundles build cleanly |
