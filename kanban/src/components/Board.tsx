import {
  closestCorners,
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core'
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import { useState, type Dispatch, type SetStateAction } from 'react'
import { burstDone } from '../burst'
import type { BoardCard, ColumnId } from '../types'
import { COLUMN_ORDER } from '../types'
import { BoardColumn } from './BoardColumn'
import { CardPreview } from './CardPreview'
import styles from './Board.module.css'

export type Columns = Record<ColumnId, BoardCard[]>

function findColumn(cardId: string, state: Columns): ColumnId | null {
  for (const key of COLUMN_ORDER) {
    if (state[key].some((c) => c.id === cardId)) return key
  }
  return null
}

function isColumnId(v: string): v is ColumnId {
  return (COLUMN_ORDER as string[]).includes(v)
}

type Props = {
  columns: Columns
  setColumns: Dispatch<SetStateAction<Columns>>
}

export function Board({ columns, setColumns }: Props) {
  const [active, setActive] = useState<BoardCard | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  const onDragStart = (e: DragStartEvent) => {
    const id = String(e.active.id)
    const col = findColumn(id, columns)
    if (!col) return
    const card = columns[col].find((c) => c.id === id)
    setActive(card ?? null)
  }

  const onDragEnd = (e: DragEndEvent) => {
    setActive(null)
    const { active, over } = e
    if (!over) return

    const activeId = String(active.id)
    const overId = String(over.id)

    const fromCol = findColumn(activeId, columns)
    if (!fromCol) return

    const sortFrom = active.data.current?.sortable as { containerId: ColumnId; index: number } | undefined
    const sortOver = over.data.current?.sortable as { containerId: ColumnId; index: number } | undefined

    const fromKey = sortFrom?.containerId ?? fromCol
    let toKey: ColumnId | undefined = sortOver?.containerId
    if (!toKey && isColumnId(overId)) toKey = overId
    if (!toKey) {
      const inferred = findColumn(overId, columns)
      if (inferred) toKey = inferred
    }
    if (!toKey) return

    const movedIntoDone = toKey === 'done' && fromKey !== 'done'

    setColumns((prev) => {
      const fromList = prev[fromKey]
      const activeIdx = fromList.findIndex((c) => c.id === activeId)
      if (activeIdx === -1) return prev

      if (fromKey === toKey) {
        const overIdx = fromList.findIndex((c) => c.id === overId)
        if (overIdx === -1 || activeIdx === overIdx) return prev
        return {
          ...prev,
          [fromKey]: arrayMove(fromList, activeIdx, overIdx),
        }
      }

      const card = fromList[activeIdx]
      const prunedFrom = [...fromList]
      prunedFrom.splice(activeIdx, 1)

      const toList = prev[toKey]
      let insertAt = toList.length
      if (!isColumnId(overId)) {
        const overIdx = toList.findIndex((c) => c.id === overId)
        if (overIdx !== -1) insertAt = overIdx
      }

      const nextTo = [...toList.slice(0, insertAt), card, ...toList.slice(insertAt)]

      return {
        ...prev,
        [fromKey]: prunedFrom,
        [toKey]: nextTo,
      }
    })

    if (movedIntoDone) {
      const ev = e.activatorEvent as MouseEvent | TouchEvent | undefined
      const x =
        ev && 'clientX' in ev ? ev.clientX : ev && 'touches' in ev ? ev.touches[0]?.clientX : undefined
      requestAnimationFrame(() => burstDone(x ?? window.innerWidth * 0.78))
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
    >
      <div className={styles.grid}>
        <BoardColumn id="todo" cards={columns.todo} accent="todo" />
        <BoardColumn id="doing" cards={columns.doing} accent="doing" />
        <BoardColumn id="done" cards={columns.done} accent="done" />
      </div>

      <DragOverlay dropAnimation={{ duration: 160, easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)' }}>
        {active ? (
          <div className={styles.overlayShell}>
            <CardPreview card={active} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}
