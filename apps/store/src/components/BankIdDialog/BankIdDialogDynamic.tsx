import dynamic from 'next/dynamic'

// By the time it gets used, BankIdDialog will probably be loaded/cached already so
// no reason to add a 'loading' component here. At the end of the day it's also hard to
// add a loading component as this dialog is not opened directly by the user
// but as a consequence of having a BankId operation in progress.
export const BankIdDialogDynamic = dynamic(
  async () => {
    const { BankIdDialog } = await import('./BankIdDialog')
    return BankIdDialog
  },
  {
    ssr: false,
  },
)
