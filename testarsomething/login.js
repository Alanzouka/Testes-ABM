const usuarios = require("./database");

function login(nome, senha) {
    const usuario = usuarios.find(u => u.nome === nome && u.senha === senha);
    if (!usuario) {
        return "usuario ou senha incorretos.";
    }
    if (!usuario.validado) {
        return "conta ainda nao validada.";
    }
    return "login realizado com sucesso!";
}

module.exports = login;