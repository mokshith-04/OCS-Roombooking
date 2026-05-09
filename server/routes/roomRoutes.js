const express = require("express");
const { searchRooms, getBlocks, getAllRooms } = require("../controllers/roomController");
const { authenticate } = require("../middleware/auth");

const router = express.Router();

// POST /api/rooms/search (protected)
router.post("/search", authenticate, searchRooms);

// GET /api/rooms/blocks (protected)
router.get("/blocks", authenticate, getBlocks);

// GET /api/rooms (protected)
router.get("/", authenticate, getAllRooms);

module.exports = router;
