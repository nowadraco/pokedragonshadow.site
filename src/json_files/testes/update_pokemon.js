const fs = require('fs');

// Carregar o arquivo JSON
const filePath = '../../json_files/poke_reide_shiny.json';
const rawData = fs.readFileSync(filePath, 'utf-8');
const pokemons = JSON.parse(rawData);

// Criar um dicionário para armazenar as URLs de imagens dos pokémons não-shadow
const imgUrls = {};

// Percorrer todos os pokémons e coletar as URLs de imagens
pokemons.forEach(pokemon => {
  if (!pokemon.nome.includes('Shadow')) {
    imgUrls[pokemon.idNome] = pokemon.img;
  }
});

// Atualizar as URLs de imagens dos pokémons shadow e adicionar o campo `img`
pokemons.forEach(pokemon => {
  if (pokemon.nome.includes('Shadow')) {
    const baseName = pokemon.idNome.replace('_shadow', '');
    if (imgUrls[baseName]) {
      pokemon.img = imgUrls[baseName];
    }
  }
});

// Salvar o arquivo JSON atualizado
fs.writeFileSync('../../json_files/poke_reide_shiny_atu.json', JSON.stringify(pokemons, null, 2), 'utf-8');

console.log("URLs das imagens atualizadas com sucesso!");
