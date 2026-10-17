# MoneyFlow — Database Design & Schema Specification

## 1. Overview
MoneyFlow uses a relational database schema managed via **Prisma ORM** with **PostgreSQL**.
All personal financial records enforce foreign key constraints, indexing for high-frequency queries, and strict user ownership isolation.

---

## 2. Entity-Relationship Diagram

```
+----------------+       1:N       +----------------+       1:N       +-------------------+
|     User       |---------------->|    Account     |---------------->|    Transaction    |
+----------------+                 +----------------+                 +-------------------+
        |                                                                       |
        | 1:N                                                                   | N:1
        v                                                                       v
+----------------+                                                    +-------------------+
|    Category    |--------------------------------------------------->|    Category       |
+----------------+                                                    +-------------------+
        |
        | 1:N
        v
+-----------------------+         1:N       +-------------------+
|        Budget         |------------------>|  CategoryBudget   |
+-----------------------+                   +-------------------+
        |
        | 1:N
        v
+-----------------------+         1:N       +--------------------+
|      SavingsGoal      |------------------>|  GoalContribution  |
+-----------------------+                   +--------------------+
        |
        | 1:N
        v
+-----------------------+
|   RecurringPayment    |
+-----------------------+
        |
        | 1:1
        v
+-----------------------+
|    UserPreference     |
+-----------------------+
```

---

## 3. Prisma Schema Definition

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

enum AccountType {
  CASH
  BANK
  SAVINGS
  CREDIT_CARD
  LOAN
}

enum TransactionType {
  INCOME
  EXPENSE
  TRANSFER
}

enum CategoryType {
  INCOME
  EXPENSE
}

enum PaymentFrequency {
  DAILY
  WEEKLY
  MONTHLY
  YEARLY
}

enum ThemePreference {
  LIGHT
  DARK
  SYSTEM
}

model User {
  id                String             @id @default(uuid())
  email             String             @unique
  passwordHash      String
  name              String
  createdAt         DateTime           @default(now())
  updatedAt         DateTime           @updatedAt

  accounts          Account[]
  categories        Category[]
  transactions      Transaction[]
  budgets           Budget[]
  savingsGoals      SavingsGoal[]
  recurringPayments RecurringPayment[]
  preference        UserPreference?

  @@index([email])
}

