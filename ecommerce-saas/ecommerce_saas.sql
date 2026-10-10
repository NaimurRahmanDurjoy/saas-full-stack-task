-- MySQL dump 10.13  Distrib 8.0.30, for Win64 (x86_64)
--
-- Host: localhost    Database: ecommerce_saas
-- ------------------------------------------------------
-- Server version	8.0.30

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `admins`
--

DROP TABLE IF EXISTS `admins`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `admins` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'admin',
  `remember_token` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `admins_email_unique` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admins`
--

LOCK TABLES `admins` WRITE;
/*!40000 ALTER TABLE `admins` DISABLE KEYS */;
INSERT INTO `admins` VALUES (1,'Management Admin','admin@cartessa.com',NULL,'$2y$12$pmRB6yuLEOnjW/.8xtSoHeRF2qR/d3gvPDKocnZcDhBiVqdvNBpsG','super_admin',NULL,'2026-10-08 23:35:53','2026-10-08 23:35:53');
/*!40000 ALTER TABLE `admins` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cache`
--

DROP TABLE IF EXISTS `cache`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cache` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL,
  PRIMARY KEY (`key`),
  KEY `cache_expiration_index` (`expiration`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cache`
--

LOCK TABLES `cache` WRITE;
/*!40000 ALTER TABLE `cache` DISABLE KEYS */;
/*!40000 ALTER TABLE `cache` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cache_locks`
--

DROP TABLE IF EXISTS `cache_locks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cache_locks` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `owner` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL,
  PRIMARY KEY (`key`),
  KEY `cache_locks_expiration_index` (`expiration`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cache_locks`
--

LOCK TABLES `cache_locks` WRITE;
/*!40000 ALTER TABLE `cache_locks` DISABLE KEYS */;
/*!40000 ALTER TABLE `cache_locks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `store_id` bigint unsigned NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `status` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `categories_store_id_slug_unique` (`store_id`,`slug`),
  KEY `categories_slug_index` (`slug`),
  KEY `categories_status_index` (`status`),
  CONSTRAINT `categories_store_id_foreign` FOREIGN KEY (`store_id`) REFERENCES `stores` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (1,1,'Smartphones','smartphones',NULL,'active','2026-10-08 23:35:55','2026-10-08 23:35:55'),(2,1,'Laptops','laptops',NULL,'active','2026-10-08 23:35:55','2026-10-08 23:35:55'),(3,1,'Accessories','accessories',NULL,'active','2026-10-08 23:35:55','2026-10-08 23:35:55'),(4,1,'Smartwatches','smartwatches',NULL,'active','2026-10-08 23:35:55','2026-10-08 23:35:55'),(5,1,'Headphones','headphones',NULL,'active','2026-10-08 23:35:55','2026-10-08 23:35:55'),(6,1,'Monitors','monitors',NULL,'active','2026-10-08 23:35:55','2026-10-08 23:35:55'),(7,1,'Cameras','cameras',NULL,'active','2026-10-08 23:35:55','2026-10-08 23:35:55'),(8,1,'Gaming Consoles','gaming-consoles',NULL,'active','2026-10-08 23:35:55','2026-10-08 23:35:55'),(9,2,'Mens Clothing','mens-clothing',NULL,'active','2026-10-08 23:35:55','2026-10-08 23:35:55'),(10,2,'Womens Clothing','womens-clothing',NULL,'active','2026-10-08 23:35:55','2026-10-08 23:35:55'),(11,2,'Shoes','shoes',NULL,'active','2026-10-08 23:35:55','2026-10-08 23:35:55'),(12,2,'Bags','bags',NULL,'active','2026-10-08 23:35:55','2026-10-08 23:35:55'),(13,2,'Fashion Watches','fashion-watches',NULL,'active','2026-10-08 23:35:55','2026-10-08 23:35:55'),(14,2,'Sunglasses','sunglasses',NULL,'active','2026-10-08 23:35:55','2026-10-08 23:35:55'),(15,2,'Jewelry','jewelry',NULL,'active','2026-10-08 23:35:55','2026-10-08 23:35:55');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `failed_jobs`
--

DROP TABLE IF EXISTS `failed_jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `failed_jobs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `connection` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `queue` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `exception` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `failed_jobs`
--

LOCK TABLES `failed_jobs` WRITE;
/*!40000 ALTER TABLE `failed_jobs` DISABLE KEYS */;
/*!40000 ALTER TABLE `failed_jobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `job_batches`
--

DROP TABLE IF EXISTS `job_batches`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `job_batches` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `total_jobs` int NOT NULL,
  `pending_jobs` int NOT NULL,
  `failed_jobs` int NOT NULL,
  `failed_job_ids` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `options` mediumtext COLLATE utf8mb4_unicode_ci,
  `cancelled_at` int DEFAULT NULL,
  `created_at` int NOT NULL,
  `finished_at` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `job_batches`
--

LOCK TABLES `job_batches` WRITE;
/*!40000 ALTER TABLE `job_batches` DISABLE KEYS */;
/*!40000 ALTER TABLE `job_batches` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `jobs`
--

DROP TABLE IF EXISTS `jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jobs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `queue` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `attempts` tinyint unsigned NOT NULL,
  `reserved_at` int unsigned DEFAULT NULL,
  `available_at` int unsigned NOT NULL,
  `created_at` int unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `jobs_queue_index` (`queue`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jobs`
--

LOCK TABLES `jobs` WRITE;
/*!40000 ALTER TABLE `jobs` DISABLE KEYS */;
/*!40000 ALTER TABLE `jobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `migrations`
--

DROP TABLE IF EXISTS `migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `migrations` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `migration` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `migrations`
--

LOCK TABLES `migrations` WRITE;
/*!40000 ALTER TABLE `migrations` DISABLE KEYS */;
INSERT INTO `migrations` VALUES (1,'0001_01_01_000000_create_users_table',1),(2,'0001_01_01_000001_create_cache_table',1),(3,'0001_01_01_000002_create_jobs_table',1),(4,'2026_10_07_044245_create_personal_access_tokens_table',1),(5,'2026_10_07_045751_create_stores_table',1),(6,'2026_10_07_045752_create_packages_table',1),(7,'2026_10_07_045752_create_subscriptions_table',1),(8,'2026_10_07_045753_create_categories_table',1),(9,'2026_10_07_045753_create_products_table',1),(10,'2026_10_07_045754_create_payment_channels_table',1),(11,'2026_10_07_045754_create_product_variants_table',1),(12,'2026_10_07_045754_create_variant_attributes_table',1),(13,'2026_10_07_045755_create_orders_table',1),(14,'2026_10_07_045756_create_order_items_table',1),(15,'2026_10_07_045758_create_payments_table',1),(16,'2026_10_07_063503_add_guest_fields_to_orders_table',1),(17,'2026_10_07_064500_create_subscription_payments_table',1),(18,'2026_10_07_111216_add_performance_indexes_to_core_tables',1),(19,'2026_10_07_184243_create_admins_table',1),(20,'2026_10_08_063941_add_store_limit_to_packages_table',1);
/*!40000 ALTER TABLE `migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_items`
--

DROP TABLE IF EXISTS `order_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_items` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `order_id` bigint unsigned NOT NULL,
  `product_variant_id` bigint unsigned DEFAULT NULL,
  `quantity` int NOT NULL,
  `unit_price` decimal(10,2) NOT NULL,
  `subtotal` decimal(12,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `order_items_order_id_foreign` (`order_id`),
  KEY `order_items_product_variant_id_foreign` (`product_variant_id`),
  CONSTRAINT `order_items_order_id_foreign` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  CONSTRAINT `order_items_product_variant_id_foreign` FOREIGN KEY (`product_variant_id`) REFERENCES `product_variants` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_items`
--

LOCK TABLES `order_items` WRITE;
/*!40000 ALTER TABLE `order_items` DISABLE KEYS */;
INSERT INTO `order_items` VALUES (1,1,1,1,150000.00,150000.00,'2026-10-08 23:35:57','2026-10-08 23:35:57'),(2,2,9,1,2500.00,2500.00,'2026-10-08 23:35:57','2026-10-08 23:35:57'),(3,2,10,1,4500.00,4500.00,'2026-10-08 23:35:57','2026-10-08 23:35:57'),(4,3,6,1,45000.00,45000.00,'2026-10-08 23:46:04','2026-10-08 23:46:04'),(5,3,4,1,50000.00,50000.00,'2026-10-08 23:46:04','2026-10-08 23:46:04');
/*!40000 ALTER TABLE `order_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `store_id` bigint unsigned NOT NULL,
  `user_id` bigint unsigned DEFAULT NULL,
  `customer_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `customer_email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `customer_phone` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `shipping_address` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `total_amount` decimal(12,2) NOT NULL DEFAULT '0.00',
  `status` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `orders_store_id_foreign` (`store_id`),
  KEY `orders_user_id_foreign` (`user_id`),
  KEY `orders_status_index` (`status`),
  KEY `orders_created_at_index` (`created_at`),
  CONSTRAINT `orders_store_id_foreign` FOREIGN KEY (`store_id`) REFERENCES `stores` (`id`) ON DELETE CASCADE,
  CONSTRAINT `orders_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (1,1,3,'Tanvir Ahmed','tanvir@gmail.com','01712345678','House 12, Road 5, Dhanmondi, Dhaka',150000.00,'completed','2026-10-08 23:35:57','2026-10-08 23:39:27'),(2,2,4,'Sadia Afrin','sadia@gmail.com','01998765432','Block C, Bashundhara R/A, Dhaka',7000.00,'pending','2026-10-08 23:35:57','2026-10-08 23:35:57'),(3,1,NULL,'Rahim','rahim@gmail.com','016564694101','Dhaka Bangladesh',95000.00,'pending','2026-10-08 23:46:04','2026-10-08 23:46:04');
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `packages`
--

DROP TABLE IF EXISTS `packages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `packages` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `price` decimal(10,2) NOT NULL,
  `store_limit` int DEFAULT NULL,
  `billing_period` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'monthly',
  `status` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `packages_slug_unique` (`slug`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `packages`
--

LOCK TABLES `packages` WRITE;
/*!40000 ALTER TABLE `packages` DISABLE KEYS */;
INSERT INTO `packages` VALUES (1,'Monthly','monthly','Billed every month',1000.00,NULL,'monthly','active','2026-10-08 23:35:55','2026-10-08 23:35:55'),(2,'Quarterly','quarterly','Billed every 3 months',2800.00,NULL,'quarterly','active','2026-10-08 23:35:55','2026-10-08 23:35:55'),(3,'Half-Yearly','half-yearly','Billed every 6 months',5500.00,NULL,'half-yearly','active','2026-10-08 23:35:55','2026-10-08 23:35:55'),(4,'Yearly','yearly','Billed every 12 months',10000.00,NULL,'yearly','active','2026-10-08 23:35:55','2026-10-08 23:35:55');
/*!40000 ALTER TABLE `packages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `password_reset_tokens`
--

DROP TABLE IF EXISTS `password_reset_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `password_reset_tokens`
--

LOCK TABLES `password_reset_tokens` WRITE;
/*!40000 ALTER TABLE `password_reset_tokens` DISABLE KEYS */;
/*!40000 ALTER TABLE `password_reset_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payment_channels`
--

DROP TABLE IF EXISTS `payment_channels`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payment_channels` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'manual',
  `account_number` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `instructions` text COLLATE utf8mb4_unicode_ci,
  `status` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payment_channels`
--

LOCK TABLES `payment_channels` WRITE;
/*!40000 ALTER TABLE `payment_channels` DISABLE KEYS */;
INSERT INTO `payment_channels` VALUES (1,'bKash','MFS','01711000000','Please send money to this number. 01711000000','active','2026-10-08 23:35:55','2026-10-08 23:35:55'),(2,'Nagad','MFS','01911000000','Please send money to this Nagad number. 01911000000','active','2026-10-08 23:35:55','2026-10-08 23:35:55'),(3,'Rocket','MFS','018110000009','Please send money to this Rocket account. 018110000009','active','2026-10-08 23:35:55','2026-10-08 23:35:55'),(4,'City Bank','banking','11025544778899','Transfer to City Bank, Branch: Gulshan. 11025544778899','active','2026-10-08 23:35:55','2026-10-08 23:35:55');
/*!40000 ALTER TABLE `payment_channels` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payments`
--

DROP TABLE IF EXISTS `payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payments` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `order_id` bigint unsigned NOT NULL,
  `payment_channel_id` bigint unsigned DEFAULT NULL,
  `amount` decimal(12,2) NOT NULL,
  `account_number` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `transaction_id` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `verified_by` bigint unsigned DEFAULT NULL,
  `verified_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `payments_transaction_id_unique` (`transaction_id`),
  KEY `payments_order_id_foreign` (`order_id`),
  KEY `payments_payment_channel_id_foreign` (`payment_channel_id`),
  KEY `payments_verified_by_foreign` (`verified_by`),
  KEY `payments_transaction_id_index` (`transaction_id`),
  CONSTRAINT `payments_order_id_foreign` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  CONSTRAINT `payments_payment_channel_id_foreign` FOREIGN KEY (`payment_channel_id`) REFERENCES `payment_channels` (`id`) ON DELETE SET NULL,
  CONSTRAINT `payments_verified_by_foreign` FOREIGN KEY (`verified_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payments`
--

LOCK TABLES `payments` WRITE;
/*!40000 ALTER TABLE `payments` DISABLE KEYS */;
INSERT INTO `payments` VALUES (1,1,1,150000.00,'01712345678','BKASH-789XYZ','verified',NULL,NULL,'2026-10-08 23:35:57','2026-10-08 23:39:27'),(2,2,4,7000.00,'2200445588','TRX-BANK-001','pending',NULL,NULL,'2026-10-08 23:35:57','2026-10-08 23:35:57');
/*!40000 ALTER TABLE `payments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `personal_access_tokens`
--

DROP TABLE IF EXISTS `personal_access_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `personal_access_tokens` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `tokenable_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tokenable_id` bigint unsigned NOT NULL,
  `name` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `abilities` text COLLATE utf8mb4_unicode_ci,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`),
  KEY `personal_access_tokens_expires_at_index` (`expires_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `personal_access_tokens`
--

LOCK TABLES `personal_access_tokens` WRITE;
/*!40000 ALTER TABLE `personal_access_tokens` DISABLE KEYS */;
/*!40000 ALTER TABLE `personal_access_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_variants`
--

DROP TABLE IF EXISTS `product_variants`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_variants` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `store_id` bigint unsigned NOT NULL,
  `product_id` bigint unsigned NOT NULL,
  `sku` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `image_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `stock` int NOT NULL DEFAULT '0',
  `status` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `product_variants_store_id_sku_unique` (`store_id`,`sku`),
  KEY `product_variants_product_id_foreign` (`product_id`),
  KEY `product_variants_sku_index` (`sku`),
  KEY `product_variants_status_index` (`status`),
  CONSTRAINT `product_variants_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  CONSTRAINT `product_variants_store_id_foreign` FOREIGN KEY (`store_id`) REFERENCES `stores` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_variants`
--

LOCK TABLES `product_variants` WRITE;
/*!40000 ALTER TABLE `product_variants` DISABLE KEYS */;
INSERT INTO `product_variants` VALUES (1,1,1,'IP15PM-256',150000.00,'https://images.unsplash.com/photo-1696446701796-da61225697cc?w=500&q=80',10,'active','2026-10-08 23:35:55','2026-10-08 23:35:55'),(2,1,2,'MBP-M3-16-512',220000.00,'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80',5,'active','2026-10-08 23:35:56','2026-10-08 23:35:56'),(3,1,3,'SONY-XM5-BLK',35000.00,'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=500&q=80',15,'active','2026-10-08 23:35:56','2026-10-08 23:35:56'),(4,1,4,'AW9-45-MID',50000.00,'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=500&q=80',11,'active','2026-10-08 23:35:56','2026-10-08 23:46:04'),(5,1,5,'ANK-PB-10K',3500.00,'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=500&q=80',50,'active','2026-10-08 23:35:56','2026-10-08 23:35:56'),(6,1,6,'DELL-27-4K',45000.00,'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&q=80',7,'active','2026-10-08 23:35:56','2026-10-08 23:46:04'),(7,1,7,'PS5-DISC',65000.00,'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=500&q=80',15,'active','2026-10-08 23:35:56','2026-10-08 23:35:56'),(8,1,8,'SONY-A73-BODY',180000.00,'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&q=80',3,'active','2026-10-08 23:35:56','2026-10-08 23:35:56'),(9,2,9,'PNJ-CTN-M',2500.00,'https://images.unsplash.com/photo-1594938298596-10fe7ddb0b63?w=500&q=80',50,'active','2026-10-08 23:35:56','2026-10-08 23:35:56'),(10,2,10,'LFS-BLK-42',4500.00,'https://images.unsplash.com/photo-1614252339474-124b895696d0?w=500&q=80',30,'active','2026-10-08 23:35:56','2026-10-08 23:35:56'),(11,2,11,'SRE-SLK-RED',8500.00,'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=500&q=80',20,'active','2026-10-08 23:35:56','2026-10-08 23:35:56'),(12,2,12,'CAS-VIN-GLD',4500.00,'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=500&q=80',40,'active','2026-10-08 23:35:56','2026-10-08 23:35:56'),(13,2,13,'RB-AVI-BLK',12000.00,'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500&q=80',15,'active','2026-10-08 23:35:57','2026-10-08 23:35:57');
/*!40000 ALTER TABLE `product_variants` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `store_id` bigint unsigned NOT NULL,
  `category_id` bigint unsigned NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `status` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `products_store_id_slug_unique` (`store_id`,`slug`),
  KEY `products_category_id_foreign` (`category_id`),
  KEY `products_slug_index` (`slug`),
  KEY `products_status_index` (`status`),
  CONSTRAINT `products_category_id_foreign` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE,
  CONSTRAINT `products_store_id_foreign` FOREIGN KEY (`store_id`) REFERENCES `stores` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (1,1,1,'iPhone 15 Pro Max','iphone-15-pro-max','Apple latest flagship smartphone.','active','2026-10-08 23:35:55','2026-10-08 23:35:55'),(2,1,2,'MacBook Pro M3','macbook-pro-m3','Powerful laptop for creators.','active','2026-10-08 23:35:56','2026-10-08 23:35:56'),(3,1,5,'Sony WH-1000XM5','sony-wh-1000xm5','Industry leading noise cancellation.','active','2026-10-08 23:35:56','2026-10-08 23:35:56'),(4,1,4,'Apple Watch Series 9','apple-watch-series-9','Smarter. Brighter. Mightier.','active','2026-10-08 23:35:56','2026-10-08 23:35:56'),(5,1,3,'Anker 10000mAh Power Bank','anker-10000mah-power-bank','Fast charging portable battery.','active','2026-10-08 23:35:56','2026-10-08 23:35:56'),(6,1,6,'Dell 27\" 4K Monitor','dell-27-4k-monitor','Ultra HD 4K IPS display.','active','2026-10-08 23:35:56','2026-10-08 23:35:56'),(7,1,8,'PlayStation 5','playstation-5','Next gen gaming console.','active','2026-10-08 23:35:56','2026-10-08 23:35:56'),(8,1,7,'Sony Alpha a7 III','sony-alpha-a7-iii','Mirrorless full-frame camera.','active','2026-10-08 23:35:56','2026-10-08 23:35:56'),(9,2,9,'Premium Cotton Panjabi','premium-cotton-panjabi','Comfortable wear for all occasions.','active','2026-10-08 23:35:56','2026-10-08 23:35:56'),(10,2,11,'Leather Formal Shoes','leather-formal-shoes','Elegant and durable formal shoes.','active','2026-10-08 23:35:56','2026-10-08 23:35:56'),(11,2,10,'Silk Saree','silk-saree','Traditional authentic silk saree.','active','2026-10-08 23:35:56','2026-10-08 23:35:56'),(12,2,13,'Casio Vintage Watch','casio-vintage-watch','Classic digital watch for everyday wear.','active','2026-10-08 23:35:56','2026-10-08 23:35:56'),(13,2,14,'Ray-Ban Aviator','ray-ban-aviator','Iconic sunglasses style.','active','2026-10-08 23:35:57','2026-10-08 23:35:57');
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sessions` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint unsigned DEFAULT NULL,
  `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` text COLLATE utf8mb4_unicode_ci,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_activity` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `sessions_user_id_index` (`user_id`),
  KEY `sessions_last_activity_index` (`last_activity`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sessions`
--

LOCK TABLES `sessions` WRITE;
/*!40000 ALTER TABLE `sessions` DISABLE KEYS */;
INSERT INTO `sessions` VALUES ('TMDBJXXKc8KwG2try3U0Mgnbz4N7iCBe3RCaNJ1c',1,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36','YTo1OntzOjY6Il90b2tlbiI7czo0MDoiazlXZ2hiQWpkWFMwbHdnUDlTVEtwVDh3THV1RzFtdEZjRUJZa3pjTiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NDQ6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvYWRtaW4vc2FsZXMtcmVwb3J0IjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX1zOjUyOiJsb2dpbl9hZG1pbl81OWJhMzZhZGRjMmIyZjk0MDE1ODBmMDE0YzdmNThlYTRlMzA5ODlkIjtpOjE7czoxOToicGFzc3dvcmRfaGFzaF9hZG1pbiI7czo2NDoiMTEwNGIyZWM4YjY2MGJkMTAwNmQ1ZDFiOTZmOWI5OWNlNWJkZWM5MDkzZjc4ZjJjNmI0MGJjYjA2NTI0ZTMyZCI7fQ==',1791525154),('UDQlzxaZ1e5lCV7R2he8KqvZoiVGbutkMlOgA8q7',1,'127.0.0.1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36','YTo1OntzOjY6Il90b2tlbiI7czo0MDoiRDgxbG9ZeU5GaGpjQVdEQ0g3SlF5QVhYMkhITEZTckZrUlVGOE16ayI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MzA6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGkvdXNlciI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319czo1MDoibG9naW5fd2ViXzU5YmEzNmFkZGMyYjJmOTQwMTU4MGYwMTRjN2Y1OGVhNGUzMDk4OWQiO2k6MTtzOjE3OiJwYXNzd29yZF9oYXNoX3dlYiI7czo2NDoiOTJmNjEwYjc2NjNhYjQ0ZmIwM2E3MWFiM2IzYTljNjZiYzBmNDRhYTlkYjFlZjY1M2EyMjBiZDdmMWFhODY4ZCI7fQ==',1791525169);
/*!40000 ALTER TABLE `sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `stores`
--

DROP TABLE IF EXISTS `stores`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `stores` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `status` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `stores_slug_unique` (`slug`),
  KEY `stores_user_id_foreign` (`user_id`),
  KEY `stores_slug_index` (`slug`),
  KEY `stores_status_index` (`status`),
  CONSTRAINT `stores_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `stores`
--

LOCK TABLES `stores` WRITE;
/*!40000 ALTER TABLE `stores` DISABLE KEYS */;
INSERT INTO `stores` VALUES (1,1,'Naim Gadgets','naim-gadgets','Premium tech gadgets and accessories in Bangladesh.','active','2026-10-08 23:35:55','2026-10-08 23:35:55'),(2,2,'Rakib Fashion','rakib-fashion','Trendy clothing and fashion items for everyone.','active','2026-10-08 23:35:55','2026-10-08 23:35:55');
/*!40000 ALTER TABLE `stores` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `subscription_payments`
--

DROP TABLE IF EXISTS `subscription_payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `subscription_payments` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `subscription_id` bigint unsigned NOT NULL,
  `payment_channel_id` bigint unsigned DEFAULT NULL,
  `amount` decimal(12,2) NOT NULL,
  `account_number` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `transaction_id` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `verified_by` bigint unsigned DEFAULT NULL,
  `verified_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `subscription_payments_transaction_id_unique` (`transaction_id`),
  KEY `subscription_payments_subscription_id_foreign` (`subscription_id`),
  KEY `subscription_payments_payment_channel_id_foreign` (`payment_channel_id`),
  KEY `subscription_payments_transaction_id_index` (`transaction_id`),
  CONSTRAINT `subscription_payments_payment_channel_id_foreign` FOREIGN KEY (`payment_channel_id`) REFERENCES `payment_channels` (`id`) ON DELETE SET NULL,
  CONSTRAINT `subscription_payments_subscription_id_foreign` FOREIGN KEY (`subscription_id`) REFERENCES `subscriptions` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `subscription_payments`
--

LOCK TABLES `subscription_payments` WRITE;
/*!40000 ALTER TABLE `subscription_payments` DISABLE KEYS */;
/*!40000 ALTER TABLE `subscription_payments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `subscriptions`
--

DROP TABLE IF EXISTS `subscriptions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `subscriptions` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `store_id` bigint unsigned NOT NULL,
  `package_id` bigint unsigned NOT NULL,
  `status` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `starts_at` timestamp NULL DEFAULT NULL,
  `ends_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `subscriptions_store_id_foreign` (`store_id`),
  KEY `subscriptions_package_id_foreign` (`package_id`),
  KEY `subscriptions_status_index` (`status`),
  CONSTRAINT `subscriptions_package_id_foreign` FOREIGN KEY (`package_id`) REFERENCES `packages` (`id`) ON DELETE RESTRICT,
  CONSTRAINT `subscriptions_store_id_foreign` FOREIGN KEY (`store_id`) REFERENCES `stores` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `subscriptions`
--

LOCK TABLES `subscriptions` WRITE;
/*!40000 ALTER TABLE `subscriptions` DISABLE KEYS */;
INSERT INTO `subscriptions` VALUES (1,1,4,'active','2026-09-28 23:35:55','2027-09-28 23:35:55','2026-10-08 23:35:55','2026-10-08 23:35:55'),(2,2,1,'active','2026-10-08 23:35:55','2026-11-08 23:35:55','2026-10-08 23:35:55','2026-10-08 23:35:55');
/*!40000 ALTER TABLE `subscriptions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'customer',
  `remember_token` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Md. Naimur Rahman','naim@gmail.com',NULL,'$2y$12$c0HYarGZXMkmWFvBzb/IM.4OJGG4VSYJxGCM1DMcJjfencpTPDWcy','store_owner',NULL,'2026-10-08 23:35:54','2026-10-08 23:35:54'),(2,'Rakibul Islam','rakib@gmail.com',NULL,'$2y$12$.g3nkQ1/3xpzdzHIzyFJ/eeJ2Nud3aW3alVwBF5Zdq7XcpuWMHYFi','store_owner',NULL,'2026-10-08 23:35:54','2026-10-08 23:35:54'),(3,'Tanvir Ahmed','tanvir@gmail.com',NULL,'$2y$12$shKzpKy7NKwfGhW4msnwy.K0HjFaL8HoXC7JpGtyTWrrDCKcIkn0u','customer',NULL,'2026-10-08 23:35:54','2026-10-08 23:35:54'),(4,'Sadia Afrin','sadia@gmail.com',NULL,'$2y$12$T5ntT2eJKbe6zv0jRPasuu5kt20Kra9auYAMcAhmlBDDxNnoA3sWK','customer',NULL,'2026-10-08 23:35:55','2026-10-08 23:35:55');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `variant_attributes`
--

DROP TABLE IF EXISTS `variant_attributes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `variant_attributes` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `product_variant_id` bigint unsigned NOT NULL,
  `attribute_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `attribute_value` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `variant_attributes_product_variant_id_attribute_name_unique` (`product_variant_id`,`attribute_name`),
  CONSTRAINT `variant_attributes_product_variant_id_foreign` FOREIGN KEY (`product_variant_id`) REFERENCES `product_variants` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `variant_attributes`
--

LOCK TABLES `variant_attributes` WRITE;
/*!40000 ALTER TABLE `variant_attributes` DISABLE KEYS */;
INSERT INTO `variant_attributes` VALUES (1,1,'Storage','256GB','2026-10-08 23:35:56','2026-10-08 23:35:56'),(2,2,'RAM','16GB','2026-10-08 23:35:56','2026-10-08 23:35:56'),(3,3,'Color','Black','2026-10-08 23:35:56','2026-10-08 23:35:56'),(4,4,'Size','45mm','2026-10-08 23:35:56','2026-10-08 23:35:56'),(5,5,'Capacity','10000mAh','2026-10-08 23:35:56','2026-10-08 23:35:56'),(6,6,'Resolution','4K','2026-10-08 23:35:56','2026-10-08 23:35:56'),(7,7,'Edition','Disc','2026-10-08 23:35:56','2026-10-08 23:35:56'),(8,8,'Type','Body Only','2026-10-08 23:35:56','2026-10-08 23:35:56'),(9,9,'Size','M','2026-10-08 23:35:56','2026-10-08 23:35:56'),(10,10,'Size','42','2026-10-08 23:35:56','2026-10-08 23:35:56'),(11,11,'Color','Red','2026-10-08 23:35:56','2026-10-08 23:35:56'),(12,12,'Color','Gold','2026-10-08 23:35:56','2026-10-08 23:35:56'),(13,13,'Size','Standard','2026-10-08 23:35:57','2026-10-08 23:35:57');
/*!40000 ALTER TABLE `variant_attributes` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-10-09 12:18:17
