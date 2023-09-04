import styled from '@emotion/styled'
import { useTranslation } from 'next-i18next'
import Link from 'next/link'
import { type ComponentProps } from 'react'
import { Button, Space, Text, mq, theme } from 'ui'
import { Pillow } from '@/components/Pillow/Pillow'
import { Price } from '@/components/Price'
import { SpaceFlex } from '@/components/SpaceFlex/SpaceFlex'

type Props = {
  title: string
  subtitle: string
  pillow: ComponentProps<typeof Pillow>
  href: string
  cost: ComponentProps<typeof Price>
  onAdd: () => void
  loading: boolean
  onDismiss: () => void
}

export const QuickAdd = (props: Props) => {
  const { t } = useTranslation('cart')

  return (
    <Card>
      <Space y={1}>
        <Header>
          <SpaceFlex space={1} align="center">
            <Pillow size="small" {...props.pillow} />
            <div>
              <StyledLink href={props.href}>
                <Text as="span" color="textTranslucentPrimary">
                  {props.title}
                </Text>
              </StyledLink>
              <Text as="p" color="textTranslucentSecondary">
                {props.subtitle}
              </Text>
            </div>
          </SpaceFlex>
        </Header>
        <Divider />
        <Text as="p" color="textTranslucentSecondary">
          {/* TODO: move this text to the api so it can be used with other offer types */}
          {t('ACCIDENT_OFFER_DESCRIPTION')}
        </Text>
        <Footer>
          <SpaceFlex space={0.5}>
            <Button size="medium" onClick={props.onAdd} loading={props.loading}>
              {t('QUICK_ADD_BUTTON')}
            </Button>
            <Button size="medium" variant="ghost" onClick={props.onDismiss}>
              {t('QUICK_ADD_DISMISS')}
            </Button>
          </SpaceFlex>

          <Price
            {...props.cost}
            color="textTranslucentPrimary"
            secondaryColor="textTranslucentSecondary"
          />
        </Footer>
      </Space>
    </Card>
  )
}

const Card = styled.div({
  backgroundColor: theme.colors.opaque1,
  borderRadius: theme.radius.md,
  padding: theme.space.md,

  [mq.lg]: { padding: theme.space.lg },
})

const Header = styled.div({
  paddingBottom: theme.space.xs,
})

const StyledLink = styled(Link)({
  '&:hover': {
    textDecoration: 'underline',
  },
})

const Divider = styled.div({
  height: 1,
  backgroundColor: theme.colors.borderTranslucent1,
})

const Footer = styled.div({
  paddingTop: theme.space.xs,
  display: 'grid',
  gridTemplateRows: 'auto auto',
  gap: theme.space.md,

  [mq.sm]: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
})
