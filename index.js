'use strict';

var mongoose = require('mongoose');
var app = require('./app');
var port = 3800;

mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost:27017/controlEmpresas', {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false})
    .then(() =>{
        console.log('Succes');
        app.listen(port, ()=>{
            console.log('El servidor está corriendo en el puerto', port);
        });
    })
    .catch((err) =>{
        console.log('Error al conectarse',err);
    });