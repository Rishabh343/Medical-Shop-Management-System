import jwt from "jsonwebtoken";
export const auth = (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({
        message: "No token found",
      });
    }
    const decorded = jwt.verify(token, process.env.JWT_SECRET || "secretkey");
    req.user = decorded;
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid token",
    });
  }
};
