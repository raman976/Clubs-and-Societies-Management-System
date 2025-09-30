import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const getAllClubs = async (req, res) => {
  try {
    const clubs = await prisma.club.findMany();
    res.json(clubs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch clubs" });
  }
};

export const addClub = async (req, res) => {
  const { name, description, membersCount } = req.body;
  try {
    const newClub = await prisma.club.create({
      data: {
        name,
        description,
        membersCount: membersCount || 0,
      },
    });
    res.status(201).json(newClub);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add club" });
  }
};
