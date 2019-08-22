-- -----------------------------------------------------
-- Database sugerenciasDB
-- -----------------------------------------------------
CREATE DATABASE sugerenciasDB;
USE sugerenciasDB;


-- -----------------------------------------------------
-- Table `sugerenciasDB`.`pelicula`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `sugerenciasDB`.`pelicula` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `titulo` VARCHAR(100) NULL,
  `duracion` INT NULL,
  `director` VARCHAR(400) NULL,
  `anio` INT NULL,
  `fecha_lanzamiento` DATE NULL,
  `puntuacion` INT NULL,
  `poster` VARCHAR(300) NULL,
  `trama` VARCHAR(700) NULL,
  PRIMARY KEY (`id`)
  )
ENGINE = InnoDB;