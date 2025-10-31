import jwt from "jsonwebtoken";
import prisma from "../DB/db.config.js";

export const authenticate = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer "))
    return res.status(401).json({ error: "No token" });
  const token = header.split(" ")[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = {
      id: Number(payload.sub),
      club_id: Number(payload.club_id),
      role: payload.role,
    };
    return next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

export const requireRole =
  (...allowedRoles) =>
  (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: "Not authenticated" });
    if (!allowedRoles.includes(req.user.role))
      return res.status(403).json({ error: "Forbidden" });
    next();
  };


export const ensureSameClubParam =
  (paramName = "id", resourceTable = null) =>
  async (req, res, next) => {

    if (req.user?.role === "SUPER_ADMIN") return next();
    const id = parseInt(req.params[paramName]);
    if (!id) return res.status(400).json({ error: "Invalid id param" });
    if (!resourceTable)
      return res.status(500).json({ error: "Server misconfigured" });
    try {
      const resource = await prisma[resourceTable].findUnique({
        where: { id },
      });
      if (!resource)
        return res.status(404).json({ error: "Resource not found" });
      if (resource.club_id !== req.user.club_id)
        return res.status(403).json({ error: "Forbidden" });
      next();
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Server error" });
    }
  };
