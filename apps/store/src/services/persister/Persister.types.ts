export interface SimplePersister {
  save(id: string, key?: string): void

  fetch(key?: string): string | null

  reset(key?: string): void
}
