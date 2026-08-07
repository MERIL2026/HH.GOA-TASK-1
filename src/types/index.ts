export type CardType = 'id-card' | 'pfp-frame'
export type GeneratorMode = 'upload' | 'form' | 'preview' | 'success'

export interface BuilderData {
  name: string
  role: string
  groupNo: string
  headerTitle: string
  sideText: string
  location: string
  stack: string
  cardType: CardType
  imageUrl: string | null
}
