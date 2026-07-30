const express = require('express');
const bcrypt = require('bcrypt');

const app = express();
app.use(express.json());


const usuarios = [];


app.post('/cadastro', async(req, res) => {
    const {nome, email, senha} = req.body;

    if (!nome || !email || !senha) {
        return res.status(400).json({erro: "Preenche tudo aí"});
    }

    const jaExiste = usuarios.find(u => u.email === email);
    if(jaExiste){
        return res.status(409).json({erro: "Já tem essa porra cadastrada"});
    }

    const hashSenha = await bcrypt.hash(senha, 10);

    usuarios.push({nome, email, senha: hashSenha});

    console.log("Usuários cadastrados até agora:", usuarios);

    res.status(201).json({mensagem: "Uhuu criou com sucesso"});
});

app.post('/login', async(req, res) => {
    const {email, senha} = req.body;

    const usuario = usuarios.find(u => u.email === email);
    if(!usuario) {
        return res.status(401).json({erro:"Tem treco errado aí"});
    }

    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
    if (!senhaCorreta) {
        return res.status(401).json({erro: "Tem treco errado aí"});
    }

    res.json({mensagem: "O login deu certo viado", nome: usuario.nome, email: usuario.email});
});

const PORTA = 3002;
app.listen(PORTA, () => {
    console.log('Servidor rodando em http://localhost:3002')
});