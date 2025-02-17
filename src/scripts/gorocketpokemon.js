
async function carregarPokemons() {
    try {
        const response = await fetch('https://nowadraco.github.io/pokedragonshadow.site/src/json_files/pok_selvagens.json');
        const pokemons = await response.json();
        return { pokemons };
    } catch (error) {
        console.error('Erro ao carregar o arquivo JSON:', error);
        return { pokemons: [] };
    }
}

function getTypeColor(tipo) {
    switch (tipo.toLowerCase()) {
        case 'normal': return '#A8A77A';
        case 'fogo': return '#FF4500';
        case 'água': return '#1E90FF';
        case 'elétrico': return '#F7D02C';
        case 'planta': return '#32CD32';
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
        case 'substitute': return '#000';
        default: return '#FFFFFF';
    }
}

function criarElementoPokemon(pokemon) {
    const li = document.createElement('li');
    let classList = `shadow ${pokemon.tipo1.toLowerCase()}`;
    if (pokemon.tipo2) {
        classList += ` ${pokemon.tipo2.toLowerCase()}`;
    }
    li.className = classList;

    if (pokemon.tipo2 && pokemon.tipo2.toLowerCase() !== 'null') {
        li.style.background = `linear-gradient(to right, ${getTypeColor(pokemon.tipo1)}, ${getTypeColor(pokemon.tipo2)})`;
    } else {
        li.style.backgroundColor = getTypeColor(pokemon.tipo1);
    }

    const img = document.createElement('img');
    img.classList.add('imgSelvagem');
    img.src = pokemon.img;
    img.alt = pokemon.nome;

    const span = document.createElement('span');
    span.classList.add('pokemon-nome');
    span.textContent = pokemon.nome;
    
    li.appendChild(img);
    li.appendChild(span);

    return li;
}

function buscarPokemon(pokemons, nome) {
    const nomeNormalizado = nome.replace('*', '').toLowerCase();
    return pokemons.find(pokemon => pokemon.nome.toLowerCase() === nomeNormalizado);
}

async function preencherLista() {
    const { pokemons } = await carregarPokemons();
    const substitute = buscarPokemon(pokemons, 'substitute') || {
        nome: 'Substitute',
        tipo1: 'normal',
        img: './path/to/substitute-image.png'
    };

    const listas = document.querySelectorAll('.gorocket');

    listas.forEach(lista => {
        const itens = lista.querySelectorAll('li');

        itens.forEach(item => {
            const nome = item.textContent.trim();
            let pokemon = buscarPokemon(pokemons, nome);

            if (!pokemon) {
                pokemon = substitute;
            }

            const novoItem = criarElementoPokemon(pokemon);
            if (nome.includes('*')) {
                novoItem.lastChild.nodeValue = ` ${nome}`;
            }
            item.replaceWith(novoItem);
        });
    });

    // Implementando a funcionalidade de exibir fraquezas ao clicar
    document.querySelectorAll('.shadow li').forEach(function(pokemon) {
        pokemon.addEventListener('click', function() {
            // Remove existing weakness lists
            document.querySelectorAll('.weaknesses-list').forEach(function(list) {
                list.remove();
            });
            
            // Get weaknesses from data attributes
            const doubleWeaknesses = pokemon.getAttribute('data-double-weaknesses');
            const singleWeaknesses = pokemon.getAttribute('data-single-weaknesses');

            // Create weaknesses list
            const weaknessesList = document.createElement('ul');
            weaknessesList.classList.add('weaknesses-list');

            if (doubleWeaknesses) {
                const doubleWeaknessesItem = document.createElement('li');
                doubleWeaknessesItem.textContent = 'Fraquezas Duplas: ' + doubleWeaknesses;
                weaknessesList.appendChild(doubleWeaknessesItem);
            }

            if (singleWeaknesses) {
                const singleWeaknessesItem = document.createElement('li');
                singleWeaknessesItem.textContent = 'Fraquezas Simples: ' + singleWeaknesses;
                weaknessesList.appendChild(singleWeaknessesItem);
            }

            // Append weaknesses list to the Pokemon list item
            pokemon.appendChild(weaknessesList);

            // Show the weaknesses list
            weaknessesList.style.display = 'block';
        });
    });
}

window.onload = preencherLista;

