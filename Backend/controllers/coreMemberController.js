import prisma from "../DB/db.config.js";
import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

export const getAllCoreMembers = async (req, res) => {
  try {
    // if request is authenticated, limit to same club unless SUPER_ADMIN
    if (req.user && req.user.role === "SUPER_ADMIN") {
      const members = await prisma.coreMember.findMany();
      return res.status(200).json(members);
    }
    if (req.user) {
      const members = await prisma.coreMember.findMany({
        where: { club_id: req.user.club_id },
      });
      return res.status(200).json(members);
    }
    // unauthenticated: do not expose core member list
    return res.status(401).json({ error: "Authentication required" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch core members" });
  }
};

export const getCoreMemberById = async (req, res) => {
  const { id } = req.params;
  try {
    const member = await prisma.coreMember.findUnique({
      where: { id: parseInt(id) },
    });
    if (!member) {
      return res.status(404).json({ error: "Core member not found" });
    }
    res.status(200).json(member);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch core member" });
  }
};

export const createCoreMember = async (req, res) => {
  const { name, email, phone, role, password, club_id } = req.body;
  if (!name || !email || !password || !club_id) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  try {
    // Only SUPER_ADMIN can create members for other clubs
    if (
      req.user.role !== "SUPER_ADMIN" &&
      req.user.club_id !== parseInt(club_id)
    ) {
      return res
        .status(403)
        .json({ error: "Cannot create member for another club" });
    }

    const hashed = await bcrypt.hash(password, SALT_ROUNDS);
    const newMember = await prisma.coreMember.create({
      data: {
        name,
        email,
        phone,
        role: role || "MEMBER",
        password: hashed,
        club_id: parseInt(club_id),
      },
    });
    res.status(201).json(newMember);
  } catch (error) {
    console.error(error);
    if (error.code === "P2002" && error.meta?.target?.includes("email")) {
      return res.status(409).json({ error: "Email already exists" });
    }
    res.status(500).json({ error: "Failed to create core member" });
  }
};

export const updateCoreMember = async (req, res) => {
  const { id } = req.params;
  try {
    // allow only SUPER_ADMIN or members of same club to update
    const where = { id: parseInt(id) };
    // if not super admin, ensure club matches
    if (req.user.role !== "SUPER_ADMIN") {
      // updateMany will return count = 0 if no rows matched (including club mismatch)
      const result = await prisma.coreMember.updateMany({
        where: { id: parseInt(id), club_id: req.user.club_id },
        data: req.body,
      });
      if (result.count === 0)
        return res.status(404).json({ error: "Not found or not permitted" });
      const updatedMember = await prisma.coreMember.findUnique({ where });
      return res.status(200).json(updatedMember);
    }
    const updatedMember = await prisma.coreMember.update({
      where,
      data: req.body,
    });
    res.status(200).json(updatedMember);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Failed to update core member" });
  }
};

export const deleteCoreMember = async (req, res) => {
  const { id } = req.params;
  try {
    if (req.user.role === "SUPER_ADMIN") {
      await prisma.coreMember.delete({ where: { id: parseInt(id) } });
      return res.status(204).send();
    }
    const result = await prisma.coreMember.deleteMany({
      where: { id: parseInt(id), club_id: req.user.club_id },
    });
    if (result.count === 0)
      return res.status(404).json({ error: "Not found or not permitted" });
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete core member" });
  }
};
