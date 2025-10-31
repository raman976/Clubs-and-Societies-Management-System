import prisma from "../DB/db.config.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { randomBytes } from "crypto";

const ACCESS_EXPIRES = "15m";

export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: "Missing credentials" });
  try {
    const user = await prisma.coreMember.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ error: "Invalid credentials" });

    const accessToken = jwt.sign(
      { sub: String(user.id), club_id: user.club_id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: ACCESS_EXPIRES }
    );

    const refreshToken = randomBytes(48).toString("hex");
    const refreshHash = await bcrypt.hash(refreshToken, 10);
    await prisma.coreMember.update({
      where: { id: user.id },
      data: { refreshTokenHash: refreshHash },
    });

    // set httpOnly cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    return res.json({ accessToken });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
};

export const refresh = async (req, res) => {
  try {
    const token = req.cookies?.refreshToken;
    if (!token) return res.status(401).json({ error: "No refresh token" });
    // find user with non-null refreshTokenHash (we can't search by hash), so fetch by id stored in cookie in prod; for now iterate - better to store separate table
    // We'll fetch by matching hashes (inefficient) — acceptable for small scale. In production, store tokenId.
    const users = await prisma.coreMember.findMany({
      where: { refreshTokenHash: { not: null } },
    });
    for (const user of users) {
      const ok = await bcrypt.compare(token, user.refreshTokenHash);
      if (ok) {
        // rotate
        const newRefresh = randomBytes(48).toString("hex");
        const newHash = await bcrypt.hash(newRefresh, 10);
        await prisma.coreMember.update({
          where: { id: user.id },
          data: { refreshTokenHash: newHash },
        });
        const accessToken = jwt.sign(
          { sub: String(user.id), club_id: user.club_id, role: user.role },
          process.env.JWT_SECRET,
          { expiresIn: ACCESS_EXPIRES }
        );
        res.cookie("refreshToken", newRefresh, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
        });
        return res.json({ accessToken });
      }
    }
    return res.status(401).json({ error: "Invalid refresh token" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
};

export const logout = async (req, res) => {
  try {
    const token = req.cookies?.refreshToken;
    if (token) {
      const users = await prisma.coreMember.findMany({
        where: { refreshTokenHash: { not: null } },
      });
      for (const user of users) {
        const ok = await bcrypt.compare(token, user.refreshTokenHash);
        if (ok) {
          await prisma.coreMember.update({
            where: { id: user.id },
            data: { refreshTokenHash: null },
          });
          break;
        }
      }
    }
    res.clearCookie("refreshToken");
    return res.json({ message: "Logged out" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
};
