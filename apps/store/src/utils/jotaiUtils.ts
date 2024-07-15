import { type Atom, type Getter } from 'jotai'

export const getAtomValueOrThrow = <T>(get: Getter, atom: Atom<T>): NonNullable<T> => {
  const value = get(atom)
  if (value == null) {
    throw new Error(`${atom} must have value`)
  }
  return value
}
