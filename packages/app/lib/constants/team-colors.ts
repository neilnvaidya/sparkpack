// c7 (Pink), c9 (Brown) and c13 (Gold) are gone — reclaimed as reserved card
// colours. Games stored with those ids predate CONTENT_VERSION 2 and are dropped
// on read, so nothing live can still reference them.
export type TeamColorId =
  | 'c1'
  | 'c2'
  | 'c3'
  | 'c4'
  | 'c5'
  | 'c6'
  | 'c8'
  | 'c10'
  | 'c11'
  | 'c12'
  | 'c14'
  | 'c15'
  | 'c16'

export interface ColorDef {
  id: string
  name: string
  hex: string
  lightHex: string
}

export interface TeamColorDef extends ColorDef {
  id: TeamColorId
}

// Saturated, Kahoot-style palette that pops on a light background.
// lightHex is a pale tint of the same hue, for chips/backgrounds.
//
// Yellow, Pink and Brown are deliberately absent: they are reserved for
// Question Rush card labels (CARD_COLOR_OPTIONS below). A team must never share
// a colour with a card, or "I'll answer the red one" stops meaning anything.
export const TEAM_COLOR_OPTIONS: TeamColorDef[] = [
  { id: 'c1', name: 'Red', hex: '#e21b3c', lightHex: '#fad1d9' },
  { id: 'c2', name: 'Blue', hex: '#1368ce', lightHex: '#cfe1f7' },
  { id: 'c3', name: 'Green', hex: '#26890c', lightHex: '#d3eacb' },
  { id: 'c4', name: 'Orange', hex: '#f4881d', lightHex: '#fde5cd' },
  { id: 'c5', name: 'Purple', hex: '#7c3aed', lightHex: '#e4d7fb' },
  { id: 'c6', name: 'Teal', hex: '#0a9ba3', lightHex: '#c9ebed' },
  { id: 'c8', name: 'Indigo', hex: '#4a5cc5', lightHex: '#d9def4' },
  { id: 'c10', name: 'Flame', hex: '#f4511e', lightHex: '#fdd9cc' },
  { id: 'c11', name: 'Lime', hex: '#7cb342', lightHex: '#e2efd3' },
  { id: 'c12', name: 'Cyan', hex: '#0097c8', lightHex: '#c8e9f4' },
  { id: 'c14', name: 'Slate', hex: '#546e7a', lightHex: '#d6dee2' },
  { id: 'c15', name: 'Berry', hex: '#ad1457', lightHex: '#f1cbdc' },
  { id: 'c16', name: 'Forest', hex: '#2e7d32', lightHex: '#d4e6d5' },
]

/**
 * Reserved for question cards — never offered as a team colour, so a child can
 * say "the yellow one" and mean exactly one thing on screen.
 *
 * Chosen to be instantly nameable by a Year 3 pupil and mutually unmistakable.
 * The count here caps how many cards a Rush round can show.
 */
export const CARD_COLOR_OPTIONS: ColorDef[] = [
  { id: 'card-yellow', name: 'Yellow', hex: '#e0a100', lightHex: '#f8ebc4' },
  { id: 'card-pink', name: 'Pink', hex: '#e91e8c', lightHex: '#fbd2e8' },
  { id: 'card-brown', name: 'Brown', hex: '#795548', lightHex: '#dfd5d1' },
]

export const DEFAULT_TEAM_COLORS: TeamColorId[] = ['c1', 'c2', 'c4', 'c3', 'c5', 'c6']

export function getTeamColorDef(id: TeamColorId): TeamColorDef {
  return TEAM_COLOR_OPTIONS.find((color) => color.id === id) ?? TEAM_COLOR_OPTIONS[0]
}

