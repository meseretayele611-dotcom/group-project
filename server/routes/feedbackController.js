const Feedback = require("../models/Feedback");
const ServiceRequest = require("../models/ServiceRequest");

// @desc    የቴክኒሻን ግብረ-መልስ መመዝገቢያ (Create Feedback)
// @route   POST /api/feedbacks
// @access  Private (Technician)
const createFeedback = async (req, res) => {
  try {
    const { feedbackId, rating, comment, serviceRequestId } = req.body;

    const feedback = await Feedback.create({
      feedbackId,
      rating,
      comment,
      serviceRequest: serviceRequestId,
    });

    // የጥገናውን ሁኔታም (Status) ማሻሻል ይቻላል
    await ServiceRequest.findByIdAndUpdate(serviceRequestId, {
      status: "Completed",
    });

    res.status(201).json({
      success: true,
      message: "የጥገና ሪፖርቱ እና ግብረ-መልሱ በተሳካ ሁኔታ ተመዝግቧል!",
      data: feedback,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    ግብረ-መልሶችን ማምጣት (Get Feedbacks)
// @route   GET /api/feedbacks
// @access  Private
const getFeedbacks = async (req, res) => {
  try {
    const feedbacks = await Feedback.find().populate("serviceRequest");
    res.status(200).json({ success: true, data: feedbacks });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  createFeedback,
  getFeedbacks,
};
