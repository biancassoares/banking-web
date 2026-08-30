document.addEventListener("DOMContentLoaded", async () => {

    const token =
        sessionStorage.getItem("token");

    const accountsGrid =
        document.getElementById("accounts-grid");

    const addAccountCard =
        document.getElementById("add-account-card");

    const accountsLoading =
        document.getElementById("accounts-loading");

    function hideAccountsLoading() {
        accountsLoading?.remove();
    }


    function renderAccounts(accounts) {

        const existingCards =
            accountsGrid.querySelectorAll(".account-card");

        existingCards.forEach(card => {

            if (card !== addAccountCard) {
                card.remove();
            }

        });


        accounts.forEach(account => {

            const accountCard =
                document.createElement("article");

            accountCard.classList.add("account-card");

            accountCard.dataset.accountId =
                account.id;


            const accountTitle =
                document.createElement("h3");

            accountTitle.textContent =
                "Conta Bancária";


            const accountNumber =
                document.createElement("p");

            accountNumber.classList.add(
                "account-number"
            );


            const lastFourDigits =
                account.accountNumber.slice(-4);

            accountNumber.textContent =
                `•••• ${lastFourDigits}`;


            const balanceContainer =
                document.createElement("div");

            balanceContainer.classList.add(
                "balance-container"
            );


            const balanceLabel =
                document.createElement("span");

            balanceLabel.textContent =
                "Saldo disponível";


            const balanceValue =
                document.createElement("strong");

            balanceValue.textContent =
                new Intl.NumberFormat(
                    "pt-BR",
                    {
                        style: "currency",
                        currency: "BRL"
                    }
                ).format(account.balance);


            balanceContainer.append(
                balanceLabel,
                balanceValue
            );


            accountCard.append(
                accountTitle,
                accountNumber,
                balanceContainer
            );


            accountsGrid.insertBefore(
                accountCard,
                addAccountCard
            );

        });

    }


    const cachedAccounts =
        sessionStorage.getItem("accountsCache");


    if (cachedAccounts) {

        try {

            renderAccounts(
                JSON.parse(cachedAccounts)
            );
            hideAccountsLoading();


        } catch (error) {

            console.error(
                "Erro ao carregar cache de contas:",
                error
            );

        }

    }


    try {

        const response = await fetch(
            `${window.API_URL}/accounts`,
            {
                method: "GET",

                headers: {
                    "Authorization":
                        `Bearer ${token}`
                }
            }
        );


        if (response.status === 401) {

            sessionStorage.removeItem("token");

            window.location.href =
                "index.html";

            return;
        }


        if (!response.ok) {

            throw new Error(
                "Erro ao buscar contas."
            );

        }


        const accounts =
            await response.json();

            hideAccountsLoading();


        sessionStorage.setItem(
            "accountsCache",
            JSON.stringify(accounts)
        );


        renderAccounts(accounts);


    } catch (error) {

        console.error(
            "Erro ao carregar contas:",
            error
        );

    }

});