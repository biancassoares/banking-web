const transactionCards = document.querySelectorAll(".transaction-card");

const modal = document.getElementById("transaction-modal");

const modalClose = document.getElementById("modal-close");
const cancelButton = document.getElementById("cancel-button");

const modalTitle = document.getElementById("modal-title");
const modalDescription = document.getElementById("modal-description");
const modalIcon = document.getElementById("modal-icon");

const confirmButton = document.getElementById("confirm-button");

const destinationAccountField =
    document.getElementById("destination-account-field");


const transactionConfig = {

    deposit: {
        title: "Depósito",
        description: "Adicione dinheiro à sua conta",
        button: "Confirmar depósito",
        icon: "arrow-down",
        className: "deposit-icon"
    },

    withdraw: {
        title: "Saque",
        description: "Retire dinheiro da sua conta",
        button: "Confirmar saque",
        icon: "arrow-up",
        className: "withdraw-icon"
    },

    transfer: {
        title: "Transferência",
        description: "Envie dinheiro para outra conta",
        button: "Confirmar transferência",
        icon: "arrow-right-left",
        className: "transfer-icon"
    }

};


transactionCards.forEach(card => {

    card.addEventListener("click", () => {

        const type = card.dataset.transaction;

        const config = transactionConfig[type];

        modalTitle.textContent = config.title;
        modalDescription.textContent = config.description;
        confirmButton.textContent = config.button;

        modalIcon.className =
            `modal-icon ${config.className}`;

        modalIcon.innerHTML =
            `<i data-lucide="${config.icon}"></i>`;


        if (type === "transfer") {

            destinationAccountField.style.display = "flex";

        } else {

            destinationAccountField.style.display = "none";

        }


        modal.classList.add("show");

        lucide.createIcons();

    });

});


function closeModal() {

    modal.classList.remove("show");

}


modalClose.addEventListener("click", closeModal);

cancelButton.addEventListener("click", closeModal);


modal.addEventListener("click", (event) => {

    if (event.target === modal) {
        closeModal();
    }

});