const nodemailer = require('nodemailer');
const db = require('./database.js');
const listaEmails = db.listaEmails.map(u => u.emails);
const transport = nodemailer.createTransport({

    service: 'gmail',
    auth: {
        user: 'lulaticospedagogia@gmail.com',
        pass:'dnwofjipjgkzmini',
    }
});
listaEmails.forEach(emailDestinatario => {
    transport.sendMail({
        from: 'Lulaticos <lulaticospedagogia@gmail.com>',
        to: emailDestinatario,
        subject: 'Novo aviso pendente!',
        html: '<h1>Olá ' + db.listaEmails.find(u => u.emails === emailDestinatario)?.name + '!</h1> <p style="font-weight: 300;">um novo aviso foi adicionado na agenda, para mais informações, acesse o sistema.</p>',
        text: 'avisos',
    })

    .then(() => {
        console.log('Email enviado com sucesso para', emailDestinatario);
    })
    .catch(err => {
        console.error('Erro ao enviar email para', emailDestinatario, err);

    });
    

});

