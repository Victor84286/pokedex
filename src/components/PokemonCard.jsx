import './PokemonCard.css'

const TYPE_LABELS = {
  normal: 'Normal',
  fire: 'Fogo',
  water: 'Água',
  grass: 'Grama',
  electric: 'Elétrico',
  ice: 'Gelo',
  fighting: 'Lutador',
  poison: 'Veneno',
  ground: 'Terra',
  flying: 'Voador',
  psychic: 'Psíquico',
  bug: 'Inseto',
  rock: 'Pedra',
  ghost: 'Fantasma',
  dragon: 'Dragão',
  dark: 'Sombrio',
  steel: 'Aço',
  fairy: 'Fada',
}

function formatId(id) {
  return `#${String(id).padStart(3, '0')}`
}

function formatName(name) {
  return name.charAt(0).toUpperCase() + name.slice(1)
}

function PokemonCard({ id, name, image, types }) {
  return (
    <article className="pokemon-card">
      <span className="pokemon-card__id">{formatId(id)}</span>
      <div className="pokemon-card__image-wrap">
        <img src={image} alt={formatName(name)} className="pokemon-card__image" />
      </div>
      <h2 className="pokemon-card__name">{formatName(name)}</h2>
      <ul className="pokemon-card__types">
        {types.map((type) => (
          <li key={type} className={`pokemon-card__type pokemon-card__type--${type}`}>
            {TYPE_LABELS[type] ?? type}
          </li>
        ))}
      </ul>
    </article>
  )
}

export default PokemonCard
