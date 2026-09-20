const form = document.querySelector("form");

form.addEventListener("submit", function(event) {
    event.preventDefault();

    const username = document.getElementById("user").value;
    const password = document.getElementById("password").value;

    if (username ==="admin" && password ==="12345678") {
        alert("login successful!");
        window.location.href="home.html";
    } else {
        alert("incorrect username or password");
        console.log("Login Failed!");
    }
});
