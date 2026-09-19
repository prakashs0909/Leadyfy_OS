# LEADYFY OS — Agency Management & Operations SaaS

**LEADYFY OS** is an internal Agency Management & Operations SaaS built specifically to streamline and automate the complete operational lifecycle of a User-Generated Content (UGC) & Digital Marketing Agency.

> **Tagline**: *"Manage clients, production, creators, content and operations in one place."*

---

## Technical Stack & Architecture

- **Frontend**: React 18, Vite, JavaScript (`.jsx`/`.js`), Tailwind CSS, React Router v6, Recharts, Lucide React Icons.
- **Backend**: Node.js, Express.js, JavaScript (`.js`), MongoDB & Mongoose ORM, JWT Authentication, bcryptjs password hashing, RBAC middleware.
- **Database Resilience**: Automatic dual-mode connection to local MongoDB (`mongodb://127.0.0.1:27017/leadyfy_os`) with automatic failover to `mongodb-memory-server` for zero-configuration startup.

---

## Design System

- **Primary Color**: Amber / Yellow (`#F59E0B`)
- **Background Palette**: Charcoal Black (`#09090B`, `#111111`, `#18181B`)
- **Typography & Theme**: Minimalist Dark SaaS Dashboard, desktop-first responsive layout, clear status badges, deadline urgency highlights, and interactive data cards.

---

## User Roles & Access Control (RBAC)

| Role | Access Scope | Accessible Modules |
| :--- | :--- | :--- |
| **OWNER** | Full Unrestricted Access | Executive Dashboard, Clients, Orders, Scripts, Creators, Shoots, Videos Pipeline, Tasks, Payments, Expenses, Creator Payouts, Employees, Support, Activity Logs |
| **ADMIN** | Operations Manager | Operational Dashboard, Clients, Orders, Scripts, Creators, Shoots, Videos Pipeline, Tasks, Payments, Support |
| **EMPLOYEE** | Operational Staff | Dashboard, Clients, Assigned Scripts, Creators, Shoots, Videos Pipeline, Tasks |
| **CLIENT** | Isolated Client Portal | Client Portal Dashboard, Active Orders, Script Approvals, Video Reviews, Revision Feedback, Final Deliveries, Invoices, Support Tickets |

---

## Demo Login Credentials

| Role | Email | Password |
| :--- | :--- | :--- |
| **Owner** | `owner@leadyfy.com` | `Password123!` |
| **Admin** | `admin@leadyfy.com` | `Password123!` |
| **Employee** | `employee@leadyfy.com` | `Password123!` |
| **Client** | `client@leadyfy.com` | `Password123!` |

*(One-click preset buttons are available on the login page for rapid evaluation.)*

---

## Key Features & Core Workflows

### 1. Schema Normalization (`companyName`)
Resolved the critical known client schema mismatch by standardizing `companyName` across the React forms, API validation payloads, Express controllers, and Mongoose client model.

### 2. Live Executive & Operational Dashboard
- **Financial KPIs**: Total Active Clients, New Clients, Active Orders, Pending Scripts, Upcoming Shoots, Videos in Production, Pending Approvals, Delivered Videos, Total Receivables, Monthly Revenue, Monthly Expenses, Creator Payouts, and **Estimated Net Profit** (`Revenue - Expenses - Creator Payouts`).
- **Visual Analytics**: Interactive Recharts trend charts and live 9-stage production breakdown counters.

### 3. Core Video Production Pipeline (9 Stages)
1. `Script Approved`
2. `Shoot Pending`
3. `Raw Footage Received`
4. `Video Editing`
5. `Internal QA`
6. `Client Review`
7. `Revision`
8. `Final Approved`
9. `Delivered`

Includes editor urgency sorting (`Overdue`, `Due Today`, `Due Tomorrow`, `Completed`) and real-time status transitions.

### 4. Client Review & Approval Workflow
Clients review draft videos in their isolated portal, submit timestamped feedback for revisions (auto-incrementing `revisionCount`), approve final cuts, and access permanent cloud delivery links.

### 5. Financial & Operational Ledgers
- **Payments**: Tracks client invoice amounts, received amounts, pending balances, and transaction refs.
- **Expenses**: Tracks operational overhead across `Salaries`, `Office`, `Studio`, `Equipment`, `Fuel`, and `Payouts`.
- **Creator Payouts**: Contracted rate payouts per completed shoot/video with duplicate entry prevention.

---

## Local Setup Instructions

### Prerequisites
- Node.js (v18+)
- MongoDB (Optional: Backend automatically falls back to in-memory MongoDB if local daemon is off)

### 1. Backend Setup & Database Seed
```bash
cd backend
npm install
npm run seed     # Populates database with demo users, clients, orders, scripts, 15 videos, financial ledgers
npm run dev      # Runs Express server on http://localhost:5000
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev      # Runs Vite dev server on http://localhost:3000
```

---

## REST API Specification

### Authentication
- `POST /api/auth/login` - Authenticate user & issue JWT
- `GET /api/auth/me` - Fetch authenticated user session

### Clients & Orders
- `GET /api/clients` - List clients with search & status filter
- `POST /api/clients` - Onboard new client account (`companyName` required)
- `GET /api/clients/:id` - Fetch client profile & centralized hub data
- `PUT /api/clients/:id` - Update client profile
- `GET /api/orders` - List package orders with live video quota stats
- `POST /api/orders` - Create package order bound to client

### Scripts & Shoots
- `GET /api/scripts` - List scripts
- `POST /api/scripts` - Create script draft
- `PATCH /api/scripts/:id/status` - Transition script status / client approval
- `GET /api/shoots` - List shoot schedules
- `POST /api/shoots` - Schedule shoot & verify creator booking conflict
- `PATCH /api/shoots/:id/checklists` - Update pre-shoot & post-shoot checklists

### Video Pipeline
- `GET /api/videos` - List video cards across 9 Kanban stages
- `POST /api/videos` - Add video asset to pipeline
- `PATCH /api/videos/:id/status` - Transition video stage
- `POST /api/videos/:id/feedback` - Client revision request with timestamped feedback
- `POST /api/videos/:id/approve` - Client final video approval & delivery trigger

### Financial Ledgers & Support
- `GET /api/payments` & `POST /api/payments` - Client receivables
- `GET /api/expenses` & `POST /api/expenses` - Agency operational expenses
- `GET /api/payouts` & `POST /api/payouts` - Creator payouts
- `GET /api/dashboard` - Executive KPI aggregation

---

## Known Limitations & Next Steps

1. **Cloud File Uploads**: Currently uses cloud storage link inputs (e.g., Google Drive links); direct AWS S3 / Cloudinary multi-part upload SDK can be connected in future iterations.
2. **Real-time WebSockets**: In-app notifications update via polling; Socket.io can be added for instant push updates.
3. **Advanced PDF Export**: Client invoice PDF generator can be added for client downloading.
