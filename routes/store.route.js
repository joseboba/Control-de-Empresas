'use strict';

var express = require('express');
var storeController = require('../controllers/store.controller');
var mdAuth = require('../middlerwars/authenticated');

var api = express.Router();

api.post('/saveStore/:id', mdAuth.ensureAuth, storeController.saveStore);
api.put('/updateStore/:id/:idE', mdAuth.ensureAuth, storeController.updateStore);
api.delete('/removeStore/:id/:idE', mdAuth.ensureAuth, storeController.removeStore);
api.post('/searchStores/:idE', mdAuth.ensureAuth, storeController.searchStores);
api.get('/getStores/:idE', mdAuth.ensureAuth, storeController.getStores)

module.exports = api;

