const prisma = require("../config/db");

// POST /api/bookings/create
const createBooking = async (req, res) => {
  try {
    const { roomId, date, startTime, endTime, purpose, participants } = req.body;
    const userId = req.user.id;

    // Validate required fields
    if (!roomId || !date || !startTime || !endTime || !purpose) {
      return res.status(400).json({
        message: "Room ID, date, start time, end time, and purpose are required.",
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

    // Check if room exists and is available
    const room = await prisma.room.findUnique({
      where: { id: parseInt(roomId) },
    });

    if (!room) {
      return res.status(404).json({ message: "Room not found." });
    }

    if (!room.availabilityStatus) {
      return res.status(400).json({ message: "Room is currently unavailable." });
    }

    // Check for overlapping bookings
    const existingBookings = await prisma.booking.findMany({
      where: {
        roomId: parseInt(roomId),
        date: new Date(date),
        status: "CONFIRMED",
      },
    });

    const hasOverlap = existingBookings.some((booking) => {
      const noOverlap =
        booking.endTime <= startTime || booking.startTime >= endTime;
      return !noOverlap;
    });

    if (hasOverlap) {
      return res.status(409).json({
        message: "Room is already booked for the selected time slot.",
      });
    }

    // Create booking
    const booking = await prisma.booking.create({
      data: {
        userId,
        roomId: parseInt(roomId),
        date: new Date(date),
        startTime,
        endTime,
        purpose,
        participants: parseInt(participants) || 1,
        status: "CONFIRMED",
      },
      include: {
        room: {
          include: { block: true },
        },
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    res.status(201).json({
      message: "Room booked successfully!",
      booking,
    });
  } catch (error) {
    console.error("Create booking error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

// GET /api/bookings/my-bookings
const getMyBookings = async (req, res) => {
  try {
    const userId = req.user.id;

    const bookings = await prisma.booking.findMany({
      where: { userId },
      include: {
        room: {
          include: { block: true },
        },
      },
      orderBy: [{ date: "desc" }, { startTime: "desc" }],
    });

    res.json({ bookings });
  } catch (error) {
    console.error("Get my bookings error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

// PUT /api/bookings/:id/cancel
const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const booking = await prisma.booking.findUnique({
      where: { id: parseInt(id) },
    });

    if (!booking) {
      return res.status(404).json({ message: "Booking not found." });
    }

    // Only booking owner or admin can cancel
    if (booking.userId !== userId && req.user.role !== "ADMIN") {
      return res.status(403).json({ message: "Not authorized to cancel this booking." });
    }

    const updatedBooking = await prisma.booking.update({
      where: { id: parseInt(id) },
      data: { status: "CANCELLED" },
      include: {
        room: { include: { block: true } },
      },
    });

    res.json({ message: "Booking cancelled successfully.", booking: updatedBooking });
  } catch (error) {
    console.error("Cancel booking error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

// GET /api/bookings/all (admin only)
const getAllBookings = async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      include: {
        room: { include: { block: true } },
        user: { select: { id: true, name: true, email: true } },
      },
      orderBy: [{ date: "desc" }, { startTime: "desc" }],
    });

    res.json({ bookings });
  } catch (error) {
    console.error("Get all bookings error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

module.exports = { createBooking, getMyBookings, cancelBooking, getAllBookings };
