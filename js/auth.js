document.addEventListener("DOMContentLoaded", () => {


    // LOGIN
    const loginForm = document.getElementById("login-form");
    const loginError = document.getElementById("login-error");

    if (loginForm) {

        loginForm.addEventListener("submit", async (event) => {

            event.preventDefault();

            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;

            loginError.textContent = "";

            try {

                const response = await fetch(
                    `${window.API_URL}/auth/login`,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type": "application/json"
                        },

                        body: JSON.stringify({
                            email: email,
                            password: password
                        })
                    }
                );

                if (!response.ok) {

                    loginError.textContent =
                        "E-mail ou senha inválidos.";

                    return;
                }

                const data = await response.json();

                sessionStorage.setItem(
                    "token",
                    data.token
                );

                sessionStorage.setItem(
                    "userName",
                    data.name
                );

                window.location.href =
                    "dashboard.html";

            } catch (error) {

                loginError.textContent =
                    "Não foi possível conectar ao servidor.";

                console.error(error);
            }

        });
    }

    // CADASTRO
    const registerForm =
        document.getElementById("register-form");

    const registerMessage =
        document.getElementById("register-message");

    if (registerForm) {

        registerForm.addEventListener(
            "submit",
            async (event) => {

                event.preventDefault();

                const name =
                    document.getElementById("name").value;

                const email =
                    document.getElementById("email").value;

                const cpf =
                    document.getElementById("cpf").value;

                const password =
                    document.getElementById("password").value;

                registerMessage.textContent = "";

                try {

                    const response = await fetch(
                        `${window.API_URL}/customers`,
                        {
                            method: "POST",

                            headers: {
                                "Content-Type": "application/json"
                            },

                            body: JSON.stringify({
                                name: name,
                                email: email,
                                cpf: cpf,
                                password: password
                            })
                        }
                    );

              if (!response.ok) {

                  const errorBody = await response.text();

                  console.log("Status:", response.status);
                  console.log("Erro do backend:", errorBody);

                  registerMessage.textContent =
                      `Erro ${response.status}: ${errorBody}`;

                  return;
              }

                    registerMessage.textContent =
                        "Conta criada com sucesso!";

                registerForm.reset();

                alert("Conta criada com sucesso! Agora você pode fazer login.");

                window.location.href = "index.html";

                } catch (error) {

                    registerMessage.textContent =
                        "Não foi possível conectar ao servidor.";

                    console.error(error);
                }

            }
        );
    }

});