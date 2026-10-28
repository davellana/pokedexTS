import * as Models from "./models.js";
import * as Utils from "./utils.js";
import {renderitzarLlistaNoms} from "./utils.js";
import {BasePokemon} from "./models.js";

// ==========================================================
// EXERCICI 1: Llistar els 151 Pokémon
// ==========================================================
// TODO: Implementa la lògica de l'exercici 1 seguint els requisits
const mapaPokemon = new Map<number, Models.BasePokemon>();

let btnCarregar = document.getElementById("btn-show-all") as HTMLButtonElement

async function carregarLlistaPokemon() {
    Utils.mostrarEstat("Carregant Pokemons", "loading")
    Utils.netejarCercador()
    let botons = document.querySelectorAll("button")

    botons.forEach((boto) => {
        boto.classList.remove("active")
    })
    try {
        let resposta = await fetch("https://pokeapi.co/api/v2/pokemon?limit=151")

        if (!resposta.ok) {
            throw new Error(`Error HTTP: ${resposta.status}`)
        }

        let results:Models.IPokeApiListResponse = await resposta.json() as Models.IPokeApiListResponse
        //console.log(results.results)
        let i:number = 0
        mapaPokemon.clear()
        for (let result of results.results) {
            let pokemon = new Models.BasePokemon(result)
            mapaPokemon.set(pokemon.id, pokemon)
        }

    } catch (error: unknown) {
        if (error instanceof Error) {
            Utils.mostrarEstat(error.message, "error")
        } else {
            Utils.mostrarEstat("Create new scratch file from selection", "error")
        }
    } finally {
        //console.log(mapaPokemon)

        let llistaPokemons:Models.BasePokemon[]=[]
        for (let pokeElem of mapaPokemon.values()) {
            llistaPokemons.push(pokeElem)
        }
        //console.log(llistaPokemons)
        Utils.renderitzarLlistaNoms(llistaPokemons)
        Utils.amagarEstat()
    }
}

btnCarregar.addEventListener("click", carregarLlistaPokemon)


// ==========================================================
// EXERCICI 2: Cercador en temps real
// ==========================================================
// TODO: Implementa la lògica de l'exercici 2 seguint els requisits

let inpBuscar= document.getElementById("search-input") as HTMLInputElement
function canviBuscador() {
    console.log(inpBuscar.value)
    if (inpBuscar.value === "") {
        let llistaPokemons:Models.BasePokemon[]=[]
        for (let pokeElem of mapaPokemon.values()) {
            llistaPokemons.push(pokeElem)
        }
        //console.log(llistaPokemons)
        Utils.renderitzarLlistaNoms(llistaPokemons)
    } else if (!isNaN(Number(inpBuscar.value))) {
        let llistaPokemonsPerId:Models.BasePokemon[]=[]
        for (let idPoke of mapaPokemon.values()) {
            if(idPoke.id==Number(inpBuscar.value)) {
                llistaPokemonsPerId.push(idPoke)
            }
        }
        Utils.renderitzarLlistaNoms(llistaPokemonsPerId)
    } else {
        let llistaPokemonsPerNom:Models.BasePokemon[]=[]
        for (let idPoke of mapaPokemon.values()) {
            if(idPoke.name.toUpperCase().includes(inpBuscar.value.toUpperCase())) {
                llistaPokemonsPerNom.push(idPoke)
            }
        }
        Utils.renderitzarLlistaNoms(llistaPokemonsPerNom)
    }
}
inpBuscar.addEventListener("input",canviBuscador)

// ==========================================================
// EXERCICI 3: Detall del Pokémon, cache i crit
// ==========================================================
// TODO: Implementa la lògica de l'exercici 3 seguint els requisits

let cachePokemon = new Map<number, Models.DetailedPokemon>()

async function carregarDetallPokemon(id: number, url: string): Promise<void> {
    if (cachePokemon.has(id)) {
        let pokemon = cachePokemon.get(id)

        if (pokemon) {
            Utils.renderitzarDetallCard(pokemon)
            Utils.amagarEstat()
        }
        return
    }

    Utils.mostrarEstat("Carregant detall del Pokémon...", "loading")

    try {
        let resposta = await fetch(url)

        if (!resposta.ok) {
            throw new Error("No s'han pogut carregar les dades del Pokémon.")
        }

        let data = await resposta.json() as Models.IPokeApiDetail

        let pokemon = new Models.DetailedPokemon(data, url)

        cachePokemon.set(id, pokemon)

        Utils.renderitzarDetallCard(pokemon)
        Utils.amagarEstat()

    } catch (error: unknown) {
        if (error instanceof Error) {
            Utils.mostrarEstat(error.message, "error")
        } else {
            Utils.mostrarEstat("Error desconegut", "error")
        }
    }
}

let llistaPokemon = document.getElementById("pokemon-list")

function seleccionarPokemon(event: MouseEvent): void {
    let target = event.target

    if (!(target instanceof HTMLElement)) return

    Utils.marcarItemActiu(target)

    let id = Number(target.dataset.id)
    let pokemon = mapaPokemon.get(id)

    if (pokemon) {
        carregarDetallPokemon(id, pokemon.url)
    }
}

if (llistaPokemon) {
    llistaPokemon.addEventListener("click", seleccionarPokemon)
}


// ==========================================================
// EXERCICI 4: Botons de filtre per tipus
// ==========================================================
// TODO: Implementa la lògica de l'exercici 4 seguint els requisits

Utils.generarBotonsTipus();



// ==========================================================
// EXERCICI 5: Filtrar la llista per tipus
// ==========================================================
// TODO: Implementa la lògica de l'exercici 5 seguint els requisits

let typeFilterContainer=document.getElementById("type-filter-container") as HTMLElement

function buscarTipusPerCarregar(event: MouseEvent){
    let targetClick=event.target
    if (!(targetClick instanceof HTMLElement)) return;
    let tipus=targetClick.getAttribute("data-type")
    if(tipus===null) return;
    let botons = document.querySelectorAll("button")

    botons.forEach((boto) => {
        boto.classList.remove("active")
    })

    targetClick.classList.add("active")

    carregarPokemonPerTipus(tipus)
}

async function carregarPokemonPerTipus(tipus:string){
    Utils.mostrarEstat("Carregant Pokémons","loading")
    try{
        let resposta = await fetch(`https://pokeapi.co/api/v2/type/${tipus}`)
        if(!resposta.ok){
            throw new Error(`Error HTTP: ${resposta.status}`)
        }
        let data = await resposta.json() as Models.IPokeApiTypeResponse
        let pokemonsTipus: BasePokemon[] = []
        for (let element of data.pokemon) {
            let pokemon = new BasePokemon(element.pokemon)

            if (pokemon.id <= 151) {
                pokemonsTipus.push(pokemon)
            }
        }

        mapaPokemon.clear()
        for(let pokemon of pokemonsTipus){
            mapaPokemon.set(pokemon.id,pokemon)
        }
        Utils.renderitzarLlistaNoms(pokemonsTipus)
        Utils.netejarCercador()
        Utils.netejarDetallCard()
        Utils.amagarEstat()

    }catch (error:unknown){
        if (error instanceof Error) {
            Utils.mostrarEstat("Error en carregar els Pokémon: " + error.message, "error")
        } else {
            Utils.mostrarEstat("Create new scratch file from selection", "error")
        }
    }
}





typeFilterContainer.addEventListener("click",buscarTipusPerCarregar)