model UserPreference {
  id            String          @id @default(uuid())
  userId        String          @unique
  theme         ThemePreference @default(SYSTEM)
  currency      String          @default("INR")
  locale        String          @default("en-IN")
  monthStartDay Int             @default(1)
  createdAt     DateTime        @default(now())
  updatedAt     DateTime        @updatedAt

  user          User            @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model Account {
  id             String        @id @default(uuid())
  userId         String
  name           String
  type           AccountType   @default(BANK)
  currency       String        @default("INR")
  initialBalance Decimal       @default(0.00) @db.Decimal(12, 2)
  isArchived     Boolean       @default(false)
  createdAt      DateTime      @default(now())
  updatedAt      DateTime      @updatedAt

  user           User          @relation(fields: [userId], references: [id], onDelete: Cascade)
  transactions   Transaction[] @relation("AccountTransactions")
  transfersIn    Transaction[] @relation("DestinationAccountTransactions")
  contributions  GoalContribution[]
  recurring      RecurringPayment[]

  @@index([userId, isArchived])
}

model Category {
  id             String          @id @default(uuid())
  userId         String?         // null indicates global system default category
  name           String
  type           CategoryType
  icon           String?         // icon identifier (e.g. "shopping-bag", "car")
  color          String?         // hex color code (e.g. "#10B981")
  isArchived     Boolean         @default(false)
  createdAt      DateTime        @default(now())
  updatedAt      DateTime        @updatedAt

  user           User?           @relation(fields: [userId], references: [id], onDelete: Cascade)
  transactions   Transaction[]
  categoryBudgets CategoryBudget[]
  recurring      RecurringPayment[]

  @@index([userId, type])
}

model Transaction {
  id                   String           @id @default(uuid())
  userId               String
  accountId            String
  destinationAccountId String?          // Populated only for TRANSFER transactions
  categoryId           String?          // Nullable for TRANSFER
  type                 TransactionType
  amount               Decimal          @db.Decimal(12, 2)
  date                 DateTime
  description          String
  notes                String?
  isRecurringInstance  Boolean          @default(false)
  createdAt            DateTime         @default(now())
  updatedAt            DateTime         @updatedAt

  user                 User             @relation(fields: [userId], references: [id], onDelete: Cascade)
  account              Account          @relation("AccountTransactions", fields: [accountId], references: [id], onDelete: Restrict)
  destinationAccount   Account?         @relation("DestinationAccountTransactions", fields: [destinationAccountId], references: [id], onDelete: Restrict)
  category             Category?        @relation(fields: [categoryId], references: [id], onDelete: SetNull)
  goalContributions    GoalContribution[]

  @@index([userId, date])
  @@index([userId, accountId])
  @@index([userId, categoryId])
}

model Budget {
  id                String           @id @default(uuid())
  userId            String
  month             Int              // 1 - 12
  year              Int              // e.g. 2026
  totalBudgetAmount Decimal          @db.Decimal(12, 2)
  createdAt         DateTime         @default(now())
  updatedAt         DateTime         @updatedAt

  user              User             @relation(fields: [userId], references: [id], onDelete: Cascade)
  categoryBudgets   CategoryBudget[]

  @@unique([userId, year, month])
  @@index([userId, year, month])
}

model CategoryBudget {
  id         String   @id @default(uuid())
  budgetId   String
  categoryId String
  amount     Decimal  @db.Decimal(12, 2)
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt

  budget     Budget   @relation(fields: [budgetId], references: [id], onDelete: Cascade)
  category   Category @relation(fields: [categoryId], references: [id], onDelete: Restrict)

  @@unique([budgetId, categoryId])
}

model SavingsGoal {
  id            String             @id @default(uuid())
  userId        String
  name          String
  targetAmount  Decimal            @db.Decimal(12, 2)
  targetDate    DateTime
  isCompleted   Boolean            @default(false)
  createdAt     DateTime           @default(now())
  updatedAt     DateTime           @updatedAt

  user          User               @relation(fields: [userId], references: [id], onDelete: Cascade)
  contributions GoalContribution[]

  @@index([userId, isCompleted])
}

model GoalContribution {
  id            String       @id @default(uuid())
  goalId        String
  accountId     String?
  transactionId String?
  amount        Decimal      @db.Decimal(12, 2)
  date          DateTime     @default(now())
  notes         String?
  createdAt     DateTime     @default(now())

  goal          SavingsGoal  @relation(fields: [goalId], references: [id], onDelete: Cascade)
  account       Account?     @relation(fields: [accountId], references: [id], onDelete: SetNull)
  transaction   Transaction? @relation(fields: [transactionId], references: [id], onDelete: SetNull)

  @@index([goalId])
}

model RecurringPayment {
  id          String           @id @default(uuid())
  userId      String
  accountId   String
  categoryId  String
  name        String
  amount      Decimal          @db.Decimal(12, 2)
  frequency   PaymentFrequency @default(MONTHLY)
  startDate   DateTime
  nextDueDate DateTime
  endDate     DateTime?
  isActive    Boolean          @default(true)
  createdAt   DateTime         @default(now())
  updatedAt   DateTime         @updatedAt

  user        User             @relation(fields: [userId], references: [id], onDelete: Cascade)
  account     Account          @relation(fields: [accountId], references: [id], onDelete: Restrict)
  category    Category         @relation(fields: [categoryId], references: [id], onDelete: Restrict)

  @@index([userId, isActive, nextDueDate])
}
```

---

## 4. Key Design Decisions

1. **Exact Precision (`@db.Decimal(12, 2)`):**
   Supports balances and transactions up to 9,999,999,999.99 with exact cent/paisa arithmetic.
2. **Transfer Integrity:**
   Transfers specify both `accountId` (source) and `destinationAccountId` (target). The balance computation safely credits target and debits source within a single database transaction.
3. **Cascading vs Restrictive Deletions:**
   - Deleting a `User` cascades and clears all personal records.
   - Deleting an `Account` or `Category` that contains active transactions is **restricted** to preserve audit trails. Categories can be archived (`isArchived: true`) or transactions reassigned.
4. **Composite Indexes:**
   Indexes on `[userId, date]` optimize transaction sorting, pagination, and monthly reporting.

---

## 5. Migrations & Seeding
- **Migrations:** Managed via `npx prisma migrate dev --name <migration_name>`.
- **Seeding:** Automatically seeds default system categories for new environments via `prisma/seed.ts`.
