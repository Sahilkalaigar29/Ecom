const jwt = require("jsonwebtoken");
const { User } = require("../models");

isValidToken = async (req, res, next) => {
  //check if authentication header exists
  if(req.headers.authorization)
  {
      const token = req.headers.authorization.split(" ")[1]; //get the token
      try
      {
        await jwt.verify(token, process.env.JWT_KEY);
        const user = await User.findOne({ where: { device_token: token } });
        if(user)
        {
          req.user = user;
          return next();
        }
        else
        {
          return res.status(401).json({
            status: false,
            msg: "Unauthorized! Please login",
          });
        }
      }
      catch(error)
      {
        return res.status(401).json({
          status: false,
          msg: "Unauthorized! Please login",
        });
      }
  }
  else
  {
    return res.status(401).json({
      status: false,
      msg: "Unauthorized! Please login",
    });
  }
};


module.exports = {
  isValidToken
}