document.addEventListener("DOMContentLoaded", () => {

    const userName =
        sessionStorage.getItem("userName");

    const userNameElement =
        document.getElementById("user-name");

    const userAvatar =
        document.getElementById("user-avatar");


    if (!userName) {
        return;
    }


    userNameElement.textContent =
        userName;


    const nameParts =
        userName
            .trim()
            .split(/\s+/);


    let initials = "";


    if (nameParts.length === 1) {

        initials =
            nameParts[0]
                .charAt(0)
                .toUpperCase();

    } else {

        initials =
            (
                nameParts[0].charAt(0) +
                nameParts[
                    nameParts.length - 1
                ].charAt(0)
            ).toUpperCase();

    }


    userAvatar.textContent =
        initials;

});