import prisma from "../DB/db.config.js";

export const getAllEvents = async (req, res) => {
  try {
    // public: return all events
    const events = await prisma.events.findMany();
    res.status(200).json(events);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch events" });
  }
};

export const getEventById = async (req, res) => {
  const { id } = req.params;
  try {
    const event = await prisma.events.findUnique({
      where: { id: parseInt(id) },
    });
    if (!event) return res.status(404).json({ error: "Event not found" });
    res.status(200).json(event);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch event" });
  }
};

export const createEvent = async (req, res) => {
  const { name, description, venue, start_time, end_time, poc, club_id } =
    req.body;

  try {
    // Only SUPER_ADMIN can create events for other clubs
    const targetClubId =
      req.user.role === "SUPER_ADMIN" && club_id
        ? parseInt(club_id)
        : req.user.club_id;
    const newEvent = await prisma.events.create({
      data: {
        name,
        description,
        venue,
        start_time: new Date(start_time),
        end_time: new Date(end_time),
        poc,
        club_id: targetClubId,
      },
    });
    res.status(201).json(newEvent);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Failed to create event" });
  }
};

export const updateEvent = async (req, res) => {
  const { id } = req.params;
  const { start_time, end_time, ...otherData } = req.body;

  const data = { ...otherData };
  if (start_time) {
    data.start_time = new Date(start_time);
  }
  if (end_time) {
    data.end_time = new Date(end_time);
  }

  try {
    // enforce club ownership unless SUPER_ADMIN
    if (req.user.role !== "SUPER_ADMIN") {
      const result = await prisma.events.updateMany({
        where: { id: parseInt(id), club_id: req.user.club_id },
        data,
      });
      if (result.count === 0)
        return res.status(404).json({ error: "Not found or not permitted" });
      const updatedEvent = await prisma.events.findUnique({
        where: { id: parseInt(id) },
      });
      return res.status(200).json(updatedEvent);
    }
    const updatedEvent = await prisma.events.update({
      where: { id: parseInt(id) },
      data,
    });
    res.status(200).json(updatedEvent);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Failed to update event" });
  }
};

export const deleteEvent = async (req, res) => {
  const { id } = req.params;
  try {
    if (req.user.role === "SUPER_ADMIN") {
      await prisma.events.delete({ where: { id: parseInt(id) } });
      return res.status(204).send();
    }
    const result = await prisma.events.deleteMany({
      where: { id: parseInt(id), club_id: req.user.club_id },
    });
    if (result.count === 0)
      return res.status(404).json({ error: "Not found or not permitted" });
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete event" });
  }
};
