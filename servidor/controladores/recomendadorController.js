var con = require('../lib/conexionbd');

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

    console.log(sql);
    console.log('--------------------------------------');
    console.log(sqlNoLimit);


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
            console.log("totalRegs 1: "+totalRegs);

            //si no hubo error, se crea el objeto respuesta con las canciones encontradas
            var response = {
                'peliculas': resultado,
                'total': totalRegs
            };
            //se envía la respuesta
            res.send(JSON.stringify(response));
        });
    });
}

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
        //si no hubo error, se crea el objeto respuesta con las canciones encontradas
        var response = {
            'generos': resultado
        };
        //se envía la respuesta
        res.send(JSON.stringify(response));
    });
}

/*
function buscarCancion(req, res) {
    //se obtiene el path param id
    var id = req.params.id;
    //se crea la consulta que obtiene
    var sql = "select * from cancion where id = " + id;
    con.query(sql, function(error, resultado, fields) {
        if (error) {
            console.log("Hubo un error en la consulta", error.message);
            return res.status(404).send("Hubo un error en la consulta");
        }
        //si no se encontró ningún resultado, se envía un mensaje con el error
        if (resultado.length == 0) {
            console.log("No se encontro ninguna canción con ese id");
            return res.status(404).send("No se encontro ninguna canción con ese id");
        } else {
            var respuesta = {
                //se crea el objeto respuesta con la canción encontrada
                'cancion': resultado
            };
            //se envía la respuesta
            res.send(JSON.stringify(response));
        }

    });
}
*/

//se exportan las funciones creadas
module.exports = {
    getMovies: getMovies,
    getGenders: getGenders,
};