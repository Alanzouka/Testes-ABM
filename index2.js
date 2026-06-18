const nodemailer = require('nodemailer');
const db = require('./database.js');

// ─── Configuração do transporte (igual ao que você já tinha) ───────────────────
const transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'lulaticospedagogia@gmail.com',
        pass: 'senhasenha',
    }
});

// ─── Email de SUPORTE (para onde o feedback vai chegar) ────────────────────────
const EMAIL_SUPORTE = 'lulaticospedagogia@gmail.com';

// ─── Função principal que você vai chamar quando o botão for clicado ──────────
// Parâmetros:
//   userId      → id do usuário logado (virá da sessão/login no app real)
//   mensagem    → texto que a pessoa digitou no campo de feedback
function enviarFeedback(userId, mensagem) {

    // Simula puxar o usuário logado no banco (no app real isso vem da sessão)
    const usuarioLogado = db.listaEmails.find(u => u.id === userId);

    if (!usuarioLogado) {
        console.error('Usuário não encontrado no banco.');
        return;
    }

    if (!mensagem || mensagem.trim() === '') {
        console.error('Mensagem de feedback está vazia.');
        return;
    }

    transport.sendMail({
        from: `Lulaticos App <lulaticospedagogia@gmail.com>`,
        to: EMAIL_SUPORTE,
        subject: `Novo Feedback recebido de ${usuarioLogado.name}`,
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
        console.log(`✅ Feedback de "${usuarioLogado.name}" enviado para o suporte.`);
    })
    .catch(err => {
        console.error('❌ Erro ao enviar feedback:', err);
    });
}

// ─── SIMULAÇÃO: testando como se os dois usuários do banco enviassem feedback ──
// (Remova isso quando integrar com o front de verdade)
enviarFeedback(1, 'O app tá ótimo, mas seria legal ter modo escuro!');
enviarFeedback(2, 'Encontrei um bug na tela de avisos, o botão some às vezes.');