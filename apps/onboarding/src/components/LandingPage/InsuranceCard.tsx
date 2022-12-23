import styled from '@emotion/styled'
import { useTranslation } from 'next-i18next'
import Image, { ImageProps } from 'next/legacy/image'
import type { ChangeEventHandler, MouseEventHandler } from 'react'
import { useRef, useState } from 'react'
import { Space, Checkbox, CheckboxProps, useBreakpoint, mq } from 'ui'
import { Button } from '@/components/Button/Button'
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
  const moreDetailsButtonRef = useRef<HTMLButtonElement | null>(null)

  const [isSelected, setIsSelected] = useState(delegated.checked ?? false)
  const [openDialog, setOpenDialog] = useState(false)

  const matchesSmall = useBreakpoint('sm')
  const { t } = useTranslation()

  const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    onChange?.(event)
    setIsSelected(event.target.checked)
  }

  const handleClick: MouseEventHandler<HTMLDivElement> = (event) => {
    const hasClickedOnTheCard =
      event.target !== checkboxRef.current && event.target !== moreDetailsButtonRef.current
    if (hasClickedOnTheCard) {
      checkboxRef.current?.click()
    }
  }

  return (
    <>
      <Card selected={isSelected} onClick={handleClick}>
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
                <Checkbox ref={checkboxRef} onChange={handleChange} {...delegated} />
              </CheckboxWrapper>
            </CardHeader>
            <CardDescription>{description}</CardDescription>
          </Space>
          <TextButton
            ref={moreDetailsButtonRef}
            type="button"
            variant="text"
            p="0"
            onClick={() => setOpenDialog(true)}
          >
            {t('INSURANCE_CARD_SEE_COVERAGE')}
          </TextButton>
        </CardSection>
      </Card>
      {matchesSmall && (
        <CoverageDialog
          open={openDialog}
          onOpenChange={setOpenDialog}
          title={t('PERILS_DIALOG_TITLE', { insurance: title })}
          perils={perils}
        />
      )}
    </>
  )
}

const Card = styled.div<{ selected: boolean }>(({ theme, selected }) => ({
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  minHeight: '11.625rem',
  borderRadius: '8px',
  overflow: 'hidden',
  boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.1)',
  outline: selected ? `2px solid ${theme.colors.black}` : 'none',
  transition: 'all 150ms',
  ':hover': {
    cursor: 'pointer',
    outline: `2px solid ${theme.colors.black}`,
    transform: 'scale(1.010)',
  },
  [mq.sm]: {
    minHeight: '20.43rem',
  },
}))

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
