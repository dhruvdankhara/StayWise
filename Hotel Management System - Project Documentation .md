# Hotel Management System — Project Documentation

> **Type:** Single Hotel | **Stack:** Angular · Node.js · Express.js · MongoDB
> 
> 
> **Panels:** Admin · Hotel Manager · Receptionist · Cleaning Staff · User (Guest)
> 

---

## 1. Project Overview

The Hotel Management System (HMS) is a full-stack web application that digitalises all operations of a single hotel property. It covers the complete guest lifecycle — from room search and booking through to check-out and feedback — alongside internal workflows including housekeeping, staff management, billing, and reporting.

### 1.1 Objectives

- Centralise hotel operations into a single platform
- Provide role-specific dashboards for every staff category
- Automate room availability, booking, billing, and housekeeping workflows
- Enable guests to self-service via a dedicated user panel
- Generate actionable reports and analytics for management

### 1.2 Technology Stack

| Layer | Technology | Purpose |
| --- | --- | --- |
| Frontend | Angular 17+ (Angular CLI), tailwind CSS | SPA, routing, reactive forms, role-based panels |
| Backend | Node.js + Express.js | REST API, middleware, auth, business logic |
| Database | MongoDB + Mongoose | Data persistence, schemas, relationships |
| Auth | JWT + bcrypt | Stateless authentication, password hashing |
| File Uploads | Multer + Cloudinary | Room images, guest documents |
| PDF Generation | pdfkit / Puppeteer | Invoice PDF generation |

---

## 2. Project Structure

Two separate repositories: one for the Angular frontend, one for the Node.js backend.

### 2.1 Frontend — `hotel-management-ui`

```
hotel-management-ui/
├── src/
│   ├── app/
│   │   ├── core/
│   │   │   ├── guards/            # AuthGuard, RoleGuard
│   │   │   ├── interceptors/      # JWT interceptor, error interceptor
│   │   │   ├── services/          # auth.service, api.service
│   │   │   └── models/            # TypeScript interfaces / enums
│   │   ├── shared/
│   │   │   ├── components/        # navbar, sidebar, modals, loaders, room-card
│   │   │   └── pipes/             # date-format, currency-inr, room-status, booking-status
│   │   ├── panels/
│   │   │   ├── admin/
│   │   │   ├── hotel-manager/
│   │   │   ├── receptionist/
│   │   │   ├── cleaning-staff/
│   │   │   └── user/
│   │   └── app-routing.module.ts
│   ├── assets/
│   └── environments/
│       ├── environment.ts
│       └── environment.prod.ts
└── angular.json
```

### 2.2 Backend — `hotel-management-api`

```
hotel-management-api/
├── src/
│   ├── config/            # db.js, cloudinary.js
│   ├── middleware/        # auth.js, roleCheck.js, errorHandler.js
│   ├── models/            # User, Room, Booking, Invoice, HousekeepingTask, Review
│   ├── routes/            # auth, rooms, bookings, staff, billing, housekeeping, reports, reviews
│   ├── controllers/       # one controller file per route
│   ├── services/          # reportService, pdfService
│   └── utils/             # helpers.js, validators.js
├── .env
├── server.js
└── package.json
```

---

## 3. Roles & Permissions

Every user has a `role` field in MongoDB, encoded in their JWT. Angular `RoleGuard` enforces panel access on the frontend; Express middleware enforces it on every API endpoint.

| Permission | Admin | Hotel Manager | Receptionist | Cleaning Staff |
| --- | --- | --- | --- | --- |
| Manage staff accounts | ✅ | ❌ | ❌ | ❌ |
| View all bookings | ✅ | ✅ | ✅ | ❌ |
| Create / edit bookings | ✅ | ✅ | ✅ | ❌ |
| Check-in / Check-out | ✅ | ✅ | ✅ | ❌ |
| Billing & invoicing | ✅ | ✅ | ✅ | ❌ |
| Manage rooms & rates | ✅ | ✅ | ❌ | ❌ |
| Assign housekeeping tasks | ✅ | ✅ | ✅ | ❌ |
| Update room clean status | ❌ | ❌ | ❌ | ✅ |
| View assigned tasks only | ❌ | ❌ | ❌ | ✅ |
| Reports & analytics | ✅ | ✅ | ❌ | ❌ |
| System configuration | ✅ | ❌ | ❌ | ❌ |

