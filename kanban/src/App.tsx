import { useEffect, useState } from 'react'
import { fetchCharacters } from './api/rickMorty'
import { AddCardForm } from './components/AddCardForm'
import { Board, type Columns } from './components/Board'
import type { BoardCard } from './types'
import styles from './App.module.css'

const emptyBoard: Columns = {
  todo: [],
  doing: [],
  done: [],
}

export default function App() {
  const [roster, setRoster] = useState<Awaited<ReturnType<typeof fetchCharacters>>>([])
  const [load, setLoad] = useState<'idle' | 'loading' | 'err'>('idle')
  const [errMsg, setErrMsg] = useState<string | null>(null)
  const [columns, setColumns] = useState<Columns>(emptyBoard)

  useEffect(() => {
    let gone = false
    setLoad('loading')
    fetchCharacters()
      .then((rows) => {
        if (gone) return
        setRoster(rows)
        setLoad('idle')
      })
      .catch((e: unknown) => {
        if (gone) return
        setLoad('err')
        setErrMsg(e instanceof Error ? e.message : 'Something broke fetching the cast.')
      })
    return () => {
      gone = true
    }
  }, [])

  const addCard = (card: BoardCard) => {
    setColumns((prev) => ({
      ...prev,
      todo: [card, ...prev.todo],
    }))
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <p className={styles.kicker}>Session 2 prep · frontend only</p>
        <h1 className={styles.title}>Open loops</h1>
        <p className={styles.lede}>
          A tiny Kanban for juggling tasks with a Rick &amp; Morty character attached — built for the
          pairing session, not production polish.
        </p>
      </header>

      <main className={styles.main}>
        <section className={styles.panel} aria-labelledby="new-card">
          <h2 id="new-card" className={styles.h2}>
            Drop something new on the board
          </h2>
          {load === 'loading' ? (
            <p className={styles.muted}>Pulling characters from the GraphQL API…</p>
          ) : null}
          {load === 'err' ? (
            <p className={styles.error} role="alert">
              {errMsg}
            </p>
          ) : null}
          <AddCardForm roster={roster} onCreate={addCard} />
        </section>

        <section className={styles.boardWrap} aria-label="Kanban columns">
          <Board columns={columns} setColumns={setColumns} />
        </section>
      </main>
    </div>
  )
}
