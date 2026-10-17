# MoneyFlow 💰

> Professional, modular, and extensible personal finance management system.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/Node.js-v20%2B-green.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)

---

## 🌟 Overview

**MoneyFlow** is a modern personal finance application built to give individuals complete control, clarity, and discipline over their financial health. It provides reliable manual income and expense tracking, multi-account balance monitoring, monthly category budget planning, future savings goal forecasting, and recurring payment tracking.

---

## 🏗️ Architecture & Technology Stack

MoneyFlow is structured as an **npm workspaces monorepo**:

- **Frontend (`apps/web`):**
  - React 18 / 19 with TypeScript
  - Vite for fast HMR and optimized builds
  - React Router for client-side navigation
  - Tailwind CSS with semantic CSS custom properties
  - Recharts for financial visual analytics
  - TanStack Query (React Query) for resilient server-state caching
  - React Hook Form + Zod for strict form validation

- **Backend (`apps/api`):**
  - Node.js & Express with TypeScript
  - Layered Module Architecture: Routes -> Controllers -> Services -> Repositories -> Schemas
  - Zod validation on all HTTP inputs
  - Centralized error handling and standardized JSON envelopes
  - Strict user-level data isolation on all queries

- **Shared Domain (`packages/shared`):**
  - Shared TypeScript interfaces, DTOs, and constants
  - Shared Zod validation schemas for cross-tier contract consistency

- **Database:**
  - PostgreSQL with Prisma ORM
  - Strict decimal precision (`Decimal(12, 2)`) for authoritative currency amounts
  - Database transactions for atomic multi-row mutations (account transfers)

---

## 📁 Repository Directory Structure

```
MoneyFlow/
├── apps/
│   ├── web/                    # Frontend React application
│   └── api/                    # Backend Express REST API
├── packages/
│   └── shared/                 # Shared domain types, constants, schemas
├── docs/                       # Comprehensive documentation
│   ├── REQUIREMENTS.md         # Detailed functional & non-functional requirements
│   ├── ARCHITECTURE.md         # Layered design & dependency contracts
│   ├── DATABASE.md             # Prisma schema, ER diagram, migration strategy
│   ├── API.md                  # REST API contract & endpoints specification
│   ├── DEVELOPMENT.md          # Local developer setup & troubleshooting guide
│   ├── TESTING.md              # Testing pyramid, unit & integration test plan
│   └── ROADMAP.md              # Phase-by-phase implementation roadmap
├── package.json                # Monorepo root workspace configuration
└── README.md
```

---

## 🚀 Quick Start (Local Setup)

### 1. Prerequisites
- **Node.js** v20+ (current system: `v24.15.0`)
- **npm** v10+ (current system: `npm 11.12.1`)
- **PostgreSQL** instance (local installation or free cloud database like Neon.tech / Supabase)

### 2. Installation
```powershell
# Clone the repository
git clone https://github.com/saifullahkhalid521-bit/MoneyFlow.git
cd MoneyFlow

# Install dependencies across all workspaces
npm.cmd install
```

### 3. Environment Variables
Copy `.env.example` in `apps/api` and update your database credentials:
```powershell
cp apps/api/.env.example apps/api/.env
```

### 4. Database Setup
```powershell
npm.cmd run prisma:migrate -w @moneyflow/api
npm.cmd run prisma:seed -w @moneyflow/api
```

### 5. Start Development
```powershell
# Runs both API and Web concurrently
npm.cmd run dev
```
- Web Application: `http://localhost:5173`
- API Health Check: `http://localhost:5000/api/v1/health`

---

## 📖 Documentation Index
For in-depth specifications, consult the documents in [`docs/`](./docs/):
- 📋 [Requirements & Acceptance Criteria](./docs/REQUIREMENTS.md)
- 🏛️ [Architecture & Module Patterns](./docs/ARCHITECTURE.md)
- 🗄️ [Database Design & Prisma Schema](./docs/DATABASE.md)
- 🔌 [REST API Contract](./docs/API.md)
- 💻 [Local Development Guide](./docs/DEVELOPMENT.md)
- 🧪 [Testing Strategy](./docs/TESTING.md)
- 🗺️ [Development Roadmap](./docs/ROADMAP.md)

---

## 🛡️ License
Distributed under the MIT License.
