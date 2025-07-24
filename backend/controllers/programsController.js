const Program = require('../models/Programs');

// Create a new program
exports.createProgram = async (req, res) => {
  try {
    const { name, description, startDate, endDate } = req.body;
    if (!name) {
      return res.status(400).json({ message: 'Program name is required' });
    }
    const existing = await Program.findOne({ name });
    if (existing) {
      return res.status(409).json({ message: 'Program name already exists' });
    }
    const program = new Program({ name, description, startDate, endDate, createdBy: req.user.userId });
    await program.save();
    // Populate createdBy before sending response
    await program.populate('createdBy', 'name email role');
    res.status(201).json(program);
  } catch (error) {
    res.status(500).json({ message: 'Create program error', error: error.message });
  }
};

// Get all programs
exports.getPrograms = async (req, res) => {
  try {
    let programs;
    if (req.user.role === 'admin' || req.user.role === 'worker') {
      programs = await Program.find()
        .populate('createdBy', 'name email role')
        .sort({ createdAt: -1 });
    } else if (req.user.role === 'ngo_staff') {
      programs = await Program.find({ createdBy: req.user.userId })
        .populate('createdBy', 'name email role')
        .sort({ createdAt: -1 });
    } else {
      return res.status(403).json({ message: 'Access denied' });
    }
    res.status(200).json(programs);
  } catch (error) {
    res.status(500).json({ message: 'Get programs error', error: error.message });
  }
};

// Get a single program by ID
exports.getProgramById = async (req, res) => {
  try {
    const program = await Program.findById(req.params.id).populate('createdBy', 'name email role');
    if (!program) {
      return res.status(404).json({ message: 'Program not found' });
    }
    res.status(200).json(program);
  } catch (error) {
    res.status(500).json({ message: 'Get program error', error: error.message });
  }
};

// Update a program
exports.updateProgram = async (req, res) => {
  try {
    const { name, description, startDate, endDate } = req.body;
    const updateFields = {};
    if (name) updateFields.name = name;
    if (description) updateFields.description = description;
    if (startDate) updateFields.startDate = startDate;
    if (endDate) updateFields.endDate = endDate;

    // Prevent duplicate name
    if (name) {
      const existing = await Program.findOne({ name, _id: { $ne: req.params.id } });
      if (existing) {
        return res.status(409).json({ message: 'Program name already exists' });
      }
    }

    let program = await Program.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true, runValidators: true }
    );
    if (!program) {
      return res.status(404).json({ message: 'Program not found' });
    }
    program = await Program.findById(program._id).populate('createdBy', 'name email role');
    res.status(200).json(program);
  } catch (error) {
    res.status(500).json({ message: 'Update program error', error: error.message });
  }
};

// Delete a program
exports.deleteProgram = async (req, res) => {
  try {
    const program = await Program.findByIdAndDelete(req.params.id);
    if (!program) {
      return res.status(404).json({ message: 'Program not found' });
    }
    res.status(200).json({ message: 'Program deleted', program });
  } catch (error) {
    res.status(500).json({ message: 'Delete program error', error: error.message });
  }
};