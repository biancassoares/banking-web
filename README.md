# Banking Web 🏦

Frontend desenvolvido para consumir a **Banking API**, projeto backend construído com Java e Spring Boot.

A aplicação fornece uma interface web para autenticação, gerenciamento de contas e operações financeiras.

## ✨ Funcionalidades

- Cadastro e login de usuários
- Autenticação com JWT
- Criação e visualização de contas
- Depósitos, saques e transferências
- Histórico de transações
- Filtros e paginação
- Proteção de páginas autenticadas
- Logout e controle de sessão

## 🛠 Tecnologias

- HTML5
- CSS3
- JavaScript
- Fetch API
- Session Storage
- REST API
- JWT

## 🔐 Integração com a API

O frontend consome a Banking API e envia o token JWT nas requisições protegidas.

As operações financeiras também utilizam `Idempotency-Key`, evitando o processamento duplicado de uma mesma operação.

## 🔗 Projetos relacionados

### Backend

[Banking API](LINK_DO_REPOSITORIO_BANKING_API)

### Demonstração

[Ver no portfólio](https://biancasoares.vercel.app/#projetos)

## 🚀 Executando localmente

Clone o projeto:

```bash
git clone (https://github.com/biancassoares/banking-web)
```

Configure a URL da API em:

```text
js/config.js
```

Depois execute o projeto utilizando um servidor local.

## 👩🏻‍💻 Autora

**Bianca Soares 😊**

Até o próximo projeto 👋
