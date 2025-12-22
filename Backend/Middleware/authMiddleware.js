import jwt from 'jsonwebtoken';

const JWT_SECRET = "SUPER_SECRET_KEY_CHANGE_THIS";

export const verifyToken = (req, res, next) => {
  const header = req.headers.authorization;

  if (!header)
    return res.status(401).json({ message: "No token provided" });

  const token = header.split(" ")[1];

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err)
      return res.status(403).json({ message: "Invalid token" });

    req.user = decoded;
    next();
  });
};
export function authenticate(req, res, next) {
  // Read token from Authorization header
  const authHeader = req.headers.authorization; // "Bearer <token>"
  if (!authHeader) return res.status(401).json({ message: 'Formateur non authentifié' });

  const token = authHeader.split(' ')[1]; // get the second part after "Bearer"
  if (!token) return res.status(401).json({ message: 'Formateur non authentifié' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id_user }; // make sure the field matches your token payload
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token invalide' });
  }
}
