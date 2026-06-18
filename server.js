const express = require('express');
const path = require('path');
const nodemailer = require('nodemailer');
const db = require('./database.js');
 
const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname)));
 
const transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'lulaticospedagogia@gmail.com',
        pass: 'dnwofjipjgkzmini',
    }
});
 
// Rota chamada quando o aviso é publicado
app.post('/publicar-aviso', (req, res) => {
    const listaEmails = db.listaEmails.map(u => u.emails);
 
    const envios = listaEmails.map(emailDestinatario => {
        return transport.sendMail({
            from: 'Lulaticos <lulaticospedagogia@gmail.com>',
            to: emailDestinatario,
            subject: 'Novo aviso pendente!',
            html: '<h1>Olá ' + db.listaEmails.find(u => u.emails === emailDestinatario)?.name + '!</h1> <p style="font-weight: 300;">um novo aviso foi adicionado na agenda, para mais informações, acesse o sistema.</p>',
            text: 'avisos',
        })
        .then(() => console.log('Email enviado para', emailDestinatario))
        .catch(err => console.error('Erro ao enviar para', emailDestinatario, err));
    });
 
    Promise.all(envios).then(() => res.json({ ok: true }));
});
 
app.listen(3000, () => {
    console.log('Servidor rodando em http://localhost:3000');
});
 