'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var enterpirseSchema = Schema({
    name: String,
    email: String,
    user: String,
    password: String,
    CEO: String,
    socialMedia: [],
    phones: [],
    role: String,
    direction: String,
    socialApproach: String,
    products:[{type: Schema.Types.ObjectId, ref: 'product'}],      
    employees: [{ type: Schema.Types.ObjectId, ref: 'employee'}],
    stores: [{type: Schema.Types.ObjectId, ref: 'store'}]
});

module.exports = mongoose.model('enterprise', enterpirseSchema);