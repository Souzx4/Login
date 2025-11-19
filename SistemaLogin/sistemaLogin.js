function criarConta() {
    const email = document.getElementById('ilogin').value;
    const senha = document.getElementById('isenha').value;

    if (!email || !senha) {
        alert("Por favor, preencha o e-mail e a senha para cadastrar.");
        return;
    }

    // Verifica se já existe uma senha salva para este email
    if (localStorage.getItem(`senha_${email}`)) {
        alert("Este usuário já existe! Clique em Entrar.");
        return;
    }

    // Salva a conta
    localStorage.setItem(`senha_${email}`, senha);
    alert("Conta criada com sucesso! Agora clique em Entrar.");
}

function fazerLogin(event) {
    event.preventDefault(); // Impede a página de recarregar

    const email = document.getElementById('ilogin').value;
    const senha = document.getElementById('isenha').value;

    // Busca a senha salva no navegador
    const senhaSalva = localStorage.getItem(`senha_${email}`);

    if (senha === senhaSalva) {
        // SUCESSO!
        // 1. Salva quem está logado agora
        localStorage.setItem('usuarioLogado', email);
        
        // 2. Redireciona para o arquivo das finanças
        // ATENÇÃO: Certifique-se que o nome do seu arquivo HTML de finanças é 'financas.html'
        window.location.href = 'financas.html'; 
    } else {
        // FRACASSO
        if (!senhaSalva) {
            alert("Usuário não encontrado. Clique em 'Cadastrar Nova Conta'.");
        } else {
            alert("Senha incorreta!");
        }
    }
}