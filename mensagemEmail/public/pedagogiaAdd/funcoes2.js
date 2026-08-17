document.addEventListener('DOMContentLoaded', () => {
    const btnEditar = document.getElementById('btn-editar');
    const btnDeletar = document.getElementById('btn-deletar');
    const btnConfirmar = document.getElementById('btn-confirmar');
    const inputData = document.getElementById('data-aviso');
    const textareaConteudo = document.getElementById('texto-aviso');

    btnEditar.addEventListener('click', () => {
        inputData.removeAttribute('disabled');
        textareaConteudo.removeAttribute('disabled');
        textareaConteudo.focus();
        alert("Modo de edição ativado! Faça suas alterações.");
    });

    btnDeletar.addEventListener('click', () => {
        if (confirm("Tem certeza que deseja excluir o conteúdo deste aviso?")) {
            inputData.value = '';
            textareaConteudo.value = '';
            inputData.setAttribute('disabled', 'true');
            textareaConteudo.setAttribute('disabled', 'true');
        }
    });

    btnConfirmar.addEventListener('click', () => {
        const texto = textareaConteudo.value.trim();
        const data = inputData.value;

        if (texto === '') {
            alert('Escreve alguma coisa antes de confirmar!');
            return;
        }

        inputData.setAttribute('disabled', 'true');
        textareaConteudo.setAttribute('disabled', 'true');

        btnConfirmar.disabled = true;
        btnConfirmar.innerText = 'Enviando...';

        fetch('/publicar-aviso', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ texto, data })
        })
        .then(res => res.json())
        .then(resposta => {
            if (resposta.ok) {
                alert("Aviso salvo e e-mails enviados com sucesso!");
            } else {
                alert("Aviso salvo, mas houve um problema ao enviar os e-mails.");
            }
        })
        .catch(err => {
            console.error('Erro ao notificar por email:', err);
            alert("Erro ao publicar o aviso. Tenta de novo.");
        })
        .finally(() => {
            btnConfirmar.disabled = false;
            btnConfirmar.innerHTML = '<i class="bi bi-check-lg"></i>';
        });
    });
});