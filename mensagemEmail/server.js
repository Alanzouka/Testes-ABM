const express = require('express');
const path = require('path');
const nodemailer = require('nodemailer');
const db = require('./database.js');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'lulaticospedagogia@gmail.com',
        pass: 'dnwofjipjgkzmini',
    }
});

app.post('/publicar-aviso', (req, res) => {
    const { texto, data } = req.body;

    if (!texto || texto.trim() === '') {
        return res.status(400).json({ ok: false, erro: 'Texto do aviso é obrigatório.' });
    }

    const listaEmails = db.listaEmails.map(u => u.emails);

    const envios = listaEmails.map(emailDestinatario => {
        const usuario = db.listaEmails.find(u => u.emails === emailDestinatario);

        return transport.sendMail({
            from: 'Lulaticos <lulaticospedagogia@gmail.com>',
            to: emailDestinatario,
            subject: 'Novo aviso pendente!',
            html: `
                <h1>Olá ${usuario?.name}!</h1>
                <p style="font-weight: 300;">Um novo aviso foi adicionado na agenda:</p>
                <p><strong>Data:</strong> ${data || 'não informada'}</p>
                <p>${texto}</p>
                <p style="font-weight: 300;">Para mais informações, acesse o sistema.</p>
            `,
            text: `Novo aviso (${data || 'sem data'}): ${texto}`,
        })
        .then(() => console.log('Email enviado para', emailDestinatario))
        .catch(err => console.error('Erro ao enviar para', emailDestinatario, err));
    });

    Promise.all(envios).then(() => res.json({ ok: true }));
});

app.listen(3000, () => {
    console.log('Servidor rodando em http://localhost:3000');
});