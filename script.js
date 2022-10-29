//DARKMODE
function dark_mode(){
    let bgBody = document.querySelector('body');
    let container = document.getElementById('container');
    bgBody.classList.toggle("body_dark_active");
    bgBody.classList.toggle("cards_dark_active");
    // if(document.getElementById('toggleButton').checked) {
    //     container.style.backgroundColor = 'rgba(119, 172, 172, 0.8)';
    // } else {
    //     container.style.backgroundColor = 'rgba(240, 255, 255, 0.8)';
    // }
}

//POKEMON CONTENT
const pokemons = document.getElementById('pokemons')
const searchbar = document.getElementById('inputText');

var pokeStorage = [];
var currentStorage = [];

const fetchPokemon = () => {
    const promises = [];
    for (i = 1; i <= 151; i++) {
        const url = `https://pokeapi.co/api/v2/pokemon/${i}`;
        promises.push(fetch(url).then((res) => res.json()));
    }

    Promise.all(promises).then(results => {
        const pokemon = results.map((data) => ({
            name: data.name.charAt(0).toUpperCase() + data.name.slice(1),
            id: data.id,
            image: data.sprites['front_default'],
            type1: data.types[0].type.name.charAt(0).toUpperCase() + data.types[0].type.name.slice(1),
            type2: data.types[1] ? data.types[1].type.name.charAt(0).toUpperCase() + data.types[1].type.name.slice(1) : null
        }));
        displayPokemon(pokemon);
        pokeStorage = pokemon;
        currentStorage = pokemon;
    })
}
fetchPokemon()


//DISPLAY ALL
const displayPokemon = (pokemon) => {
    const html = pokemon.map(poke => `
        <div class="poke_container" id="container${poke.type1}">
            <div class="poke_card" id="${poke.type1}">
                <div class="poke_number">
                    #${poke.id}
                </div>
                <div class="poke_image">
                    <img src="${poke.image}"/>
                </div>
                <div class="poke_name">
                    ${poke.name}
                </div>
                <div class="poke_types">
                    <div class=${poke.type1}> <img src="" id="img${poke.type1}" title="${poke.type1}"> </div>
                    <div class=${poke.type2}> ${poke.type2 === null ? '' : `<img src="" id="img${poke.type2}" title="${poke.type2}">`} </div>
                </div>
            </div>
        </div>
    `).join('');
    pokemons.innerHTML = html
}

function sortPokemonByType() {
    var e = document.getElementById("sortOptions");
    var value = e.value;
    pokeSort(value);
}

const pokeSort = (option) => {
    pokemons.innerHTML = '';
    if(option == 'ALL') {
        displayPokemon(pokeStorage);
        currentStorage = pokeStorage;
        return;
    }
    const sortedPokemons = pokeStorage.filter(element => element.type1 === option || element.type2 === option);
    displayPokemon(sortedPokemons);
    currentStorage = sortedPokemons;
}

function sortByNameOrID (){
    var e = document.getElementById("sortOptionsID");
    var value = e.value;

    if(value == 'name') sortByName();
    if(value == 'id') sortByID();
}

function sortByID(){
    currentStorage.sort(function(a, b) {
        return a.id - b.id;
    });
    displayPokemon(currentStorage)
}

function sortByName(){
    currentStorage = currentStorage.sort((a, b) => a.name.localeCompare(b.name))
    displayPokemon(currentStorage)
}

searchbar.addEventListener('keyup', (e) => {
    const searchString = e.target.value.toLowerCase();
    const filteredStorage = currentStorage.filter( pokemon => {
        return pokemon.name.toLowerCase().includes(searchString)
        
    })

    displayPokemon(filteredStorage);
})