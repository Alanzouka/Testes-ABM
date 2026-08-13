const express = require("express");
const path = require("path");
const jwt = require("jsonwebtoken");
const cadastrar = require("./cadastro");
const validar = require("./validacao");
const login = require("./login");
const permitirApenas = require("./middlewares/permitirApenas");

const SEGREDO = "nossa_chave_super_hiper_mega_secreta";

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

// ===== O "PORTEIRO" (middleware de verificação de role) =====

function permitirApenas(...rolesPermitidas) {
    return function (req, res, next) {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ erro: "token nao fornecido." });
        }

        const token = authHeader.split(" ")[1]; // formato: "Bearer TOKEN"

        try {
            const dados = jwt.verify(token, SEGREDO);

            if (!rolesPermitidas.includes(dados.role)) {
                return res.status(403).json({ erro: "acesso negado para essa role." });
            }

            req.usuario = dados; // guarda os dados do usuário pra usar depois, se precisar
            next(); // libera a passagem
        } catch (erro) {
            return res.status(401).json({ erro: "token invalido ou expirado." });
        }
    };
}

// ===== ROTAS PROTEGIDAS (exemplo de uso do porteiro) =====

app.get("/api/pedagogia/avisos", permitirApenas("pedagogia"), (req, res) => {
    res.json({ mensagem: "acesso liberado para pedagogia!" });
});

app.get("/api/pais/agenda", permitirApenas("responsavel", "pedagogia"), (req, res) => {
    res.json({ mensagem: "acesso liberado para responsavel ou pedagogia!" });
});

app.listen(3000, () => {
    console.log("servidor rodando em http://localhost:3000");
});