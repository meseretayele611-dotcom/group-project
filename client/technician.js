const API_URL = "http://localhost:5000/api";
let token = localStorage.getItem("token");

const techRequestsTableBody = document.getElementById("techRequestsTableBody");
const techModal = document.getElementById("techModal");
const technicianResolutionForm = document.getElementById(
  "technicianResolutionForm",
);

document.getElementById("resolutionDate").valueAsDate = new Date();

if (!token) {
  alert("Please login first!");
  window.location.href = "login.html";
} else {
  fetchRequestsForTechnician();
}

function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  window.location.href = "login.html";
}

async function fetchRequestsForTechnician() {
  try {
    const res = await fetch(`${API_URL}/requests`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();

    if (res.ok) {
      techRequestsTableBody.innerHTML = "";

      if (data.length === 0) {
        techRequestsTableBody.innerHTML = `<tr><td colspan="7" style="text-align:center;">No pending maintenance requests found.</td></tr>`;
        return;
      }

      data.forEach((req) => {
        let prioClass = "priority-med";
        if (req.priority === "High") prioClass = "priority-high";
        if (req.priority === "Low") prioClass = "priority-low";

        let statusBadge = `<span class="badge badge-pending">Pending</span>`;
        if (req.status === "Fixed" || req.status === "fixed") {
          statusBadge = `<span class="badge badge-fixed">Fixed</span>`;
        } else if (req.status === "Not Fixed" || req.status === "not fixed") {
          statusBadge = `<span class="badge badge-notfixed">Not Fixed</span>`;
        }

        const row = `
          <tr>
            <td>
              <strong>Dept:</strong> ${req.department || "N/A"}<br>
              <small><strong>Applicant:</strong> ${req.applicantName || "N/A"}</small><br>
              <small><strong>Phone:</strong> ${req.phoneNo || "N/A"}</small>
            </td>
            <td>${req.category}</td>
            <td><small>${req.description}</small></td>
            <td><span class="${prioClass}">${req.priority}</span></td>
            <td>${statusBadge}</td>
            <td>
              ${req.response ? `<strong>Sol:</strong> ${req.response}<br><small>By: ${req.technicianName || "Tech"}</small>` : "<em>No response yet</em>"}
            </td>
            <td>
              <button class="btn btn-primary" style="padding: 0.4rem 0.8rem; font-size: 0.8rem;" onclick="openTechModal('${req._id}')">
                Update / Respond
              </button>
            </td>
          </tr>
        `;
        techRequestsTableBody.innerHTML += row;
      });
    }
  } catch (err) {
    console.error("Error fetching requests:", err);
  }
}

function openTechModal(requestId) {
  document.getElementById("modalRequestId").value = requestId;
  techModal.classList.remove("hidden");
}

function closeTechModal() {
  techModal.classList.add("hidden");
}

function toggleReasonField() {
  const status = document.getElementById("repairStatus").value;
  const reasonBox = document.getElementById("notFixedReasonBox");
  if (status === "Not Fixed") {
    reasonBox.style.display = "block";
  } else {
    reasonBox.style.display = "none";
  }
}

technicianResolutionForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const requestId = document.getElementById("modalRequestId").value;
  const technicianName = document.getElementById("techName").value;
  const resolutionDate = document.getElementById("resolutionDate").value;
  const identifiedProblem = document.getElementById("identifiedProblem").value;
  const response = document.getElementById("solutionDetails").value;
  const status = document.getElementById("repairStatus").value;
  const notFixedReason = document.getElementById("notFixedReason").value;

  try {
    const res = await fetch(`${API_URL}/requests/${requestId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        technicianName,
        resolutionDate,
        identifiedProblem,
        response,
        status,
        notFixedReason,
      }),
    });

    if (res.ok) {
      alert("Technician resolution saved successfully!");
      closeTechModal();
      fetchRequestsForTechnician();
    } else {
      const data = await res.json();
      alert(data.message || "Failed to update request.");
    }
  } catch (err) {
    console.error("Error submitting technician feedback:", err);
  }
});
