// backend/middleware/authMiddleware.js
// it authorizes user 
const jwt = require("jsonwebtoken");

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      
      // Decodes token using the same secret key
      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      
      req.user = decoded; // Attaches { email, id } to req.user
      return next();
    } catch (error) {
      return res.status(401).json({ message: "Not authorized, token invalid or expired" });
    }
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token provided" });
  }
};

module.exports = { protect };