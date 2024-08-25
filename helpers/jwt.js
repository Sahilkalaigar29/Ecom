const jwt = require('jsonwebtoken');

exports.generateJwtToken = async (id) => {
    try{
        return jwt.sign({id}, process.env.JWT_KEY, { expiresIn: '1y' });
    }catch (error) {
        return error;
    }
}