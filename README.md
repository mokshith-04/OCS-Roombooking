# 🏢 Room Booking System

A full-stack, responsive web application for managing and booking meeting rooms across various blocks and facilities. Built with React, Vite, Node.js, Express, and PostgreSQL (via Prisma).

## 🌟 Features
- **Role-based Access Control**: Distinct `Admin` and `Member` roles.
- **Advanced Search Logic**: Search available rooms by date, time slot, minimum capacity, and specific block.
- **Overlap Prevention**: Ensures no two bookings overlap in the same room for the same time.
- **Admin Dashboard**: Admins can view all bookings, manage member accounts, and cancel any bookings.
- **Modern UI**: Sleek, dark-themed UI built with Tailwind CSS featuring glassmorphism effects.

---

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing.

### Prerequisites

Before you begin, ensure you have the following installed on your machine (Windows or Mac):
- **[Node.js](https://nodejs.org/)** (v18 or higher recommended)
- **[PostgreSQL](https://www.postgresql.org/download/)** (Ensure the PostgreSQL service is running)
- **[Git](https://git-scm.com/)**

---

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR-USERNAME/OCS-Projects.git
cd OCS-Projects
```

---

### 2. Database Setup

1. Open your terminal or a database tool like pgAdmin/DBeaver.
2. Create a new PostgreSQL database named `room_booking_db`.

For example, using the `psql` command line tool:
```bash
# On Mac/Linux
createdb room_booking_db

# On Windows (inside psql shell)
CREATE DATABASE room_booking_db;
```

---

### 3. Backend Setup (Server)

1. Navigate to the `server` directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Configure Environment Variables:
Create a `.env` file inside the `server` directory and add the following configuration. Replace `YOUR_DB_USER` and `YOUR_DB_PASSWORD` with your PostgreSQL credentials.

```env
# Example .env file
DATABASE_URL="postgresql://YOUR_DB_USER:YOUR_DB_PASSWORD@localhost:5432/room_booking_db?schema=public"
JWT_SECRET="your-super-secret-jwt-key-change-this"
PORT=5001
```
*(Note: If your local PostgreSQL installation does not require a password, you can use `postgresql://localhost:5432/room_booking_db?schema=public`)*

4. Run Database Migrations:
This creates the necessary tables in your PostgreSQL database.
```bash
npx prisma migrate dev --name init
```

5. Seed the Database:
This populates the database with initial blocks, rooms, an Admin user, and a Temporary Member.
```bash
node prisma/seed.js
```

6. Start the Backend Server:
```bash
npm run dev
```
The server should now be running on `http://localhost:5001`.

---

### 4. Frontend Setup (Client)

1. Open a **new terminal window** and navigate to the `client` directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Start the Frontend Server:
```bash
npm run dev
```

4. Open your browser and navigate to:
**[http://localhost:5173](http://localhost:5173)**

---

## 🔐 Demo Login Credentials

Once the database is seeded successfully, you can log in using the following test accounts:

**Admin Account** (Can create members, view all bookings, cancel bookings)
- **Email:** `admin@roombooking.com`
- **Password:** `admin123`

**Member Account** (Can search and book rooms, view own bookings)
- **Email:** `tempuser@roombooking.com`
- **Password:** `temp123`

---

## 🛠 Tech Stack

- **Frontend:** React, Vite, Tailwind CSS, React Router DOM, Axios, React Hot Toast
- **Backend:** Node.js, Express.js, JSON Web Tokens (JWT), bcrypt
- **Database:** PostgreSQL
- **ORM:** Prisma
