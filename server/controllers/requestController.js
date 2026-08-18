const MaintenanceRequest = require("../models/MaintenanceRequest");

// Create Maintenance Request
const createRequest = async (req, res) => {
  const { equipmentName, description, location } = req.body;

  if (!equipmentName || !description || !location) {
    return res.status(400).json({ message: "እባክዎ ሁሉንም መስኮች ያሟሉ" });
  }

  try {
    const request = await MaintenanceRequest.create({
      user: req.user.id,
      equipmentName,
      description,
      location,
    });

    res.status(201).json({
      message: "Maintenance request created successfully!",
      request,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Requests
const getRequests = async (req, res) => {
  try {
    const requests = await MaintenanceRequest.find()
      .populate("user", "fullName email")
      .sort({ createdAt: -1 });

    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createRequest, getRequests };
