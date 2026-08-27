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

// ===== 3. Busca os avisos reais e desenha os cards na tela =====
async function carregarAvisos() {
    try {
        const resposta = await fetch('/api/pais/agenda', {
            method: 'GET',
            headers: { 'Authorization': 'Bearer ' + token }
        });

        if (resposta.status === 401 || resposta.status === 403) {
            const erro = await resposta.json();
            alert(erro.erro);
            localStorage.removeItem('token');
            localStorage.removeItem('role');
            window.location.href = '../login/login.html';
            return;
        }

        const dados = await resposta.json();
        desenharCards(dados.avisos);

    } catch (erro) {
        console.error('Erro ao carregar avisos:', erro);
    }
}

function desenharCards(avisos) {
    const container = document.querySelector('.lista-cards');
    container.innerHTML = ''; // limpa os cards fixos que estavam no HTML

    if (avisos.length === 0) {
        container.innerHTML = '<p>Nenhum aviso publicado ainda.</p>';
        return;
    }

    avisos.forEach((aviso, index) => {
        const cor = index % 2 === 0 ? 'escuro' : 'claro';

        const card = document.createElement('div');
        card.className = `card-aviso ${cor}`;
        card.innerHTML = `
            <h2 class="data">${aviso.data || 'sem data'}</h2>
            <p class="descricao">${aviso.texto}</p>
            <details>
                <summary>ler mais</summary>
                <p>${aviso.texto}</p>
                <input type="button" value="Editar Aviso!" class="btn btn-primary"
                    onclick="window.location.href='editar-aviso.html?id=${aviso.id}'">
            </details>
        `;
        container.appendChild(card);
    });
}

carregarAvisos();

// ===== 4. Logout =====
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    window.location.href = '../login/login.html';
}