import jwt from "jsonwebtoken";

export const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Ensure Authorization header exists and starts with "Bearer"
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  const token = authHeader.split(" ")[1]; // Extract token part

  try {
    // Verify token using secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach userId from token payload to request object
    req.userId = decoded.userId;

    next(); // Continue to next middleware/route
  } catch (error) {
    // Token invalid or expired
    return res.status(401).json({ message: "Not authorized, token failed" });
  }
};

export default protect;
