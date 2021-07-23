const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    const authHeaders = req.headers.authorization;

    if (!authHeaders) {
        return res.status(401).send({ 'erro': 'No token' })
    }

    const parts = authHeaders.split(' ')

    if (!parts.length === 2){
        return res.status(401).send({ 'erro': 'Token error' })
    }
    
    jwt.verify(parts[1], "tokensecretosuper", (erro, decoded) => {
        if (erro) {
            res.status(401).send({ 'erro': 'Token inválido' })
        }

        req.userId = decoded.id
        return next();
    })
}