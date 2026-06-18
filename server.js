const express = require('express');
const path = require('path');
const nodemailer = require('nodemailer');
const db = require('./database.js');
 
const app = express();
app.use(express.json());
 
// Serve o HTML da sua amiga
app.use(express.static(path.join(__dirname)));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'bi.html'));
});
 
// ─── Configuração do email ─────────────────────────────────────────────────────
const transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'lulaticospedagogia@gmail.com',
        pass: 'senhasenha',
    }
});
 
const EMAIL_SUPORTE = 'lulaticospedagogia@gmail.com';
 
// ─── Rota que recebe o feedback do front ──────────────────────────────────────
app.post('/feedback', (req, res) => {
    const { userId, mensagem } = req.body;
 
    const usuarioLogado = db.listaEmails.find(u => u.id === userId);
 
    if (!usuarioLogado) {
        return res.json({ ok: false, erro: 'Usuário não encontrado.' });
    }
 
    if (!mensagem || mensagem.trim() === '') {
        return res.json({ ok: false, erro: 'Mensagem vazia.' });
    }
 
    transport.sendMail({
        from: 'Lulaticos App <lulaticospedagogia@gmail.com>',
        to: EMAIL_SUPORTE,
        subject: `Novo Feedback de ${usuarioLogado.name}`,
        html: `
            <h2>📩 Novo Feedback</h2>
            <p><strong>Usuário:</strong> ${usuarioLogado.name}</p>
            <p><strong>Email:</strong> ${usuarioLogado.emails}</p>
            <p><strong>Mensagem:</strong></p>
            <blockquote style="border-left: 3px solid #ccc; padding-left: 12px; color: #555;">
                ${mensagem}
            </blockquote>
        `,
        text: `Feedback de ${usuarioLogado.name} (${usuarioLogado.emails}):\n\n${mensagem}`,
    })
    .then(() => {
        console.log(`✅ Feedback de "${usuarioLogado.name}" enviado.`);
        res.json({ ok: true });
    })
    .catch(err => {
        console.error('❌ Erro ao enviar email:', err);
        res.json({ ok: false, erro: 'Falha ao enviar email.' });
    });
});
 
app.listen(3000, () => {
    console.log('Servidor rodando em http://localhost:3000');
});