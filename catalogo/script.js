let produtosGlobais = [];
let produtosFiltrados = [];
let indexRenderizacao = 0;
const TAMANHO_LOTE = 50; 

async function carregarProdutos() {
    try {
        const resposta = await fetch('produtos.json');
        if (!resposta.ok) throw new Error(`Erro HTTP: ${resposta.status}`);
        
        produtosGlobais = await resposta.json();
        produtosFiltrados = [...produtosGlobais]; 
        
        iniciarRenderizacao();
    } catch (erro) {
        console.error("Erro ao carregar o catálogo:", erro);
    }
}


function iniciarRenderizacao() {
    const grid = document.getElementById('gridCatalogo');
    grid.innerHTML = '';
    indexRenderizacao = 0;
    renderizarLote();
}


function renderizarLote() {
    const grid = document.getElementById('gridCatalogo');
    const fragmento = document.createDocumentFragment();
    
    
    const limite = Math.min(indexRenderizacao + TAMANHO_LOTE, produtosFiltrados.length);

    for (let i = indexRenderizacao; i < limite; i++) {
        const produto = produtosFiltrados[i];
        const card = document.createElement('div');
        card.classList.add('card-produto');

        card.innerHTML = `
            <div class="caixaProduto">
                <img src="${produto.img}" alt="${produto.nome}" loading="lazy" 
                     onerror="this.onerror=null; this.src='indisponivel.png';"
                     style="min-width: 75%; min-height: 75%; max-width:75%; max-height:75%; object-fit: contain;">
                <h3 class="nomeProduto">${produto.nome}</h3>
                <p class="preco">R$ ${produto.preco.toFixed(2).replace('.', ',')}</p>
            </div>
        `;
        
        card.addEventListener('click', () => abrirModal(produto));
        fragmento.appendChild(card);
    }
    
    grid.appendChild(fragmento);
    indexRenderizacao = limite; 
}


document.getElementById('barraDePesquisa').addEventListener('input', (e) => {
    const termo = e.target.value.toLowerCase();
    
    
    produtosFiltrados = produtosGlobais.filter(p => 
        p.nome.toLowerCase().includes(termo)
    );
    
    iniciarRenderizacao();
});

window.addEventListener('scroll', () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 500) {
        if (indexRenderizacao < produtosFiltrados.length) {
            renderizarLote();
        }
    }
});

function abrirModal(produto) {
    const modal = document.getElementById('modal-produto');
    const conteudo = document.querySelector('.modalconteudo');
    const modalImg = document.getElementById('modal-img');

    modalImg.src = produto.img;

    modalImg.onerror = function() {
        this.onerror = null;
        this.src = 'indisponivel.png';
    };

    document.getElementById('modal-nome').innerText = produto.nome;
    document.getElementById('modal-preco').innerText = `R$ ${produto.preco.toFixed(2).replace('.', ',')}`;

    document.body.style.overflow = 'hidden'; 
    modal.style.display = "block"; 

    
    conteudo.style.position = "fixed";
    conteudo.style.left = "50%";
    conteudo.style.top = "50%";
    conteudo.style.transform = "translate(-50%, -50%)";
    conteudo.style.zIndex = "10000"; 
}

function fecharModal() {
    document.getElementById('modal-produto').style.display = "none";
    document.body.style.overflow = 'auto'; 
}

window.onclick = function(event) {
    const modal = document.getElementById('modal-produto');
    if (event.target == modal) {
        fecharModal();
    }
}


carregarProdutos();