-- Create the database (optional, used for local testing)
CREATE DATABASE IF NOT EXISTS task3_db;
USE task3_db;

-- -----------------------------------------------------
-- Table `users`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `users` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `email_unique` (`email` ASC)
) ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `products`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `products` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `description` TEXT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `product_variants`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `product_variants` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `product_id` BIGINT UNSIGNED NOT NULL,
  `sku` VARCHAR(100) NOT NULL,
  `price` DECIMAL(10,2) NOT NULL,
  `image_url` VARCHAR(255) NULL,
  `stock` INT NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `sku_unique` (`sku` ASC),
  INDEX `fk_variants_product_idx` (`product_id` ASC),
  CONSTRAINT `fk_variants_product`
    FOREIGN KEY (`product_id`)
    REFERENCES `products` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `variant_attributes`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `variant_attributes` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `product_variant_id` BIGINT UNSIGNED NOT NULL,
  `attribute_name` VARCHAR(100) NOT NULL COMMENT 'e.g., Size, Color, Model, Weight',
  `attribute_value` VARCHAR(100) NOT NULL COMMENT 'e.g., XL, Red, Model S, 1.5kg',
  PRIMARY KEY (`id`),
  INDEX `fk_attributes_variant_idx` (`product_variant_id` ASC),
  CONSTRAINT `fk_attributes_variant`
    FOREIGN KEY (`product_variant_id`)
    REFERENCES `product_variants` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `orders`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `orders` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` BIGINT UNSIGNED NOT NULL,
  `total_amount` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  `status` VARCHAR(50) NOT NULL DEFAULT 'pending',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `fk_orders_user_idx` (`user_id` ASC),
  INDEX `status_idx` (`status` ASC),
  CONSTRAINT `fk_orders_user`
    FOREIGN KEY (`user_id`)
    REFERENCES `users` (`id`)
    -- Do not cascade delete user to preserve order history. Restrict deletion of users with orders.
    ON DELETE RESTRICT
    ON UPDATE CASCADE
) ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `order_items`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `order_items` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `order_id` BIGINT UNSIGNED NOT NULL,
  `product_variant_id` BIGINT UNSIGNED NULL, -- Nullable so if a variant is deleted, order history remains intact (SET NULL)
  `quantity` INT NOT NULL,
  `unit_price` DECIMAL(10,2) NOT NULL,
  `subtotal` DECIMAL(12,2) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `fk_order_items_order_idx` (`order_id` ASC),
  INDEX `fk_order_items_variant_idx` (`product_variant_id` ASC),
  CONSTRAINT `fk_order_items_order`
    FOREIGN KEY (`order_id`)
    REFERENCES `orders` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_order_items_variant`
    FOREIGN KEY (`product_variant_id`)
    REFERENCES `product_variants` (`id`)
    -- If a variant is deleted, we must keep the order item for historical records.
    ON DELETE SET NULL
    ON UPDATE CASCADE
) ENGINE = InnoDB;


-- -----------------------------------------------------
-- SAMPLE DATA
-- -----------------------------------------------------

-- Insert a test user
INSERT INTO `users` (`name`, `email`) VALUES ('Jane Doe', 'jane@example.com');

-- Insert a base product
INSERT INTO `products` (`id`, `name`, `description`) 
VALUES (1, 'Classic T-Shirt', 'A high-quality cotton t-shirt.');

-- Insert two variants for the product (different sizes and colors)
INSERT INTO `product_variants` (`id`, `product_id`, `sku`, `price`, `image_url`, `stock`) VALUES 
(1, 1, 'TSHIRT-M-RED', 500.00, 'images/tshirt-red.jpg', 100),
(2, 1, 'TSHIRT-L-BLUE', 550.00, 'images/tshirt-blue.jpg', 50);

-- Define attributes for Variant 1 (Red, M)
INSERT INTO `variant_attributes` (`product_variant_id`, `attribute_name`, `attribute_value`) VALUES 
(1, 'Color', 'Red'),
(1, 'Size', 'M');

-- Define attributes for Variant 2 (Blue, L)
INSERT INTO `variant_attributes` (`product_variant_id`, `attribute_name`, `attribute_value`) VALUES 
(2, 'Color', 'Blue'),
(2, 'Size', 'L');

-- Insert a sample order
INSERT INTO `orders` (`id`, `user_id`, `total_amount`, `status`) VALUES 
(1, 1, 1050.00, 'completed');

-- Insert order items (historical prices captured)
INSERT INTO `order_items` (`order_id`, `product_variant_id`, `quantity`, `unit_price`, `subtotal`) VALUES 
(1, 1, 1, 500.00, 500.00),
(1, 2, 1, 550.00, 550.00);
