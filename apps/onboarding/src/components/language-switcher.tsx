import styled from '@emotion/styled'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Separate } from 'ui'
import { useCurrentMarket } from '@/lib/l10n'

const FALLBACK_PATH = '/'

const Wrapper = styled(Separate)({
  display: 'flex',
  height: '1.5rem',
})

const Separator = styled.div(({ theme }) => ({
  width: 1,
  height: '100%',
  backgroundColor: theme.colors.gray700,
  marginLeft: '0.5rem',
  marginRight: '0.5rem',
}))

const Anchor = styled.a<{ active: boolean }>(({ active, theme }) => ({
  textDecoration: 'none',
  '&:hover': {
    color: theme.colors.gray900,
  },
  color: active ? theme.colors.gray900 : theme.colors.gray500,
}))

export const LanguageSwitcher = () => {
  const router = useRouter()
  const { languages } = useCurrentMarket()

  return (
    <Wrapper Separator={<Separator />}>
      {languages.map((language) => (
        <Link
          key={language.urlParam}
          // avoid using `asPath` until `isReady` field is `true` (https://nextjs.org/docs/api-reference/next/router)
          href={router.isReady ? router.asPath : FALLBACK_PATH}
          locale={language.urlParam}
          passHref
          legacyBehavior
        >
          <Anchor active={router.locale === language.urlParam}>{language.displayName}</Anchor>
        </Link>
      ))}
    </Wrapper>
  )
}
