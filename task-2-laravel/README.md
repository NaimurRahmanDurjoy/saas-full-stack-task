# Task 2 - PHP + Laravel Order Management

A simple Laravel-based order management system that allows placing an order via a JSON API.

## Features
- **API Endpoint:** `POST /api/orders` for order creation.
- **Validation:** Validates users, products, stock, and quantities.
- **Database Transaction:** Ensures atomic order creation (stock reduction and order placement).
- **Price Calculation:** Calculated securely on the server-side.
- **Stock Management:** Deducts stock on valid order.

## Requirements Met
- Proper MVC architecture (Models, Controller).
- Eloquent relationships.
- Migrations and Seeders.
- Database transactions.

## Setup Instructions

1. Go to the project directory:
   ```bash
   cd task-2-laravel
   ```
2. Run composer install (if not already installed):
   ```bash
   composer install
   ```
3. Environment setup:
   Copy `.env.example` to `.env` (it should already be configured to use `task2_db`).
4. Generate app key:
   ```bash
   php artisan key:generate
   ```
5. Run migrations and seed the database:
   ```bash
   php artisan migrate:fresh --seed
   ```
6. Start the development server:
   ```bash
   php artisan serve
   ```

## Example API Request

`POST http://localhost:8000/api/orders`
```json
{
    "user_id": 1,
    "items": [
        {
            "product_id": 1,
            "quantity": 2
        }
    ]
}
```

## Example API Response

```json
{
    "success": true,
    "message": "Order placed successfully",
    "order": {
        "user_id": 1,
        "total_amount": 2400.00,
        "status": "pending",
        "id": 1,
        ...
    }
}
```
