const { verify } = require('../helpers/jwt-helper.js');

exports.isAuth = (req, res, next) => {
    try {
        let token = req.headers.token || req.body.token || req.query.token ;
        if (!token) {
			return next(new Error('AUTHENTICATION_FAILED'));
        }
        const verifiedData = this.verifyData(token);
        if (!verifiedData) {
            return next(new Error('JWT_INVALID_FORMAT'));
        } 
        req.user = verifiedData;
        return next();
    } catch(err) {
        return next(err);
    }
}

exports.verifyData = (token) => {
    const [ prefixToken, accessToken ] = token.split(' ');
    if (prefixToken !== 'Bearer') {
        return null;
    }
    token = accessToken;
    const verifiedData = verify(token);
    return verifiedData;
}