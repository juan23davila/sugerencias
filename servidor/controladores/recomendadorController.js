var con = require('../lib/conexionbd');

function getMovies(req, res) {
    // Se crea consulta para obtener todas las películas
    var sql = "select * from pelicula"

    //se ejecuta la consulta
    con.query(sql, function(error, resultado, fields) {
        //si hubo un error, se informa y se envía un mensaje de error
        if (error) {
            console.log("Hubo un error en la consulta", error.message);
            return res.status(404).send("Hubo un error en la consulta");
        }
        //si no hubo error, se crea el objeto respuesta con las canciones encontradas
        var response = {
            'peliculas': resultado
        };
        //se envía la respuesta
        res.send(JSON.stringify(response));
    });
}

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

//se exportan las funciones creadas
module.exports = {
    getMovies: getMovies,
    buscarCancion: buscarCancion,
};