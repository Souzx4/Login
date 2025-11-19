// --- CONFIGURAÇÃO DE USUÁRIO E SEGURANÇA ---

// 1. Descobre quem está logado
const usuarioLogado = localStorage.getItem('usuarioLogado');

// 2. Se não tiver ninguém, chuta de volta pro login
if (!usuarioLogado) {
    alert("Você precisa fazer login primeiro!");
    window.location.href = 'login.html'; // Volta para a tela de login
}

// 3. Cria uma chave única para salvar os dados desse usuário
// Ex: se o email for 'ana@gmail.com', a chave será 'dados_ana@gmail.com'
const CHAVE_DO_BANCO = `dados_${usuarioLogado}`;


// --- INÍCIO DO SISTEMA ---

window.addEventListener('DOMContentLoaded', () => {
    // Mostra na tela quem está logado (opcional, mas legal)
    const titulo = document.querySelector('h1');
    if(titulo) titulo.innerHTML = `Finanças de <br><span style="font-size:0.6em">${usuarioLogado}</span>`;

    // Carrega os dados DESTE usuário específico
    carregarDadosSalvos();
    
    // Roda o cálculo inicial
    atualizarTodosOsTotais();

    // O "Ouvinte" para salvar automático
    document.querySelector('table').addEventListener('input', () => {
        atualizarTodosOsTotais();
        salvarDados();
    });
});

// --- FUNÇÕES PRINCIPAIS ---

function atualizarTodosOsTotais() {
    const totalValor = calcularSoma('.valor');
    const totalPago = calcularSoma('.pagas');
    const saldoRestante = totalValor - totalPago;

    const formatoMoeda = { style: 'currency', currency: 'BRL'};
    
    // Atualiza Saldo Restante
    const elementoRes3 = document.getElementById('res3');
    if (elementoRes3) {
        elementoRes3.innerHTML = `<strong>${saldoRestante.toLocaleString('pt-br', formatoMoeda)}</strong>`;
    }
    
    // Se você quiser reativar os outros totais (res e res2), coloque aqui igual fizemos antes
}

function calcularSoma(seletorClasse) {
    const celulas = document.querySelectorAll(seletorClasse);
    let soma = 0;

    celulas.forEach(celula => {
        let texto = celula.textContent;
        if (texto.includes('=')) texto = texto.split('=')[1];
        
        const textoLimpo = texto.trim().replace('R$', '').replace(/\./g, '').replace(',', '.');
        const valor = parseFloat(textoLimpo);
        
        if (!isNaN(valor)) soma += valor;
    });
    return soma;
}

function adicionarLinha() {
    const tbody = document.querySelector('tbody');
    const novaLinha = document.createElement('tr');

    novaLinha.innerHTML = `
        <td contenteditable="true">Novo Cliente</td>
        <td class="num" contenteditable="true"><input type="date"></td>
        <td class="num valor" contenteditable="true">0</td>
        <td contenteditable="true">0</td>
        <td class="num" contenteditable="true">0x</td>
        <td class="pagas" contenteditable="true">0</td>
        <td style="text-align: center;"><button onclick="excluirLinha(this)" style="cursor:pointer">🗑️</button></td>
    `;

    tbody.appendChild(novaLinha);
    atualizarTodosOsTotais();
    salvarDados();
}

function excluirLinha(botao) {
    if(confirm("Apagar esta linha?")) {
        botao.parentNode.parentNode.remove();
        atualizarTodosOsTotais();
        salvarDados();
    }
}

// --- FUNÇÕES DE BANCO DE DADOS DINÂMICO ---

function salvarDados() {
    const conteudoTabela = document.querySelector('tbody').innerHTML;
    // Salva usando a chave EXCLUSIVA do usuário logado
    localStorage.setItem(CHAVE_DO_BANCO, conteudoTabela);
}

function carregarDadosSalvos() {
    // Busca apenas os dados do usuário logado
    const dados = localStorage.getItem(CHAVE_DO_BANCO);
    if (dados) {
        document.querySelector('tbody').innerHTML = dados;
    } else {
        // Se for um usuário novo, a tabela começa limpa (ou com modelo padrão)
        // Opcional: limpar a tabela padrão do HTML se for usuário novo
        // document.querySelector('tbody').innerHTML = ''; 
    }
}

function resetarDados() {
    if (confirm('Isso apagará todas as finanças DESTA conta. Continuar?')) {
        localStorage.removeItem(CHAVE_DO_BANCO);
        location.reload();
    }
}

// Função nova para o botão de Sair
function sairDoSistema() {
    localStorage.removeItem('usuarioLogado');
    window.location.href = 'login.html';
}