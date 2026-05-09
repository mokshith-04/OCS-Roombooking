const express = require("express");
const { createMember, getAllUsers, deleteUser } = require("../controllers/adminController");
const { authenticate, authorize } = require("../middleware/auth");

const router = express.Router();

// All admin routes require ADMIN role
router.use(authenticate, authorize("ADMIN"));

// POST /api/admin/create-member
router.post("/create-member", createMember);

// GET /api/admin/users
router.get("/users", getAllUsers);

// DELETE /api/admin/users/:id
router.delete("/users/:id", deleteUser);

module.exports = router;
