
const menuBtn=document.getElementById("menuBtn");
const sidebar=document.getElementById("sidebar");
menuBtn.addEventListener("click",()=> {
sidebar.classList.toggle("closed");});

const navItems=document.querySelectorAll(".nav-item");
navItems.forEach(item => {
    item.addEventListener("click", () => {
        navItems.forEach(nav => nav.classList.remove("active"));
        item.classList.add("active");
    });
});

const searchInput=document.getElementById("searchInput");
searchInput.addEventListener("keyup",()=>{
    const value=searchInput.value.toLowerCase();
    document.querySelectorAll(".stat").forEach(stat=>{
        stat.style.display=stat.textContent.toLowerCase().includes(value)?"flex":"none";
    });
});

document.querySelectorAll(".details-btn").forEach(button=>{
    button.addEventListener("click",()=>alert("More details will be available soon."));
});

document.querySelectorAll(".info").forEach(button=>{
    button.addEventListener("click",()=>alert("This section displays dashboard statistics."));
});

document.querySelector(".top-button").addEventListener("click",()=>{
    if(confirm("Are you sure you want to log out?")) alert("You have been logged out.");
});