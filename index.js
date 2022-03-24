//fetch first collection using var beginURL
let beginURL = 'https://pokeapi.co/api/v2/pokemon'

fetch(beginURL)
    .then( respons => respons.json())
    .then( addPokemon )

//global variables
let id = 0;
let pokeDetailURL = ''
let currentPokemon = []
let collection = []
let currentPage = 1

//close modal when window.onclick
let modal = document.getElementById('id01')

//disable modal when clicked on window
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

//apply single-pokemon-data to modal
function writePokeDetails(pokemon) {
    currentPokemon = pokemon
    document.getElementById('pokemon-name').innerHTML='#' + pokemon.id + ' ' + pokemon.name
    document.getElementById('modal-img').innerHTML=
        `
            <img class="h-[10rem]" alt="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/${pokemon.id}.gif">
        `
    document.getElementById('modal-info-entrys').innerHTML=
        `
            <p><strong>height:</strong> ${pokemon.height}0cm</p>
            <p><strong>weight:</strong> ${pokemon.weight}kg</p>
            <p><strong>exp:</strong> ${pokemon.base_experience}</p>
            <p><strong>type:</strong><span class="font-bold text-[${mapColor(pokemon.types[0].type.name)}]"> ${pokemon.types[0].type.name}</span></p>
        `
    document.getElementById('modal-moves').innerHTML=
        `
            <p><strong>move 1:</strong> ${pokemon.moves[0].move.name}</p>
            <p><strong>move 2:</strong> ${pokemon.moves[1].move.name}</p>
            <p><strong>move 3:</strong> ${pokemon.moves[2].move.name}</p>
            <p><strong>move 4:</strong> ${pokemon.moves[3].move.name}</p>
        `
    document.getElementById('modal-stats').innerHTML=
        `
            <p><strong>${pokemon.stats[0].stat.name}:</strong> <span>${pokemon.stats[0].base_stat}</span></p>
            <p><strong>${pokemon.stats[1].stat.name}:</strong> <span>-${pokemon.stats[1].base_stat}</span></p>
            <p><strong>${pokemon.stats[2].stat.name}:</strong> <span>${pokemon.stats[2].base_stat}</span></p>
            <p><strong>${pokemon.stats[3].stat.name}:</strong> <span>-${pokemon.stats[3].base_stat}</span></p>
            <p><strong>${pokemon.stats[4].stat.name}:</strong> <span>${pokemon.stats[4].base_stat}</span></p>
            <p><strong>${pokemon.stats[5].stat.name}:</strong> <span>${pokemon.stats[5].base_stat}</span></p>
        `
    if (currentPokemon) {
        document.getElementById('id01').style.display='block'
        console.log(currentPokemon)
    }
}

//fetch single pokemon data and run function writePokeDetails
const getPokeDetails = async (id ) => {
    pokeDetailURL = `https://pokeapi.co/api/v2/pokemon/${id}`
    const res = await fetch(pokeDetailURL)
    let pokemon = await res.json()
    let type;
    type = pokemon.types[0].type.name
    writePokeDetails( pokemon,type )
}

//apply next data to modal
function nxtSinglePokemon() {
    getPokeDetails( currentPokemon.id+1 )
}

//apply previous data to modal if id > 1
function prevSinglePokemon() {
    if (currentPokemon.id != 1) {
        getPokeDetails( currentPokemon.id-1 )
    } else { console.error("failed to go back 1 pokemon")}
}

//fetch next 20 pokemons and apply to main content
function replaceCollectionURL_next() {
    const getNextCollection = async(respons) => {
        const res = await fetch(collection.next)
        respons = await res.json()
        addPokemon( respons )
    }
    if (currentPage <= 44) {
        getNextCollection()
        currentPage ++
        updatePageNum()
    }
}

//fetch previous 20 pokemons and apply to main content
function replaceCollectionURL_prev() {
    const getPrevCollection = async(respons) => {
        const res = await fetch(collection.previous)
        respons = await res.json()
        id -= 40
        addPokemon( respons )
    }
    if (id != 20){
        getPrevCollection()

        currentPage --
        updatePageNum()
    }
}

//search for specific pokemon using id or name
function searchPokemon() {
    let input = document.getElementById('search').value
    if (! input) {
        input = document.getElementById('search-mobile').value
    }
    getPokeDetails(input)
}

//simple function to set pagenum to current page
function updatePageNum() {
    document.getElementById('pageNum').innerHTML = `Page: ${currentPage}/45`
}

//loops tru current collection and makes an individual card for all of them
function addPokemon( respons ) {
    collection = respons
    console.log(collection)
    let pokeData = collection.results
    document.getElementById('maincontent').innerHTML=""
    pokeData.forEach( item => {
        id++
        document.getElementById('maincontent').innerHTML+=
            `
                <div class="card rounded-3xl shadow-lg h-[20rem] m-[2rem] opacity-100" onclick="getPokeDetails( ${id} )">
                    <div class="card-body flex items-center justify-center flex-col h-[15] ">
                        <img src= "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png" class="h-[11rem] m-[2rem]">
                    </div>
                    <div class="card-footer bg-[#009688] h-[5rem] rounded-b-3xl p-10 flex justify-center items-center">
                        <p class="text-white font-bold">${id}.${item.name}</p>                    
                    </div>
                </div>
            `
    })
}

//returns color based on pokemon type or id
function mapColor(id) {
    let colors = {
        "grass": "#77cc55",
        "normal": "#aaaa99",
        "fire": "#ff4422",
        "water": "#3399ff",
        "electric": "#fecb33",
        "ice": "#66ccff",
        "fighting": "#bb5544",
        "poison": "#aa5599",
        "ground": "#ddbb55",
        "flying": "#8899ff",
        "psychic": "#ff5599",
        "bug": "#aabb22",
        "rock": "#bbaa66",
        "ghost": "#6666bb",
        "dragon": "#7766ee",
        "dark": "#775544",
        "steel": "#aaaabb",
        "fairy": "#ee99ee",
    }
    return colors[id]
}