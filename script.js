/**
 * script.js (Para o formulário de submissão - index.html)
 * * Responsável por:
 * - Capturar os dados do formulário de Ordem de Serviço.
 * - Enviar os dados (incluindo a foto) para a API do backend.
 * - Exibir feedback de sucesso/erro para o usuário com base na resposta do servidor.
 */

// --- CONFIGURAÇÃO ---
const API_URL = 'http://localhost:3000/ordens-servico';

// --- SELEÇÃO DOS ELEMENTOS DO DOM ---
const form = document.getElementById('os-form');
const submitButton = form.querySelector('button[type="submit"]');
const feedbackMessage = document.getElementById('feedback-message');

// --- EVENT LISTENER PRINCIPAL ---
form.addEventListener('submit', async (event) => {
    event.preventDefault();

    submitButton.disabled = true;
    submitButton.textContent = 'Enviando, aguarde...';
    feedbackMessage.style.display = 'none';

    const formData = new FormData(form);

    const fotoInput = document.getElementById('foto_defeito');
    if (fotoInput.files.length === 0) {
        feedbackMessage.textContent = 'Erro: Por favor, anexe uma foto do defeito.';
        feedbackMessage.className = 'error';
        feedbackMessage.style.display = 'block';

        submitButton.disabled = false;
        submitButton.textContent = 'Abrir Ordem de Serviço';
        return;
    }

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            body: formData
        });

        const result = await response.json();

        if (response.ok) { // Status 201 Created
            // Usa o 'numero_os' retornado pelo servidor na mensagem de sucesso
            feedbackMessage.textContent = `Sucesso! Ordem de Serviço #${result.numero_os} foi aberta.`;
            feedbackMessage.className = 'success';
            form.reset();
        } else { // Status 4xx ou 5xx
            feedbackMessage.textContent = `Erro: ${result.message || 'Não foi possível abrir a O.S.'}`;
            feedbackMessage.className = 'error';
        }

    } catch (error) {
        console.error('Falha na comunicação com a API:', error);
        feedbackMessage.textContent = 'Erro de conexão. Verifique se o servidor está online e sua conexão com a rede.';
        feedbackMessage.className = 'error';

    } finally {
        feedbackMessage.style.display = 'block';
        submitButton.disabled = false;
        submitButton.textContent = 'Abrir Ordem de Serviço';
    }
});