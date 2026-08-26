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


    let isCreatingAccount = false;


    function openAccountModal() {
        accountModal.classList.add("show");
    }


    function closeAccountModal() {
        accountModal.classList.remove("show");
    }


    newAccountButton.onclick = openAccountModal;

    addAccountCard.onclick = openAccountModal;

    accountModalClose.onclick = closeAccountModal;

    accountCancelButton.onclick = closeAccountModal;


    accountModal.onclick = (event) => {

        if (event.target === accountModal) {
            closeAccountModal();
        }

    };


    createAccountButton.onclick = async () => {

        if (isCreatingAccount) {
            return;
        }

        isCreatingAccount = true;

        createAccountButton.disabled = true;
        createAccountButton.textContent = "Criando...";

        const token =
            sessionStorage.getItem("token");


        try {

            const response = await fetch(`${window.API_URL}/accounts`, {
                    method: "POST",

                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                }
            );


            if (response.status === 401) {

                sessionStorage.removeItem("token");

                window.location.href = "index.html";

                return;
            }


            if (!response.ok) {

                throw new Error(
                    "Não foi possível criar a conta."
                );

            }


            closeAccountModal();

            window.location.reload();


        } catch (error) {

            console.error(
                "Erro ao criar conta:",
                error
            );

            alert(
                "Não foi possível criar a conta."
            );


        } finally {

            isCreatingAccount = false;

            createAccountButton.disabled = false;
            createAccountButton.textContent =
                "Criar conta";

        }

    };

});