**Role enum values:** `admin` | `hotel_manager` | `receptionist` | `cleaning_staff` | `guest`

---

## 4. Panel Features

---

### 4.1 Admin Panel

Full system access. The control centre for the entire HMS.

### 4.1.1 Dashboard

- Real-time KPI cards: occupancy rate, today's check-ins/check-outs, total revenue
- Booking trend chart (daily / weekly / monthly toggle)
- Room status summary (available, occupied, dirty, maintenance)
- Recent activity feed (latest bookings, check-ins, check-outs)

### 4.1.2 Staff Management

| Feature | Description | Access |
| --- | --- | --- |
| Create Staff Account | Add receptionist, hotel manager, or cleaning staff with role assignment | Admin only |
| Edit / Deactivate Staff | Update details, reset password, toggle active status | Admin only |
| View All Users | List all guest accounts with search, filter, and export | Admin only |
| Role Assignment | Assign or change roles; enforced via JWT claims | Admin only |

### 4.1.3 Room Management

| Feature | Description | Access |
| --- | --- | --- |
| Add / Edit Room | Create rooms with number, type, floor, capacity, amenities, images, and base rate | Admin |
| Set Room Rates | Configure base rate, seasonal pricing, and promotional rates | Admin |
| Room Status Override | Manually set any room to Available, Maintenance, or Out-of-Order | Admin |
| Bulk Room Import | Upload CSV to create multiple rooms at once | Admin |

**Room status values:** `available` | `occupied` | `dirty` | `maintenance` | `out_of_order`

### 4.1.4 Bookings Overview

- View, filter, and export all bookings across all dates and statuses
- Cancel any booking with mandatory reason logging
- Override check-in / check-out dates when required

### 4.1.5 Reports & Analytics

| Report | Description | Access |
| --- | --- | --- |
| Occupancy Report | Daily/monthly occupancy % by room type | Admin, Hotel Manager |
| Revenue Report | Revenue breakdown by period, room type, and booking source | Admin, Hotel Manager |
| Staff Report | Tasks completed per cleaning staff member | Admin |
| Guest Report | Top guests, repeat customers, origin analysis | Admin |
| Export | Download reports as PDF or Excel (.xlsx) | Admin, Hotel Manager |

### 4.1.6 System Configuration

- Hotel profile: name, address, contact info, logo
- Tax rates and invoice footer settings
- Payment gateway configuration (Razorpay / Stripe)

---

### 4.2 Hotel Manager Panel

Oversees day-to-day operations. No access to system configuration or staff account creation.

### 4.2.1 Dashboard

- Today's occupancy, arrivals, departures, and pending housekeeping tasks
- Revenue vs target progress
- Housekeeping task status overview (pending / in-progress / completed)

### 4.2.2 Booking Management

| Feature | Description | Access |
| --- | --- | --- |
| View All Bookings | Full list with search, date range filter, and status filter | Hotel Manager |
| Create Booking | Make reservations on behalf of guests (walk-in or phone) | Hotel Manager |
| Modify Booking | Change room, dates, or guest count for existing bookings | Hotel Manager |
| Cancel Booking | Cancel with reason; auto-updates room status | Hotel Manager |

### 4.2.3 Room Management

| Feature | Description | Access |
| --- | --- | --- |
| Edit Room Details | Update amenities, images, and descriptions (rates require Admin) | Hotel Manager |
| Room Status View | Live floor-plan view of all room statuses | Hotel Manager |
| Maintenance Request | Flag a room for maintenance and add issue notes | Hotel Manager |

### 4.2.4 Housekeeping Oversight

- Assign cleaning tasks to staff with priority and deadline
- View real-time task progress per floor / room
- Reassign tasks if a staff member is unavailable

### 4.2.5 Reports

- Occupancy and revenue reports (read-only; export to PDF or Excel)
- Guest feedback summary and average rating per room type

---

### 4.3 Receptionist Panel

Handles the front desk: bookings, check-in, check-out, and billing.

