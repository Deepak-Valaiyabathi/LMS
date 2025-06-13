
import jwt from 'jsonwebtoken';

export const authMiddleware = (request, h) => {
  const token = request.headers.authorization?.split(' ')[1];
  const SECRET = "npc";

  try {
    const decoded = jwt.verify(token, SECRET);
    request.auth = { isAuthenticated: true, credentials: decoded };
    return h.continue;
  } catch (err) {
    if (!request.path.includes('/api/login')) {
      return h.redirect('/api/login').takeover();
    }
    return h.continue;
  }
};
