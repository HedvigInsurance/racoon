export type Peril = {
  id: string
  icon: React.ReactNode
  name: string
  description: string
  covered: Array<string>
  notCovered: Array<string>
}
