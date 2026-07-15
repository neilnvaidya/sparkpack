/**
 * Game persistence – localStorage for created/generated games.
 * @see Docs/08a-implementation-guide.md (5.1 Storage Utility)
 */

export interface StoredGame {
  gameId: string
  templateId: string
  content: unknown
  createdAt: string
  /** Shape of `content`. Games from an older shape are dropped on read. */
  contentVersion?: number
  settings?: {
    numTeams?: number
    teamNames?: string[]
    teamColors?: string[]
  }
}

const STORAGE_KEY = 'sparkpack_games'

/**
 * Bump whenever the built template content shape changes. Stored games carry the
 * version they were created with; mismatches are discarded rather than fed to a
 * runtime that can no longer read them.
 */
export const CONTENT_VERSION = 2

export function saveGame(game: StoredGame): void {
  try {
    if (typeof window === 'undefined') return
    const games = getAllGames()
    games[game.gameId] = { ...game, contentVersion: game.contentVersion ?? CONTENT_VERSION }
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(games))
  } catch (error) {
    console.error('Failed to save game:', error)
  }
}

export function getGame(gameId: string): StoredGame | null {
  try {
    if (typeof window === 'undefined') return null
    const games = getAllGames()
    const game = games[gameId]
    if (!game) return null
    if (game.contentVersion !== CONTENT_VERSION) {
      deleteGame(gameId)
      return null
    }
    return game
  } catch (error) {
    console.error('Failed to get game:', error)
    return null
  }
}

export function getAllGames(): Record<string, StoredGame> {
  try {
    if (typeof window === 'undefined') return {}
    const stored = window.localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : {}
  } catch (error) {
    console.error('Failed to get all games:', error)
    return {}
  }
}

export function deleteGame(gameId: string): void {
  try {
    if (typeof window === 'undefined') return
    const games = getAllGames()
    delete games[gameId]
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(games))
  } catch (error) {
    console.error('Failed to delete game:', error)
  }
}

export function clearAllGames(): void {
  try {
    if (typeof window === 'undefined') return
    window.localStorage.removeItem(STORAGE_KEY)
  } catch (error) {
    console.error('Failed to clear games:', error)
  }
}
