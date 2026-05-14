import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { BoardCard } from '../types'
import styles from './SortableCard.module.css'

type Props = {
  card: BoardCard
}

export function SortableCard({ card }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: card.id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <article
      ref={setNodeRef}
      style={style}
      className={`${styles.card} ${isDragging ? styles.dragging : ''}`}
      {...attributes}
      {...listeners}
    >
      <img src={card.character.image} alt="" className={styles.avatar} draggable={false} />
      <div className={styles.body}>
        <p className={styles.name}>{card.character.name}</p>
        <p className={styles.meta}>{card.character.species}</p>
        {card.blurb.trim() ? <p className={styles.blurb}>{card.blurb.trim()}</p> : null}
      </div>
    </article>
  )
}
