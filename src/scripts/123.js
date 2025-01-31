const cpms = [/* array de CPMS */];

function getTypeColor(tipo) {
    /* função para obter cor do tipo */
}

function getTypeIcon(tipo) {
    /* função para obter ícone do tipo */
}

function getWeatherIcon(tipo) {
    /* função para obter ícone do clima */
}

function calculateCP(baseStats, ivs, level) {
    /* função para calcular CP */
}

function buscarPokemon(pokemons, nome) {
    const nomeNormalizado = nome.replace('*', '').toLowerCase();
    return pokemons.find(pokemon => pokemon.nome.toLowerCase() === nomeNormalizado);
}

function buscarShinyPokemon(shinyPokemons, nome) {
    const nomeNormalizado = nome.replace('*', '').toLowerCase();
    return shinyPokemons.find(shiny => shiny.nome.toLowerCase() === nomeNormalizado);
}

function alternarImagens(pokemons, shinyPokemons) {
    const listas = document.querySelectorAll('.pokemon-list li');

    listas.forEach(item => {
        const nome = item.textContent.trim();
        const img = item.querySelector('img');
        const pokemon = buscarPokemon(pokemons, nome.replace('*', ''));
        const shinyPokemon = buscarShinyPokemon(shinyPokemons, nome.replace('*', ''));

        if (img && pokemon && shinyPokemon && nome.includes('*')) {
            let showShiny = false;
            setInterval(() => {
                img.style.transition = 'opacity 0.5s';
                img.style.opacity = 0;
                setTimeout(() => {
                    img.src = showShiny ? shinyPokemon.img : pokemon.img;
                    img.style.opacity = 1;
                    showShiny = !showShiny;
                }, 500);
            }, 2500);
        }
    });
}

function generatePokemonListItem(pokemon, shinyPokemon) {
    const validTipos = pokemon.tipos.filter(tipo => tipo !== "null");
    const typeColors = validTipos.map(tipo => getTypeColor(tipo));
    
    let gradientBackground;
    if (typeColors.length === 1) {
        gradientBackground = typeColors[0];
    } else {
        gradientBackground = `linear-gradient(to right, ${typeColors.join(', ')})`;
    }

    const baseStats = pokemon.statusBase;
    const cpInfo = {
        normal: calculateCP(baseStats, { atk: 10, def: 10, hp: 10 }, 20),
        perfect: calculateCP(baseStats, { atk: 15, def: 15, hp: 15 }, 20)
    };
    const cpBoost = {
        normal: calculateCP(baseStats, { atk: 10, def: 10, hp: 10 }, 25),
        perfect: calculateCP(baseStats, { atk: 15, def: 15, hp: 15 }, 25)
    };

    const typeIcons = validTipos.map(tipo =>
        `<img src="${getTypeIcon(tipo)}" alt="${tipo}">`
    ).join('');

    const weatherIcons = validTipos.map(tipo =>
        `<img class="clima-boost" src="${getWeatherIcon(tipo)}">`
    ).join('');

    const nomePokemon = pokemon.nome.includes('*') ? pokemon.nome + '*' : pokemon.nome;

    return `<li class="Selvagem ${validTipos.map(t => t.toLowerCase()).join(' ')}" 
               style="background: ${gradientBackground};">
        <img class="imgSelvagem" src="${pokemon.img}" alt="${nomePokemon}"> 
        ${nomePokemon}
        <div class="tipo-icons">${typeIcons}</div>
        <div class="pc-info">PC: ${cpInfo.normal} - ${cpInfo.perfect}</div>
        <div class="boost">
            ${weatherIcons}
            <div class="pc-boost"> ${cpBoost.normal} - ${cpBoost.perfect}</div>
        </div>
    </li>`;
}

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

processSpecificPokemonList();
