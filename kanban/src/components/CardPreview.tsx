import type { BoardCard } from '../types'
import cardStyles from './SortableCard.module.css'

export function CardPreview({ card }: { card: BoardCard }) {
  return (
    <article className={`${cardStyles.card} ${cardStyles.dragging}`}>
      <img src={card.character.image} alt="" className={cardStyles.avatar} draggable={false} />
      <div className={cardStyles.body}>
        <p className={cardStyles.name}>{card.character.name}</p>
        <p className={cardStyles.meta}>{card.character.species}</p>
        {card.blurb.trim() ? <p className={cardStyles.blurb}>{card.blurb.trim()}</p> : null}
      </div>
    </article>
  )
}
