const API_URL = "http://localhost:5000/api";
let token = localStorage.getItem("token");

const requestForm = document.getElementById("requestForm");
const requestsTableBody = document.getElementById("requestsTableBody");

// Authentication Guard: Login ካላደረገ ወደ login.html ይመልሰዋል
if (!token) {
  window.location.href = "login.html";
} else {
  fetchRequests();
}

document.getElementById("requestDate").valueAsDate = new Date();

function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  window.location.href = "login.html";
}

async function fetchRequests() {
  try {
    const res = await fetch(`${API_URL}/requests`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();

    if (res.ok) {
      requestsTableBody.innerHTML = "";
      if (data.length === 0) {
        requestsTableBody.innerHTML = `<tr><td colspan="6" style="text-align:center;">No maintenance requests found.</td></tr>`;
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

        let responseBox = `<em style="color:var(--text-muted);">Waiting for technician...</em>`;
        if (req.response) {
          responseBox = `
            <div><strong>Sol:</strong> ${req.response}</div>
            <small style="color:var(--text-muted);">Tech: ${req.technicianName || "ICT Tech"}</small>
            ${req.notFixedReason ? `<br><small style="color:red;">Reason: ${req.notFixedReason}</small>` : ""}
          `;
        }

        const row = `
          <tr>
            <td>
              <strong>${req.department || "IT Dept"}</strong><br>
              <small>Name: ${req.applicantName || "N/A"}</small><br>
              <small>Phone: ${req.phoneNo || "N/A"}</small>
            </td>
            <td>${req.category}</td>
            <td>
              <small><strong>Date:</strong> ${req.requestDate ? req.requestDate.split("T")[0] : "N/A"}</small><br>
              <small>${req.description}</small>
            </td>
            <td><span class="${prioClass}">${req.priority}</span></td>
            <td>${statusBadge}</td>
            <td>${responseBox}</td>
          </tr>
        `;
        requestsTableBody.innerHTML += row;
      });
    }
  } catch (err) {
    console.error("Error fetching requests:", err);
  }
}

requestForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const department = document.getElementById("department").value;
  const phoneNo = document.getElementById("phoneNo").value;
  const applicantName = document.getElementById("applicantName").value;
  const requestDate = document.getElementById("requestDate").value;
  const category = document.getElementById("reqCategory").value;
  const priority = document.getElementById("reqPriority").value;
  const description = document.getElementById("reqDescription").value;

  try {
    const res = await fetch(`${API_URL}/requests`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        department,
        phoneNo,
        applicantName,
        requestDate,
        category,
        priority,
        description,
      }),
    });

    if (res.ok) {
      alert("Maintenance request submitted successfully!");
      requestForm.reset();
      document.getElementById("requestDate").valueAsDate = new Date();
      fetchRequests();
    }
  } catch (err) {
    console.error(err);
  }
});
