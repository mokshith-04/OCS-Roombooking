const bcrypt = require("bcrypt");
const prisma = require("../config/db");

// POST /api/admin/create-member
const createMember = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email, and password are required.",
      });
    }

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (existingUser) {
      return res.status(409).json({ message: "A user with this email already exists." });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create member
    const member = await prisma.user.create({
      data: {
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        role: "MEMBER",
      },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    });

    res.status(201).json({
      message: "Member account created successfully.",
      user: member,
    });
  } catch (error) {
    console.error("Create member error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

// GET /api/admin/users
const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true, createdAt: true },
      orderBy: { createdAt: "desc" },
    });

    res.json({ users });
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

// DELETE /api/admin/users/:id
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (user.role === "ADMIN") {
      return res.status(400).json({ message: "Cannot delete admin accounts." });
    }

    // Delete user's bookings first, then the user
    await prisma.booking.deleteMany({ where: { userId: parseInt(id) } });
    await prisma.user.delete({ where: { id: parseInt(id) } });

    res.json({ message: "User deleted successfully." });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

module.exports = { createMember, getAllUsers, deleteUser };
