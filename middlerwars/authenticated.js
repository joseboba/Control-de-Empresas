'use strict';

var jwt = require('jwt-simple');
var moment = require('moment');
var key = 'clave';
exports.ensureAuth = (req,res, next) =>{
    if(!req.headers.authorization){
        return res.status(403).send({message: 'Petición sin autenticación'});
    }else{
        var token = req.headers.authorization.replace(/['"]+/g, '');
        try{
            var payload = jwt.decode(token, key);
            if(payload.exp <= moment().unix()){
                return res.status(401).send({message: 'Token expirado'});
            }
        }catch(err){
            return res.status(404).send('Token invalido', err);
        }
        req.enterprise = payload;
        next();
    }
}