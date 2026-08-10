const express = require("express");
const path = require("path");
const cadastrar = require("./cadastro");
const validar = require("./validacao");
const login = require("./login");

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "public"))); // serve o HTML, CSS, JS do front

app.post("/api/cadastro", async (req, res) => {
    const { nome, email, senha, confirmarsenha } = req.body;
    const resultado = await cadastrar(nome, email, senha, confirmarsenha);
    res.send(resultado);
});

app.post("/api/validacao", (req, res) => {
    const { nome } = req.body;
    res.send(validar(nome));
});

app.post("/api/login", async (req, res) => {
    const { email, senha } = req.body;
    const resultado = await login(email, senha);
    res.send(resultado);
});

app.listen(3000, () => {
    console.log("servidor rodando em http://localhost:3000");
});