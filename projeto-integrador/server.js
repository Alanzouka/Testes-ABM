const express = require("express");
const path = require("path");
const cadastrar = require("./services/cadastro");
const validar = require("./services/validacao");
const login = require("./services/login");
const permitirApenas = require("./middlewares/permitirApenas");

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// ===== ROTAS PÚBLICAS (não precisam de token) =====

app.post("/api/cadastro", async (req, res) => {
    const { nome, email, senha, confirmarsenha } = req.body;
    res.send(await cadastrar(nome, email, senha, confirmarsenha));
});

app.post("/api/validacao", (req, res) => {
    const { nome } = req.body;
    res.send(validar(nome));
});

app.post("/api/login", async (req, res) => {
    const { email, senha } = req.body;
    res.json(await login(email, senha));
});

// ===== ROTAS PROTEGIDAS =====

app.get("/api/pedagogia/avisos", permitirApenas("pedagogia"), (req, res) => {
    res.json({ mensagem: "acesso liberado para pedagogia!" });
});

app.get("/api/pais/agenda", permitirApenas("responsavel", "pedagogia"), (req, res) => {
    res.json({ mensagem: "acesso liberado para responsavel ou pedagogia!" });
});

app.listen(3000, () => {
    console.log("servidor rodando em http://localhost:3000");
});