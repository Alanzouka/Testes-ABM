const formFeedback = document.getElementById('formFeedback');
const resultadoDiv = document.getElementById('resultadoFeedback');

formFeedback.addEventListener('submit', function (event) {
    event.preventDefault();

    const texto = document.getElementById('texto').value.trim();
    const emailUsuario = sessionStorage.getItem('emailFeedback') || '';

    if (texto === '') {
        alert('Escreva algo antes de enviar!');
        return;
    }

    if (texto.length < 5) {
        alert('O feedback precisa ter pelo menos 5 caracteres.');
        return;
    }

    fetch('/enviar-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ texto, emailUsuario })
    })
        .then(res => res.json())
        .then(data => {
            if (data.ok) {
                resultadoDiv.innerText = 'Feedback enviado com suceeso.';
                sessionStorage.removeItem('emailFeedback');
                formFeedback.reset();
            } else {
                resultadoDiv.innerText = data.erro || 'Deu erro, tenta de novo.';
            }
        })
        .catch(err => {
            console.error('Erro ao enviar feedback:', err);
            resultadoDiv.innerText = 'Erro ao enviar feedback, tente novamente.';
        });
});