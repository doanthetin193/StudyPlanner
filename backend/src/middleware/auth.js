import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Middleware bảo vệ route
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Lấy token từ header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Lấy thông tin user từ token
      req.user = await User.findById(decoded.id).select('-password');

      next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({ message: 'Không có quyền truy cập, token không hợp lệ' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Không có quyền truy cập, không có token' });
  }
};

export { protect };
