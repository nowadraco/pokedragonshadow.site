// URL do JSON (substitua com o link real do seu arquivo JSON)
const urlJson = "https://raw.githubusercontent.com/nowadraco/pokedragonshadow.site/refs/heads/main/src/json_files/eventos.json"; 

// Função para calcular o tempo restante
function calcularCountdown(data) {
    const agora = new Date();
    const tempoRestante = new Date(data) - agora;
    if (tempoRestante <= 0) return "Encerrado";

    const dias = Math.floor(tempoRestante / (1000 * 60 * 60 * 24));
    const horas = Math.floor((tempoRestante % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutos = Math.floor((tempoRestante % (1000 * 60 * 60)) / (1000 * 60));

    return `${dias}d ${horas}h ${minutos}m`;
}

// Função para renderizar os eventos
function renderizarEventos(eventos) {
    const agora = new Date();
    document.getElementById("lista-atuais").innerHTML = "";
    document.getElementById("lista-futuros").innerHTML = "";
    document.getElementById("lista-passados").innerHTML = "";

    eventos.forEach(evento => {
        const inicio = new Date(evento.inicio);
        const fim = new Date(evento.fim);
        const container = (fim < agora)
            ? document.getElementById("lista-passados")
            : (inicio > agora)
                ? document.getElementById("lista-futuros")
                : document.getElementById("lista-atuais");

        const countdown = (inicio > agora) ? calcularCountdown(evento.inicio)
            : (fim > agora) ? calcularCountdown(evento.fim)
            : "Encerrado";

        const status = (fim < agora) ? "Encerrado" : (inicio > agora) ? "Aguardando" : "Em Andamento";

        container.innerHTML += `
            <div class="evento">
                <img src="${evento.imagem}" alt="Imagem do ${evento.nome}">
                <h3>${evento.nome}</h3>
                <p>Início: ${inicio.toLocaleString()}</p>
                <p>Fim: ${fim.toLocaleString()}</p>
                <p class="status">${status}</p>
                <p class="countdown">${countdown}</p>
            </div>
        `;
    });
}

// Função para buscar dados do JSON e atualizar a página
function atualizarEventos() {
    fetch(urlJson)
        .then(response => {
            if (!response.ok) {
                throw new Error("Erro ao carregar o JSON");
            }
            return response.json();
        })
        .then(eventos => {
            renderizarEventos(eventos);
        })
        .catch(error => {
            console.error("Erro ao buscar eventos:", error);
        });
}

// Atualizar automaticamente a cada minuto
atualizarEventos();
setInterval(atualizarEventos, 60000); // 60000ms = 1 minuto
