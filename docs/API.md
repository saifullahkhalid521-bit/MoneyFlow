# MoneyFlow — REST API Contract & Specification

## 1. Design Principles & Standards
- **Protocol:** HTTP/1.1 or HTTP/2 over TLS.
- **Base Path:** `/api/v1`
- **Content Type:** `application/json` for all requests and responses (except CSV export).
- **Authentication:** Bearer token in `Authorization: Bearer <token>` header or HttpOnly secure cookie.
- **Status Codes:** Standard HTTP status codes (200, 201, 204, 400, 401, 403, 404, 409, 422, 500).

---

## 2. Standard Response Envelopes

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 45,
    "totalPages": 3
  }
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed for one or more fields.",
    "details": [
      {
        "field": "amount",
        "message": "Amount must be a positive number greater than 0"
      }
    ]
  }
}
```

---

## 3. Endpoints Overview

### 3.1 Authentication (`/api/v1/auth`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/auth/register` | Register new user account | No |
| `POST` | `/auth/login` | Authenticate user & return token/cookie | No |
| `POST` | `/auth/logout` | Invalidate session / clear cookie | Yes |
| `GET` | `/auth/me` | Fetch authenticated user profile & preferences | Yes |

#### Sample: `POST /api/v1/auth/register`
**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "StrongPassword123!",
  "name": "Alex Mercer"
}
```
**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "c1f7b7e0-9430-4e56-b09e-76e27c02bb03",
      "email": "user@example.com",
      "name": "Alex Mercer"
    },
    "token": "eyJhbGciOiJIUzI1NiIsIn..."
  }
}
```

---

### 3.2 Accounts (`/api/v1/accounts`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/accounts` | List all accounts with calculated balances |
| `POST` | `/accounts` | Create a new financial account |
| `GET` | `/accounts/:id` | Fetch account detail and balance breakdown |
| `PUT` | `/accounts/:id` | Update account details (name, type, archive flag) |
| `DELETE`| `/accounts/:id` | Archive or delete account (restricted if transactions exist) |

---

### 3.3 Transactions (`/api/v1/transactions`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/transactions` | List transactions with filters, search, sort, pagination |
| `POST` | `/transactions` | Create income, expense, or account transfer |
| `GET` | `/transactions/:id` | Get transaction details |
| `PUT` | `/transactions/:id` | Update transaction and recalculate balances atomically |
| `DELETE`| `/transactions/:id` | Delete transaction and reverse balance impact |

#### Query Parameters for `GET /api/v1/transactions`:
- `startDate` (ISO 8601 string, e.g. `2026-10-01`)
- `endDate` (ISO 8601 string, e.g. `2026-10-31`)
- `type` (`INCOME` | `EXPENSE` | `TRANSFER`)
- `accountId` (UUID)
- `categoryId` (UUID)
- `search` (text query matching description or notes)
- `sortBy` (`date` | `amount` | `createdAt`)
- `sortOrder` (`asc` | `desc`, default `desc`)
- `page` (integer, default `1`)
- `limit` (integer, default `20`)

---

### 3.4 Categories (`/api/v1/categories`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/categories` | List user categories and active system defaults |
| `POST` | `/categories` | Create custom category |
| `PUT` | `/categories/:id` | Update category name, icon, color |
| `DELETE`| `/categories/:id` | Archive category (preserves historical transactions) |

---

### 3.5 Budgets (`/api/v1/budgets`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/budgets/current` | Get budget for current month with spending utilization |
| `GET` | `/budgets/:year/:month` | Get budget for specific month/year with utilization |
| `POST` | `/budgets` | Set overall and category budgets for a month |
| `PUT` | `/budgets/:id` | Update existing budget limits |

---

### 3.6 Savings Goals (`/api/v1/savings-goals`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/savings-goals` | List all savings goals with calculated progress & pacing |
| `POST` | `/savings-goals` | Create a new savings goal |
| `POST` | `/savings-goals/:id/contributions` | Record a contribution towards a goal |
| `PUT` | `/savings-goals/:id` | Update goal target amount, date, or completion status |
| `DELETE`| `/savings-goals/:id` | Delete savings goal and associated contribution history |

---

### 3.7 Recurring Payments (`/api/v1/recurring-payments`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/recurring-payments` | List upcoming bills and active subscriptions |
| `POST` | `/recurring-payments` | Create a recurring schedule |
| `POST` | `/recurring-payments/:id/process` | Mark payment as paid (creates actual transaction idempotently) |
| `PUT` | `/recurring-payments/:id` | Update cadence, amount, or active status |
| `DELETE`| `/recurring-payments/:id` | Cancel/delete recurring payment |

---

### 3.8 Reports & Analytics (`/api/v1/reports`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/reports/summary` | Net cash flow, savings rate, total income/expense for range |
| `GET` | `/reports/category-breakdown` | Category spending sums and percentages for donut chart |
| `GET` | `/reports/trends` | Monthly historical trend comparison data for charts |
| `GET` | `/reports/export-csv` | Download CSV stream of filtered transactions |

---

### 3.9 Settings (`/api/v1/settings`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/settings` | Get user preferences (theme, currency, locale) |
| `PUT` | `/settings` | Update user preferences |
| `DELETE`| `/settings/account` | Permanently delete user account and wipe all records |
