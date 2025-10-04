import prisma from "../DB/db.config.js";

export const addImage = async (req,res)=>{
    const {id, name, email, password} = req.body;
    try{
        const newImage = await prisma.user.create({
            data:{
                url,
                text,
                club_id,
                club
            }
        })
        res.status(201).json(newImage)
}catch(err){
    console.error(err);
    res.status(500).json({ error: "Failed to add image" });
}
}

export const getGallery = async (req, res) => {
  try {
    const gallery = await prisma.user.findMany();
    res.json(gallery);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch gallery" });
  }
};


