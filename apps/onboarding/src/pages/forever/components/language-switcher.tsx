import Link from 'next/link'
import { Separate } from 'ui'
import { colorsV3 } from '@hedviginsurance/brand'
import styled from '@emotion/styled'
import { useCurrentMarket } from '@/lib/l10n'
import { useRouter } from 'next/router'

const Wrapper = styled(Separate)({
  display: 'flex',
})

const Separator = styled.div({
  width: 1,
  height: '100%',
  backgroundColor: colorsV3.gray700,
  marginLeft: '0.25rem',
  marginRight: '0.25rem',
})

const Anchor = styled.a<{ active: boolean }>(
  {
    textDecoration: 'none',
    '&:hover': {
      color: colorsV3.gray900,
    },
  },
  ({ active }) => ({
    color: active ? colorsV3.gray900 : colorsV3.gray500,
  }),
)

export const LanguageSwitcher = () => {
  const router = useRouter()
  const { languages } = useCurrentMarket()

  return (
    <Wrapper Separator={<Separator />}>
      {languages.map((language) => (
        <Link key={language.urlParam} href={router.asPath} locale={language.urlParam} passHref>
          <Anchor active={router.locale === language.urlParam}>{language.displayName}</Anchor>
        </Link>
      ))}
    </Wrapper>
  )
}
