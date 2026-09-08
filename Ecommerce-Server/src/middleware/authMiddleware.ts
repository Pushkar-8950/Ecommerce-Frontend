import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';

export interface JwtPayload {
  id: string;
  role: string;
  iat?: number;
  exp?: number;
}

export type AuthRequest = Request;

// Extend Express Request type globally so req.user is recognized anywhere in Express handlers
declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

/**
 * Middleware to protect routes: verifies incoming JWT Bearer token
 * and attaches authenticated user document to req.user.
 */
export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  let token: string | undefined;

  const authHeader = req.headers.authorization;

  // Check for 'Bearer <token>' format
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  }

  if (!token) {
    res.status(401).json({
      success: false,
      message: 'Not authorized: No Bearer token provided in Authorization header.',
    });
    return;
  }

  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      res.status(500).json({
        success: false,
        message: 'Server error: JWT_SECRET is not configured.',
      });
      return;
    }

    // Verify token validity and expiration
    const decoded = jwt.verify(token, secret) as JwtPayload;

    // Retrieve user by ID from MongoDB, excluding the password field
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      res.status(401).json({
        success: false,
        message: 'Not authorized: User belonging to this token no longer exists.',
      });
      return;
    }

    req.user = user;
    next();
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      res.status(401).json({
        success: false,
        message: 'Not authorized: Token has expired. Please log in again.',
      });
      return;
    }

    res.status(401).json({
      success: false,
      message: 'Not authorized: Invalid token provided.',
    });
    return;
  }
};

/**
 * Optional Role-based authorization middleware.
 * Example: authorize('artisan', 'admin')
 */
export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: `Forbidden: Role '${req.user?.role || 'unauthenticated'}' is not authorized to access this route.`,
      });
      return;
    }
    next();
  };
};
