import styled from '@emotion/styled'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { MenuTheme } from 'ui/src/components/Menu/Menu'
import { getColor, LinkButton, Separate } from 'ui'
import { useCurrentMarket } from '@/lib/l10n/useCurrentMarket'

const Wrapper = styled(Separate)({
  display: 'flex',
  alignItems: 'center',
})

const Separator = styled.div(() => ({
  width: 1,
  height: '1rem',
  backgroundColor: getColor('gray700'),
}))

type LanguagePickerProps = {
  theme: MenuTheme
}

export const LanguagePicker = ({ theme }: LanguagePickerProps) => {
  const router = useRouter()
  const { languages } = useCurrentMarket()

  return (
    <Wrapper Separator={<Separator />}>
      {languages.map((language) => (
        <Link key={language.urlParam} href={router.asPath} locale={language.urlParam} passHref>
          <LinkButton
            color={theme}
            variant="text"
            size="sm"
            disabled={router.locale === language.urlParam}
          >
            {language.displayName}
          </LinkButton>
        </Link>
      ))}
    </Wrapper>
  )
}
