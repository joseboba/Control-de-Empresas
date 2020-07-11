'use strict';

var jwt = require('jwt-simple');
var moment = require('moment');
var key = 'clave';

exports.createToken = (enterprise) =>{
    var payload = {
        sub: enterprise._id,
        name: enterprise.name,
        email: enterprise.email,
        user: enterprise._id,
        CEO: enterprise.CEO,
        socialMedia: enterprise.socialMedia,
        phones: enterprise.phones,
        direction: enterprise.direction,
        socialApproach: enterprise.socialApproach,
        iat: moment().unix(),
        exp: moment().add(1, "day").unix()
    }
    return jwt.encode(payload, key);
}
