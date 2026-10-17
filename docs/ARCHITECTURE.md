# MoneyFlow — Architecture & Design Specification

## 1. Architectural Style: Modular Monolith

MoneyFlow is structured as a modular monolith within an npm workspace monorepo. This balances simplicity, fast local development, and strict separation of concerns without the deployment and operational overhead of microservices.

```
+-------------------------------------------------------------------------+
|                               MONOREPO                                  |
|                                                                         |
|  +-----------------------+                    +----------------------+  |
|  |       apps/web        |                    |       apps/api       |  |
|  |  (React + Vite + TS)  |                    | (Express + Node + TS)|  |
|  +-----------+-----------+                    +-----------+----------+  |
|              \                                            /             |
|               \                                          /              |
|                v                                        v               |
|            +------------------------------------------------+           |
|            |                packages/shared                 |           |
|            |     (Zod Schemas, Domain Types, Constants)     |           |
|            +------------------------------------------------+           |
+-------------------------------------------------------------------------+
```

---

## 2. Monorepo Structure

```
MoneyFlow/
├── apps/
│   ├── web/                    # Frontend SPA
│   │   ├── src/
│   │   │   ├── app/            # App setup: router, providers, layout shells
│   │   │   ├── components/     # Reusable atomic UI (Button, Modal, Card, Table)
│   │   │   ├── features/       # Business slices (auth, dashboard, transactions, etc.)
│   │   │   ├── hooks/          # Cross-cutting custom hooks
│   │   │   ├── lib/            # Utilities (api client, formatting, dates)
│   │   │   └── types/          # Frontend-specific types
│   │   ├── tests/              # Frontend unit and component tests
│   │   ├── package.json
│   │   └── vite.config.ts
│   │
│   └── api/                    # Backend REST API
│       ├── src/
│       │   ├── config/         # Environment variables & constants
│       │   ├── middleware/     # Auth, error handling, rate limiting, request validation
│       │   ├── modules/        # Modular business domains
│       │   │   ├── auth/
│       │   │   ├── accounts/
│       │   │   ├── transactions/
│       │   │   ├── categories/
│       │   │   ├── budgets/
│       │   │   ├── savings-goals/
│       │   │   ├── recurring-payments/
│       │   │   ├── reports/
│       │   │   └── settings/
│       │   ├── lib/            # Database client (Prisma), logger, encryption
│       │   ├── app.ts          # Express app configuration
│       │   └── server.ts       # Server entrypoint
│       ├── prisma/
│       │   ├── schema.prisma   # Declarative database schema
│       │   └── seed.ts         # Non-sensitive seeding
│       ├── tests/              # Integration and unit tests
│       └── package.json
│
├── packages/
│   └── shared/                 # Shared domain logic and types
│       ├── src/
│       │   ├── constants/      # Currencies, transaction types, frequencies
│       │   ├── schemas/        # Zod validation schemas
│       │   └── types/          # TypeScript interfaces & DTOs
│       └── package.json
│
├── docs/                       # Project documentation
├── package.json                # Root package with npm workspaces
└── README.md
```

---

## 3. Backend Architecture: Layered Module Pattern

Each backend module in `apps/api/src/modules/<module-name>/` strictly follows the layered responsibility pattern:

```
[ HTTP Request ]
       |
       v
+------------------------+
|   *.routes.ts          |  Declares paths, methods, auth middleware, and validation
+------------------------+
       |
       v
+------------------------+
|   *.controller.ts      |  Extracts params/body, calls service, sends HTTP status & JSON
+------------------------+
       |
       v
+------------------------+
|   *.service.ts         |  Core business rules, validations, calculations & transactions
+------------------------+
       |
       v
+------------------------+
|   *.repository.ts      |  Prisma ORM queries, database constraints & filters
+------------------------+
       |
       v
[ PostgreSQL Database ]
```

### Module Responsibilities:
1. **`*.routes.ts`**: Pure routing configuration. Maps endpoints to controllers and applies middleware (e.g., `authenticate`, `validate(createTransactionSchema)`).
2. **`*.controller.ts`**: Translates HTTP requests to service calls. Does NOT perform raw database queries or complex mathematical calculations.
3. **`*.service.ts`**: The single source of truth for business logic. Enforces ownership, runs calculations (utilization %, required savings), and wraps multi-step updates in atomic Prisma transactions.
4. **`*.repository.ts`**: Encapsulates all Prisma database queries. Ensures `userId` is always part of the `where` clause.
5. **`*.schema.ts`**: Zod schemas for validating input payloads and query parameters.
6. **`*.types.ts`**: Module-specific TypeScript contracts and internal interfaces.

### Cross-Module Communication Rules:
- Modules must never import another module's repository directly.
- Cross-module operations must occur through designated services or shared utilities.
- For example, when creating a Transfer, the `TransactionService` coordinates with the `AccountService` to verify that both accounts belong to the user.

---

## 4. Financial Calculations & Monetary Integrity

### Problem: Floating-Point Inaccuracies
In standard JavaScript: `0.1 + 0.2 === 0.30000000000000004`. Using floating-point numbers (`Float` / `Double`) for financial ledgers creates compounding rounding errors.

### Solution: Minor Units / Exact Decimal Representation
- **Database Layer:** Monetary amounts are stored in PostgreSQL as `Decimal(12, 2)` or `Int` (representing paise / cents).
- **Application Layer:** Monetary operations are executed using integer minor units or high-precision decimal math.
- **Display Layer:** Formatted via `Intl.NumberFormat` according to the user's selected currency and locale.

---

## 5. Security & Isolation Architecture

1. **Strict User-Level Isolation:**
   Every repository query that reads or mutates personal financial data requires `userId`:
   ```ts
   // Example pattern in repository:
   prisma.transaction.findFirst({
     where: { id: transactionId, userId: authenticatedUserId }
   });
   ```
2. **Authentication Flow:**
   - Stateless JWT in HTTP-only, secure, SameSite cookies (or Authorization Bearer token).
   - Passwords hashed using bcrypt with salt rounds >= 12.
3. **Defensive API Headers:**
   - Helmet integration for secure HTTP headers (CSP, HSTS, X-Frame-Options).
   - CORS restricted to the frontend origin.
   - Rate limiting on authentication routes (e.g., 5 attempts per 15 minutes).

---

## 6. Frontend Architecture

### State Management Strategy
- **Server State:** Managed by **TanStack Query** (React Query). Provides automated background refetching, caching, optimistic updates, and loading/error states without boilerplate reducers.
- **UI State:** React Context or local component state for non-persisted UI states (e.g., modal visibility, search filters).
- **Theme Preference:** Stored in `localStorage` for immediate, zero-flicker CSS class application (`dark` class on root HTML).

### Design System & Theming
- Built with Tailwind CSS and CSS custom properties (variables) for semantic colors:
  - `--bg-primary`, `--bg-surface`, `--bg-card`
  - `--text-primary`, `--text-secondary`, `--text-muted`
  - `--border-subtle`, `--border-strong`
  - `--accent-income` (emerald), `--accent-expense` (rose), `--accent-brand` (indigo)