### 4.3.1 Dashboard

- Today's arrivals and departures list
- Quick search: find a booking by guest name, phone, or booking reference
- Room availability grid for walk-in bookings

### 4.3.2 Bookings

| Feature | Description | Access |
| --- | --- | --- |
| New Booking | Room availability search by date, type, and guest count; confirm booking | Receptionist |
| Edit Booking | Modify dates, room, or guest details pre check-in | Receptionist |
| Cancel Booking | Cancel with reason; room status auto-updates | Receptionist |
| Booking History | View past bookings for a guest to assist with repeat stays | Receptionist |

### 4.3.3 Check-In

- Verify guest identity (manual ID entry or document scan)
- Confirm booking details and collect deposit if applicable
- Assign room; mark booking as **Checked-In** — room status → `occupied`
- Send check-in confirmation to guest via email/SMS

### 4.3.4 Check-Out

- Review all charges: room rate, extras (minibar, room service, late check-out), taxes
- Apply discounts or promotional codes with mandatory reason
- Process payment (cash, card, or UPI)
- Generate and email final PDF invoice
- Mark booking as **Checked-Out** — room status → `dirty` (auto-triggers housekeeping task)

### 4.3.5 Billing & Invoicing

| Feature | Description | Access |
| --- | --- | --- |
| View Invoice | See itemised bill for any active or past booking | Receptionist |
| Add Extra Charges | Add ad-hoc charges during the stay | Receptionist |
| Apply Discount | Percentage or fixed discount with mandatory reason | Receptionist |
| Print / Email PDF | Generate and send PDF invoice to guest | Receptionist |
| Payment Recording | Record cash, card, or UPI payments against a booking | Receptionist |

### 4.3.6 Guest Management

- Create or look up guest profiles (name, phone, email, ID)
- View stay history and internal notes for a guest
- Log special requests (early check-in, room preferences, dietary needs)

---

### 4.4 Cleaning Staff Panel

Minimal, task-focused interface. Staff see only their own assigned tasks.

### 4.4.1 Dashboard

- Personal task list for today, sorted by priority and floor
- Room status badge: `dirty` → `in_progress` → `clean`
- Completed task count for the current shift

### 4.4.2 Task Management

| Feature | Description | Access |
| --- | --- | --- |
| View Assigned Tasks | List of rooms to clean with priority, room type, and notes | Cleaning Staff |
| Start Task | Mark task as In-Progress; timestamps start time | Cleaning Staff |
| Complete Task | Mark room as Cleaned; room status → `available` | Cleaning Staff |
| Add Notes | Leave notes on a room (e.g., damaged item, needs maintenance) | Cleaning Staff |
| Request Supplies | Flag a room or floor for supply restocking | Cleaning Staff |

---

### 4.5 User (Guest) Panel

Self-service portal for guests to browse, book, manage stays, and leave reviews.

### 4.5.1 Registration & Login

- Register with email, phone, and password; email verification on sign-up
- Login with email/password or OTP via phone
- Forgot password / reset via email link

### 4.5.2 Room Search & Booking

| Feature | Description | Access |
| --- | --- | --- |
| Room Search | Filter by check-in/out dates, room type, guest count, and amenities | Guest |
| Room Details | Photos, amenities list, cancellation policy, and pricing | Guest |
| Select & Book | Choose room, add special requests, confirm booking | Guest |
| Online Payment | Pay via card / UPI / net banking (Razorpay or Stripe) | Guest |
| Booking Confirmation | PDF confirmation delivered via email | Guest |

### 4.5.3 My Bookings

- View upcoming, active, and past bookings
- Download booking confirmation and invoices
- Modify booking (subject to hotel policy and availability)
- Cancel booking with refund policy displayed

### 4.5.4 Guest Profile

- Edit personal details, contact info, and ID documents
- Saved payment methods (tokenised via payment gateway)

### 4.5.5 Feedback & Reviews

| Feature | Description | Access |
| --- | --- | --- |
| Submit Review | Rate stay (1–5 stars) and write review — only unlocked after check-out | Guest |
| View Reviews | Browse reviews for a room before booking | Public |
| Report Issue | Flag a problem during stay; notifies Hotel Manager | Guest |

