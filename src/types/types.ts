export type PokemonEvolution = {
    name: string;
    pokedexId: number;
}

export type PokemonType = {
    id: number;
    name: string;
    image: string;
}

export type Pokemon = {
    id: number;
    pokedexId: number;
    name: string;
    image: string;
    sprite: string;
    stats: {
        HP: number;
        speed: number;
        attack: number;
        defense: number;
        specialAttack: number;
        specialDefense: number;
        special_attack: number;
        special_defense: number;
    };
    generation: number;
    evolutions: PokemonEvolution[];
    types: PokemonType[];
}