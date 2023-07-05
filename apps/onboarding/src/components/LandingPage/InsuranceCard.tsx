import styled from '@emotion/styled'
import { useTranslation } from 'next-i18next'
import Image, { ImageProps } from 'next/legacy/image'
import { useRef, useState } from 'react'
import { Space, theme, mq } from 'ui'
import { Button } from '@/components/Button/Button'
import { type CheckboxProps, Checkbox } from '@/components/Checkbox/Checkbox'
import { CoverageDialog } from './CoverageDialog'

type Props = {
  title: string
  description: string
  img: ImageProps
  perils: Array<string>
} & Omit<CheckboxProps, 'label' | 'prependLabel' | 'circle'>

export const InsuranceCard = ({
  title,
  description,
  img,
  perils,
  onChange,
  ...delegated
}: Props) => {
  const checkboxRef = useRef<HTMLInputElement | null>(null)
  const [openDialog, setOpenDialog] = useState(false)

  const { t } = useTranslation()

  return (
    <>
      <Card
        onClick={() => {
          // Clicking on the card area should be interpreted as clicking on the Checkbox
          checkboxRef.current?.click()
        }}
      >
        <ImageFrame>
          <Image
            {...img}
            alt={img.alt ?? ''}
            layout="fill"
            objectFit="cover"
            placeholder="blur"
            priority={true}
          />
        </ImageFrame>
        <CardSection>
          <Space y={0.75}>
            <CardHeader>
              <CardTitle>{title}</CardTitle>
              <CheckboxWrapper>
                <Checkbox
                  ref={checkboxRef}
                  onChange={(event) => onChange?.(event)}
                  onClick={(event) => {
                    // This prevents click events fired on Checkbox being also
                    // handled by the Card. If that's allowed, clicking on the
                    // Checkbox would toggle it and then its value would be reversed
                    // as the Card get's clicked as well.
                    event.stopPropagation()
                  }}
                  {...delegated}
                />
              </CheckboxWrapper>
            </CardHeader>
            <CardDescription>{description}</CardDescription>
          </Space>
          <TextButton
            type="button"
            variant="text"
            p="0"
            onClick={(event) => {
              // This prevents click events fired on 'See More' text button being also
              // handled by the Card. If that's allowed, clicking on the
              // 'See More' text button would open 'Coverage Modal' and also select the
              // Card.
              event.stopPropagation()
              setOpenDialog(true)
            }}
          >
            {t('INSURANCE_CARD_SEE_COVERAGE')}
          </TextButton>
        </CardSection>
      </Card>
      <CoverageDialog
        open={openDialog}
        onOpenChange={setOpenDialog}
        title={t('PERILS_DIALOG_TITLE', { insurance: title })}
        perils={perils}
      />
    </>
  )
}

const Card = styled.div({
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  minHeight: '11.625rem',
  borderRadius: '8px',
  overflow: 'hidden',
  boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.1)',
  transition: 'all 150ms',
  ':hover': {
    cursor: 'pointer',
    outline: `2px solid ${theme.colors.black}`,
    transform: 'scale(1.010)',
  },
  ':has(input[type="checkbox"]:checked)': {
    outline: `2px solid ${theme.colors.black}`,
  },
  [mq.sm]: {
    minHeight: '20.43rem',
  },
})

const ImageFrame = styled.div({
  position: 'relative',
  flex: '1 1 90%',
  [mq.md]: {
    flex: '1 1 55%',
  },
})

const CardSection = styled.section({
  flex: '0 1 10%',
  padding: '12px',
  [mq.md]: {
    flex: '0 1 45%',
    padding: '16px',
  },
})

const CardHeader = styled.header({
  [mq.md]: {
    display: 'flex',
    gap: '8px',
  },
})

const CardTitle = styled.h2(({ theme }) => ({
  fontSize: theme.fontSizes[2],
  [mq.sm]: {
    fontSize: theme.fontSizes[3],
    flexGrow: 1,
  },
}))

const CheckboxWrapper = styled.div({
  position: 'absolute',
  top: 10,
  right: 10,
  [mq.md]: {
    position: 'revert',
  },
})

const CardDescription = styled.p(({ theme }) => ({
  display: 'none',
  color: theme.colors.gray700,
  fontSize: theme.fontSizes[1],
  [mq.sm]: {
    display: 'revert',
  },
}))

const TextButton = styled(Button)(({ theme }) => ({
  display: 'none',
  fontSize: theme.fontSizes[1],
  color: theme.colors.purple900,
  marginTop: theme.space[4],
  [mq.sm]: {
    display: 'revert',
  },
}))
