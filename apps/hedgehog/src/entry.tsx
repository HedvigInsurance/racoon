import { useEffect } from 'react'
import { CookiesProvider } from 'react-cookie'
import { app } from 'portals'
import {
  Button,
  FadeIn,
  Flex,
  Spinner,
  StandaloneMessage,
  useSearchParamsState,
} from '@hedvig-ui'
import { useAuthenticate } from 'auth/use-authenticate'
import { RenewTokenLock } from 'gql/apollo/lock'
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useNavigate,
} from 'react-router-dom'
import { TriagingPage } from 'demo/TriagingPage'
import { PortalsPage } from 'auth/PortalsPage'
import { removeAuthTokens, saveAuthTokens } from './auth/auth.state'
import { AUTH_BASE_URL } from './auth/auth.api'

const Main = () => {
  const { me, loading } = useAuthenticate()
  const navigate = useNavigate()

  if (loading) {
    return (
      <StandaloneMessage paddingTop="45vh" opacity={1}>
        <Spinner />
      </StandaloneMessage>
    )
  }

  if (!me?.portal) {
    window.sessionStorage.setItem(
      'hvg:login-return-to',
      window.location.toString(),
    )
    return (
      <FadeIn>
        <StandaloneMessage paddingTop="45vh" opacity={1}>
          <Flex direction="column" align="center" gap="small">
            Could not authenticate to the server...
            <Button onClick={() => navigate('/login/logout')}>
              Log in again
            </Button>
          </Flex>
        </StandaloneMessage>
      </FadeIn>
    )
  }

  const Portal = app(me.portal)

  return Portal ? <Portal me={me} /> : null
}

const LoginProvider = () => {
  useEffect(() => {
    let redirect = `${window.location.protocol}//${window.location.host}/login/callback`

    const returnTo = window.sessionStorage.getItem('hvg:login-return-to')
    if (returnTo) {
      redirect += `?return-to=${returnTo}`
    }

    window.location.href = `${AUTH_BASE_URL}/login?redirect=${encodeURIComponent(
      redirect,
    )}`
  }, [])
  return null
}

const LoginCallback = () => {
  const [accessToken] = useSearchParamsState('access-token', '')
  const [refreshToken] = useSearchParamsState('refresh-token', '')
  const [expiresIn] = useSearchParamsState('expires-in', '599')
  const [returnTo] = useSearchParamsState('return-to', '/')

  useEffect(() => {
    saveAuthTokens({
      access_token: accessToken,
      refresh_token: refreshToken,
      expires_in: parseInt(expiresIn),
    })
      .then(() => {
        window.location.href = returnTo
      })
      .catch(console.error)
  }, [accessToken, refreshToken, expiresIn, returnTo])
  return null
}

const Logout = () => {
  removeAuthTokens()

  return <Navigate to="/login-provider" />
}

export const ReactRouterApp = () => {
  return (
    <CookiesProvider>
      <BrowserRouter>
        <RenewTokenLock />
        <Routes>
          <Route path="/demo/triaging" element={<TriagingPage />} />
          <Route path="/portals" element={<PortalsPage />} />
          <Route path="/login-provider" element={<LoginProvider />} />
          <Route path="/login/callback" element={<LoginCallback />} />
          <Route path="/login/logout" element={<Logout />} />
          <Route path="*" element={<Main />} />
        </Routes>
      </BrowserRouter>
    </CookiesProvider>
  )
}

export default ReactRouterApp

// Ignore known issue in recharts until they fix it
// https://github.com/recharts/recharts/issues/3615#issuecomment-1943095746
const ignoreRechartsErrors = () => {
  if (typeof window === 'undefined') return
  const error = console.error
  // eslint-disable-next-line
  window.console.error = (...args: any) => {
    if (/defaultProps/.test(args[0])) return
    error(...args)
  }
}

ignoreRechartsErrors()
