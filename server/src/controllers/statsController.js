import Message from "../models/Message.js";
import Project from "../models/Project.js";
import Skill from "../models/Skill.js";
import Experience from "../models/Experience.js";
import User from "../models/User.js";

export const getDashboardStats = async (req, res, next) => {
  try {
    const [
      totalMessages, unreadMessages,
      totalProjects, totalSkills,
      totalExperience, totalUsers, recentMessages,
    ] = await Promise.all([
      Message.countDocuments(),
      Message.countDocuments({ read: false }),
      Project.countDocuments(),
      Skill.countDocuments(),
      Experience.countDocuments(),
      User.countDocuments(),
      Message.find().sort({ createdAt: -1 }).limit(5)
        .select("name email subject createdAt read"),
    ]);

    res.json({
      success: true,
      data: { totalMessages, unreadMessages, totalProjects, totalSkills, totalExperience, totalUsers, recentMessages },
    });
  } catch (err) { next(err); }
};
