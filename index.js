const nodemailer = require('nodemailer');
const db = require('./database.js');
const listaEmails = db.email_logados.map(u => u.email).join(',');
const transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'lulaticospedagogia@gmail.com',
        pass:'dnwofjipjgkzmini',
    }
});

transport.sendMail({
    from: 'Lulaticos <lulaticospedagogia@gmail.com>',
    to: listaEmails,
    subject: 'Novo aviso pendente!',
    html: '<h1>Aviso!<h1> <p>um novo aviso foi adicionado na agenda<p>',
    text: 'testeste',
})
.then(() => console.log('Email enviado com sucesso'))
.catch((err) => console.log('Erro ao enviar', err));