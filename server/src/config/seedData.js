import Project from "../models/Project.js";
import Skill from "../models/Skill.js";
import Experience from "../models/Experience.js";

const defaultProjects = [
  {
    title: "ResolveX — Complaint Resolution Tracker",
    description:
      "Full-stack complaint management system with admin dashboard, role-based access control, and real-time status tracking across 4+ campus sectors. Secure REST APIs with JWT authentication and an analytics module for resolution rate monitoring.",
    image: "/images/project1.jpg",
    techStack: ["React", "Node.js", "Express.js", "MongoDB", "JWT", "REST APIs"],
    liveUrl: "",
    githubUrl: "https://github.com/saksham1122a/Complaint-To-Resolution-Transparency-Tracker",
    caseStudyUrl: "",
    featured: true,
    order: 1,
  },
  {
    title: "TeamBuddy — Employee Management System",
    description:
      "MERN employee management platform supporting 3 user roles (Employee, HR, Admin) with separate dashboards, leave request management, task assignment, and attendance tracking using scalable Mongoose data models.",
    image: "/images/project2.jpg",
    techStack: ["React", "Node.js", "Express.js", "MongoDB", "Mongoose"],
    liveUrl: "",
    githubUrl: "https://github.com/saksham1122a/Employee-Management-System",
    caseStudyUrl: "",
    featured: true,
    order: 2,
  },
  {
    title: "TravelTales — Travel Tourism Platform",
    description:
      "Full-stack MERN travel booking platform where users explore, compare, and book travel destinations via a responsive interface with dynamic booking workflows, destination management APIs, and real-time data updates.",
    image: "/images/project3.jpg",
    techStack: ["React", "Node.js", "Express.js", "MongoDB", "REST APIs"],
    liveUrl: "",
    githubUrl: "https://github.com/saksham1122a/TravelTail---A-Travel-Tourism-Hub",
    caseStudyUrl: "",
    featured: false,
    order: 3,
  },
];

const defaultSkills = [
  { name: "React.js",      category: "frontend",  proficiency: 92, yearsExperience: 2, order: 1 },
  { name: "HTML5",         category: "frontend",  proficiency: 95, yearsExperience: 3, order: 2 },
  { name: "CSS3",          category: "frontend",  proficiency: 92, yearsExperience: 3, order: 3 },
  { name: "Tailwind CSS",  category: "frontend",  proficiency: 88, yearsExperience: 2, order: 4 },
  { name: "JavaScript",    category: "language",  proficiency: 90, yearsExperience: 3, order: 5 },
  { name: "Node.js",       category: "backend",   proficiency: 88, yearsExperience: 2, order: 6 },
  { name: "Express.js",    category: "backend",   proficiency: 86, yearsExperience: 2, order: 7 },
  { name: "REST APIs",     category: "backend",   proficiency: 90, yearsExperience: 2, order: 8 },
  { name: "JWT Auth",      category: "backend",   proficiency: 85, yearsExperience: 2, order: 9 },
  { name: "MongoDB",       category: "database",  proficiency: 85, yearsExperience: 2, order: 10 },
  { name: "Mongoose",      category: "database",  proficiency: 84, yearsExperience: 2, order: 11 },
  { name: "Git & GitHub",  category: "tools",     proficiency: 90, yearsExperience: 3, order: 12 },
  { name: "Python",        category: "language",  proficiency: 75, yearsExperience: 2, order: 13 },
  { name: "C++",           category: "language",  proficiency: 70, yearsExperience: 2, order: 14 },
  { name: "Postman",       category: "tools",     proficiency: 88, yearsExperience: 2, order: 15 },
  { name: "Vercel/Netlify",category: "tools",     proficiency: 85, yearsExperience: 2, order: 16 },
];

const defaultExperiences = [
  {
    role: "Web Development Intern",
    company: "Sensation Software Solutions Pvt. Ltd.",
    location: "Mohali, Punjab",
    startDate: new Date("2025-06-01"),
    endDate: new Date("2025-07-31"),
    description:
      "Built and integrated RESTful APIs for a MERN-based campus feedback platform managing complaint workflows across 4+ departments, collaborating in a 3-member developer team.",
    achievements: [
      "Built RESTful APIs for a MERN campus feedback platform managing workflows across 4+ departments",
      "Reduced manual tracking effort significantly through automated complaint routing",
      "Collaborated with a 3-member team implementing CRUD operations and debugging feature issues",
      "Improved platform usability based on structured user feedback sessions",
    ],
    order: 1,
  },
  {
    role: "BCA Student & Self-Directed Developer",
    company: "PCTE Group of Engineering and Technology",
    location: "Ludhiana, Punjab",
    startDate: new Date("2023-08-01"),
    endDate: null,
    description:
      "Pursuing Bachelor of Computer Applications with 9.35 CGPA while building production-grade MERN stack projects. Delivered a research paper at an international conference on AI and employment trends.",
    achievements: [
      "Maintained 9.35 CGPA throughout the BCA programme",
      "Delivered research paper at PCTE ICMR–IET 2025 International Conference",
      "Built 3+ full-stack MERN applications deployed to production",
      "Google Developer Student Club Member (2024–Present)",
      "Completed Backend Development certification on Udemy",
    ],
    order: 2,
  },
];

export const seedMockData = async () => {
  try {
    const projectCount = await Project.countDocuments();
    if (projectCount === 0) {
      await Project.insertMany(defaultProjects);
      console.log("Database seeded with default projects successfully!");
    }

    const skillCount = await Skill.countDocuments();
    if (skillCount === 0) {
      await Skill.insertMany(defaultSkills);
      console.log("Database seeded with default skills successfully!");
    }

    const expCount = await Experience.countDocuments();
    if (expCount === 0) {
      await Experience.insertMany(defaultExperiences);
      console.log("Database seeded with default experience successfully!");
    }
  } catch (err) {
    console.error("Error seeding mock data:", err);
  }
};
