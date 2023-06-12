var jwt = require("jsonwebtoken");

module.exports = function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null)
    return res.status(401).json({ errors: [{ message: "Unauthorized" }] }); // if there isn't any token

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err)
      return res
        .status(403)
        .json({ errors: [{ message: "Invalid or expired token" }] });
    req.user = user;
    next(); // pass the execution off to whatever request the client intended
  });
};
