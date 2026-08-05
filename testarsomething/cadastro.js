const usuarios = require("./database");

function cadastrar (nome, senha, confirmarsenha) {
if(!nome || !senha ||  !confirmarsenha)  {
    return "preencha todos os campos.";
}
if(senha !== confirmarsenha) {
return "as senhas nao coincidem.";
}
const existe = usuarios.find(u => u.nome === nome);
if  (existe) {
    return "usuarios ja cadastrado.";
}
usuarios.push({
nome,
senha,
validado: false

});
return "cadastro realizado com sucesso.";
}
module.exports = cadastrar;