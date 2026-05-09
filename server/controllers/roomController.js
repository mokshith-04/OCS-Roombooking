const prisma = require("../config/db");

// POST /api/rooms/search
const searchRooms = async (req, res) => {
  try {
    const { date, startTime, endTime, purpose, capacity, blockId } = req.body;

    // Validate required fields
    if (!date || !startTime || !endTime || !purpose || !capacity) {
      return res.status(400).json({
        message: "Date, start time, end time, purpose, and capacity are required.",
      });
    }

    // Validate purpose
    const validPurposes = ["OA", "INTERVIEW", "PPT"];
    if (!validPurposes.includes(purpose)) {
      return res.status(400).json({
        message: "Purpose must be one of: OA, INTERVIEW, PPT",
      });
    }

    // Validate time range
    if (startTime >= endTime) {
      return res.status(400).json({
        message: "End time must be after start time.",
      });
    }

    // Build room filter
    const roomFilter = {
      capacity: { gte: parseInt(capacity) },
      availabilityStatus: true,
    };

    // Filter by block only if selected
    if (blockId) {
      roomFilter.blockId = parseInt(blockId);
    }

    // Find rooms that match capacity and block criteria
    const rooms = await prisma.room.findMany({
      where: roomFilter,
      include: {
        block: true,
        bookings: {
          where: {
            date: new Date(date),
            status: "CONFIRMED",
          },
        },
      },
      orderBy: [{ blockId: "asc" }, { roomName: "asc" }],
    });

    // Instead of filtering out overlapping rooms, we check their status
    const result = rooms.map((room) => {
      const hasOverlap = room.bookings.some((booking) => {
        // No overlap if: existing ends before/at requested start OR existing starts after/at requested end
        const noOverlap =
          booking.endTime <= startTime || booking.startTime >= endTime;
        return !noOverlap; // returns true if there IS an overlap
      });

      return {
        id: room.id,
        roomName: room.roomName,
        capacity: room.capacity,
        availabilityStatus: room.availabilityStatus,
        isAvailableForBooking: !hasOverlap,
        block: {
          id: room.block.id,
          blockName: room.block.blockName,
        },
      };
    });

    res.json({
      message: `${result.length} room(s) found`,
      rooms: result,
      searchCriteria: { date, startTime, endTime, purpose, capacity, blockId },
    });
  } catch (error) {
    console.error("Search rooms error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

// GET /api/rooms/blocks - Get all blocks
const getBlocks = async (req, res) => {
  try {
    const blocks = await prisma.block.findMany({
      orderBy: { blockName: "asc" },
    });
    res.json({ blocks });
  } catch (error) {
    console.error("Get blocks error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

// GET /api/rooms - Get all rooms
const getAllRooms = async (req, res) => {
  try {
    const rooms = await prisma.room.findMany({
      include: { block: true },
      orderBy: [{ blockId: "asc" }, { roomName: "asc" }],
    });
    res.json({ rooms });
  } catch (error) {
    console.error("Get rooms error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

module.exports = { searchRooms, getBlocks, getAllRooms };
