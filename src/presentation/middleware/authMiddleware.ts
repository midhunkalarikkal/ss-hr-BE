import { DecodedUser } from "../../express";
import { NextFunction, Request, Response } from "express";
import { JWTService } from "../../infrastructure/security/jwt";

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {

  console.log("req.cookies["token"] : ",req.cookies["token"]);
  const token = req.cookies["token"];
  console.log("token : ",token)
  const currentTime = Date.now();

  if (!token) {
    console.log("No token found");
    res.status(401).json({ success: false, message: "Unauthorized, no token." });
    return;
  } 
  
  try {
    const decoded = JWTService.verifyToken(token);
    if (decoded && decoded.exp && currentTime > decoded.exp * 1000) {
      console.log("Token decoded and unauthorized");
      res.status(401).json({ success: false, message: "Unauthorized: Token expired." });
      return;
    }
    
    req.user = decoded as DecodedUser;
    next();
  } catch (error) {
    console.log("middleware error");
    res.status(401).json({ success: false, message: "Unauthorized: Invalid token." });
  }
};
