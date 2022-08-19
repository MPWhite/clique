import jwt from "jsonwebtoken";

const config = process.env;

export const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(403).send("Authorization token missing");
  }
  try {
    req.userId = jwt.verify(token, "REPLACE_ME");
  } catch (err) {
    return res.status(401).send("Invalid token");
  }
  return next();
};
