document.addEventListener("DOMContentLoaded", () => {

    const token =
        sessionStorage.getItem("token");

    const accountSelect =
        document.getElementById("filter-account");

    const typeSelect =
        document.getElementById("filter-type");

    const startDateInput =
        document.getElementById("start-date");

    const endDateInput =
        document.getElementById("end-date");

    const filterButton =
        document.getElementById("filter-button");

    const transactionsBody =
        document.getElementById("transactions-body");

    const pagination =
        document.getElementById("pagination");


    const accounts = new Map();

    let currentPage = 0;
    let totalPages = 0;


    async function loadAccounts() {

        try {

            const response = await fetch(
                `${window.API_URL}/accounts`,
                {
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
                    "Could not load accounts."
                );

            }


            const data =
                await response.json();


            data.forEach(account => {

                accounts.set(
                    account.id,
                    account
                );


                const option =
                    document.createElement("option");

                option.value =
                    account.id;


                const lastFourDigits =
                    account.accountNumber.slice(-4);


                option.textContent =
                    `Conta •••• ${lastFourDigits}`;


                accountSelect.appendChild(
                    option
                );

            });


            if (data.length > 0) {

                accountSelect.value =
                    data[0].id;

                await loadTransactions();

            }


        } catch (error) {

            console.error(
                "Erro ao carregar contas:",
                error
            );

        }

    }


    async function loadTransactions(page = 0) {

        const accountId =
            accountSelect.value;


        if (!accountId) {
            return;
        }


        const category =
            typeSelect.value;

        const startDate =
            startDateInput.value;

        const endDate =
            endDateInput.value;


        if (
            (startDate && !endDate) ||
            (!startDate && endDate)
        ) {

            alert(
                "Preencha a data inicial e a data final."
            );

            return;
        }


        const params =
            new URLSearchParams();


        params.append(
            "page",
            page
        );

        params.append(
            "size",
            10
        );


        if (category) {

            params.append(
                "category",
                category
            );

        }


        if (startDate && endDate) {

            params.append(
                "startDate",
                `${startDate}T00:00:00`
            );

            params.append(
                "endDate",
                `${endDate}T23:59:59`
            );

        }


        try {

            const response = await fetch(
                `http://localhost:8080/accounts/${accountId}/transactions?${params.toString()}`,
                {
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

                const errorText =
                    await response.text();

                throw new Error(
                    errorText ||
                    "Could not load transactions."
                );

            }


            const data =
                await response.json();


            currentPage =
                data.number;

            totalPages =
                data.totalPages;


            renderTransactions(
                data.content,
                Number(accountId)
            );


            renderPagination();


        } catch (error) {

            console.error(
                "Erro ao carregar transações:",
                error
            );

            alert(error.message);

        }

    }


    function renderTransactions(
        transactions,
        selectedAccountId
    ) {

        transactionsBody.innerHTML = "";


        if (transactions.length === 0) {

            const row =
                document.createElement("tr");


            row.innerHTML = `
                <td colspan="6"
                    style="text-align: center;">
                    Nenhuma transação encontrada.
                </td>
            `;


            transactionsBody.appendChild(
                row
            );

            return;

        }


        transactions.forEach(transaction => {

            const category =
                transaction.categoryName ||
                transaction.category;


            const account =
                accounts.get(
                    selectedAccountId
                );


            const lastFourDigits =
                account
                    ? account.accountNumber.slice(-4)
                    : "----";


            const isReceivedTransfer =
                category === "TRANSFER" &&
                Number(
                    transaction.destinationAccountId
                ) === selectedAccountId;


            let description = "";
            let typeLabel = "";
            let badgeClass = "";
            let amountClass = "";
            let amountPrefix = "";


            if (category === "DEPOSIT") {

                description = "Depósito";

                typeLabel = "Depósito";

                badgeClass = "deposit";

                amountClass = "positive";

                amountPrefix = "+";

            }


            if (category === "WITHDRAW") {

                description = "Saque";

                typeLabel = "Saque";

                badgeClass = "withdraw";

                amountClass = "negative";

                amountPrefix = "-";

            }


            if (category === "TRANSFER") {

                typeLabel =
                    "Transferência";

                badgeClass =
                    "transfer";


                if (isReceivedTransfer) {

                    description =
                        "Transferência recebida";

                    amountClass =
                        "positive";

                    amountPrefix =
                        "+";

                } else {

                    description =
                        "Transferência enviada";

                    amountClass =
                        "negative";

                    amountPrefix =
                        "-";

                }

            }


            const formattedAmount =
                new Intl.NumberFormat(
                    "pt-BR",
                    {
                        style: "currency",
                        currency: "BRL"
                    }
                ).format(
                    transaction.amount
                );


            const formattedDate =
                new Intl.DateTimeFormat(
                    "pt-BR",
                    {
                        dateStyle: "short",
                        timeStyle: "short"
                    }
                ).format(
                    new Date(
                        transaction.createdAt
                    )
                );


            const row =
                document.createElement("tr");


            row.innerHTML = `

                <td>
                    ${formattedDate}
                </td>


                <td>

                    <strong>
                        ${description}
                    </strong>

                </td>


                <td>

                    <span class="type-badge ${badgeClass}">
                        ${typeLabel}
                    </span>

                </td>


                <td>

                    <strong>
                        Conta Bancária
                    </strong>

                    <span>
                        •••• ${lastFourDigits}
                    </span>

                </td>


                <td class="${amountClass}">
                    ${amountPrefix} ${formattedAmount}
                </td>


                <td>

                    <span class="status-badge">
                        Concluída
                    </span>

                </td>

            `;


            transactionsBody.appendChild(
                row
            );

        });

    }


    function renderPagination() {

        pagination.innerHTML = "";


        if (totalPages <= 1) {
            return;
        }


        const previousButton =
            document.createElement("button");

        previousButton.className =
            "pagination-button";

        previousButton.innerHTML =
            `<i data-lucide="chevron-left"></i>`;

        previousButton.disabled =
            currentPage === 0;


        previousButton.addEventListener(
            "click",
            () => {

                loadTransactions(
                    currentPage - 1
                );

            }
        );


        pagination.appendChild(
            previousButton
        );


        for (
            let page = 0;
            page < totalPages;
            page++
        ) {

            const pageButton =
                document.createElement("button");


            pageButton.className =
                "pagination-number";


            if (page === currentPage) {

                pageButton.classList.add(
                    "active"
                );

            }


            pageButton.textContent =
                page + 1;


            pageButton.addEventListener(
                "click",
                () => {

                    loadTransactions(
                        page
                    );

                }
            );


            pagination.appendChild(
                pageButton
            );

        }


        const nextButton =
            document.createElement("button");

        nextButton.className =
            "pagination-button";

        nextButton.innerHTML =
            `<i data-lucide="chevron-right"></i>`;

        nextButton.disabled =
            currentPage >=
            totalPages - 1;


        nextButton.addEventListener(
            "click",
            () => {

                loadTransactions(
                    currentPage + 1
                );

            }
        );


        pagination.appendChild(
            nextButton
        );


        lucide.createIcons();

    }


    filterButton.addEventListener(
        "click",
        () => {

            loadTransactions(0);

        }
    );


    accountSelect.addEventListener(
        "change",
        () => {

            loadTransactions(0);

        }
    );


    loadAccounts();

});