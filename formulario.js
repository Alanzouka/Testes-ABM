const form = document.getElementById('formAviso');

    form.addEventListener('submit', function(event) {
        event.preventDefault(); // impede o recarregamento da página

        const texto = document.getElementById('mensagem').value;

        if (texto.trim() === '') {
            alert('Escreve alguma coisa antes de publicar!');
            return;
        }

        console.log('Aviso publicado:', texto);
        document.getElementById('resultado').innerText = 'Aviso publicado: ' + texto;

        form.reset(); // limpa o campo depois de enviar

        fetch('/publicar-aviso', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
        })
        .then(res => res.json())
        .then(data => {
            if(data.ok) console.log('Email enviado com sucesso!!!!');
        })
        .catch(err => console.error('Erro ao notificar por email.', err));

    });