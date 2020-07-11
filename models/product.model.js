'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var prodcutSchema = Schema({
    name: String,
    description: String,
    price: String,
    provider: String,
    stock: Number,
    store: [{type: Schema.Types.ObjectId, ref: 'store'}]
});

module.exports = mongoose.model('product', prodcutSchema)