const clinics = [
  {
    id: 1,
    name: "Kabul Family Health Clinic",
    specialty: "Primary Care",
    address: "Shahr-e Naw, Kabul, Afghanistan",
    phone: "+93 70 123 4567",
    languages: ["Dari", "English"],
    gender: "Female",
    condition: "General",
    online: true,
    lat: 34.5389,
    lng: 69.1715,
    image: "assets/clinic-1.svg"
  },
  {
    id: 2,
    name: "Shahr-e Naw Medical Center",
    specialty: "General Medicine",
    address: "Shahr-e Naw, Kabul, Afghanistan",
    phone: "+93 78 234 5678",
    languages: ["Dari", "Pashto"],
    gender: "Any",
    condition: "General",
    online: true,
    lat: 34.5330,
    lng: 69.1730,
    image: "assets/clinic-2.svg"
  },
  {
    id: 3,
    name: "Kabul Children's Clinic",
    specialty: "Pediatrics",
    address: "Wazir Akbar Khan, Kabul, Afghanistan",
    phone: "+93 79 345 6789",
    languages: ["Dari", "English"],
    gender: "Female",
    condition: "Children",
    online: false,
    lat: 34.5528,
    lng: 69.1844,
    image: "assets/clinic-3.svg"
  },
  {
    id: 4,
    name: "Kabul Dental Care",
    specialty: "Dental",
    address: "Taimani, Kabul, Afghanistan",
    phone: "+93 72 456 7890",
    languages: ["Dari", "English"],
    gender: "Any",
    condition: "Dental",
    online: true,
    lat: 34.5585,
    lng: 69.1648,
    image: "assets/clinic-4.svg"
  },
  {
    id: 5,
    name: "West Kabul Community Clinic",
    specialty: "Primary Care",
    address: "Kart-e-Char, Kabul, Afghanistan",
    phone: "+93 77 567 8901",
    languages: ["Dari", "Pashto"],
    gender: "Male",
    condition: "General",
    online: false,
    lat: 34.5086,
    lng: 69.1240,
    image: "assets/clinic-5.svg"
  }
];


const kabulCenter = [34.5553, 69.2075];

const map = L.map("map").setView(kabulCenter, 12);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

const markersLayer = L.layerGroup().addTo(map);
let currentClinics = [...clinics];

function createMarker(clinic) {
  const marker = L.marker([clinic.lat, clinic.lng]);
  marker.bindPopup(`
    <div>
      <div class="popup-title">${clinic.name}</div>
      <div>${clinic.specialty}</div>
      <div>${clinic.address}</div>
      <div>${clinic.phone}</div>
    </div>
  `);
  marker.addTo(markersLayer);
}

function renderMap(items) {
  markersLayer.clearLayers();

  if (!items.length) {
    map.setView(kabulCenter, 12);
    return;
  }

  items.forEach(createMarker);

  const bounds = L.latLngBounds(items.map(item => [item.lat, item.lng]));
  map.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });
}

function renderList(items) {
  const list = document.getElementById("list");
  const empty = document.getElementById("emptyState");

  if (!items.length) {
    list.innerHTML = "";
    empty.classList.remove("hidden");
    return;
  }

  empty.classList.add("hidden");

  list.innerHTML = items.map(clinic => `
    <article class="clinic-card">
      <img class="clinic-image" src="${clinic.image}" alt="${clinic.name}" />
      <div>
        <h2>${clinic.name}</h2>
        <p><strong>${clinic.specialty}</strong> · ${clinic.condition}</p>
        <p>${clinic.address}</p>
        <p>${clinic.languages.join(", ")} · ${clinic.phone}</p>
        <p>${clinic.online ? "Online scheduling available" : "Appointment by phone"}</p>
      </div>
      <div class="card-actions">
        <button class="action-btn secondary" data-location="${clinic.id}">More about this location</button>
        <button class="action-btn" data-doctor="${clinic.id}">Find a doctor & schedule</button>
      </div>
    </article>
  `).join("");

  list.querySelectorAll("[data-location]").forEach(button => {
    button.addEventListener("click", () => {
      const clinic = clinics.find(c => c.id === Number(button.dataset.location));
      map.setView([clinic.lat, clinic.lng], 15);
      const marker = L.marker([clinic.lat, clinic.lng]).addTo(markersLayer);
      marker.bindPopup(`<div class="popup-title">${clinic.name}</div>${clinic.address}`).openPopup();
      showToast(`Showing ${clinic.name} on the Kabul map.`);
    });
  });

  list.querySelectorAll("[data-doctor]").forEach(button => {
    button.addEventListener("click", () => {
      const clinic = clinics.find(c => c.id === Number(button.dataset.doctor));
      showToast(`Demo: appointment flow opened for ${clinic.name}.`);
    });
  });
}

