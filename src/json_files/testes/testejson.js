let pokemonData = [];
let filteredPokemonData = [];

const container = document.getElementById('pokemon-container');
const prevButton = document.getElementById('prev-button');
const nextButton = document.getElementById('next-button');
const searchBar = document.getElementById('search-bar');

let currentPage = 0;
const itemsPerPage = 100;

searchBar.addEventListener('input', () => {
    const searchTerm = searchBar.value.toLowerCase();
    filteredPokemonData = pokemonData.filter(pokemon => pokemon.nome.toLowerCase().includes(searchTerm));
    currentPage = 0; // Reset para a primeira página da pesquisa
    displayPage(currentPage);
});

async function loadPokemonData() {
    try {
        const response = await fetch('https://raw.githubusercontent.com/nowadraco/pokedragonshadow.site/refs/heads/main/src/json_files/poke_reide.json');
        const data = await response.json();
        pokemonData = data;
        filteredPokemonData = pokemonData; // Inicia com todos os dados
        displayPage(currentPage);
    } catch (error) {
        console.error('Erro ao carregar os dados do JSON:', error);
    }
}

function displayPage(page) {
    container.innerHTML = '';
    const start = page * itemsPerPage;
    const end = start + itemsPerPage;
    const pageData = filteredPokemonData.slice(start, end);

    pageData.forEach(pokemon => {
        const pokemonElement = document.createElement('div');
        pokemonElement.classList.add('pokemon');

        // Adiciona cores de background baseadas nos tipos
        if (pokemon.tipos && pokemon.tipos[1]) {
            pokemonElement.style.setProperty('--tipo1-color', getTypeColor(pokemon.tipos[0]));
            pokemonElement.style.setProperty('--tipo2-color', getTypeColor(pokemon.tipos[1]));
            pokemonElement.classList.add('combinacao');
        } else {
            pokemonElement.style.backgroundColor = getTypeColor(pokemon.tipos[0]);
        }

        pokemonElement.innerHTML = `
            <img src="${pokemon.img}" alt="${pokemon.nome}">
            <h2>${pokemon.nome}</h2>
            <p>ID: ${pokemon.dex}</p>
            <p>Tipo 1: ${pokemon.tipos[0]}</p>
            ${pokemon.tipos[1] ? `<p>Tipo 2: ${pokemon.tipos[1]}</p>` : ''}
            <p>Atk: ${pokemon.statusBase.atk}</p>
            <p>Def: ${pokemon.statusBase.def}</p>
            <p>HP: ${pokemon.statusBase.hp}</p>
            <p>Fast Moves: ${pokemon.fastMoves.join(', ')}</p>
            <p>Charged Moves: ${pokemon.chargedMoves.join(', ')}</p>
            <p>Buddy Distance: ${pokemon.buddyDistancia} km</p>
            <p>Cost of Third Move: ${pokemon.custoTerceiroMove} candy</p>
        `;

        container.appendChild(pokemonElement);
    });

    prevButton.disabled = page === 0;
    nextButton.disabled = end >= filteredPokemonData.length;
}

// Função para obter a cor do tipo
function getTypeColor(tipo) {
    switch (tipo.toLowerCase()) {
        case 'normal': return '#A8A77A';
        case 'fogo': return '#FF4500';
        case 'água': return '#1E90FF';
        case 'elétrico': return '#F7D02C';
        case 'grama': return '#32CD32';
        case 'gelo': return '#96D9D6';
        case 'lutador': return '#C22E28';
        case 'venenoso': return '#A33EA1';
        case 'terrestre': return '#E2BF65';
        case 'voador': return '#A98FF3';
        case 'psíquico': return '#F95587';
        case 'inseto': return '#A6B91A';
        case 'pedra': return '#B6A136';
        case 'fantasma': return '#735797';
        case 'dragão': return '#6F35FC';
        case 'sombrio': return '#705746';
        case 'aço': return '#B7B7CE';
        case 'fada': return '#D685AD';
        default: return '#FFFFFF'; // Cor padrão
    }
}

prevButton.addEventListener('click', () => {
    if (currentPage > 0) {
        currentPage--;
        displayPage(currentPage);
    }
});

nextButton.addEventListener('click', () => {
    if ((currentPage + 1) * itemsPerPage < filteredPokemonData.length) {
        currentPage++;
        displayPage(currentPage);
    }
});

// Carregar a primeira página ao carregar
loadPokemonData();
