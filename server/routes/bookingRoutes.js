const express = require("express");
const {
  createBooking,
  getMyBookings,
  cancelBooking,
  getAllBookings,
} = require("../controllers/bookingController");
const { authenticate, authorize } = require("../middleware/auth");

const router = express.Router();

// POST /api/bookings/create (protected)
router.post("/create", authenticate, createBooking);

// GET /api/bookings/my-bookings (protected)
router.get("/my-bookings", authenticate, getMyBookings);

// PUT /api/bookings/:id/cancel (protected)
router.put("/:id/cancel", authenticate, cancelBooking);

// GET /api/bookings/all (admin only)
router.get("/all", authenticate, authorize("ADMIN"), getAllBookings);

module.exports = router;
