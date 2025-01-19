import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
const jwtSecret = "secret";

export const auth = (req:Request, res:Response, next:NextFunction) => {
  try {
    const token = req.headers["authorization"] ?? "";
    const decodedToken = jwt.verify(token, jwtSecret);
    if (decodedToken.id) {
      req.userId = decodedToken.id;
      next();
    } else {
      res.status(401).json({
        message: "You are not authenticated!",
      });
    }
  } catch (error) {
    res.status(401).json({ message: "You are not authenticated!" });
  }
};

declare global {
  namespace Express {
    interface Request {
      userId: string
    }
  }
}
