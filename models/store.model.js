'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var storeSchemma = Schema({
    mall: String,
    direction: String,
    phone: String,
    manager: String,
    email: String,
    product:[{
        products:{type: Schema.Types.ObjectId, ref: 'product'},
        quantity: Number    
    }]
});

module.exports = mongoose.model('store', storeSchemma);