'use strict';

var express = require('express');
var bodyParser = require('body-parser');

//IMPORTACION DE RUTAS
var enterpriseRoutes = require('./routes/enterprise.route');
var employeeRoutes =  require('./routes/employee.route');
var storeRoutes = require('./routes/store.route');
var productRoutes = require('./routes/product.route');

var app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//CONFIGURACION DE CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

app.use('/enterprise', enterpriseRoutes);
app.use('/employee', employeeRoutes);
app.use('/store', storeRoutes);
app.use('/product', productRoutes);
module.exports = app;