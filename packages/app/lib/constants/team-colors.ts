export type TeamColorId =
  | 'c1'
  | 'c2'
  | 'c3'
  | 'c4'
  | 'c5'
  | 'c6'
  | 'c7'
  | 'c8'
  | 'c9'
  | 'c10'
  | 'c11'
  | 'c12'
  | 'c13'
  | 'c14'
  | 'c15'
  | 'c16'

export interface TeamColorDef {
  id: TeamColorId
  name: string
  hex: string
  lightHex: string
}

// Island Joy 16 palette (from island-joy-16.hex)
export const TEAM_COLOR_OPTIONS: TeamColorDef[] = [
  { id: 'c1', name: '#ffffff', hex: '#ffffff', lightHex: '#ffffff' },
  { id: 'c2', name: '#6df7c1', hex: '#6df7c1', lightHex: '#c0fde4' },
  { id: 'c3', name: '#11adc1', hex: '#11adc1', lightHex: '#8fdde8' },
  { id: 'c4', name: '#606c81', hex: '#606c81', lightHex: '#a7b0bf' },
  { id: 'c5', name: '#393457', hex: '#393457', lightHex: '#807b99' },
  { id: 'c6', name: '#1e8875', hex: '#1e8875', lightHex: '#6bc7b4' },
  { id: 'c7', name: '#5bb361', hex: '#5bb361', lightHex: '#a4dbac' },
  { id: 'c8', name: '#a1e55a', hex: '#a1e55a', lightHex: '#d3f4ab' },
  { id: 'c9', name: '#f7e476', hex: '#f7e476', lightHex: '#fbf2b4' },
  { id: 'c10', name: '#f99252', hex: '#f99252', lightHex: '#fcc9a5' },
  { id: 'c11', name: '#cb4d68', hex: '#cb4d68', lightHex: '#e398aa' },
  { id: 'c12', name: '#6a3771', hex: '#6a3771', lightHex: '#af87b6' },
  { id: 'c13', name: '#c92464', hex: '#c92464', lightHex: '#ea7ba3' },
  { id: 'c14', name: '#f48cb6', hex: '#f48cb6', lightHex: '#f8c8dc' },
  { id: 'c15', name: '#f7b69e', hex: '#f7b69e', lightHex: '#fbdbcf' },
  { id: 'c16', name: '#9b9c82', hex: '#9b9c82', lightHex: '#cfd0c1' },
]

export const DEFAULT_TEAM_COLORS: TeamColorId[] = ['c2', 'c3', 'c7', 'c8', 'c11']

export function getTeamColorDef(id: TeamColorId): TeamColorDef {
  return TEAM_COLOR_OPTIONS.find((color) => color.id === id) ?? TEAM_COLOR_OPTIONS[0]
}

