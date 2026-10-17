# MoneyFlow — Testing Strategy & Quality Assurance

## 1. Testing Philosophy & Architecture

Testing in MoneyFlow is mandatory to ensure financial accuracy, data integrity, and strict user privacy. Financial applications must never rely on visual manual testing alone.

```
       / \
      / E2E \       Critical user workflows (Register -> Add Transaction -> Check Dashboard)
     /-------\
    /  Integ  \     API routes, DB queries, auth middleware, user isolation (Supertest)
   /-----------\
  /    Unit     \   Business logic, math formulas, budget pacing, Zod validation
 /---------------\
```

---

## 2. Unit Testing Strategy

Unit tests focus on deterministic pure functions, calculations, and domain rules without spinning up the network or database.

### Critical Unit Test Suites:
1. **Financial Calculations:**
   - Account balance computation: `Balance = Initial + Income - Expense + TransfersIn - TransfersOut`.
   - Transfer operations: source debit equals destination credit; net user wealth remains unchanged.
   - Budget utilization: percentage calculation, handling 0 budgeted amount, and boundary conditions (79.9%, 80%, 100%, 150%).
   - Savings goal pacing: monthly required savings given target date, current date, and remaining amount.
2. **Date Boundaries:**
   - Leap years, month boundaries (e.g. Feb 28/29, Jan 31 -> Feb 1), and time zone normalization to UTC.
3. **Validation Rules (Zod Schemas):**
   - Rejecting negative amounts, non-numeric strings, missing categories, or invalid emails.

---

## 3. Integration Testing Strategy

Integration tests verify that controllers, services, middleware, and Prisma repositories interact correctly.

### Critical Integration Test Scenarios:
1. **Authentication & Authorization:**
   - Valid credentials return 200 with JWT / session cookie.
   - Invalid password returns 401 Unauthorized.
   - Protected endpoints reject unauthenticated requests with 401.
2. **User Data Isolation (Security Audit):**
   - User A creates Account 1 and Transaction 1.
   - User B attempts `GET /api/v1/accounts/:id_of_user_a` -> Must return 404 Not Found (or 403 Forbidden).
   - User B attempts `PUT /api/v1/transactions/:id_of_user_a` -> Must return 404/403.
   - Verification that no query executes without `userId` scoping.
3. **Database Transactions:**
   - Atomic rollback: if creating an account transfer fails midway (e.g., credit fails), the source account debit is rolled back.

---

## 4. Frontend Component & Hook Testing

- **Form Validation:** Verify inline error messages when submitting empty or invalid transaction forms.
- **Theme Switching:** Verify document class toggle between `light` and `dark` and persistence in `localStorage`.
- **Empty States:** Ensure appropriate illustration and CTA appear when accounts or transactions list is empty.

---

## 5. End-to-End (E2E) Test Checklist

Before any major release, verify this 10-step critical path:
1. Register a new user account and verify automatic login.
2. Create two accounts: "Checking Bank" (Initial ₹10,000) and "Cash Wallet" (Initial ₹2,000).
3. Record an Income transaction: ₹50,000 "Monthly Salary" credited to "Checking Bank".
4. Record an Expense transaction: ₹3,500 "Groceries" debited from "Cash Wallet".
5. Verify updated balances on Dashboard: Checking (₹60,000), Cash (₹-1,500), Total Net Worth (₹58,500).
6. Create a Monthly Budget: ₹10,000 for "Groceries".
7. Verify Budget Progress widget reflects 35% utilization and displays correct warning thresholds.
8. Create a Savings Goal: "Emergency Fund" target ₹1,00,000 by 12 months ahead; record ₹10,000 contribution.
9. Review Reports page: verify Income vs Expense chart and category breakdown agree with dashboard totals.
10. Toggle between Light and Dark themes and reload the browser to ensure persistence.

---

## 6. Testing Commands

| Scope | Command |
| :--- | :--- |
| **All Tests** | `npm.cmd run test` |
| **API Unit & Integration Tests** | `npm.cmd run test -w @moneyflow/api` |
| **Frontend Unit & Component Tests** | `npm.cmd run test -w @moneyflow/web` |
| **Shared Package Validation Tests** | `npm.cmd run test -w @moneyflow/shared` |
| **Coverage Report** | `npm.cmd run test:coverage` |
