-- -----------------------------------------------------
-- Table `sugerenciasDB`.`actor`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `sugerenciasDB`.`actor` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(70) NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `sugerenciasDB`.`actor_pelicula`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `sugerenciasDB`.`actor_pelicula` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `actor_id` INT NOT NULL,
  `pelicula_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_actor_has_pelicula_pelicula1_idx` (`pelicula_id` ASC, `id` ASC),
  INDEX `fk_actor_has_pelicula_actor1_idx` (`actor_id` ASC),
  CONSTRAINT `fk_actor_pelicula_actor1`
    FOREIGN KEY (`actor_id`)
    REFERENCES `sugerenciasDB`.`actor` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_actor_pelicula_pelicula1`
    FOREIGN KEY (`pelicula_id`)
    REFERENCES `sugerenciasDB`.`pelicula` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;