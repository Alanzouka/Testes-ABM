const express = require("express");
const path = require("path");
const cadastrar = require("./services/cadastro");
const validar = require("./services/validacao");
const login = require("./services/login");
const { publicarAviso, listarAvisos, buscarAvisoPorId, editarAviso, deletarAviso } = require("./services/avisos");
const permitirApenas = require("./middlewares/permitirApenas");

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// ===== ROTAS PÚBLICAS =====

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

// criar um aviso novo (só pedagogia)
app.post("/api/pedagogia/avisos", permitirApenas("pedagogia"), async (req, res) => {
    const { texto, data } = req.body;
    const resultado = await publicarAviso(texto, data);
    res.status(resultado.status).json(resultado.corpo);
});

// buscar um aviso específico pelo ID (pra preencher a tela de edição)
app.get("/api/pedagogia/avisos/:id", permitirApenas("pedagogia"), (req, res) => {
    const aviso = buscarAvisoPorId(req.params.id);
    if (!aviso) {
        return res.status(404).json({ erro: "Aviso não encontrado." });
    }
    res.json(aviso);
});

// editar um aviso existente (só pedagogia)
app.put("/api/pedagogia/avisos/:id", permitirApenas("pedagogia"), async (req, res) => {
    const { texto, data } = req.body;
    const resultado = await editarAviso(req.params.id, texto, data);
    res.status(resultado.status).json(resultado.corpo);
});

// deletar um aviso (só pedagogia)
app.delete("/api/pedagogia/avisos/:id", permitirApenas("pedagogia"), (req, res) => {
    const resultado = deletarAviso(req.params.id);
    res.status(resultado.status).json(resultado.corpo);
});

// listar avisos (pedagogia e responsáveis)
app.get("/api/pais/agenda", permitirApenas("responsavel", "pedagogia"), (req, res) => {
    res.json({ avisos: listarAvisos() });
});

app.listen(3000, () => {
    console.log("servidor rodando em http://localhost:3000");
});