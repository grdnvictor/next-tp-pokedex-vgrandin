"use client";

import {useEffect, useState} from "react";
import { useParams } from 'next/navigation';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {Button} from "@/components/ui/button";

import Image from 'next/image';
import Link from "next/link";

import AppHeader from "@/app_components/AppHeader";
import {Pokemon} from "@/types/types";

export default function PokemonPage() {
    const { id } = useParams();

    const [pokemon, setPokemon] = useState<Pokemon | null>(null);

    useEffect(() => {
        const url = `https://nestjs-pokedex-api.vercel.app/pokemons/${id}`;

        fetch(url).then(fetchedPokemon => {
            return fetchedPokemon.json()
        }).then((fetchedPokemon) => {
            setPokemon(fetchedPokemon);
        });
    }, [id]);

    return (
        <>
            <AppHeader/>
            <div className="container mx-auto p-4">
                <Link href={"/"}>
                    <Button className={"mb-4"}>
                        Retour à la liste des pokémons
                    </Button>
                </Link>
                {
                    pokemon === null
                        ? <p>Pokémon non trouvé</p>
                        : <Card className="w-full">
                            <CardHeader className="flex justify-between items-center">
                                <CardTitle>{pokemon.name}</CardTitle>
                                <span className="text-sm font-medium">#{pokemon.pokedexId}</span>
                            </CardHeader>
                            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex flex-col items-center md:items-start">
                                    <Image src={pokemon.image} alt={pokemon.name} width={128} height={128} className="w-32 h-32 mb-4"/>
                                    <div className="text-center md:text-left">
                                        <p className="text-lg font-bold">Types:</p>
                                        <ul className="list-none">
                                            <p className="text-sm text-muted-foreground flex justify-center gap-1">
                                                {pokemon.types.map((type) => (
                                                    <span key={type.id} className={"flex"}>
                                                        <Image src={type.image} alt={`Image type ${type.name}`} width={12} height={12}/>
                                                        &nbsp;
                                                        {type.name}
                                                    </span>
                                                ))}
                                            </p>
                                        </ul>
                                    </div>
                                </div>
                                <div className="flex flex-col items-center md:items-start">
                                    <h2 className="text-lg font-bold">Statistiques</h2>
                                    <ul className="list-none mb-4">
                                        <li>HP: {pokemon.stats.HP}</li>
                                        <li>Vitesse: {pokemon.stats.speed}</li>
                                        <li>Attaque: {pokemon.stats.attack}</li>
                                        <li>Défense: {pokemon.stats.defense}</li>
                                        <li>Attaque spé: {pokemon.stats.specialAttack}</li>
                                        <li>Défense spé: {pokemon.stats.specialDefense}</li>
                                    </ul>
                                    <h2 className="text-lg font-bold">Évolutions</h2>
                                    <ul className="list-none">
                                        {pokemon.evolutions.map(evolution => (
                                            <li key={evolution.pokedexId}>{evolution.name}</li>
                                        ))}
                                    </ul>
                                </div>
                            </CardContent>
                        </Card>
                }
            </div>
        </>
    );
}