function getFilters() {
  return {
    query: (
      document.getElementById("clinicSearch").value +
      " " +
      document.getElementById("primaryCare").value +
      " " +
      document.getElementById("globalSearch").value
    ).trim().toLowerCase(),
    area: (
      document.getElementById("zipSearch").value +
      " " +
      document.getElementById("zipFilter").value
    ).trim().toLowerCase(),
    specialty: document.getElementById("specialty").value,
    gender: document.getElementById("gender").value,
    condition: document.getElementById("condition").value,
    language: document.getElementById("language").value,
    onlineOnly: document.getElementById("onlineOnly").checked,
    primaryOnly: document.getElementById("primaryOnly").checked
  };
}

function applyFilters() {
  const f = getFilters();

  currentClinics = clinics.filter(clinic => {
    const haystack = [
      clinic.name,
      clinic.specialty,
      clinic.address,
      clinic.phone,
      clinic.condition,
      clinic.gender,
      clinic.languages.join(" ")
    ].join(" ").toLowerCase();

    const matchesQuery = !f.query || haystack.includes(f.query);
    const matchesArea = !f.area || clinic.address.toLowerCase().includes(f.area);
    const matchesSpecialty = !f.specialty || clinic.specialty === f.specialty;
    const matchesGender = !f.gender || clinic.gender === f.gender || clinic.gender === "Any";
    const matchesCondition = !f.condition || clinic.condition === f.condition;
    const matchesLanguage = !f.language || clinic.languages.includes(f.language);
    const matchesOnline = !f.onlineOnly || clinic.online;
    const matchesPrimary = !f.primaryOnly || clinic.specialty === "Primary Care";

    return (
      matchesQuery &&
      matchesArea &&
      matchesSpecialty &&
      matchesGender &&
      matchesCondition &&
      matchesLanguage &&
      matchesOnline &&
      matchesPrimary
    );
  });

  renderMap(currentClinics);
  renderList(currentClinics);
}

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2600);
}

document.getElementById("searchBtn").addEventListener("click", applyFilters);

document.getElementById("nearbyBtn").addEventListener("click", () => {
  map.setView(kabulCenter, 13);
  showToast("Showing clinics around Kabul.");
});

["clinicSearch", "zipSearch", "primaryCare", "zipFilter", "globalSearch"].forEach(id => {
  document.getElementById(id).addEventListener("input", applyFilters);
});

["specialty", "gender", "condition", "language", "onlineOnly", "primaryOnly"].forEach(id => {
  document.getElementById(id).addEventListener("change", applyFilters);
});

document.getElementById("clearFilters").addEventListener("click", () => {
  document.querySelectorAll("input").forEach(input => {
    if (input.type === "checkbox") input.checked = false;
    else input.value = "";
  });

  document.querySelectorAll("select").forEach(select => {
    select.value = "";
  });

  document.querySelector('.check-row input[type="checkbox"]').checked = true;
  applyFilters();
  showToast("Filters cleared.");
});

document.getElementById("mapTab").addEventListener("click", () => {
  document.getElementById("mapTab").classList.add("active");
  document.getElementById("listTab").classList.remove("active");
  document.getElementById("map").classList.remove("hidden");
  document.getElementById("list").classList.add("hidden");
  document.getElementById("emptyState").classList.add("hidden");
  map.invalidateSize();
});

document.getElementById("listTab").addEventListener("click", () => {
  document.getElementById("listTab").classList.add("active");
  document.getElementById("mapTab").classList.remove("active");
  document.getElementById("map").classList.add("hidden");
  document.getElementById("list").classList.remove("hidden");
  renderList(currentClinics);
});

// Initial render
renderMap(currentClinics);
renderList(currentClinics);
