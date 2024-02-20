import { PropsWithChildren } from 'react'

// Everything interesting is in [locale]/layout, but we must provide root layout anyway
const RootLayout = ({ children }: PropsWithChildren) => children
export default RootLayout
