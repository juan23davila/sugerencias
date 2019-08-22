-- -----------------------------------------------------
-- Table `sugerenciasDB`.`genero`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS sugerenciasDB.genero(
  id INT NOT NULL AUTO_INCREMENT,
  nombre VARCHAR(30) NULL,
  PRIMARY KEY (id))
ENGINE = InnoDB;

-- Se adiciona la columana nueva a la tabla pelicula
ALTER TABLE sugerenciasDB.pelicula
ADD COLUMN genero_id INT NOT NULL;

-- Se crea un indice para el nueva campo de la tabla pelicula
CREATE INDEX fk_pelicula_genero_idx ON pelicula(genero_id);

-- Se actualizan el id de las peliculas a 1 antes de crear la llave foranea
UPDATE pelicula
set genero_id = 1;