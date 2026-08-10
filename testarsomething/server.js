const express = require("express");
const cadastrar = require("./cadastro");
const validar = require("./validacao");
const login = require("./login");

const app = express();
app.use(express.json());

app.post("/cadastro", (req, res) => {
    const { nome, senha, confirmarsenha } = req.body;
    res.send(cadastrar(nome, senha, confirmarsenha));
});

app.post("/validacao", (req, res) => {
    const { nome } = req.body;
    res.send(validar(nome));
});

app.post("/login", (req, res) => {
    const { nome, senha } = req.body;
    res.send(login(nome, senha));
});

app.listen(3000, () => {
    console.log("servidor rodando em http://localhost:3000");
});