import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-super-secret-jwt-key";
const JWT_EXPIRE = (process.env.JWT_EXPIRE || "7d") as SignOptions["expiresIn"];

export const signToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRE,
  });
};

export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error("Invalid or expired token");
  }
};

export const generateTokens = (user: {
  _id: any;
  username: any;
  role: any;
}) => {
  const payload = {
    userId: user._id,
    username: user.username,
    role: user.role,
  };

  const accessToken = signToken(payload);

  return {
    accessToken,
    user: {
      id: user._id,
      username: user.username,
      role: user.role,
    },
  };
};
export const authenticateUser = (req: any, res: any, next: any) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};          