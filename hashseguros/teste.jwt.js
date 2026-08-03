const jwt = require('jsonwebtoken');

const SEGREDO = "nossa_chave_super_hiper_mega_secreta";

function testarJWT() {
    const dadosUsuario = {
        email: "teste@email.com",
        nome: "Allan viadinho"
    };

    const token = jwt.sign(dadosUsuario, SEGREDO, {expiresIn: '2h'});
    console.log("Token gerado:", token);

    try {
        dadosDecodificados = jwt.verify(token, SEGREDO);
        console.log("O token deu certo, oh o que tem dentro:", dadosDecodificados);
    } catch (erro) {
        console.log("O token deu ruim, olha o erro:", erro.message);
    }

    const tokenFalso = token + "maldade";
    try {
        jwt.verify(tokenFalso, SEGREDO);
    } catch (erro) {
        console.log("Sa porra é falsa, olha isso:", erro.message);
    }
}
testarJWT();