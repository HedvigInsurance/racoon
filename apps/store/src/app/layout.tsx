import { contentFontClassName } from '@/utils/fonts'

const Layout = ({ children }: { children: JSX.Element }) => {
  return (
    <html lang="en">
      <body className={contentFontClassName}>{children}</body>
    </html>
  )
}

export default Layout
