export type ColumnId = 'todo' | 'doing' | 'done'

export type RmCharacter = {
  id: number
  name: string
  image: string
  species: string
}

export type BoardCard = {
  id: string
  character: RmCharacter
  /** Optional note — most cards won't need one */
  blurb: string
  createdAt: number
}

export const COLUMN_ORDER: ColumnId[] = ['todo', 'doing', 'done']

export const COLUMN_COPY: Record<ColumnId, { title: string; hint: string }> = {
  todo: { title: 'To Do', hint: 'Not started' },
  doing: { title: 'Doing', hint: 'In progress' },
  done: { title: 'Done', hint: 'Wrapped up' },
}