---

## 5. MongoDB Schemas

All collections use Mongoose with `{ timestamps: true }` (adds `createdAt`, `updatedAt`).

### 5.1 User

```jsx
{
  name:          { type: String, required: true },
  email:         { type: String, required: true, unique: true },
  phone:         { type: String, required: true },
  passwordHash:  { type: String, required: true },
  role:          { type: String, enum: ['admin','hotel_manager','receptionist','cleaning_staff','guest'], required: true },
  isActive:      { type: Boolean, default: true },
  isVerified:    { type: Boolean, default: false },
  profileImage:  { type: String },
  preferences:   { type: Object },
}
```

### 5.2 Room

```jsx
{
  roomNumber:   { type: String, required: true, unique: true },
  type:         { type: String, enum: ['single','double','suite','deluxe','family'], required: true },
  floor:        { type: Number, required: true },
  capacity:     { type: Number, required: true },
  baseRate:     { type: Number, required: true },
  amenities:    [{ type: String }],
  images:       [{ type: String }],
  status:       { type: String, enum: ['available','occupied','dirty','maintenance','out_of_order'], default: 'available' },
  description:  { type: String },
  isActive:     { type: Boolean, default: true },
}
```

### 5.3 Booking

```jsx
{
  bookingRef:      { type: String, required: true, unique: true },
  guest:           { type: ObjectId, ref: 'User', required: true },
  room:            { type: ObjectId, ref: 'Room', required: true },
  checkIn:         { type: Date, required: true },
  checkOut:        { type: Date, required: true },
  actualCheckIn:   { type: Date },
  actualCheckOut:  { type: Date },
  guests:          { type: Number, required: true },
  status:          { type: String, enum: ['pending','confirmed','checked_in','checked_out','cancelled'], default: 'pending' },
  totalAmount:     { type: Number, required: true },
  paymentStatus:   { type: String, enum: ['unpaid','partial','paid','refunded'], default: 'unpaid' },
  specialRequests: { type: String },
  createdBy:       { type: ObjectId, ref: 'User' },
}
```

### 5.4 Invoice

```jsx
{
  booking:    { type: ObjectId, ref: 'Booking', required: true },
  guest:      { type: ObjectId, ref: 'User', required: true },
  lineItems:  [{ description: String, quantity: Number, unitPrice: Number, total: Number }],
  subtotal:   { type: Number, required: true },
  taxRate:    { type: Number, required: true },
  taxAmount:  { type: Number, required: true },
  discount:   { type: Number, default: 0 },
  total:      { type: Number, required: true },
  paidAmount: { type: Number, default: 0 },
  pdfUrl:     { type: String },
  issuedAt:   { type: Date, default: Date.now },
}
```

### 5.5 HousekeepingTask

```jsx
{
  room:         { type: ObjectId, ref: 'Room', required: true },
  assignedTo:   { type: ObjectId, ref: 'User', required: true },
  assignedBy:   { type: ObjectId, ref: 'User', required: true },
  priority:     { type: String, enum: ['low','normal','high','urgent'], default: 'normal' },
  status:       { type: String, enum: ['pending','in_progress','completed','skipped'], default: 'pending' },
  notes:        { type: String },
  scheduledFor: { type: Date, required: true },
  startedAt:    { type: Date },
  completedAt:  { type: Date },
}
```

### 5.6 Review

```jsx
{
  booking:   { type: ObjectId, ref: 'Booking', required: true },
  guest:     { type: ObjectId, ref: 'User', required: true },
  room:      { type: ObjectId, ref: 'Room', required: true },
  rating:    { type: Number, min: 1, max: 5, required: true },
  comment:   { type: String },
  isVisible: { type: Boolean, default: true },
}
```

---

## 6. API Reference

**Base URL:** `http://localhost:5000/api`

All protected routes require: `Authorization: Bearer <JWT>`

### 6.1 Auth — `/api/auth`

