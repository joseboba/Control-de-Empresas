'use strict';

var express = require('express');
var enterpriseController = require('../controllers/enterprise.controller');
var mdAtuh = require('../middlerwars/authenticated');
var api = express.Router();

api.post('/login', enterpriseController.login);
api.post('/saveEnterprise', enterpriseController.saveEnterprise);
api.put('/editEnterprise/:id',mdAtuh.ensureAuth, enterpriseController.updateEnterprise);
api.delete('/removeEnterprise/:id', mdAtuh.ensureAuth,enterpriseController.removeEnterprise);
api.get('/count/:id', mdAtuh.ensureAuth,enterpriseController.count); 
api.post('/setProduct/:idE/:idS', mdAtuh.ensureAuth, enterpriseController.setProduct);
api.get('/getProduct/:idE', mdAtuh.ensureAuth, enterpriseController.getProduct);
api.post('/valueOnStore/:idE',mdAtuh.ensureAuth, enterpriseController.valueOnStore);
module.exports = api;


