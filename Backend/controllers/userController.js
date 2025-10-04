import prisma from "../DB/db.config.js";

export const createUser = async (req,res)=>{
    const {name, email, password} = req.body;
      if (!name || !email || !password) {
        return res.status(400).json({ error: "Missing required fields" });
  }
    try{
        const newUser = await prisma.user.create({
            data:{
                name,
                email,
                password
            }
        })
        res.status(201).json(newUser)
}catch(err){
    console.error(err);
    res.status(500).json({ error: "Failed to add user" });
}
}

export const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch users" });
  }
};