| Method | Endpoint | Description | Access |
| --- | --- | --- | --- |
| POST | `/auth/register` | Register a new guest account | Public |
| POST | `/auth/login` | Login and receive JWT | Public |
| POST | `/auth/verify-email` | Verify email with token | Public |
| POST | `/auth/forgot-password` | Request password reset email | Public |
| POST | `/auth/reset-password` | Reset password with token | Public |
| GET | `/auth/me` | Get current user profile | All roles |
| PUT | `/auth/me` | Update own profile | All roles |

### 6.2 Rooms — `/api/rooms`

| Method | Endpoint | Description | Access |
| --- | --- | --- | --- |
| GET | `/rooms` | List all rooms with filters | All roles |
| GET | `/rooms/available` | Search available rooms by date range | All roles |
| GET | `/rooms/:id` | Get single room details | All roles |
| POST | `/rooms` | Create a new room | Admin |
| PUT | `/rooms/:id` | Update room details or status | Admin, Hotel Manager |
| DELETE | `/rooms/:id` | Soft-delete (`isActive = false`) | Admin |

### 6.3 Bookings — `/api/bookings`

| Method | Endpoint | Description | Access |
| --- | --- | --- | --- |
| GET | `/bookings` | List all bookings (role-filtered) | Admin, Manager, Receptionist |
| GET | `/bookings/my` | Current guest's own bookings | Guest |
| GET | `/bookings/:id` | Single booking detail | Admin, Manager, Receptionist, Guest (own) |
| POST | `/bookings` | Create a new booking | All roles |
| PUT | `/bookings/:id` | Update booking details | Admin, Manager, Receptionist |
| POST | `/bookings/:id/checkin` | Perform check-in | Admin, Manager, Receptionist |
| POST | `/bookings/:id/checkout` | Perform check-out | Admin, Manager, Receptionist |
| POST | `/bookings/:id/cancel` | Cancel a booking | All roles |

### 6.4 Staff — `/api/staff`

| Method | Endpoint | Description | Access |
| --- | --- | --- | --- |
| GET | `/staff` | List all staff members | Admin |
| POST | `/staff` | Create a new staff account | Admin |
| PUT | `/staff/:id` | Update staff details or role | Admin |
| DELETE | `/staff/:id` | Deactivate a staff account | Admin |

### 6.5 Billing — `/api/billing`

| Method | Endpoint | Description | Access |
| --- | --- | --- | --- |
| GET | `/billing/:bookingId` | Get invoice for a booking | Admin, Manager, Receptionist, Guest (own) |
| POST | `/billing/:bookingId` | Generate / finalise invoice | Admin, Manager, Receptionist |
| PUT | `/billing/:bookingId/charges` | Add an extra charge | Admin, Manager, Receptionist |
| POST | `/billing/:bookingId/payment` | Record a payment | Admin, Manager, Receptionist |
| GET | `/billing/:bookingId/pdf` | Download invoice PDF | Admin, Manager, Receptionist, Guest (own) |

### 6.6 Housekeeping — `/api/housekeeping`

| Method | Endpoint | Description | Access |
| --- | --- | --- | --- |
| GET | `/housekeeping` | List tasks (role-filtered) | Admin, Manager, Receptionist, Cleaning Staff (own) |
| POST | `/housekeeping` | Create a housekeeping task | Admin, Manager, Receptionist |
| PUT | `/housekeeping/:id` | Update assignment or priority | Admin, Manager, Receptionist |
| PATCH | `/housekeeping/:id/status` | Update task status | Cleaning Staff |

### 6.7 Reports — `/api/reports`

| Method | Endpoint | Description | Access |
| --- | --- | --- | --- |
| GET | `/reports/occupancy` | Occupancy by date range | Admin, Hotel Manager |
| GET | `/reports/revenue` | Revenue by date range | Admin, Hotel Manager |
| GET | `/reports/staff` | Staff task performance | Admin |
| GET | `/reports/guests` | Guest analytics | Admin |

### 6.8 Reviews — `/api/reviews`

| Method | Endpoint | Description | Access |
| --- | --- | --- | --- |
| GET | `/reviews` | List all reviews | Admin, Hotel Manager |
| GET | `/reviews/room/:roomId` | Reviews for a specific room | Public |
| POST | `/reviews` | Submit a review (post check-out only) | Guest |
| PATCH | `/reviews/:id/visibility` | Show / hide a review | Admin |

