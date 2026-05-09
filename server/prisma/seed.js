const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...\n");

  // --- Create Admin User ---
  const adminPassword = await bcrypt.hash("admin123", 10);
  const admin = await prisma.user.upsert({
    where: { email: "admin@roombooking.com" },
    update: {},
    create: {
      name: "System Admin",
      email: "admin@roombooking.com",
      password: adminPassword,
      role: "ADMIN",
    },
  });
  console.log(`✅ Admin created: ${admin.email} (password: admin123)`);

  // --- Create Temporary Check Member ---
  const memberPassword = await bcrypt.hash("temp123", 10);
  const tempUser = await prisma.user.upsert({
    where: { email: "tempuser@roombooking.com" },
    update: {},
    create: {
      name: "Temporary Checker",
      email: "tempuser@roombooking.com",
      password: memberPassword,
      role: "MEMBER",
    },
  });
  console.log(`✅ Temporary Member created: ${tempUser.email} (password: temp123)`);

  // --- Create Blocks ---
  const blockNames = [
    "A Block", "BT/BM Block", "C Block", "CSE Block", "CY Block", 
    "EE Block", "LHC Block", "MA Block", "MSME Block", "PH Block"
  ];
  
  const blockMap = {};
  for (const bName of blockNames) {
    const block = await prisma.block.upsert({
      where: { blockName: bName },
      update: {},
      create: { blockName: bName },
    });
    blockMap[bName] = block.id;
  }
  console.log(`✅ ${blockNames.length} blocks created`);

  // --- Create Rooms ---
  const roomsData = [
    { roomName: "A-Class Room 320", capacity: 80, blockId: blockMap["A Block"] },
    { roomName: "A-AUDITORIUM", capacity: 289, blockId: blockMap["A Block"] },
    { roomName: "A-Class Room 111", capacity: 70, blockId: blockMap["A Block"] },
    { roomName: "A-Class Room 112", capacity: 80, blockId: blockMap["A Block"] },
    { roomName: "A-Class Room 114", capacity: 36, blockId: blockMap["A Block"] },
    { roomName: "A-Class Room 117", capacity: 84, blockId: blockMap["A Block"] },
    { roomName: "A-Class Room 118", capacity: 84, blockId: blockMap["A Block"] },
    { roomName: "A-Class Room 119", capacity: 108, blockId: blockMap["A Block"] },
    { roomName: "A-Class Room 220", capacity: 40, blockId: blockMap["A Block"] },
    { roomName: "A-Class Room 221", capacity: 120, blockId: blockMap["A Block"] },
    { roomName: "A-LH-1", capacity: 184, blockId: blockMap["A Block"] },
    { roomName: "A-LH-2", capacity: 184, blockId: blockMap["A Block"] },
    { roomName: "BT/BM-009", capacity: 24, blockId: blockMap["BT/BM Block"] },
    { roomName: "BT/BM-010", capacity: 24, blockId: blockMap["BT/BM Block"] },
    { roomName: "BT/BM-118", capacity: 60, blockId: blockMap["BT/BM Block"] },
    { roomName: "C-LH-10", capacity: 68, blockId: blockMap["C Block"] },
    { roomName: "C-LH-2", capacity: 138, blockId: blockMap["C Block"] },
    { roomName: "C-LH-3", capacity: 100, blockId: blockMap["C Block"] },
    { roomName: "C-LH-4", capacity: 60, blockId: blockMap["C Block"] },
    { roomName: "C-LH-5", capacity: 60, blockId: blockMap["C Block"] },
    { roomName: "C-LH-6", capacity: 60, blockId: blockMap["C Block"] },
    { roomName: "C-LH-7", capacity: 60, blockId: blockMap["C Block"] },
    { roomName: "C-LH-9", capacity: 66, blockId: blockMap["C Block"] },
    { roomName: "CSE-LH-01", capacity: 70, blockId: blockMap["CSE Block"] },
    { roomName: "CSE-LH-02", capacity: 70, blockId: blockMap["CSE Block"] },
    { roomName: "CSE-LH-03", capacity: 70, blockId: blockMap["CSE Block"] },
    { roomName: "CY-LH-1", capacity: 30, blockId: blockMap["CY Block"] },
    { roomName: "CY-LH-2", capacity: 40, blockId: blockMap["CY Block"] },
    { roomName: "EE-004(GF)", capacity: 40, blockId: blockMap["EE Block"] },
    { roomName: "LHC-01", capacity: 150, blockId: blockMap["LHC Block"] },
    { roomName: "MA-01", capacity: 50, blockId: blockMap["MA Block"] },
    { roomName: "MSME-LH-1", capacity: 60, blockId: blockMap["MSME Block"] },
    { roomName: "PH-1", capacity: 60, blockId: blockMap["PH Block"] },
  ];

  for (const roomData of roomsData) {
    const existingRoom = await prisma.room.findFirst({
      where: { roomName: roomData.roomName },
    });
    if (!existingRoom) {
      await prisma.room.create({ data: roomData });
    }
  }
  const rooms = await prisma.room.findMany();
  console.log(`✅ ${rooms.length} rooms created`);

  console.log("\n🎉 Database seeded successfully!");
  console.log("\n📋 Login Credentials:");
  console.log("   Admin  → admin@roombooking.com / admin123");
  console.log("   Member → tempuser@roombooking.com / temp123");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
