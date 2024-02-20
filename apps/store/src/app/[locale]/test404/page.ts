import { notFound } from 'next/navigation'

// Provide a way to trigger 404 in app router
export default function Test404Page() {
  throw notFound()
}