---

## 7. Angular CLI Commands

All components, services, pipes, guards, and modules **must** be generated via Angular CLI to maintain module registration and consistent file structure.

### 7.1 Project Setup

- project already created using angular cli + tailwind css.

### 7.2 Panel Modules

```bash
ng generate module panels/admin --routing
ng generate module panels/hotel-manager --routing
ng generate module panels/receptionist --routing
ng generate module panels/cleaning-staff --routing
ng generate module panels/user --routing
```

### 7.3 Components

```bash
# Shared
ng g c shared/components/navbar
ng g c shared/components/sidebar
ng g c shared/components/room-card
ng g c shared/components/booking-modal
ng g c shared/components/confirm-dialog

# Admin panel
ng g c panels/admin/dashboard
ng g c panels/admin/staff-management
ng g c panels/admin/room-management
ng g c panels/admin/bookings-overview
ng g c panels/admin/reports
ng g c panels/admin/system-config

# Hotel Manager panel
ng g c panels/hotel-manager/dashboard
ng g c panels/hotel-manager/booking-management
ng g c panels/hotel-manager/room-management
ng g c panels/hotel-manager/housekeeping-oversight
ng g c panels/hotel-manager/reports

# Receptionist panel
ng g c panels/receptionist/dashboard
ng g c panels/receptionist/new-booking
ng g c panels/receptionist/check-in
ng g c panels/receptionist/check-out
ng g c panels/receptionist/billing
ng g c panels/receptionist/guest-management

# Cleaning Staff panel
ng g c panels/cleaning-staff/task-list
ng g c panels/cleaning-staff/task-detail

# User (Guest) panel
ng g c panels/user/home
ng g c panels/user/room-search
ng g c panels/user/room-detail
ng g c panels/user/booking-confirmation
ng g c panels/user/my-bookings
ng g c panels/user/profile
ng g c panels/user/reviews
```

### 7.4 Services

```bash
ng g s core/services/auth
ng g s core/services/api
ng g s core/services/booking
ng g s core/services/room
ng g s core/services/billing
ng g s core/services/housekeeping
ng g s core/services/report
ng g s core/services/review
```

### 7.5 Guards & Interceptors

```bash
ng g guard core/guards/auth
ng g guard core/guards/role
ng g interceptor core/interceptors/jwt
ng g interceptor core/interceptors/error
```

### 7.6 Pipes

```bash
ng g pipe shared/pipes/room-status
ng g pipe shared/pipes/booking-status
ng g pipe shared/pipes/currency-inr
ng g pipe shared/pipes/date-format
```

---

## 8. Development Workflow

### 8.1 Backend Setup

```bash
cd hotel-management-api
npm install
cp .env.example .env
npm run dev              # nodemon on port 5000
```

### 8.2 Frontend Setup

```bash
cd hotel-management-ui
npm install
ng serve                 # Angular dev server on port 4200
```

### 8.3 Environment Variables (`.env`)

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/hotel_management
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
```

### 8.4 Branch Strategy

| Branch | Purpose |
| --- | --- |
| `main` | Production-ready code only |
| `develop` | Integration / staging branch |
| `feature/panel-feature` | Feature branches (e.g. `feature/receptionist-checkin`) |
| `hotfix/*` | Urgent production fixes |

---

## 9. Development Priority

Build in this order to unblock each panel progressively.

| Phase | Deliverable | Panels Unblocked |
| --- | --- | --- |
| 1 | Project setup, Auth API, JWT middleware, Role guards | All (login / access) |
| 2 | Room CRUD API + Angular Room module | Admin: room management |
| 3 | Booking API + Receptionist panel | Receptionist, Hotel Manager |
| 4 | Check-in / Check-out flows | Receptionist |
| 5 | Billing API + Invoice PDF generation | Receptionist, Guest |
| 6 | Housekeeping API + Cleaning Staff panel | Cleaning Staff, Manager |
| 7 | User (Guest) panel + Payment gateway | Guest |
| 8 | Reports API + Admin / Manager report views | Admin, Hotel Manager |
| 9 | Reviews module + Final polish + QA | Guest, Admin |

---