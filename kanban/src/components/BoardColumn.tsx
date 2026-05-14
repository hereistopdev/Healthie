import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import type { BoardCard, ColumnId } from '../types'
import { COLUMN_COPY } from '../types'
import { SortableCard } from './SortableCard'
import styles from './BoardColumn.module.css'

type Props = {
  id: ColumnId
  cards: BoardCard[]
  accent: 'todo' | 'doing' | 'done'
}

export function BoardColumn({ id, cards, accent }: Props) {
  const { setNodeRef, isOver } = useDroppable({ id })
  const copy = COLUMN_COPY[id]

  return (
    <section
      ref={setNodeRef}
      className={`${styles.column} ${styles[accent]} ${isOver ? styles.over : ''}`}
      aria-labelledby={`col-${id}-title`}
    >
      <header className={styles.head}>
        <h2 id={`col-${id}-title`} className={styles.title}>
          {copy.title}
        </h2>
        <span className={styles.hint}>{copy.hint}</span>
        <span className={styles.count}>{cards.length}</span>
      </header>

      <SortableContext id={id} items={cards.map((c) => c.id)} strategy={verticalListSortingStrategy}>
        <div className={styles.list}>
          {cards.map((card) => (
            <SortableCard key={card.id} card={card} />
          ))}
        </div>
      </SortableContext>
    </section>
  )
}
