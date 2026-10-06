# Task 3 - MySQL Database Design

This directory contains the normalized database schema design for an E-commerce system supporting multiple product variants and historical order records.

## Files
- `schema.sql`: The complete MySQL database schema including DDL and sample data.
- `er-diagram.png`: Visual representation of the Entity-Relationship model.
- `README.md`: This documentation.

## Main Tables & Structure

1. **`users`**: Minimal user table for customers who place orders.
2. **`products`**: Represents the "base" product (e.g., "Classic T-Shirt"). Stores data shared by all variants.
3. **`product_variants`**: Represents the specific purchasable variation of a product. It stores the specific `price`, `sku`, `stock`, and `image_url`.
4. **`variant_attributes`**: An Entity-Attribute-Value (EAV) style table to dynamically assign attributes to variants (e.g., Size="M", Color="Red", Weight="1.5kg").
5. **`orders`**: Represents a customer's order, tracking total amounts and status.
6. **`order_items`**: The items within an order.

## Design Decisions

### Product vs Product Variant Design
We separated `products` from `product_variants` because items like a "T-Shirt" can come in multiple sizes and colors. The base product holds the generic name and description, while the variant holds the specific `price`, `sku`, `stock`, and `image_url` since these change depending on the variant chosen.

### Variant Attribute Strategy (EAV)
Instead of adding hardcoded columns to the variants table (`size`, `color`, `weight`, `model`), which would result in many NULL values and poor scalability, we used a `variant_attributes` table. This allows infinite flexibility—new attribute types can be added later without altering the core tables.

### Order and Order Item Relationship
An order acts as a header (linking the `user`, total amount, and status). The `order_items` table links back to the `order` and points to the purchased `product_variant`.

### Why `order_items` stores `unit_price`
The `unit_price` is stored in the `order_items` table intentionally to preserve **historical integrity**. If a T-Shirt costs $500 today, it is saved as $500 in the order item. If the variant price is later increased to $600 in the `product_variants` table, historical orders will still correctly display the $500 purchase price.

## Normalization & Constraints Approach

- **Normalization**: Data is fully normalized to at least 3NF. Shared data is isolated, meaning there are no repeating groups for product descriptions or attributes.
- **Foreign Keys & Cascade Rules**: 
  - `product_variants.product_id` cascades on delete. If a base product is deleted, its variants disappear.
  - `variant_attributes.product_variant_id` cascades on delete.
  - `orders.user_id` is set to **RESTRICT** on delete. We do not want to wipe out financial order records if a user is deleted.
  - `order_items.product_variant_id` is set to **SET NULL** on delete. If a variant is removed from the catalog, we must still keep the line item in historical orders for financial reporting (with its preserved `unit_price` and `quantity`).
- **Indexes**: Indexes were added for all foreign keys (`user_id`, `product_id`, etc.) and frequently searched fields (`status`, `sku`).

## How to Execute

To test the schema locally:
```bash
mysql -u root -p < schema.sql
```
This will create a `task3_db` database, run the DDL, and insert sample data.
