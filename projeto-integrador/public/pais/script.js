// ===== 1. Verifica se existe um token guardado =====
const token = localStorage.getItem('token');

if (!token) {
    alert('Você precisa fazer login primeiro.');
    window.location.href = '../login/login.html';
}

// ===== 2. Pega o nome do usuário direto do token (sem precisar de outra requisição) =====
function pegarDadosDoToken(token) {
    // um token JWT tem 3 partes separadas por ponto: cabecalho.dados.assinatura
    const partes = token.split('.');
    const dados = JSON.parse(atob(partes[1])); // decodifica a parte do meio (payload)
    return dados;
}

const usuario = pegarDadosDoToken(token);
document.getElementById('nome-usuario').textContent = usuario.nome;

// ===== 3. Confirma acesso com o backend (rota protegida) =====
async function verificarAcesso() {
    try {
        const resposta = await fetch('/api/pais/agenda', {
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
        }
        // se passou, a pessoa está autorizada — os avisos mockados já estão no HTML

    } catch (erro) {
        console.error('Erro ao verificar acesso:', erro);
    }
}

verificarAcesso();