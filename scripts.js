<script>    
        // scripts.js
        // Função para alternar o alto contraste
        

    document.addEventListener('DOMContentLoaded', function() {
            const toggleButton = document.getElementById('toggleContraste');
            const body = document.body;
            const contrasteKey = 'altoContrasteAtivo'; // Chave para localStorage

            // Função para aplicar/remover o alto contraste
            function toggleAltoContraste() {
                body.classList.toggle('alto-contraste');
                const isPressed = body.classList.contains('alto-contraste');
                toggleButton.setAttribute('aria-pressed', isPressed);
                localStorage.setItem(contrasteKey, isPressed); // Salva a preferência
            }

            // Verifica se o alto contraste estava ativo na última visita
            // Adiciona um pequeno atraso para garantir que o DOM esteja totalmente renderizado
            setTimeout(() => {
                if (localStorage.getItem(contrasteKey) === 'true') {
                    toggleAltoContraste(); // Ativa se estava salvo como true
                }
            }, 50); // Pequeno atraso de 50ms

            // Adiciona o evento de clique ao botão
            toggleButton.addEventListener('click', toggleAltoContraste);
        });


</script>