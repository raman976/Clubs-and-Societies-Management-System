import prisma from "../DB/db.config.js"

export const getAllCoreMembers = async (req, res) => {
    try {
        const members = await prisma.coreMember.findMany()
        res.status(200).json(members)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Failed to fetch core members" })
    }
};

export const getCoreMemberById = async (req, res) => {
    const { id } = req.params
    try {
        const member = await prisma.coreMember.findUnique({
        where: { id: parseInt(id) },
        })
        if (!member) {
        return res.status(404).json({ error: "Core member not found" })
        }
        res.status(200).json(member)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Failed to fetch core member" })
    }
};

export const createCoreMember = async (req, res) => {
    const { name, email, phone, role, password, club_id } = req.body;
    if (!name || !email || !phone || !role || !password || !club_id) {
        return res.status(400).json({ error: "Missing required fields" })
    }

    try {
        const newMember = await prisma.coreMember.create({
        data: {
            name,
            email,
            phone,
            role,
            password,
            club_id: parseInt(club_id),
        }
        })
        res.status(201).json(newMember)
    } catch (error) {
        console.error(error)
        if (error.code === 'P2002' && error.meta.target.includes('email')) {
        return res.status(409).json({ error: "Email already exists" })
        }
        res.status(500).json({ error: "Failed to create core member" })
    }
};

export const updateCoreMember = async (req, res) => {
    const { id } = req.params;
    try {
        const updatedMember = await prisma.coreMember.update({
        where: { id: parseInt(id) },
        data: req.body
        })
        res.status(200).json(updatedMember)
    } catch (error) {
        console.error(error)
        res.status(400).json({ error: "Failed to update core member" })
    }
};

export const deleteCoreMember = async (req, res) => {
    const { id } = req.params
    try {
        await prisma.coreMember.delete({
        where: { id: parseInt(id) },
        })
        res.status(204).send()
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Failed to delete core member" })
    }
};