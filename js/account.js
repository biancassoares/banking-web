document.addEventListener("DOMContentLoaded", () => {

    const newAccountButton =
        document.getElementById("new-account-button");

    const addAccountCard =
        document.getElementById("add-account-card");

    const accountModal =
        document.getElementById("account-modal");

    const accountModalClose =
        document.getElementById("account-modal-close");

    const accountCancelButton =
        document.getElementById("account-cancel-button");

    const createAccountButton =
        document.getElementById("create-account-button");


    function openAccountModal() {
        accountModal.classList.add("show");
    }


    function closeAccountModal() {
        accountModal.classList.remove("show");
    }


    newAccountButton.addEventListener(
        "click",
        openAccountModal
    );

    addAccountCard.addEventListener(
        "click",
        openAccountModal
    );


    accountModalClose.addEventListener(
        "click",
        closeAccountModal
    );

    accountCancelButton.addEventListener(
        "click",
        closeAccountModal
    );

    createAccountButton.addEventListener(
        "click",
        closeAccountModal
    );


    accountModal.addEventListener("click", (event) => {

        if (event.target === accountModal) {
            closeAccountModal();
        }

    });

});