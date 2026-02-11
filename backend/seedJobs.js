import mongoose from "mongoose";
import dotenv from "dotenv";
import Job from "./models/Job.js";

dotenv.config();

/* ===============================
   SAMPLE JOB DATA
================================ */
const jobs = [
  {
    title: "Frontend Developer",
    company: "TechSoft",
    skills: "html css javascript react",
    location: "Remote",
    description:
      "Frontend developer with strong HTML, CSS, JavaScript and React skills.",
    salary: 600000,
    platform: "LinkedIn",
    type: "Full-time",
    isActive: true,
    postedDate: new Date(),
  },
  {
    title: "Backend Developer",
    company: "CodeWorks",
    skills: "nodejs express mongodb api",
    location: "Bangalore",
    description:
      "Backend developer with Node.js, Express and MongoDB experience.",
    salary: 700000,
    platform: "Naukri",
    type: "Full-time",
    isActive: true,
    postedDate: new Date(),
  },
  {
    title: "Full Stack Developer",
    company: "InnovateX",
    skills: "react nodejs mongodb full stack",
    location: "Remote",
    description:
      "Full stack developer required with React and Node.js knowledge.",
    salary: 800000,
    platform: "Indeed",
    type: "Full-time",
    isActive: true,
    postedDate: new Date(),
  },
];

/* ===============================
   SEED FUNCTION
================================ */
const seedJobs = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("✅ MongoDB connected for seeding");

    await Job.deleteMany(); // optional: clear old jobs
    await Job.insertMany(jobs);

    console.log("🌱 Jobs seeded successfully");
    process.exit();
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
};

seedJobs();
