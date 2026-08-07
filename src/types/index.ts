export type CardType = 'id-card' | 'pfp-frame'
export type GeneratorMode = 'upload' | 'form' | 'preview' | 'success'

export interface BuilderData {
  name: string
  titleBadge: string
  role: string
  college: string
  phone: string
  builderNo: string
  totalBuilders: string
  dates: string
  cardType: CardType
  imageUrl: string | null
}
