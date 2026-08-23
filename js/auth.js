document.addEventListener("DOMContentLoaded", () => {

    const loginForm = document.getElementById("login-form");
    const registerForm = document.getElementById("register-form");


    // MOCK LOGIN
    if (loginForm) {

        loginForm.addEventListener("submit", (event) => {

            event.preventDefault();

            window.location.href = "dashboard.html";

        });

    }


    // MOCK REGISTER
    if (registerForm) {

        registerForm.addEventListener("submit", (event) => {

            event.preventDefault();

            window.location.href = "index.html";

        });

    }

});