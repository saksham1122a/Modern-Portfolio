import Skill from "../models/Skill.js";

// GET /api/skills
export const getSkills = async (req, res, next) => {
  try {
    const skills = await Skill.find().sort({ order: 1 });
    res.json({ success: true, data: skills });
  } catch (err) {
    next(err);
  }
};

// POST /api/skills
export const createSkill = async (req, res, next) => {
  try {
    const skill = await Skill.create(req.body);
    res.status(201).json({ success: true, data: skill });
  } catch (err) {
    next(err);
  }
};

// PUT /api/skills/:id
export const updateSkill = async (req, res, next) => {
  try {
    const skill = await Skill.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!skill) {
      res.status(404);
      throw new Error("Skill not found");
    }
    res.json({ success: true, data: skill });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/skills/:id
export const deleteSkill = async (req, res, next) => {
  try {
    const skill = await Skill.findByIdAndDelete(req.params.id);
    if (!skill) {
      res.status(404);
      throw new Error("Skill not found");
    }
    res.json({ success: true, message: "Skill deleted" });
  } catch (err) {
    next(err);
  }
};
