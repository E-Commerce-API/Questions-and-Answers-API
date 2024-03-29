DROP DATABASE IF EXISTS questionsanswers;

CREATE DATABASE questionsanswers;

USE questionsanswers;

CREATE TABLE `questions` (
  `id` INTEGER NULL AUTO_INCREMENT DEFAULT NULL,
  `product_id` INTEGER NULL DEFAULT NULL,
  `question_id` INTEGER(6) NULL DEFAULT NULL,
  `question_body` VARCHAR(1000) NULL DEFAULT NULL,
  `asker_name` VARCHAR(60) NULL DEFAULT NULL,
  `question_helpfulness` INTEGER(5) NULL DEFAULT NULL,
  `reported` TINYINT(2) NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
);

CREATE TABLE `answers` (
  `id` INTEGER NULL AUTO_INCREMENT DEFAULT NULL,
  `question_id` INTEGER NULL DEFAULT NULL,
  `answer_id` INTEGER(6) NULL DEFAULT NULL,
  `body` VARCHAR(1000) NULL DEFAULT NULL,
  `date_written` DATETIME NULL DEFAULT NULL,
  `answerer_name` VARCHAR(60) NULL DEFAULT NULL,
  `helpfulness` INTEGER(5) NULL DEFAULT NULL,
  `report` TINYINT(2) NULL DEFAULT NULL,
  `photo_id` INTEGER NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
);

CREATE TABLE `photos` (
  `answer_id` INTEGER(6) NULL DEFAULT NULL,
  `id` INTEGER NULL AUTO_INCREMENT DEFAULT NULL,
  `url` VARCHAR NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
);


-- Foreign Keys

ALTER TABLE `answers` ADD FOREIGN KEY (question_id) REFERENCES `questions` (`id`);
ALTER TABLE `answers` ADD FOREIGN KEY (photo_id) REFERENCES `photos` (`id`);
ALTER TABLE `answers` ADD FOREIGN KEY (product_id) REFERENCES `products` (`id`);
ALTER TABLE `questions` ADD FOREIGN KEY (product_id) REFERENCES `products` (`id`);