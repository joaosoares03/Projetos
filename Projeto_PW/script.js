let indiceAtual = 0;

function mostrarSlide(indice) {
  const slides = document.querySelectorAll('.carrossel-item');
  if (indice >= slides.length) {
    indiceAtual = 0;
  } else if (indice < 0) {
    indiceAtual = slides.length - 1;
  } else {
    indiceAtual = indice;
  }
  const deslocamento = -indiceAtual * 100;
  document.querySelector('.carrossel-conteudo').style.transform = `translateX(${deslocamento}%)`;
}

function proximaSlide() {
  mostrarSlide(indiceAtual + 1);
}

function slideAnterior() {
  mostrarSlide(indiceAtual - 1);
}

// Avança automaticamente para o próximo slide a cada 3 segundos
setInterval(proximaSlide, 3000);

function iniciarTransmissao() {
  alert('Iniciando transmissão ao vivo!');
}

function criarLiga() {
  const content = document.getElementById('fantasy-content');
  content.innerHTML = `
    <h3>Criar Liga</h3>
    <form onsubmit="adicionarLiga(event)">
      <input type="text" id="nome-liga" placeholder="Nome da Liga" required>
      <input type="text" id="nome-jogador" placeholder="Seu Nome" required>
      <button type="submit">Criar Liga</button>
    </form>
    <div id="lista-ligas"></div>
  `;
  atualizarListaLigas();
}

function adicionarLiga(event) {
  event.preventDefault();
  const nomeLiga = document.getElementById('nome-liga').value;
  const nomeJogador = document.getElementById('nome-jogador').value;

  const novaLiga = {
    nome: nomeLiga,
    jogadores: [nomeJogador],
  };

  ligas.push(novaLiga);
  atualizarListaLigas();
}

function atualizarListaLigas() {
  const listaLigas = document.getElementById('lista-ligas');
  listaLigas.innerHTML = '<h4>Ligas Criadas:</h4>';
  
  ligas.forEach((liga, index) => {
    listaLigas.innerHTML += `
      <div>
        <h5>${liga.nome} <button class="remover-liga" onclick="removerLiga(${index})">Remover Liga</button></h5>
        <p>Jogadores: ${liga.jogadores.map((jogador, jogadorIndex) => `
          ${jogador} <button class="remover-jogador" onclick="removerJogador(${index}, ${jogadorIndex})">Remover</button>
        `).join(', ')}</p>
        <button onclick="adicionarJogador(${index})">Adicionar Jogador</button>
      </div>
    `;
  });
}

function adicionarJogador(ligaIndex) {
  const nomeJogador = prompt('Nome do jogador:');
  if (nomeJogador) {
    ligas[ligaIndex].jogadores.push(nomeJogador);
    atualizarListaLigas();
  }
}

function removerJogador(ligaIndex, jogadorIndex) {
  ligas[ligaIndex].jogadores.splice(jogadorIndex, 1);
  atualizarListaLigas();
}

function removerLiga(ligaIndex) {
  ligas.splice(ligaIndex, 1);
  atualizarListaLigas();
}

function montarTime() {
  const content = document.getElementById('fantasy-content');
  content.innerHTML = `
    <h3>Montar Time</h3>
    <p>Funcionalidade para montar um time será implementada aqui.</p>
  `;
}

function participarDraft() {
  const content = document.getElementById('fantasy-content');
  content.innerHTML = `
    <h3>Participar do Draft</h3>
    <p>Funcionalidade para participar do draft será implementada aqui.</p>
  `;
}

function acompanharDesempenho() {
  const content = document.getElementById('fantasy-content');
  content.innerHTML = `
    <h3>Acompanhar Desempenho</h3>
    <p>Funcionalidade para acompanhar o desempenho será implementada aqui.</p>
  `;
}
let ligas = [];

function criarLiga() {
  const content = document.getElementById('fantasy-content');
  content.innerHTML = `
    <h3>Criar Liga</h3>
    <form onsubmit="adicionarLiga(event)">
      <input type="text" id="nome-liga" placeholder="Nome da Liga" required>
      <input type="text" id="nome-jogador" placeholder="Seu Nome" required>
      <button type="submit">Criar Liga</button>
    </form>
    <div id="lista-ligas"></div>
  `;
  atualizarListaLigas();
}

