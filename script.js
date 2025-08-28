// Data storage
let donors = [];
let inventory = {};
let requests = [];

// Section switching
document.querySelectorAll("nav a").forEach(link => {
    link.addEventListener("click", e => {
        e.preventDefault();
        const section = link.dataset.section;
        document.querySelectorAll("main section").forEach(sec => sec.classList.remove("active"));
        document.getElementById(section).classList.add("active");
    });
});

// Modal functions
function openModal(id) {
    document.getElementById(id).style.display = "flex";
}
function closeModal(id) {
    document.getElementById(id).style.display = "none";
}

// Donor form
document.getElementById("donor-form").addEventListener("submit", e => {
    e.preventDefault();
    if (!validateDonorForm()) return;

    const name = document.getElementById("donor-name").value;
    const age = document.getElementById("donor-age").value;
    const bloodType = document.getElementById("donor-blood-type").value;

    donors.push({ name, age, bloodType, lastDonation: new Date().toLocaleDateString() });
    updateDonors();
    closeModal("donor-modal");
    e.target.reset();
});

// Request form
document.getElementById("request-form").addEventListener("submit", e => {
    e.preventDefault();
    if (!validateRequestForm()) return;

    const patient = document.getElementById("patient-name").value;
    const bloodType = document.getElementById("request-blood-type").value;
    const units = parseInt(document.getElementById("request-units").value);

    requests.push({ patient, bloodType, units, status: "Pending" });
    updateRequests();
    closeModal("request-modal");
    e.target.reset();
});

// Inventory form
document.getElementById("inventory-form").addEventListener("submit", e => {
    e.preventDefault();
    if (!validateInventoryForm()) return;

    const bloodType = document.getElementById("inventory-blood-type").value;
    const units = parseInt(document.getElementById("inventory-units").value);

    inventory[bloodType] = (inventory[bloodType] || 0) + units;
    updateInventory();
    closeModal("inventory-modal");
    e.target.reset();
});

// Update donors table
function updateDonors() {
    const tbody = document.querySelector("#donor-table tbody");
    tbody.innerHTML = "";
    donors.forEach(d => {
        const row = `<tr>
            <td>${d.name}</td>
            <td>${d.age}</td>
            <td>${d.bloodType}</td>
            <td>${d.lastDonation}</td>
            <td><button onclick="removeDonor('${d.name}')">Delete</button></td>
        </tr>`;
        tbody.innerHTML += row;
    });
    document.getElementById("total-donors").textContent = donors.length;
}
function removeDonor(name) {
    donors = donors.filter(d => d.name !== name);
    updateDonors();
}

// Update inventory
function updateInventory() {
    const tbody = document.querySelector("#inventory-table tbody");
    tbody.innerHTML = "";
    let totalUnits = 0;
    for (const [type, units] of Object.entries(inventory)) {
        totalUnits += units;
        const status = units < 5 ? "Critical" : (units < 10 ? "Low" : "Normal");
        tbody.innerHTML += `<tr>
            <td>${type}</td>
            <td>${units}</td>
            <td>${status}</td>
        </tr>`;
    }
    document.getElementById("total-units").textContent = totalUnits;
}

// Update requests
function updateRequests() {
    const tbody = document.querySelector("#request-table tbody");
    tbody.innerHTML = "";
    requests.forEach((r, i) => {
        tbody.innerHTML += `<tr>
            <td>${r.patient}</td>
            <td>${r.bloodType}</td>
            <td>${r.units}</td>
            <td>${r.status}</td>
            <td>
                <button onclick="approveRequest(${i})">Approve</button>
                <button onclick="deleteRequest(${i})">Delete</button>
            </td>
        </tr>`;
    });
    document.getElementById("total-requests").textContent = requests.length;
}
function approveRequest(i) {
    if (inventory[requests[i].bloodType] >= requests[i].units) {
        inventory[requests[i].bloodType] -= requests[i].units;
        requests[i].status = "Approved";
        updateInventory();
        updateRequests();
    } else {
        alert("Not enough units available!");
    }
}
function deleteRequest(i) {
    requests.splice(i, 1);
    updateRequests();
}

// Validation
function validateDonorForm() {
    const name = document.getElementById("donor-name").value.trim();
    const age = document.getElementById("donor-age").value.trim();
    const bloodType = document.getElementById("donor-blood-type").value;
    if (!name || !age || !bloodType) {
        alert("Please fill all donor fields");
        return false;
    }
    return true;
}
function validateRequestForm() {
    const patient = document.getElementById("patient-name").value.trim();
    const bloodType = document.getElementById("request-blood-type").value;
    const units = document.getElementById("request-units").value.trim();
    if (!patient || !bloodType || !units) {
        alert("Please fill all request fields");
        return false;
    }
    return true;
}
function validateInventoryForm() {
    const bloodType = document.getElementById("inventory-blood-type").value;
    const units = document.getElementById("inventory-units").value.trim();
    if (!bloodType || !units) {
        alert("Please fill all inventory fields");
        return false;
    }
    return true;
}
