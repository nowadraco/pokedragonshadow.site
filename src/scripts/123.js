// ... (funções calculateCP, getTypeColor, getTypeIcon, buscarPokemon)

function buscarShinyPokemon(shinyPokemons, nome) {
    const nomeNormalizado = nome.replace('*', '').toLowerCase();
    return shinyPokemons.find(shiny => shiny.nome.toLowerCase() === nomeNormalizado);
}

function alternarImagens(pokemons, shinyPokemons) {
    const listas = document.querySelectorAll('.pokemon-list li');

    listas.forEach(item => {
        const nomeOriginal = item.textContent.trim();
        const nomeSemAsterisco = nomeOriginal.replace('*', '').trim();
        const img = item.querySelector('img.imgSelvagem'); // Seleciona a imagem pela classe

        if (img && nomeOriginal.includes('*')) {
            const pokemon = buscarPokemon(pokemons, nomeSemAsterisco);
            const shinyPokemon = buscarShinyPokemon(shinyPokemons, nomeSemAsterisco);

            if (pokemon && shinyPokemon) {
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
        }
    });
}

function generatePokemonListItem(pokemon, shinyPokemon, nomeExibicao) {
    // ... (resto do código da função)
}

async function processSpecificPokemonList() {
    try {
        const { pokemons, shinyPokemons } = await carregarPokemons();

        const pokemonLists = document.querySelectorAll('.pokemon-list');

        for (const pokemonListElement of pokemonLists) {
            // ... (código para criar a lista de pokemons)
        }

        alternarImagens(pokemons, shinyPokemons); // Chamada após a criação da lista

    } catch (error) {
        console.error('Erro ao processar as listas de Pokémon:', error);
    }
}

processSpecificPokemonList();