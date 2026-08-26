function checkAuthentication() {

    const token =
        sessionStorage.getItem("token");

    if (!token) {

        window.location.replace(
            "index.html"
        );

    }

}


checkAuthentication();


window.addEventListener(
    "pageshow",
    () => {

        checkAuthentication();

    }
);


const logoutButton =
    document.querySelector(".logout");


if (logoutButton) {

    logoutButton.addEventListener(
        "click",
        (event) => {

            event.preventDefault();

            sessionStorage.clear();

            window.location.replace(
                "index.html"
            );

        }
    );

}