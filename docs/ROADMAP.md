# MoneyFlow — Development Roadmap & Feature Matrix

## Phase Summary & Dependency Graph

```
[Phase 0: Inspection & Planning] (COMPLETED / IN REVIEW)
       |
       v
[Phase 1: Project Foundation (Monorepo, Tooling, Health Checks)]
       |
       v
[Phase 2: UI Foundation & Dashboard Shell (Design System, Themes)]
       |
       v
[Phase 3: Database & Authentication (Prisma, JWT, User Isolation)]
       |
       v
[Phase 4: Accounts, Categories & Transactions (CRUD, Balances)]
       |
       +-----------------------------------+-----------------------------------+
       |                                   |                                   |
       v                                   v                                   v
[Phase 5: Dashboard Analytics]     [Phase 6: Budget Planner]    [Phase 7: Savings Goals]
       |                                   |                                   |
       +-----------------------------------+-----------------------------------+
                                           |
                                           v
                          [Phase 8: Recurring Payments]
                                           |
                                           v
                          [Phase 9: Reports, Export & Settings]
                                           |
                                           v
                          [Phase 10: Hardening & Release]
                                           |
                                           v
                          [Phase 11: AI Integration (Future/Optional)]
```

---

## Detailed Phase Breakdown

### Phase 0: Repository Inspection and Planning
- **Status:** **Completed / In Review**
- **Objectives:**
  - Inspect existing repository and commit baseline.
  - Establish monorepo architecture and modular design.
  - Author complete documentation (`docs/` and `README.md`).
  - Establish Git workflow, branch protection strategy, and conventions.
- **Deliverables:**
  - `README.md`
  - `docs/REQUIREMENTS.md`
  - `docs/ARCHITECTURE.md`
  - `docs/DATABASE.md`
  - `docs/API.md`
  - `docs/DEVELOPMENT.md`
  - `docs/TESTING.md`
  - `docs/ROADMAP.md`

---

### Phase 1: Project Foundation
- **Status:** **Completed**
- **Dependencies:** Phase 0 approval.
- **Objectives:**
  - Configure root npm workspaces (`apps/web`, `apps/api`, `packages/shared`).
  - Configure TypeScript `tsconfig.json` across packages with path aliases.
  - Set up ESLint and Prettier configs.
  - Initialize `apps/api` with Express, CORS, Helmet, and `/api/v1/health` endpoint.
  - Initialize `apps/web` with Vite, React, and Tailwind CSS.
  - Initialize `packages/shared` with shared types and constants.
  - Add centralized API error handling and environment variable schema.
  - Verify concurrent local dev execution via `npm.cmd run dev`.

---

### Phase 2: UI Foundation & Dashboard Shell
- **Status:** Planned
- **Dependencies:** Phase 1.
- **Objectives:**
  - Implement cohesive design system with CSS custom properties (variables).
  - Implement zero-flicker Light, Dark, and System theme toggling.
  - Build responsive application layout (Sidebar navigation for desktop, bottom/drawer navigation for mobile, Topbar).
  - Create reusable atomic UI library: Buttons, Inputs, Selects, Cards, Badges, Modals, Skeleton loaders, Empty states.
  - Build shell views for Dashboard, Transactions, Budgets, Goals, Bills, Reports, and Settings.

---

### Phase 3: Database & Authentication
- **Status:** Planned
- **Dependencies:** Phase 1, Phase 2.
- **Objectives:**
  - Configure Prisma schema with PostgreSQL database connection.
  - Create database migration script and initial seed script (default categories).
  - Implement User registration, login, logout, and token validation.
  - Build Auth controller, service, repository, and Zod schemas.
  - Implement frontend auth pages (Login, Register) and AuthContext/ProtectedRoute.
  - Implement automated integration tests verifying strict user data isolation.

---

### Phase 4: Accounts, Categories & Transactions
- **Status:** Planned
- **Dependencies:** Phase 3.
- **Objectives:**
  - Implement full CRUD for Accounts (Cash, Bank, Savings, Credit).
  - Implement full CRUD for Categories (Income, Expense) with archiving protection.
  - Implement Transaction management: Income, Expense, Account Transfers.
  - Implement balance recalculation engine with atomic database transactions.
  - Build frontend transaction list with search, category/account filters, date-range picker, and pagination.
  - Add quick-add transaction modal accessible from any screen.
  - Unit tests for transfer arithmetic and balance integrity.

---

### Phase 5: Dashboard and Analytics Foundation
- **Status:** Planned
- **Dependencies:** Phase 4.
- **Objectives:**
  - Connect Dashboard widgets to live API endpoints.
  - Real-time balance calculations: Total Net Worth, Monthly Income, Monthly Expense, Net Cash Flow.
  - Category spending breakdown donut chart using Recharts.
  - Monthly income vs expense bar chart.
  - Recent transactions list with direct edit actions.
  - Verified empty states when no data is recorded.

---

### Phase 6: Budget Planner
- **Status:** Planned
- **Dependencies:** Phase 4, Phase 5.
- **Objectives:**
  - Create and manage monthly overall spending budget.
  - Create category-specific budget allocations.
  - Real-time utilization percentage tracking (`Spent / Budgeted * 100`).
  - Visual alert states: Normal (<80%), Warning (80-99%), Exceeded (>=100%).
  - Navigation between current and past monthly budgets.
  - Unit and integration tests for budget calculations and boundary conditions.

---

### Phase 7: Savings Goals & Future Planning
- **Status:** Planned
- **Dependencies:** Phase 4.
- **Objectives:**
  - Goal creation: target amount, target date, goal category/account link.
  - Contribution ledger linked to account balances or direct savings deposits.
  - Target pacing formula: `Required Monthly Savings = Remaining / Months Remaining`.
  - Pacing status: "On Track" vs "Behind Schedule".
  - Clean separation between projected savings planning and authoritative cash balances.

---

### Phase 8: Recurring Payments & Reminders
- **Status:** Planned
- **Dependencies:** Phase 4.
- **Objectives:**
  - Track subscriptions and recurring bills (daily, weekly, monthly, yearly).
  - Calculation of `nextDueDate` after payment processing.
  - "Mark as Paid" workflow that generates an actual expense transaction with idempotency.
  - Upcoming bills section on Dashboard with due date alerts.

---

### Phase 9: Reports, Export & Settings
- **Status:** Planned
- **Dependencies:** Phases 5-8.
- **Objectives:**
  - Advanced analytical reports (custom date ranges, savings rate trends, historical comparisons).
  - CSV export of user-owned financial records.
  - User settings: theme preference, currency formatting (INR ₹ default), month-start day preference.
  - Safe account deletion with explicit confirmation and cascade record wipe.

---

### Phase 10: Hardening and Production Readiness
- **Status:** Planned
- **Dependencies:** Phases 1-9.
- **Objectives:**
  - Full end-to-end testing across 10 critical user workflows.
  - Accessibility audit (WCAG AA compliance, keyboard navigation).
  - Performance audit, database index verification, and query optimization.
  - Production build validation (`apps/web` and `apps/api`).
  - Deployment guides, containerization / process configuration, and backup strategies.

---

### Phase 11: AI Financial Assistant (Deferred / Optional)
- **Status:** Backlog (Explicit User Authorization Required)
- **Future Possibilities:**
  - Spending anomaly alerts.
  - Natural language spending queries.
  - Personalized budget optimization recommendations.
  - Strict privacy guardrails: user opt-in only, no raw PII/secrets sent to external LLMs, deterministic math remains authoritative.
