'use strict';

var express = require('express');
var productController = require('../controllers/product.controller');
var mdAuth = require('../middlerwars/authenticated');

var api = express.Router();

api.post('/saveProduct/:idE', mdAuth.ensureAuth, productController.saveProduct);
api.delete('/delete/:id/:idS/:idE', mdAuth.ensureAuth, productController.removeProduct);
api.put('/updated/:idE/:id', mdAuth.ensureAuth, productController.updateProduct);
module.exports = api;