import * as Models from "./models.js";
import * as Utils from "./utils.js";
// ==========================================================
// EXERCICI 1: Llistar els 151 Pokémon
// ==========================================================
// TODO: Implementa la lògica de l'exercici 1 seguint els requisits
const mapaPokemon = new Map();
let btnCarregar = document.getElementById("btn-show-all");
async function carregarLlistaPokemon() {
    Utils.mostrarEstat("Carregant Pokemons", "loading");
    Utils.netejarCercador();
    try {
        let resposta = await fetch("https://pokeapi.co/api/v2/pokemon?limit=151");
        if (!resposta.ok) {
            throw new Error(`Error HTTP: ${resposta.status}`);
        }
        let results = await resposta.json();
        //console.log(results.results)
        let i = 0;
        mapaPokemon.clear();
        for (let result of results.results) {
            let pokemon = new Models.BasePokemon(result);
            mapaPokemon.set(pokemon.id, pokemon);
        }
    }
    catch (error) {
        if (error instanceof Error) {
            Utils.mostrarEstat(error.message, "error");
        }
        else {
            Utils.mostrarEstat("ERROR DESCONOCIDO", "error");
        }
    }
    finally {
        //console.log(mapaPokemon)
        let llistaPokemons = [];
        for (let pokeElem of mapaPokemon.values()) {
            llistaPokemons.push(pokeElem);
        }
        //console.log(llistaPokemons)
        Utils.renderitzarLlistaNoms(llistaPokemons);
        Utils.amagarEstat();
    }
}
btnCarregar.addEventListener("click", carregarLlistaPokemon);
// ==========================================================
// EXERCICI 2: Cercador en temps real
// ==========================================================
// TODO: Implementa la lògica de l'exercici 2 seguint els requisits
let inpBuscar = document.getElementById("search-input");
function canviBuscador() {
    console.log(inpBuscar.value);
    if (inpBuscar.value === "") {
        let llistaPokemons = [];
        for (let pokeElem of mapaPokemon.values()) {
            llistaPokemons.push(pokeElem);
        }
        //console.log(llistaPokemons)
        Utils.renderitzarLlistaNoms(llistaPokemons);
    }
    else if (!isNaN(Number(inpBuscar.value))) {
        let llistaPokemonsPerId = [];
        for (let idPoke of mapaPokemon.values()) {
            if (idPoke.id == Number(inpBuscar.value)) {
                llistaPokemonsPerId.push(idPoke);
            }
        }
        Utils.renderitzarLlistaNoms(llistaPokemonsPerId);
    }
    else {
        let llistaPokemonsPerNom = [];
        for (let idPoke of mapaPokemon.values()) {
            if (idPoke.name.toUpperCase().includes(inpBuscar.value.toUpperCase())) {
                llistaPokemonsPerNom.push(idPoke);
            }
        }
        Utils.renderitzarLlistaNoms(llistaPokemonsPerNom);
    }
}
inpBuscar.addEventListener("input", canviBuscador);
// ==========================================================
// EXERCICI 3: Detall del Pokémon, cache i crit
// ==========================================================
// TODO: Implementa la lògica de l'exercici 3 seguint els requisits
let cachePokemon = new Map();
async function carregarDetallPokemon(id, url) {
    if (cachePokemon.has(id)) {
        let pokemon = cachePokemon.get(id);
        if (pokemon) {
            Utils.renderitzarDetallCard(pokemon);
            Utils.amagarEstat();
        }
        return;
    }
    Utils.mostrarEstat("Carregant detall del Pokémon...", "loading");
    try {
        let resposta = await fetch(url);
        if (!resposta.ok) {
            throw new Error("No s'han pogut carregar les dades del Pokémon.");
        }
        let data = await resposta.json();
        let pokemon = new Models.DetailedPokemon(data, url);
        cachePokemon.set(id, pokemon);
        Utils.renderitzarDetallCard(pokemon);
        Utils.amagarEstat();
    }
    catch (error) {
        if (error instanceof Error) {
            Utils.mostrarEstat(error.message, "error");
        }
        else {
            Utils.mostrarEstat("Error desconegut.", "error");
        }
    }
}
let llistaPokemon = document.getElementById("pokemon-list");
function seleccionarPokemon(event) {
    const target = event.target;
    if (!(target instanceof HTMLElement))
        return;
    const li = target.closest("li");
    if (!li)
        return;
    Utils.marcarItemActiu(li);
    const id = Number(li.dataset.id);
    const pokemon = mapaPokemon.get(id);
    if (pokemon) {
        carregarDetallPokemon(id, pokemon.url);
    }
}
if (llistaPokemon) {
    llistaPokemon.addEventListener("click", seleccionarPokemon);
}
// ==========================================================
// EXERCICI 4: Botons de filtre per tipus
// ==========================================================
// TODO: Implementa la lògica de l'exercici 4 seguint els requisits
// ==========================================================
// EXERCICI 5: Filtrar la llista per tipus
// ==========================================================
// TODO: Implementa la lògica de l'exercici 5 seguint els requisits
//# sourceMappingURL=main.js.map