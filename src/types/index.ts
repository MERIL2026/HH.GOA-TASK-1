export type CardType = 'id-card' | 'pfp-frame'
export type GeneratorMode = 'upload' | 'form' | 'preview' | 'success'
export type PfpFrameStyle = 'classic-goa' | 'builder-mode' | 'ship-from-paradise'

export interface BuilderProfile {
  id: string
  name: string
  role: string
  location: string
  event: string
  builderClass: string
  interests: string[]
  shipping: string
  tagline: string
  photoUrl: string | null
  pfpFrame: PfpFrameStyle
  builderId: string
  titleBadge?: string
  college?: string
  phone?: string
  dates?: string
  totalBuilders?: string
  beachBag?: string
  createdAt?: string
}

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
  builderClass: string
  beachBag: string
  shipping: string
  pfpFrame: PfpFrameStyle
  location: string
  tagline: string
}
