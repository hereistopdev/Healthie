import type { RmCharacter } from '../types'

/** Dev server proxies `/graphql` → Rick and Morty API (avoids browser CORS issues). */
const ENDPOINT = import.meta.env.DEV
  ? '/graphql'
  : 'https://rickandmortyapi.com/graphql'

const QUERY = `#graphql
  query InterviewCharacters {
    characters {
      results {
        id
        name
        image
        species
      }
    }
  }
`

type GraphQLResponse = {
  data?: {
    characters?: {
      results: Array<{
        id: string
        name: string
        image: string
        species: string
      }> | null
    } | null
  }
  errors?: { message: string }[]
}

export async function fetchCharacters(): Promise<RmCharacter[]> {
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: QUERY }),
  })

  if (!res.ok) {
    throw new Error(`GraphQL HTTP ${res.status}`)
  }

  const json = (await res.json()) as GraphQLResponse

  if (json.errors?.length) {
    throw new Error(json.errors.map((e) => e.message).join('; '))
  }

  const rows = json.data?.characters?.results
  if (!rows) return []

  return rows.map((row) => ({
    id: Number(row.id),
    name: row.name,
    image: row.image,
    species: row.species || 'Unknown',
  }))
}
