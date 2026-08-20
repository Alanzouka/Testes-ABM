const nodemailer = require('nodemailer');
const { usuarios } = require("../database");

const transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'lulaticospedagogia@gmail.com',
        pass: 'dnwofjipjgkzmini',
    }
});

const avisos = [];

async function publicarAviso(texto, data) {
    if (!texto || texto.trim() === '') {
        return { status: 400, corpo: { ok: false, erro: 'Texto do aviso é obrigatório.' } };
    }

    avisos.push({ texto, data, criadoEm: new Date() });

    const responsaveis = usuarios.filter(u => u.role === "responsavel" && u.validado === true);

    const envios = responsaveis.map(usuario => {
        return transport.sendMail({
            from: 'Lulaticos <lulaticospedagogia@gmail.com>',
            to: usuario.email,
            subject: 'Novo aviso pendente!',
            html: `
                <h1>Olá ${usuario.nome}!</h1>
                <p style="font-weight: 300;">Um novo aviso foi adicionado na agenda:</p>
                <p><strong>Data:</strong> ${data || 'não informada'}</p>
                <p>${texto}</p>
                <p style="font-weight: 300;">Para mais informações, acesse o sistema.</p>
            `,
            text: `Novo aviso (${data || 'sem data'}): ${texto}`,
        })
        .then(() => console.log('Email enviado para', usuario.email))
        .catch(err => console.error('Erro ao enviar para', usuario.email, err));
    });

    await Promise.all(envios);

    return { status: 200, corpo: { ok: true, totalEnviados: responsaveis.length } };
}

function listarAvisos() {
    return avisos;
}

module.exports = { publicarAviso, listarAvisos };