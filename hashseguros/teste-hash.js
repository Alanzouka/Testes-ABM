const bcrypt = require('bcrypt');

async function testarHash() {
    const senhaOriginal = "123456";

    const saltRounds = 10;
    const hash = await bcrypt.hash(senhaOriginal, saltRounds);
    console.log("Senha original:", senhaOriginal);
    console.log("Hash gerado:", hash);
    
    const senhaDigitadaCorreta = "123456";
    const senhaDigitadaErrada = "senhaErrada";

    const resultado1 = await bcrypt.compare(senhaDigitadaCorreta, hash);
    const reseltado2 = await bcrypt.compare(senhaDigitadaErrada, hash);

    console.log("Tá certo isso aí?", resultado1);
    console.log("Tá errado não tá?", reseltado2);
}

testarHash();