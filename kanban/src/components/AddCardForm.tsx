import { useMemo, useState } from 'react'
import type { BoardCard, RmCharacter } from '../types'
import styles from './AddCardForm.module.css'

type Props = {
  roster: RmCharacter[]
  onCreate: (card: BoardCard) => void
}

function newId() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }
  return `card_${Date.now()}_${Math.random().toString(16).slice(2)}`
}

export function AddCardForm({ roster, onCreate }: Props) {
  const [characterId, setCharacterId] = useState<number | ''>('')
  const [blurb, setBlurb] = useState('')

  const picked = useMemo(
    () => (characterId === '' ? null : roster.find((c) => c.id === characterId) ?? null),
    [characterId, roster],
  )

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!picked) return
    onCreate({
      id: newId(),
      character: picked,
      blurb: blurb.trim(),
      createdAt: Date.now(),
    })
    setBlurb('')
    setCharacterId('')
  }

  return (
    <form className={styles.form} onSubmit={submit}>
      <div className={styles.row}>
        <label className={styles.label} htmlFor="who">
          Who&apos;s on this?
        </label>
        <select
          id="who"
          className={styles.select}
          required
          value={characterId === '' ? '' : String(characterId)}
          onChange={(e) => setCharacterId(e.target.value ? Number(e.target.value) : '')}
        >
          <option value="" disabled>
            Pick a character…
          </option>
          {roster.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.row}>
        <label className={styles.label} htmlFor="blurb">
          Context <span className={styles.optional}>(optional)</span>
        </label>
        <input
          id="blurb"
          className={styles.input}
          placeholder="e.g. follow up after portal incident"
          value={blurb}
          maxLength={140}
          onChange={(e) => setBlurb(e.target.value)}
        />
      </div>

      <button type="submit" className={styles.btn} disabled={!picked || roster.length === 0}>
        Add to board
      </button>
    </form>
  )
}
