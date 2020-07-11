'use strict';

var express = require('express');
var employeeController = require('../controllers/employee.controller');
var mdAtuh = require('../middlerwars/authenticated');
var api = express.Router();

api.post('/saveEmployee/:id',mdAtuh.ensureAuth, employeeController.saveEmployee);
api.put('/editEmployee/:idE/:id',mdAtuh.ensureAuth ,employeeController.updateEmployee);
api.delete('/removeEmployee/:id/:idE', mdAtuh.ensureAuth,employeeController.removeEmployee);
api.get('/searchEmployees/:idE', mdAtuh.ensureAuth,employeeController.searchEmployee);
api.get('/getEmployees/:idE', mdAtuh.ensureAuth,employeeController.getEmployees);  

module.exports = api;
