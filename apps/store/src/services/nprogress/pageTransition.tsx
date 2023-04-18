import { css, Global } from '@emotion/react'
import { useRouter } from 'next/router'
import NProgress from 'nprogress'
import { useEffect, useState } from 'react'
import 'nprogress/nprogress.css'
import { theme } from 'ui'

if (typeof window !== 'undefined') {
  NProgress.configure({ showSpinner: false })
}

export const PageTransitionProgressBar = () => {
  const [color, setColor] = useState(getRandomColor)
  const router = useRouter()

  useEffect(() => {
    const handleRouteStart = () => {
      setColor(getRandomColor())
      NProgress.start()
    }
    // eslint-disable-next-line @typescript-eslint/unbound-method
    const handleRouteChangeComplete = NProgress.done

    router.events.on('routeChangeStart', handleRouteStart)
    router.events.on('routeChangeComplete', handleRouteChangeComplete)
    router.events.on('routeChangeError', handleRouteChangeComplete)

    return () => {
      router.events.off('routeChangeStart', handleRouteStart)
      router.events.off('routeChangeComplete', handleRouteChangeComplete)
      router.events.off('routeChangeError', handleRouteChangeComplete)
    }
  }, [router.events])

  return <Global styles={[styles, { ':root': { '--nprogress-color': color } }]} />
}

const COLORS = [
  theme.colors.pink600,
  theme.colors.purple600,
  theme.colors.teal600,
  theme.colors.blue600,
  theme.colors.green600,
  theme.colors.amber600,
]

const getRandomColor = () => COLORS[Math.floor(Math.random() * COLORS.length)]

const styles = css({
  '#nprogress .bar': {
    background: 'var(--nprogress-color)',
  },

  '#nprogress .peg': {
    boxShadow: '0 0 10px var(--nprogress-color), 0 0 5px var(--nprogress-color)',
  },
})
