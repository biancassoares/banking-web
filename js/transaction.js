document.addEventListener("DOMContentLoaded", () => {

    const transactionCards =
        document.querySelectorAll(".transaction-card");

    const modal =
        document.getElementById("transaction-modal");

    const modalClose =
        document.getElementById("modal-close");

    const cancelButton =
        document.getElementById("cancel-button");

    const modalTitle =
        document.getElementById("modal-title");

    const modalDescription =
        document.getElementById("modal-description");

    const modalIcon =
        document.getElementById("modal-icon");

    const confirmButton =
        document.getElementById("confirm-button");

    const destinationAccountField =
        document.getElementById("destination-account-field");

    const destinationAccountInput =
        document.getElementById("destination-account");

    const accountSelect =
        document.getElementById("account");

    const amountInput =
        document.getElementById("amount");
        amountInput.addEventListener("invalid", () => {

            amountInput.setCustomValidity(
                "Digite o valor com duas casas decimais. Exemplo: 10,50."
            );

        });


        amountInput.addEventListener("input", () => {

            amountInput.setCustomValidity("");

        });

    const transactionForm =
        document.getElementById("transaction-form");


    let currentTransactionType = null;
    let currentIdempotencyKey = null;
    let isSubmitting = false;
    let userAccounts = [];


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


    async function loadAccounts() {

        const token =
            sessionStorage.getItem("token");


        try {

            const response = await fetch(`${window.API_URL}/accounts`, {
                    method: "GET",

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
                    "Erro ao buscar contas."
                );

            }


            const accounts =
                await response.json();

            userAccounts = accounts;

            accountSelect.innerHTML = "";


            if (accounts.length === 0) {

                const option =
                    document.createElement("option");

                option.textContent =
                    "Nenhuma conta disponível";

                option.disabled = true;
                option.selected = true;

                accountSelect.appendChild(option);

                confirmButton.disabled = true;

                return;
            }


            accounts.forEach(account => {

                const option =
                    document.createElement("option");

                option.value = account.id;

                const lastFourDigits =
                    account.accountNumber.slice(-4);

                option.textContent =
                    `Conta •••• ${lastFourDigits}`;

                accountSelect.appendChild(option);

            });


        } catch (error) {

            console.error(
                "Erro ao carregar contas:",
                error
            );

        }

    }

    function loadDestinationAccounts() {

        const sourceAccountId =
            Number(accountSelect.value);

        destinationAccountInput.innerHTML =
            '<option value="">Selecione a conta de destino</option>';

        const destinationAccounts =
            userAccounts.filter(
                account =>
                    Number(account.id) !== sourceAccountId
            );

        if (destinationAccounts.length === 0) {

            const option =
                document.createElement("option");

            option.textContent =
                "Nenhuma outra conta disponível";

            option.disabled = true;

            destinationAccountInput.appendChild(option);

            return;
        }

        destinationAccounts.forEach(account => {

            const option =
                document.createElement("option");

            option.value =
                account.id;

            const lastFourDigits =
                account.accountNumber.slice(-4);

            option.textContent =
                `Conta •••• ${lastFourDigits}`;

            destinationAccountInput.appendChild(option);
        });
    }

    transactionCards.forEach(card => {

        card.addEventListener("click", () => {

            const type =
                card.dataset.transaction;

            const config =
                transactionConfig[type];


            currentTransactionType = type;

            currentIdempotencyKey =
                crypto.randomUUID();


            modalTitle.textContent =
                config.title;

            modalDescription.textContent =
                config.description;

            confirmButton.textContent =
                config.button;


            modalIcon.className =
                `modal-icon ${config.className}`;

            modalIcon.innerHTML =
                `<i data-lucide="${config.icon}"></i>`;


             if (type === "transfer") {

                    destinationAccountField.style.display =
                   "flex";

                    destinationAccountInput.required =
                      true;

                    loadDestinationAccounts();

              } else {

                    destinationAccountField.style.display =
                         "none";

                     destinationAccountInput.required =
                        false;

                      destinationAccountInput.value =
                        "";

   }


            modal.classList.add("show");

            lucide.createIcons();

        });

    });
    accountSelect.addEventListener("change", () => {

        if (currentTransactionType === "transfer") {
            loadDestinationAccounts();
        }

    });


    function closeModal() {

        modal.classList.remove("show");

        transactionForm.reset();

        currentTransactionType = null;
        currentIdempotencyKey = null;

    }


    modalClose.addEventListener(
        "click",
        closeModal
    );


    cancelButton.addEventListener(
        "click",
        closeModal
    );


    modal.addEventListener("click", (event) => {

        if (event.target === modal) {

            closeModal();

        }

    });


    transactionForm.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();


            if (isSubmitting) {
                return;
            }


            if (!currentTransactionType) {
                return;
            }


            const token =
                sessionStorage.getItem("token");

            const accountId =
                accountSelect.value;

            const amount =
                 Number(
                     amountInput.value.replace(",", ".")
                 );

            if (!accountId) {

                alert(
                    "Selecione uma conta."
                );

                return;
            }


            if (!amount || amount <= 0) {

                alert(
                    "Digite um valor válido."
                );

                return;
            }


            let endpoint = "";

            let body = {
                amount: amount
            };


            if (
                currentTransactionType === "deposit"
            ) {

                endpoint =
                    `/accounts/${accountId}/deposit`;

            }


            if (
                currentTransactionType === "withdraw"
            ) {

                endpoint =
                    `/accounts/${accountId}/withdraw`;

            }


            if (
                currentTransactionType === "transfer"
            ) {

                const destinationAccountId =
                    Number(
                        destinationAccountInput.value
                    );


                if (
                    !destinationAccountId ||
                    destinationAccountId <= 0
                ) {

                    alert(
                        "Digite uma conta de destino válida."
                    );

                    return;
                }


                if (
                    Number(accountId) ===
                    destinationAccountId
                ) {

                    alert(
                        "A conta de destino deve ser diferente da conta de origem."
                    );

                    return;
                }


                endpoint =
                    `/accounts/${accountId}/transfer`;


                body = {
                    amount: amount,
                    destinationAccountId:
                        destinationAccountId
                };

            }


            try {

                isSubmitting = true;

                confirmButton.disabled = true;
                confirmButton.textContent =
                    "Processando...";


                const response = await fetch(
                    `${window.API_URL}${endpoint}`,
                    {
                        method: "POST",

                        headers: {
                            "Authorization":
                                `Bearer ${token}`,

                            "Content-Type":
                                "application/json",

                            "Idempotency-Key":
                                currentIdempotencyKey
                        },

                        body:
                            JSON.stringify(body)
                    }
                );


                if (response.status === 401) {

                    sessionStorage.removeItem(
                        "token"
                    );

                    window.location.href =
                        "index.html";

                    return;
                }


               if (!response.ok) {

                   const errorText =
                       await response.text();

                   let errorMessage =
                       "Não foi possível realizar a operação.";


                   if (errorText) {

                       try {

                           const errorBody =
                               JSON.parse(errorText);

                           errorMessage =
                               errorBody.message ||
                               errorMessage;

                       } catch {

                           errorMessage =
                               errorText;

                       }

                   }


                   throw new Error(errorMessage);

               }


                let successMessage = "";


                if (
                    currentTransactionType ===
                    "deposit"
                ) {

                    successMessage =
                        "Depósito realizado com sucesso!";

                }


                if (
                    currentTransactionType ===
                    "withdraw"
                ) {

                    successMessage =
                        "Saque realizado com sucesso!";

                }


                if (
                    currentTransactionType ===
                    "transfer"
                ) {

                    successMessage =
                        "Transferência realizada com sucesso!";

                }


                alert(successMessage);


                closeModal();

                await loadAccounts();


            } catch (error) {

                console.error(
                    "Erro na transação:",
                    error
                );

                alert(error.message);


            } finally {

                isSubmitting = false;

                confirmButton.disabled = false;

                if (currentTransactionType) {

                    confirmButton.textContent =
                        transactionConfig[
                            currentTransactionType
                        ].button;

                }

            }

        }
    );


    loadAccounts();

});