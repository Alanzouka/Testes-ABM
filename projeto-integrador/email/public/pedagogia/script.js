// ===== 1. Verifica se existe um token guardado =====
const token = localStorage.getItem('token');

if (!token) {
    alert('Você precisa fazer login primeiro.');
    window.location.href = '../login/login.html';
}

// ===== 2. Pega o nome do usuário direto do token =====
function pegarDadosDoToken(token) {
    const partes = token.split('.');
    const dados = JSON.parse(atob(partes[1]));
    return dados;
}

const usuario = pegarDadosDoToken(token);
document.getElementById('nome-usuario').textContent = usuario.nome;

// ===== 3. Confirma acesso com o backend (rota exclusiva da pedagogia) =====
async function verificarAcesso() {
    try {
        const resposta = await fetch('/api/pedagogia/avisos', {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token
            }
        });

        if (resposta.status === 401 || resposta.status === 403) {
            const erro = await resposta.json();
            alert(erro.erro);
            localStorage.removeItem('token');
            localStorage.removeItem('role');
            window.location.href = '../login/login.html';
            return;
        }

        // acesso liberado — quem chegou até aqui é da pedagogia
        const dados = await resposta.json();
        console.log(dados);

    } catch (erro) {
        console.error('Erro ao verificar acesso:', erro);
    }
}

verificarAcesso();

// ===== 4. Botão "Adicionar novo aviso" =====
document.querySelector('.novo-aviso').addEventListener('click', function () {
    window.location.href = './novo-aviso.html';
});
// ===== 5. Logout (se tiverem um botão de sair) =====
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    window.location.href = '../login/login.html';
}