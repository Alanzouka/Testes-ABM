const form = document.getElementById('formFeedback');

form.addEventListener('submit', function(event) {
    event.preventDefault();

    const texto = document.getElementById('feedbackTexto').value;
    const emailUsuario = document.getElementById('feedbackEmail').value;

    if (texto.trim() === '') {
        alert('Escreve alguma coisa antes de enviar!');
        return;
    }

    fetch('/enviar-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ texto, emailUsuario })
    })
    .then(res => res.json())
    .then(data => {
        document.getElementById('resultadoFeedback').innerText = data.ok
            ? 'Feedback enviado, valeu!'
            : 'Deu erro, tenta de novo.';
        form.reset();
    })
    .catch(err => console.error('Erro ao enviar feedback:', err));
});