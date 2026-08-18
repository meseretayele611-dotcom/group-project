const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const Assignment = require("../models/Assignment");
const ServiceRequest = require("../models/ServiceRequest");

// @desc    አስተዳዳሪው ጥገናውን ለቴክኒሻን መመደብ (Assign Technician)
// @route   POST /api/assignments
// @access  Private (Admin)
router.post("/", protect, async (req, res) => {
  try {
    const { assignmentId, serviceRequestId, technicianId } = req.body;

    const newAssignment = new Assignment({
      assignmentId,
      serviceRequest: serviceRequestId,
      technician: technicianId,
    });

    const savedAssignment = await newAssignment.save();

    // የጥገናውን ሁኔታ (Status) ወደ Assigned መቀየር
    await ServiceRequest.findByIdAndUpdate(serviceRequestId, {
      status: "Assigned",
    });

    res.status(201).json({
      success: true,
      message: "ጥገናው ለቴክኒሻኑ በተሳካ ሁኔታ ተመድቧል!",
      data: savedAssignment,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// @desc    የተመደቡ ስራዎችን በሙሉ ማየት
// @route   GET /api/assignments
// @access  Private (Admin)
router.get("/", protect, async (req, res) => {
  try {
    const assignments = await Assignment.find().populate(
      "serviceRequest technician",
    );
    res.status(200).json({ success: true, data: assignments });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
