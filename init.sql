-- CREATE DATABASE IF NOT EXISTS comic DEFAULT CHARACTER SET
-- UTF8MB4 COLLATE UTF8MB4_0900_AI_CI

GRANT ALL PRIVILEGES ON comic.* TO 'comic'@'%';
FLUSH PRIVILEGES;

DROP TABLE IF EXISTS `comic`;
CREATE TABLE `comic` (
  `id` int NOT NULL AUTO_INCREMENT,
  `library_id` int NOT NULL DEFAULT '0',
  `file_path` text NOT NULL,
  `file_size` int NOT NULL,
  `file_name` text,
  `cover` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `page_count` int DEFAULT '0',
  `authors` json DEFAULT NULL,
  `create_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `update_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_library` (`library_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `library`;
CREATE TABLE `library` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` text NOT NULL,
  `cover` varchar(255) DEFAULT NULL,
  `library_path` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `comic_count` int DEFAULT '0',
  `last_visit_time` timestamp NULL DEFAULT NULL,
  `create_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `update_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `reading_progress`;
CREATE TABLE `reading_progress` (
  `comic_id` int NOT NULL,
  `page` int NOT NULL,
  `finished` tinyint DEFAULT '0',
  `last_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`comic_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;