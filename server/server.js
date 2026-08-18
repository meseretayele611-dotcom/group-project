const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// ========================================
// TEMPORARY DATABASE
// ========================================

let requests = [];

// ========================================
// USERS
// ========================================

let users = [
  {
    id: 1,
    name: "System Administrator",
    email: "admin@dbu.edu.et",
    password: "admin123",
    role: "admin",
    active: true,
  },

  {
    id: 2,
    name: "DBU User",
    email: "user@dbu.edu.et",
    password: "user123",
    role: "user",
    active: true,
  },

  {
    id: 3,
    name: "DBU Technician",
    email: "technician@dbu.edu.et",
    password: "tech123",
    role: "technician",
    active: true,
  },
];

// ========================================
// TEST ROUTE
// ========================================

app.get("/", (req, res) => {
  res.json({
    message: "DBU Maintenance Service API is running",
  });
});

// ========================================
// LOGIN
// ========================================

app.post("/api/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "Email and password are required.",
    });
  }

  const user = users.find(
    (u) =>
      u.email.toLowerCase() === email.toLowerCase() && u.password === password,
  );

  if (!user) {
    return res.status(401).json({
      message: "Invalid email or password.",
    });
  }

  if (!user.active) {
    return res.status(403).json({
      message: "Your account is deactivated.",
    });
  }

  res.json({
    message: "Login successful",

    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

// ========================================
// REGISTER USER
// ========================================

app.post("/api/register", (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      message: "All fields are required.",
    });
  }

  const existingUser = users.find(
    (u) => u.email.toLowerCase() === email.toLowerCase(),
  );

  if (existingUser) {
    return res.status(409).json({
      message: "Email already registered.",
    });
  }

  const newUser = {
    id: users.length + 1,

    name,

    email,

    password,

    role: "user",

    active: true,
  };

  users.push(newUser);

  res.status(201).json({
    message: "Registration successful",

    user: {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
    },
  });
});

// ========================================
// CREATE MAINTENANCE REQUEST
// ========================================

app.post("/api/requests", (req, res) => {
  try {
    const {
      applicantName,
      department,
      phoneNo,
      equipmentType,
      problemDescription,
      signature,
    } = req.body;

    if (
      !applicantName ||
      !department ||
      !phoneNo ||
      !equipmentType ||
      !problemDescription ||
      !signature
    ) {
      return res.status(400).json({
        message: "All fields are required.",
      });
    }

    const newRequest = {
      _id: "REQ-" + Date.now(),

      applicantName,

      department,

      phoneNo,

      equipmentType,

      problemDescription,

      signature,

      status: "Pending",

      priority: "Normal",

      technician: null,

      createdAt: new Date(),
    };

    requests.push(newRequest);

    console.log("New maintenance request:", newRequest);

    res.status(201).json({
      message: "Maintenance request created successfully",

      requestId: newRequest._id,

      request: newRequest,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",

      error: error.message,
    });
  }
});

// ========================================
// GET ALL REQUESTS
// ========================================

app.get("/api/requests", (req, res) => {
  res.json(requests);
});

// ========================================
// GET REQUEST BY ID
// ========================================

app.get("/api/requests/:id", (req, res) => {
  const request = requests.find((r) => r._id === req.params.id);

  if (!request) {
    return res.status(404).json({
      message: "Request not found",
    });
  }

  res.json(request);
});

// ========================================
// UPDATE STATUS
// ========================================

app.put("/api/requests/update-status/:id", (req, res) => {
  const { status } = req.body;

  const request = requests.find((r) => r._id === req.params.id);

  if (!request) {
    return res.status(404).json({
      message: "Request not found",
    });
  }

  request.status = status || request.status;

  res.json({
    message: "Status updated successfully",

    request,
  });
});

// ========================================
// ASSIGN TECHNICIAN
// ========================================

app.put("/api/requests/assign/:id", (req, res) => {
  const { technician } = req.body;

  const request = requests.find((r) => r._id === req.params.id);

  if (!request) {
    return res.status(404).json({
      message: "Request not found",
    });
  }

  request.technician = technician;

  request.status = "In Progress";

  res.json({
    message: "Technician assigned successfully",

    request,
  });
});

// ========================================
// CHANGE PRIORITY
// ========================================

app.put("/api/requests/priority/:id", (req, res) => {
  const { priority } = req.body;

  const request = requests.find((r) => r._id === req.params.id);

  if (!request) {
    return res.status(404).json({
      message: "Request not found",
    });
  }

  request.priority = priority;

  res.json({
    message: "Priority updated successfully",

    request,
  });
});

// ========================================
// ADMIN DASHBOARD
// ========================================

app.get("/api/admin/dashboard", (req, res) => {
  const totalRequests = requests.length;

  const pendingRequests = requests.filter((r) => r.status === "Pending").length;

  const inProgressRequests = requests.filter(
    (r) => r.status === "In Progress",
  ).length;

  const completedRequests = requests.filter(
    (r) => r.status === "Completed",
  ).length;

  const cancelledRequests = requests.filter(
    (r) => r.status === "Cancelled",
  ).length;

  res.json({
    totalRequests,

    pendingRequests,

    inProgressRequests,

    completedRequests,

    cancelledRequests,

    recentRequests: requests.slice(-10).reverse(),
  });
});

// ========================================
// TECHNICIAN REQUESTS
// ========================================

app.get("/api/technician/requests", (req, res) => {
  const technicianRequests = requests.filter((r) => r.technician !== null);

  res.json(technicianRequests);
});

// ========================================
// USERS
// ========================================

app.get("/api/users", (req, res) => {
  const safeUsers = users.map((user) => ({
    id: user.id,

    name: user.name,

    email: user.email,

    role: user.role,

    active: user.active,
  }));

  res.json(safeUsers);
});

// ========================================
// SERVER
// ========================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running smoothly without database on port ${PORT}`);
});
