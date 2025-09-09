import { jwtConfig } from "../../config/env";
import jwt, { JwtPayload, Secret ,SignOptions, } from "jsonwebtoken";

const JWT_SECRET = jwtConfig.jwtSecret as Secret;
const JWT_EXPIRES_IN = jwtConfig.jwtExpiresIn as SignOptions["expiresIn"] || "2d";

export class JWTService {
  static generateToken(payload: object, expiresIn: SignOptions["expiresIn"] = JWT_EXPIRES_IN): string {
    try {
      const options: SignOptions = { expiresIn };
      return jwt.sign(payload, JWT_SECRET, options);
    } catch (error) {
      throw new Error("Access token generation failed.");
    }
  }

  static verifyToken(token: string): JwtPayload {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      if (typeof decoded === "string") {
        throw new Error("Invalid token format.");
      }
      return decoded;
    } catch (error) {
      throw new Error("Token verification failed.");
    }
  }
}
