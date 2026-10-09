import { useEffect, useState } from 'react'
import PokemonCard from './PokemonCard'
import './Pokedex.css'

const LIST_URL = 'https://pokeapi.co/api/v2/pokemon?limit=20'

function Pokedex() {
  const [pokemons, setPokemons] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false

    async function loadPokemons() {
      try {
        setLoading(true)
        setError('')

        const listResponse = await fetch(LIST_URL)
        if (!listResponse.ok) {
          throw new Error('Não foi possível carregar a lista de Pokémons.')
        }

        const listData = await listResponse.json()

        const details = await Promise.all(
          listData.results.map(async (pokemon) => {
            const detailResponse = await fetch(
              `https://pokeapi.co/api/v2/pokemon/${pokemon.name}`,
            )
            console.log(detailResponse)
            if (!detailResponse.ok) {
              throw new Error(`Falha ao buscar detalhes de ${pokemon.name}.`)
            }

            const detail = await detailResponse.json()
            const officialArt =
              detail.sprites?.other?.['official-artwork']?.front_default

            return {
              id: detail.id,
              name: detail.name,
              image: officialArt || detail.sprites?.front_default,
              types: detail.types.map((item) => item.type.name),
            }
          }),
        )

        if (!cancelled) {
          setPokemons(details)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || 'Erro ao buscar dados da Pokédex.')
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    loadPokemons()

    return () => {
      cancelled = true
    }
  }, [])

  const filteredPokemons = pokemons.filter((pokemon) =>
    pokemon.name.toLowerCase().includes(search.trim().toLowerCase()),
  )

  return (
    <section className="pokedex">
      <header className="pokedex__header">
        <p className="pokedex__eyebrow">Estácio · React</p>
        <h1>Pokédex</h1>
        <p className="pokedex__subtitle">
          Consulte os primeiros 20 Pokémons da PokeAPI, com foto, nome e tipos.
        </p>

        <label className="pokedex__search">
          <span className="pokedex__search-label">Buscar por nome</span>
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Ex.: bulbasaur, charmander..."
            disabled={loading}
          />
        </label>
      </header>

      {loading && <p className="pokedex__status">Carregando Pokémons...</p>}

      {!loading && error && <p className="pokedex__status pokedex__status--error">{error}</p>}

      {!loading && !error && filteredPokemons.length === 0 && (
        <p className="pokedex__status">
          Nenhum Pokémon encontrado para “{search.trim()}”.
        </p>
      )}

      {!loading && !error && (
        <div className="pokedex__grid">
          {filteredPokemons.map((pokemon) => (
            <PokemonCard
              key={pokemon.id}
              id={pokemon.id}
              name={pokemon.name}
              image={pokemon.image}
              types={pokemon.types}
            />
          ))}
        </div>
      )}
    </section>
  )
}

export default Pokedex