function adicionarLiga(event) {
  event.preventDefault();
  const nomeLiga = document.getElementById('nome-liga').value;
  const nomeJogador = document.getElementById('nome-jogador').value;

  const novaLiga = {
    nome: nomeLiga,
    jogadores: [nomeJogador],
  };

  ligas.push(novaLiga);
  atualizarListaLigas();
}

function atualizarListaLigas() {
  const listaLigas = document.getElementById('lista-ligas');
  listaLigas.innerHTML = '<h4>Ligas Criadas:</h4>';
  
  ligas.forEach((liga, index) => {
    listaLigas.innerHTML += `
      <div>
        <h5>${liga.nome} <button class="remover-liga" onclick="removerLiga(${index})">Remover Liga</button></h5>
        <p>Jogadores: ${liga.jogadores.map((jogador, jogadorIndex) => `
          ${jogador} <button class="remover-jogador" onclick="removerJogador(${index}, ${jogadorIndex})">Remover</button>
        `).join(', ')}</p>
        <button onclick="adicionarJogador(${index})">Adicionar Jogador</button>
      </div>
    `;
  });
}

function adicionarJogador(ligaIndex) {
  const nomeJogador = prompt('Nome do jogador:');
  if (nomeJogador) {
    ligas[ligaIndex].jogadores.push(nomeJogador);
    atualizarListaLigas();
  }
}

function removerJogador(ligaIndex, jogadorIndex) {
  ligas[ligaIndex].jogadores.splice(jogadorIndex, 1);
  atualizarListaLigas();
}

function removerLiga(ligaIndex) {
  ligas.splice(ligaIndex, 1);
  atualizarListaLigas();
}

function montarTime() {
  const content = document.getElementById('fantasy-content');
  content.innerHTML = `
    <h3>Montar Time</h3>
    <form id="montar-time-form">
      <label for="nome-time">Nome do Time:</label>
      <input type="text" id="nome-time" required>
      <label for="jogadores">Jogadores (separados por vírgula):</label>
      <input type="text" id="jogadores" required>
      <button type="submit">Montar Time</button>
    </form>
    <div id="time-montado"></div>
  `;

  document.getElementById('montar-time-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const nomeTime = document.getElementById('nome-time').value;
    const jogadores = document.getElementById('jogadores').value.split(',');
    const timeMontado = document.getElementById('time-montado');
    timeMontado.innerHTML = `<h4>Time: ${nomeTime}</h4><p>Jogadores: ${jogadores.join(', ')}</p>`;
  });
}

function participarDraft() {
  const content = document.getElementById('fantasy-content');
  content.innerHTML = `
    <h3>Participar do Draft</h3>
    <p>Selecione seus jogadores:</p>
    <form id="participar-draft-form">
      <label for="jogador1">Jogador 1:</label>
      <input type="text" id="jogador1" required>
      <label for="jogador2">Jogador 2:</label>
      <input type="text" id="jogador2" required>
      <label for="jogador3">Jogador 3:</label>
      <input type="text" id="jogador3" required>
      <button type="submit">Participar</button>
    </form>
    <div id="draft-participado"></div>
  `;

  document.getElementById('participar-draft-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const jogador1 = document.getElementById('jogador1').value;
    const jogador2 = document.getElementById('jogador2').value;
    const jogador3 = document.getElementById('jogador3').value;
    const draftParticipado = document.getElementById('draft-participado');
    draftParticipado.innerHTML = `<h4>Jogadores Selecionados:</h4><p>${jogador1}, ${jogador2}, ${jogador3}</p>`;
  });
}

function acompanharDesempenho() {
  const content = document.getElementById('fantasy-content');
  content.innerHTML = `
    <h3>Acompanhar Desempenho</h3>
    <p>Selecione seu time para acompanhar o desempenho:</p>
    <form id="acompanhar-desempenho-form">
      <label for="nome-time-desempenho">Nome do Time:</label>
      <input type="text" id="nome-time-desempenho" required>
      <button type="submit">Acompanhar</button>
    </form>
    <div id="desempenho-acompanhado"></div>
  `;

  document.getElementById('acompanhar-desempenho-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const nomeTimeDesempenho = document.getElementById('nome-time-desempenho').value;
    const desempenhoAcompanhado = document.getElementById('desempenho-acompanhado');
    // Aqui você pode adicionar a lógica para buscar e mostrar os dados de desempenho do time
    desempenhoAcompanhado.innerHTML = `<h4>Desempenho do Time: ${nomeTimeDesempenho}</h4><p>Dados de desempenho serão mostrados aqui.</p>`;
  });
}