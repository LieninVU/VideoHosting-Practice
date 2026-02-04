-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';



-- -----------------------------------------------------
-- Schema video_hosting
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `video_hosting` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci ;
USE `video_hosting` ;

-- -----------------------------------------------------
-- Table `video_hosting`.`Accounts`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `video_hosting`.`Accounts` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `login` VARCHAR(50) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `username` VARCHAR(65) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `login_UNIQUE` (`login` ASC) VISIBLE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `video_hosting`.`sessions`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `video_hosting`.`sessions` (
  `sid` VARCHAR(255) NOT NULL,
  `sess` JSON NOT NULL,
  `expired` DATETIME NOT NULL,
  PRIMARY KEY (`sid`),
  INDEX `sessions_expired_index` (`expired` ASC) VISIBLE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `video_hosting`.`videos`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `video_hosting`.`videos` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `title` VARCHAR(500) NOT NULL,
  `description` VARCHAR(1000) NOT NULL,
  `views_count` BIGINT NOT NULL DEFAULT 0,
  `likes_count` BIGINT NOT NULL DEFAULT 0,
  `filename` VARCHAR(255) NOT NULL,
  `filepath` VARCHAR(512) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_videos_user_idx` (`user_id` ASC) VISIBLE,
  CONSTRAINT `fk_videos_user`
    FOREIGN KEY (`user_id`)
    REFERENCES `video_hosting`.`Accounts` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `video_hosting`.`Likes`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `video_hosting`.`Likes` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `video_id` INT NOT NULL,
  `user_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `uk_video_user` (`video_id` ASC, `user_id` ASC) VISIBLE,
  INDEX `fk_likes_video_idx` (`video_id` ASC) VISIBLE,
  INDEX `fk_likes_user_idx` (`user_id` ASC) VISIBLE,
  CONSTRAINT `fk_likes_video`
    FOREIGN KEY (`video_id`)
    REFERENCES `video_hosting`.`videos` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_likes_user`
    FOREIGN KEY (`user_id`)
    REFERENCES `video_hosting`.`Accounts` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `video_hosting`.`views`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `video_hosting`.`views` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `video_id` INT NOT NULL,
  `user_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_views_video_idx` (`video_id` ASC) VISIBLE,
  INDEX `fk_views_user_idx` (`user_id` ASC) VISIBLE,
  CONSTRAINT `fk_views_video`
    FOREIGN KEY (`video_id`)
    REFERENCES `video_hosting`.`videos` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_views_user`
    FOREIGN KEY (`user_id`)
    REFERENCES `video_hosting`.`Accounts` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;