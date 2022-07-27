export interface SimplePersister {
  save(id: string): void
  fetch(): string | null
  reset(): void
}
