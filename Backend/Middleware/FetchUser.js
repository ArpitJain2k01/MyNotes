const jwt = require("jsonwebtoken");
const JWT_SECURE_KEY = "arpitjain2k01";

function fetchUser(req, res, next) {
  try {
    //get the user from jwt token and add id to the req body
    const token = req.header("jwt-token");

    if (!token) {
      res.status(401).send({ error: "Authenticate using a valid token" });
    }

    const data = jwt.verify(token, JWT_SECURE_KEY);
    req.user = data.user;
    next();
  } catch (error) {
    res.status(401).send({ error: "Authenticate using a valid token" });
  }
}

module.exports = fetchUser;
