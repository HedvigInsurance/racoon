export type Review = {
  id: string
  type: 'company' | 'product'
  score: number
  date: string
  content: string
}

export type Rating = {
  score: number
  totalOfReviews: number
}
