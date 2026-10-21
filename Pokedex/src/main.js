import * as Utils from "./utils.js";
import { BasePokemon } from "./models.js";
// ==========================================================
// EXERCICI 1: Llistar els 151 Pokémon
// ==========================================================
// TODO: Implementa la lògica de l'exercici 1 seguint els requisits
const mapaPokemon = new Map();
let btnCarregar = document.getElementById("btn-show-all");
async function carregarLlistaPokemon() {
    Utils.mostrarEstat("Carregant Pokemons", "loading");
    try {
        const resposta = await fetch("https://pokeapi.co/api/v2/pokemon?limit=151");
        if (!resposta.ok) {
            throw new Error(`Error HTTP: ${resposta.status}`);
        }
        const results = await resposta.json();
        //console.log(results.results)
        let i = 0;
        for (let result of results.results) {
            mapaPokemon.set(i, new BasePokemon(result));
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
        let pokeLista = [];
        for (let e of mapaPokemon) {
        }
    }
}
btnCarregar.addEventListener("click", carregarLlistaPokemon);
// ==========================================================
// EXERCICI 2: Cercador en temps real
// ==========================================================
// TODO: Implementa la lògica de l'exercici 2 seguint els requisits
// ==========================================================
// EXERCICI 3: Detall del Pokémon, cache i crit
// ==========================================================
// TODO: Implementa la lògica de l'exercici 3 seguint els requisits
// ==========================================================
// EXERCICI 4: Botons de filtre per tipus
// ==========================================================
// TODO: Implementa la lògica de l'exercici 4 seguint els requisits
// ==========================================================
// EXERCICI 5: Filtrar la llista per tipus
// ==========================================================
// TODO: Implementa la lògica de l'exercici 5 seguint els requisits
//# sourceMappingURL=main.js.map