import prisma from "../DB/db.config.js";

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

  const { club_name, description, logo_image, type } = req.body; 


  const { membersCount } = req.body; 


  if (!club_name || !description || !logo_image || !type) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const newClub = await prisma.club.create({
      data: {
        club_name,
        description,
        membersCount: membersCount || 0, 
        logo_image,
        type,
      },
    });
    res.status(201).json(newClub);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add club" });
  }
};