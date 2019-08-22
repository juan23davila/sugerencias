//paquetes necesarios para el proyecto
var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var recomendadorController = require('./controladores/recomendadorController');

var app = express();

app.use(cors());

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

//Obtiene todas las peliculas sin filtro alguno.
app.get('/peliculas', recomendadorController.getMovies);
// Obtiene todos los generos existentes para listarlos.
app.get('/generos', recomendadorController.getGenders);

//seteamos el puerto en el cual va a escuchar los pedidos la aplicación
var puerto = '8080';

app.listen(puerto, function () {
  console.log( "Escuchando en el puerto " + puerto );
});

