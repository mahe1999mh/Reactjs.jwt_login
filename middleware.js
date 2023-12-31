const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  try {
    let token = req.header("Token");
    if (!token) {
      return res.status(400).send("Token not found");
    }
    let decode = jwt.verify(token, "JWTKEY");
    req.user = decode.user;
    next();
  } catch (error) {
    console.log(error);
    return res.status(500).send("server error 2");
  }
};
