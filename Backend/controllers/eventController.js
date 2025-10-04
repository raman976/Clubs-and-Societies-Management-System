import prisma from "../DB/db.config"

export const getAllEvents = async (req, res) => {
    try{
        const events = await prisma.events.findMany()
        res.status(200).json(events)
    }catch(error){
        console.log(error)
        res.status(500).json({error:"Failed to fetch events"})
    }
};

export const getEventById = async (req, res) => {
    const {id} = req.params
    try{
        const event = await prisma.events.findUnique({
            where : {id: parseInt(id)}
        })
        if (!event){
            return res.status(404).json({ error: "Event not found" })
        }
        res.status(200).json(event)
    }catch(error){
        console.error(error);
        res.status(500).json({ error: "Failed to fetch event" });
    }
};

export const createEvent = async (req, res) => {
    const { name, description, venue, start_time, end_time, poc, club_id } = req.body

    try {
        const newEvent = await prisma.events.create({
        data: {
            name,
            description,
            venue,
            start_time: new Date(start_time),
            end_time: new Date(end_time),
            poc,
            club_id,
        }
        })
        res.status(201).json(newEvent)
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: "Failed to create event" })
    }
};

export const updateEvent = async (req, res) => {
    const { id } = req.params
    const { start_time, end_time, ...otherData } = req.body

    const data = { ...otherData }
    if (start_time) {
        data.start_time = new Date(start_time)
    }
    if (end_time) {
        data.end_time = new Date(end_time)
    }

    try {
        const updatedEvent = await prisma.events.update({
        where: { id: parseInt(id) },
        data,
        })
        res.status(200).json(updatedEvent)
    } catch (error) {
        console.error(error)
        res.status(400).json({ error: "Failed to update event" })
    }
};

export const deleteEvent = async (req, res) => {
    const { id } = req.params
    try {
      await prisma.events.delete({
        where: { id: parseInt(id) },
      })
      res.status(204).send()
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: "Failed to delete event" })
    }
};