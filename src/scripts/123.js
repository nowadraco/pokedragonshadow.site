async function processSpecificPokemonList() {
    try {
        const response = await fetch('https://raw.githubusercontent.com/nowadraco/pokedragonshadow.site/refs/heads/main/src/json_files/output.json');
        const shinyResponse = await fetch('https://raw.githubusercontent.com/nowadraco/pokedragonshadow.site/refs/heads/main/src/json_files/output_shiny.json');
        const allPokemon = await response.json();
        const shinyPokemons = await shinyResponse.json();

        const pokemonLists = document.querySelectorAll('.pokemon-list');

        pokemonLists.forEach(async (pokemonListElement) => {
            const pokemonNames = Array.from(pokemonListElement.getElementsByTagName('li'))
                .map(li => li.textContent.replace('*', '').replace(' de Hisui', '').replace('Mega ', '').trim());

            const filteredPokemon = allPokemon.filter(pokemon => {
                const cleanPokemonName = pokemon.nome.replace(' de Hisui', '').replace('Mega ', '').trim();
                return pokemonNames.includes(cleanPokemonName);
            });

            const pokemonListHTML = filteredPokemon.map(pokemon => {
                const shinyPokemon = buscarShinyPokemon(shinyPokemons, pokemon.nome);
                return generatePokemonListItem(pokemon, shinyPokemon);
            }).join('');
            
            pokemonListElement.innerHTML = pokemonListHTML;

            if (!pokemonListElement.classList.contains('selvagens')) {
                pokemonListElement.classList.add('selvagens');
            }
        });

        alternarImagens(allPokemon, shinyPokemons);

    } catch (error) {
        console.error('Erro ao processar as listas de Pokémon:', error);
    }
}

const cpms = [/* array de CPMS */];

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

function getTypeIcon(tipo) {
    switch (tipo.toLowerCase()) {
        case 'aço': return 'https://raw.githubusercontent.com/nowadraco/pokedragonshadow.site/refs/heads/main/src/imagens/tipos/aco.png';
        case 'água': return 'https://raw.githubusercontent.com/nowadraco/pokedragonshadow.site/refs/heads/main/src/imagens/tipos/agua.png';
        case 'dragão': return 'https://raw.githubusercontent.com/nowadraco/pokedragonshadow.site/refs/heads/main/src/imagens/tipos/dragao.png';
        case 'elétrico': return 'https://raw.githubusercontent.com/nowadraco/pokedragonshadow.site/refs/heads/main/src/imagens/tipos/eletrico.png';
        case 'fada': return 'https://raw.githubusercontent.com/nowadraco/pokedragonshadow.site/refs/heads/main/src/imagens/tipos/fada.png';
        case 'fantasma': return 'https://raw.githubusercontent.com/nowadraco/pokedragonshadow.site/refs/heads/main/src/imagens/tipos/fantasma.png';
        case 'fogo': return 'https://raw.githubusercontent.com/nowadraco/pokedragonshadow.site/refs/heads/main/src/imagens/tipos/fogo.png';
        case 'gelo': return 'https://raw.githubusercontent.com/nowadraco/pokedragonshadow.site/refs/heads/main/src/imagens/tipos/gelo.png';
        case 'inseto': return 'https://raw.githubusercontent.com/nowadraco/pokedragonshadow.site/refs/heads/main/src/imagens/tipos/inseto.png';
        case 'lutador': return 'https://raw.githubusercontent.com/nowadraco/pokedragonshadow.site/refs/heads/main/src/imagens/tipos/lutador.png';
        case 'normal': return 'https://raw.githubusercontent.com/nowadraco/pokedragonshadow.site/refs/heads/main/src/imagens/tipos/normal.png';
        case 'pedra': return 'https://raw.githubusercontent.com/nowadraco/pokedragonshadow.site/refs/heads/main/src/imagens/tipos/pedra.png';
        case 'planta': return 'https://raw.githubusercontent.com/nowadraco/pokedragonshadow.site/refs/heads/main/src/imagens/tipos/planta.png';
        case 'psíquico': return 'https://raw.githubusercontent.com/nowadraco/pokedragonshadow.site/refs/heads/main/src/imagens/tipos/psiquico.png';
        case 'sombrio': return 'https://raw.githubusercontent.com/nowadraco/pokedragonshadow.site/refs/heads/main/src/imagens/tipos/sombrio.png';
        case 'terrestre': return 'https://raw.githubusercontent.com/nowadraco/pokedragonshadow.site/refs/heads/main/src/imagens/tipos/terrestre.png';
        case 'venenoso': return 'https://raw.githubusercontent.com/nowadraco/pokedragonshadow.site/refs/heads/main/src/imagens/tipos/venenoso.png';
        case 'voador': return 'https://raw.githubusercontent.com/nowadraco/pokedragonshadow.site/refs/heads/main/src/imagens/tipos/voador.png';
        default: return '';
    }
}

function getWeatherIcon(tipo) {
    switch (tipo.toLowerCase()) {
        case 'planta':
        case 'fogo':
        case 'terrestre':
            return 'https://raw.githubusercontent.com/nowadraco/pokedragonshadow.site/c3027920e2d9674426a728d292ff8ce08209b2d2/src/imagens/clima/ensolarado.png';
        case 'água':
        case 'elétrico':
        case 'inseto':
            return 'https://raw.githubusercontent.com/nowadraco/pokedragonshadow.site/c3027920e2d9674426a728d292ff8ce08209b2d2/src/imagens/clima/chovendo.png';
        case 'normal':
        case 'pedra':
            return 'https://raw.githubusercontent.com/nowadraco/pokedragonshadow.site/c3027920e2d9674426a728d292ff8ce08209b2d2/src/imagens/clima/parcialmente_nublado.png';
        case 'fada':
        case 'lutador':
        case 'venenoso':
            return 'https://raw.githubusercontent.com/nowadraco/pokedragonshadow.site/c3027920e2d9674426a728d292ff8ce08209b2d2/src/imagens/clima/nublado.png';
        case 'voador':
        case 'dragão':
        case 'psíquico':
            return 'https://raw.githubusercontent.com/nowadraco/pokedragonshadow.site/c3027920e2d9674426a728d292ff8ce08209b2d2/src/imagens/clima/ventando.png';
        case 'gelo':
        case 'aço':
            return 'https://raw.githubusercontent.com/nowadraco/pokedragonshadow.site/c3027920e2d9674426a728d292ff8ce08209b2d2/src/imagens/clima/nevando.png';
        case 'sombrio':
        case 'fantasma':
            return 'https://raw.githubusercontent.com/nowadraco/pokedragonshadow.site/c3027920e2d9674426a728d292ff8ce08209b2d2/src/imagens/clima/neblina.png';
        default:
            return '';
    }
}

function calculateCP(baseStats, ivs, level) {
    const cpmIndex = Math.round((level - 1) * 2);
    const cpm = cpms[cpmIndex];
    const cp = Math.floor(((baseStats.atk + ivs.atk) *
