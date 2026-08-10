document.getElementById('form-login').addEventListener('submit', async function (evento) {
    evento.preventDefault(); // impede a página de recarregar

    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;

    const resposta = await fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha })
    });

    const resultado = await resposta.json();

    if (resultado.token) {
        alert(resultado.mensagem);
        // depois: guardar o token e redirecionar para outra página
    } else {
        alert(resultado.erro);
    }
});