# Junior SaaS Full-Stack Engineer Task Submission

Candidate: Naimur Rahman

## Main SaaS Architecture

**Frontend:**
React + Vite SPA

**Backend:**
Laravel REST API

**Database:**
MySQL

**Communication:**
HTTP/REST API

## How to Run the Application

### 1. Database Setup
Ensure MySQL is running and an empty database `ecommerce_saas` exists.

### 2. Backend (Laravel API)
```bash
cd backend
php artisan serve
```
Make sure to copy `.env.example` to `.env` and fill out your DB credentials. Run `php artisan migrate` before serving.

### 3. Frontend (React SPA)
```bash
cd frontend
npm install
npm run dev
```

The frontend uses environment variables to communicate with the backend. 
Ensure to use `VITE_API_URL=http://localhost:8000/api` if necessary.

---

*This application natively separates frontend UI logic from backend business logic entirely, discarding legacy Inertia architecture per architectural constraints.*

## Phase 3: Core Database Architecture

The core relational database schema has been designed with multi-store SaaS tenancy in mind.

### Architecture Concepts
- **Multi-tenant Isolation**: Store ownership securely mapped through `store_id` on products, categories, orders, and subscriptions to ensure data boundaries.
- **Packages & Subscriptions**: Groundwork for robust recurring subscription processing.
- **Product Variants**: Clean normalization linking dynamic `product_variants` and `variant_attributes` for extremely flexible multi-attribute models.
- **Financial Integrity**: Sales historically locked by migrating `unit_price` precisely to `order_items` retaining price changes inherently.

To reset the entire architecture with fresh seed data:
```bash
cd backend
php artisan migrate:fresh --seed
```
