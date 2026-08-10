const bcrypt = require('bcrypt');
const usuarios = require("./database");

async function cadastrar(nome, email, senha, confirmarsenha) {
    if (!nome || !email || !senha || !confirmarsenha) {
        return "preencha todos os campos.";
    }
    if (senha !== confirmarsenha) {
        return "as senhas nao coincidem.";
    }
    const existe = usuarios.find(u => u.email === email);
    if (existe) {
        return "usuario ja cadastrado.";
    }

    const hashSenha = await bcrypt.hash(senha, 10);
    usuarios.push({ nome, email, senha: hashSenha, validado: false });

    return "cadastro realizado com sucesso.";
}

module.exports = cadastrar;