"use client";

import {useState, useEffect} from "react";

import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import Image from 'next/image';
import Link from "next/link";

import AppHeader from "@/app_components/AppHeader";
import {Pokemon, PokemonType} from "@/types/types";

const DEFAULT_LIMIT = 50;
const DEFAULT_TYPE = 'all';

export default function Home() {
    const [pokemons, setPokemons] = useState<Pokemon[]>([]);
    const [types, setTypes] = useState<PokemonType[]>([]);

    const [limitFilter, setLimitFilter] = useState(DEFAULT_LIMIT);
    const [nameFilter, setNameFilter] = useState('');

    const [typeFilter, setTypeFilter] = useState(DEFAULT_TYPE);

    useEffect(() => {
        const url = `https://nestjs-pokedex-api.vercel.app/types`;

        fetch(url).then(fetchedTypes => {
            return fetchedTypes.json()
        }).then((fetchedTypes) => {
            setTypes(fetchedTypes);
        });
    }, []);

    useEffect(() => {
        const type = typeFilter === 'all'
            ? ''
            : typeFilter;

        const url = `https://nestjs-pokedex-api.vercel.app/pokemons?name=${nameFilter}&typeId=${type}`;

        fetch(url).then(fetchedPokemons => {
            return fetchedPokemons.json()
        }).then((fetchedPokemons) => {
            setPokemons(fetchedPokemons);
        });
    }, [nameFilter, typeFilter]);

    useEffect(() => {
        const handleScroll = () => {
            // see: https://stackoverflow.com/questions/9439725/how-to-detect-if-browser-window-is-scrolled-to-bottom
            if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
                const page = Math.floor(pokemons.length / limitFilter) + 1;
                /*
                 * Problème sur l'offset ? Car si on change de limit en cours de route
                 * Le système de pagination ne fonctionne plus ??
                 */
                //const offset = pokemons.length;

                const url = `https://nestjs-pokedex-api.vercel.app/pokemons?limit=${limitFilter}&page=${page}`;
                fetch(url).then(fetchedPokemons => {
                    return fetchedPokemons.json()
                }).then((fetchedPokemons) => {
                    setPokemons([
                        ...pokemons,
                        ...fetchedPokemons
                    ]);
                });
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [pokemons]);

    return (
        <div>
            <AppHeader/>
            <div className="container mx-auto p-4">
                <header className="flex justify-between items-center mb-4 gap-4">
                    <Input
                        type="text"
                        placeholder="Rechercher un pokémon"
                        className="border p-2 rounded"
                        value={nameFilter}
                        onChange={(e) => setNameFilter(e.target.value)}
                    />
                    <Select value={typeFilter} onValueChange={setTypeFilter}>
                        <SelectTrigger className="border p-2 rounded">
                            <SelectValue placeholder="Tous types"/>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Tous types</SelectItem>
                            {types.map((type) => (
                                <SelectItem key={type.id} value={String(type.id)}>
                                    <div className={"flex"}>
                                        <Image src={type.image} alt={`Type ${type.name}`} width={12} height={12}/>&nbsp;- {type.name}
                                    </div>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Select value={limitFilter.toString()} onValueChange={(value) => setLimitFilter(parseInt(value))}>
                        <SelectTrigger className="border p-2 rounded">
                            <SelectValue/>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="10">10</SelectItem>
                            <SelectItem value="20">20</SelectItem>
                            <SelectItem value="50">50</SelectItem>
                            <SelectItem value="100">100</SelectItem>
                        </SelectContent>
                    </Select>
                </header>
                {
                    pokemons.length === 0
                        ? <div className="text-center">Aucun pokémon trouvé</div>
                        : <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                            {pokemons.map((pokemon) => (
                                <Link href={`/pokemon/${pokemon.pokedexId}`} key={pokemon.pokedexId}>
                                    <Card className={cn("w-full hover:shadow-lg cursor-pointer")}>
                                        <CardHeader className="flex justify-between items-center">
                                            <CardTitle>{pokemon.name}</CardTitle>
                                            <span className="text-sm font-medium">#{pokemon.pokedexId}</span>
                                        </CardHeader>
                                        <CardContent className="grid gap-4">
                                            <div className="flex justify-center">
                                                <Image src={pokemon.image} alt="Pokémon" width={128} height={128}
                                                       className="w-32 h-32"/>
                                            </div>
                                            <div className="text-center">
                                                <p className="text-sm text-muted-foreground flex justify-center gap-1">
                                                    {pokemon.types.map((type) => (
                                                        <span key={type.id} className={"flex"}>
                                                    <Image src={type.image} alt={`Image type ${type.name}`} width={12}
                                                           height={12}/>
                                                            &nbsp;{type.name}
                                                </span>
                                                    ))}
                                                </p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                }

            </div>
        </div>
    );
}