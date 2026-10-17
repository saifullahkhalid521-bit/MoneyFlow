# MoneyFlow — Requirements & Acceptance Criteria

## 1. Overview
MoneyFlow is a modern, responsive personal finance management system designed for individual users to reliably track income, expenses, accounts, budgets, savings goals, recurring obligations, and financial health over time.

---

## 2. Target User & Persona
- **Audience:** Individuals seeking structured, reliable personal finance tracking.
- **Single-User Account Isolation:** Each user has an isolated account with strictly partitioned data. No multi-tenant data leakage is permitted.
- **Default Locale & Currency:** Configurable, defaulting to Indian Rupee (`INR` / `₹`) with standard number formatting (lakhs/crores or thousands/millions according to locale preference).

---

## 3. Functional Requirements

### 3.1 Authentication & User Management
- **Registration:**
  - Email and password registration with client and server Zod validation.
  - Password strength validation (minimum 8 characters, requiring mixed characters).
  - Secure password hashing using `bcrypt` / `argon2`.
- **Authentication & Sessions:**
  - Secure token authentication via HTTP-only, SameSite cookies or secure Authorization header.
  - Session invalidation on logout.
- **Authorization & Data Isolation:**
  - Every API query must filter by authenticated `userId`.
  - IDOR (Insecure Direct Object Reference) prevention: users cannot read, edit, or delete accounts, transactions, budgets, or goals belonging to another user.
- **Profile & Settings:**
  - Update user display name, currency preference, and theme mode.
  - Safe account deletion with explicit confirmation and cascade removal of personal financial records.

### 3.2 Accounts & Balance Tracking
- **Account Types:** Cash, Bank Account, Savings Account, Credit Card / Loan.
- **Account Attributes:** Name, type, currency, initial starting balance, archived flag.
- **Balance Calculation Rules:**
  - `Current Balance = Initial Balance + Sum(Income) - Sum(Expense) + Sum(Transfers In) - Sum(Transfers Out)`.
- **Transfers:**
  - Transfers between accounts move money from `sourceAccountId` to `destinationAccountId`.
  - Transfers do NOT alter net user income or expense totals; they only adjust respective account balances.
- **Archiving:** Accounts with existing transactions cannot be hard-deleted without warning; they can be archived to maintain historical integrity.

### 3.3 Transaction Management
- **Transaction Types:** `INCOME`, `EXPENSE`, `TRANSFER`.
- **Required Fields:** Amount (positive monetary value), Date, Category, Account, Description.
- **Optional Fields:** Notes, tags.
- **Validation:**
  - Amount must be strictly greater than 0.
  - Date must be a valid calendar date (supports past or current dates; warning on far-future dates).
  - Account and Category must belong to the authenticated user (or default system categories).
- **Listing & Exploration:**
  - Search by description and notes.
  - Filter by date range (Today, This Week, This Month, Custom), type, category, and account.
  - Sort by date (descending/ascending), amount, and creation time.
  - Pagination with deterministic cursor or page/limit controls.
- **Integrity on Updates & Deletions:**
  - Editing an amount or account atomically updates the corresponding account balances.
  - Deleting a transaction reverses its balance impact.

### 3.4 Categories
- **Default Categories:**
  - *Income:* Salary, Freelance, Investments, Gifts, Other Income.
  - *Expense:* Housing & Rent, Groceries, Dining Out, Utilities, Transportation, Entertainment, Health & Fitness, Shopping, Education, Personal Care, Subscriptions, Miscellaneous.
- **Custom Categories:** Users can add personalized categories with custom icons and color tags.
- **Category Protection:** Deleting a category does not delete historical transactions; transactions are either reassigned to an "Uncategorized" system category or the category is marked as archived.

### 3.5 Budget Planner
- **Period:** Monthly calendar budgets (e.g., October 2026).
- **Scope:**
  - Overall monthly spending ceiling.
  - Category-specific monthly budget allocations.
- **Tracking Metrics:**
  - `Budgeted Amount`
  - `Spent Amount` (sum of expenses in budgeted category within that month)
  - `Remaining Amount` = `Budgeted - Spent`
  - `Utilization %` = `(Spent / Budgeted) * 100`
- **Alert States:**
  - Normal: `< 80%`
  - Warning: `80% - 99%`
  - Exceeded: `>= 100%`
- **Historical Review:** Users can review and navigate past monthly budgets.

### 3.6 Savings Goals & Future Planning
- **Goal Attributes:** Goal Name, Target Amount, Target Date, Linked Account (optional), Status (Active / Completed).
- **Contributions:**
  - Explicit contributions linked to transactions or direct goal deposits.
- **Calculations & Projections:**
  - `Current Saved Amount` and `Progress %`.
  - `Required Monthly Savings` = `Remaining Amount / Months Remaining until Target Date`.
  - Projection status: "On Track" or "Behind Schedule" based on average monthly contribution rate.
- **Financial Separation:** Goal progress is a planning metric and does not artificially inflate or distort cash balances.

### 3.7 Recurring Payments & Subscriptions
- **Attributes:** Title, Amount, Frequency (`DAILY`, `WEEKLY`, `MONTHLY`, `YEARLY`), Start Date, Next Due Date, End Date, Account, Category.
- **Workflow:**
  - Upcoming due dates displayed on dashboard and bills page.
  - Action to "Mark as Paid": creates an actual expense transaction for that date, updates `nextDueDate`, and guarantees idempotency (prevents double charges).

### 3.8 Dashboard (Executive Financial Overview)
- **Primary KPIs:**
  - Total Current Net Balance across all active accounts.
  - Monthly Income vs Monthly Expense.
  - Remaining Monthly Budget & Utilization.
  - Active Savings Goals summary.
- **Visual Analytics:**
  - Income vs Expense monthly comparison bar/line chart.
  - Expense spending distribution by category (donut/pie chart).
- **Quick Actions:** Quick-add transaction modal accessible from any screen.
- **Recent Activity:** Last 5-10 transactions with category icons and direct edit links.
- **Empty States:** Clear, encouraging empty states when no data is recorded.

### 3.9 Reports & Analytics
- **Time Periods:** Monthly, Quarterly, Yearly, and Custom Date Ranges.
- **Metrics:** Total Income, Total Expenses, Net Cash Flow, Savings Rate `((Income - Expense) / Income * 100)`.
- **Exporting:** Download filtered transactions as structured CSV.

### 3.10 Theme & UI Preferences
- Dark Mode, Light Mode, and System Default.
- Zero-flicker initialization using CSS theme tokens.
- Fully accessible contrast ratios (WCAG AA standard).

---

## 4. Non-Functional Requirements

| Dimension | Specification |
| :--- | :--- |
| **Code Modularity** | Clean monorepo: `apps/web` (UI), `apps/api` (Backend), `packages/shared` (Types/Schemas). |
| **Precision** | Currency represented in exact integer minor units (paise/cents) or arbitrary-precision decimals to avoid IEEE 754 floating-point errors. |
| **Security** | Zero raw passwords in DB, CORS allowlist, Helmet HTTP security headers, rate limiting on auth endpoints. |
| **Reliability** | Atomic database transactions for multi-row mutations (transfers, goal deposits). |
| **Responsiveness** | Mobile-first design supporting 320px up to 4K desktop screens without horizontal overflow. |
| **Test Coverage** | Unit tests for calculations, integration tests for API endpoints, E2E tests for core user journeys. |
