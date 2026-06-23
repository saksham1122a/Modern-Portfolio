import Experience from "../models/Experience.js";

// GET /api/experience
export const getExperience = async (req, res, next) => {
  try {
    const experience = await Experience.find().sort({ order: 1, startDate: -1 });
    res.json({ success: true, data: experience });
  } catch (err) {
    next(err);
  }
};

// POST /api/experience
export const createExperience = async (req, res, next) => {
  try {
    const experience = await Experience.create(req.body);
    res.status(201).json({ success: true, data: experience });
  } catch (err) {
    next(err);
  }
};

// PUT /api/experience/:id
export const updateExperience = async (req, res, next) => {
  try {
    const experience = await Experience.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!experience) {
      res.status(404);
      throw new Error("Experience entry not found");
    }
    res.json({ success: true, data: experience });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/experience/:id
export const deleteExperience = async (req, res, next) => {
  try {
    const experience = await Experience.findByIdAndDelete(req.params.id);
    if (!experience) {
      res.status(404);
      throw new Error("Experience entry not found");
    }
    res.json({ success: true, message: "Experience entry deleted" });
  } catch (err) {
    next(err);
  }
};
