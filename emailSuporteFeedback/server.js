const express = require('express');
const path = require('path');
const nodemailer = require('nodemailer');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname)));

const transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'suportelulaticos@gmail.com',   // esse projeto é do suporte, então autentica com ele
        pass: 'dnwofjipjgkzmini',             // gera uma senha de app pra essa conta também
    }
});

app.post('/enviar-feedback', (req, res) => {
    const { texto, emailUsuario } = req.body;

    if (!texto || texto.trim().length < 10) {
        return res.status(400).json({ ok: false, erro: 'Feedback muito curto.' });
    }

    transport.sendMail({
        from: 'Lulaticos Suporte <suportelulaticos@gmail.com>',
        to: 'suportelulaticos@gmail.com',
        subject: 'Novo feedback recebido',
        html: `<h1>Novo feedback</h1>
               <p><strong>De:</strong> ${emailUsuario || 'anônimo'}</p>
               <p>${texto}</p>`,
        text: texto,
    })
    .then(() => res.json({ ok: true }))
    .catch(err => {
        console.error('Erro ao enviar feedback:', err);
        res.status(500).json({ ok: false });
    });
});

app.listen(3001, () => {
    console.log('Servidor de feedback rodando em http://localhost:3001');
});