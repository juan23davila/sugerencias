var con = require('../lib/conexionbd');

/**
 * Obtiene todas las películas
 */
function getMovies(req, res) {
    // Se obtiene los query paramars
    var pagina   = req.query.pagina;
    var titulo   = req.query.titulo;
    var genero   = req.query.genero;
    var anio     = req.query.anio;
    var cantidad = req.query.cantidad;
    var columna_orden = req.query.columna_orden;
    var tipo_orden = req.query.tipo_orden;

    // Se crea consulta para obtener todas las películas
    var sql = "SELECT * FROM pelicula \n";
    var sqlNoLimit = "SELECT count(1) cantidad FROM pelicula \n";
    var sqlWhere = "WHERE 1 = 1";

    // Se valida si se filtró por titulo
    if(titulo){
        sqlWhere += "\n";
        sqlWhere += "AND UPPER(pelicula.titulo) like UPPER('%"+titulo+"%')";
    }

    // Se valida si se filtró por genero
    if(genero){
        sqlWhere += "\n";
        sqlWhere += "AND pelicula.genero_id = "+genero;
    }

    // Se valida si se recibió año de estreno
    if(anio){
        sqlWhere += "\n";
        sqlWhere += "AND pelicula.anio = "+anio;
    }

    //Se fija consulta para saber total de resultados
    sqlNoLimit += sqlWhere;


    //Se ordena la búsqueda
    sqlWhere += "\n";
    sqlWhere += "ORDER BY pelicula."+columna_orden+" "+tipo_orden;

    //Se fija límite de búsqueda
    sqlWhere += "\n";
    sqlWhere += "LIMIT "+(pagina*cantidad-cantidad)+","+cantidad;

    //Se completa consulta
    sql += sqlWhere;


    // Almacena cantidad de registros dado unos filtros
    var totalRegs = 0;

    //se ejecuta la consulta
    con.query(sql, function(error, resultado, fields) {
        //si hubo un error, se informa y se envía un mensaje de error
        if (error) {
            console.log("Hubo un error en la consulta de peliculas", error.message);
            return res.status(404).send("Hubo un error en la consulta");
        }
        con.query(sqlNoLimit, function(error, resultado2, fields) {
            if (error) {
                console.log("Error en conteo de registros de peliculas", error.message);
                return res.status(404).send("Hubo un error en la consulta");
            }

            totalRegs = resultado2[0].cantidad;

            //si no hubo error, se crea el objeto respuesta con las peliculas y la cantidad de las mismas encontradas
            var response = {
                'peliculas': resultado,
                'total': totalRegs
            };
            //se envía la respuesta
            res.send(JSON.stringify(response));
        });
    });
}

/**
 * Obtiene los géneros que se encuentran en la base de datos
 */
function getGenders(req, res) {
    // Se crea consulta para obtener todas las películas
    var sql = "select * from genero";

    //se ejecuta la consulta
    con.query(sql, function(error, resultado, fields) {
        //si hubo un error, se informa y se envía un mensaje de error
        if (error) {
            console.log("Hubo un error en la consulta de todos los generos", error.message);
            return res.status(404).send("Hubo un error en la consulta");
        }
        //si no hubo error, se crea el objeto respuesta con los generos encontrados
        var response = {
            'generos': resultado
        };
        //se envía la respuesta
        res.send(JSON.stringify(response));
    });
}

/**
 * Obtiene la información de una película en específico
 */
function getMoviesById(req, res) {
    //se obtiene el path param id
    var id = req.params.id;

    //se crea la consulta que obtiene la pelicula dado un id
    var sql = "SELECT pelicula.poster, pelicula.titulo, pelicula.anio, pelicula.trama, pelicula.fecha_lanzamiento,\n"+
                   "genero.nombre nombre,\n"+
                   "pelicula.director, pelicula.duracion, pelicula.puntuacion\n"+
              "FROM pelicula, genero\n"+
              "WHERE 1 = 1\n"+
              "and genero.id = pelicula.genero_id\n"+
              "and pelicula.id = "+id;

    con.query(sql, function(error, resultado, fields) {
        if (error) {
            console.log("Hubo un error en la consulta", error.message);
            return res.status(404).send("Hubo un error en la consulteeeeeeeeeeeeeeeeee");
        }
        //si no se encontró ningún resultado, se envía un mensaje con el error
        if (resultado.length == 0) {
            console.log("No se encontro ninguna película con el id "+id);
            return res.status(404).send("No se encontró información de la película seleccionada");
        } else {
            var sqlActores = "SELECT actor.* FROM actor, actor_pelicula\n"+
                             "WHERE actor_pelicula.actor_id = actor.id\n"+
                             "AND actor_pelicula.pelicula_id = "+id;

            con.query(sqlActores, function(errorActores, resultadoActores, fieldsActores) {
                if (errorActores) {
                    console.log("Hubo un error en la consulta", errorActores.message);
                    return res.status(404).send("Hubo un error en la consulta");
                }
                //si no se encontró ningún resultado, se envía un mensaje con el error
                if (resultadoActores.length == 0) {
                    console.log("No se encontró ningún actor asociado a la película con el id "+id);
                    return res.status(404).send("No se encontro información de los actores");
                }
                var response = {
                    'pelicula': resultado[0],
                    'actores': resultadoActores
                };
                //se envía la respuesta
                res.send(JSON.stringify(response));
            });
        }

    });
};

/**
 * Funcion que obtiene las recomendaciones para los usuarios
 */
function getRecommendations(req, res) {
    //Se obtienen parámetros enviados por el cliente
    var genero = req.query.genero;
    var anio_inicio = req.query.anio_inicio;
    var anio_fin = req.query.anio_inicio;
    var puntuacion = req.query.puntuacion;


    // Se crea la consulta que obtiene la pelicula dado un id
    var sql = "SELECT * FROM pelicula, genero\n"+
              "WHERE genero.id = pelicula.genero_id";

    // Se valida que parámetros se han recibido
    if(genero){
        sql += "\n";
        sql += "AND genero.nombre = '"+genero+"'";
    }
    if(anio_inicio && anio_fin){
        sql += "\n";
        sql += "AND anio BETWEEN "+anio_inicio+" AND "+anio_fin;
    }
    if(puntuacion){
        sql += "\n";
        sql += "AND puntuacion > "+puntuacion;
    }

    // Se ejecuta la consulta
    con.query(sql, function(error, resultado, fields) {
        if (error) {
            console.log("Hubo un error en la consulta", error.message);
            return res.status(404).send("Hubo un error en la consultaaaaaaaaaaaaaa");
        }
        //si no se encontró ningún resultado, se envía un mensaje con el error
        if (resultado.length == 0) {
            console.log("No se encontro ninguna película");
            return res.status(404).send("No se encontró recomendación con las opciones seleccionadas");
        } else {
            var response = {
                'peliculas': resultado
            };
        
            //se envía la respuesta
            res.send(JSON.stringify(response));
        }
    });
};



//se exportan las funciones creadas
module.exports = {
    getMovies: getMovies,
    getGenders: getGenders,
    getMoviesById: getMoviesById,
    getRecommendations: getRecommendations
};