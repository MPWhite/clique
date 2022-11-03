import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(403).send("Authorization token missing");
  }
  try {
    const userId = jwt.verify(token, "REPLACE_ME");
    res.locals.userId = userId;
    return next();
  } catch (err) {
    return res.status(401).send("Invalid token");
  }
};
