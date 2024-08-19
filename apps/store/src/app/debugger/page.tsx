import { redirect } from 'next/navigation'

export default function DebuggerIndex() {
  return redirect('/debugger/session')
}

export const metadata = {
  robots: 'noindex, nofollow',
}
