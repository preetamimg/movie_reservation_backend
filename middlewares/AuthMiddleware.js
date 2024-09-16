const jwt = require("jsonwebtoken") 

const secret = process.env.TOKEN_SECRET_KEY;

exports.authMiddleware = async (req, res, next) => {
  try {
    const token = req?.headers?.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }
    // if (token) {
      jwt.verify(token, secret, (error, decode) => {
        if (error) {
          return res.status(401).json({ error: "Invalid token" });
        }
        req.auth = decode;
        next();
      });
    // }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

