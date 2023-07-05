import { datadogLogs } from '@datadog/browser-logs'
import styled from '@emotion/styled'
import { useState, useCallback, useMemo } from 'react'
import { mq, Text, theme } from 'ui'
import * as Accordion from '@/components/Accordion/Accordion'
import { PerilFragment } from '@/services/apollo/generated'
import { isBrowser } from '@/utils/env'
import { useBreakpoint } from '@/utils/useBreakpoint/useBreakpoint'
import { CoverageList } from './CoverageList'

type Peril = PerilFragment & { disabled?: boolean }

const getPerilColumns = (items: Array<Peril>, columns: number) =>
  items.reduce((acc, item, index) => {
    const columnIndex = index % columns
    if (!acc[columnIndex]) {
      acc[columnIndex] = []
    }
    acc[columnIndex].push(item)
    return acc
  }, [] as Array<Array<Peril>>)

type Props = {
  items: Array<PerilFragment>
  missingItems?: Array<PerilFragment>
}

export const Perils = ({ items, missingItems = [] }: Props) => {
  const BREAKPOINTS = {
    xl: useBreakpoint('xl'),
    lg: useBreakpoint('lg'),
    md: useBreakpoint('md'),
    sm: useBreakpoint('sm'),
  } as const

  const getColumnCountByBreakpoint = (breakpoints: typeof BREAKPOINTS) => {
    if (breakpoints.xl) return 4
    if (breakpoints.lg) return 3
    if (breakpoints.md) return 2
    return 1
  }

  const perilItems = useMemo<Array<Peril>>(
    () => [...items, ...missingItems.map((item) => ({ ...item, disabled: true }))],
    [items, missingItems],
  )

  return (
    <PerilsAccordionGrid>
      {getPerilColumns(perilItems, getColumnCountByBreakpoint(BREAKPOINTS)).map((perils, index) => (
        <PerilColumnFlex key={index}>
          {perils.map((peril) => (
            <PerilsAccordion key={`${index}-${peril.title}`} peril={peril} />
          ))}
        </PerilColumnFlex>
      ))}
    </PerilsAccordionGrid>
  )
}

const PerilsAccordionGrid = styled.div({
  display: 'grid',
  gap: theme.space.xxs,
  gridTemplateColumns: 'repeat(auto-fit, minmax(18rem, 1fr))',
  [mq.md]: {
    columnGap: theme.space.md,
  },
})

const PerilColumnFlex = styled.div({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.space.xxs,
  [mq.md]: {
    gap: theme.space.xs,
  },
})

const PerilsAccordion = ({ peril }: { peril: Peril }) => {
  const { title, description, covered, colorCode } = peril
  const [openItems, setOpenItems] = useState<Array<string>>()

  const handleValueChange = useCallback((value: Array<string>) => {
    setOpenItems(value)
  }, [])

  if (peril.disabled) {
    return (
      <FakeAccordionItem>
        <HeaderWrapper>
          <Color color={theme.colors.textDisabled} />
          <TriggerText size="lg" color="textSecondary">
            {title}
          </TriggerText>
        </HeaderWrapper>
      </FakeAccordionItem>
    )
  }

  return (
    <Accordion.Root type="multiple" value={openItems} onValueChange={handleValueChange}>
      <Accordion.Item key={title} value={title}>
        <Accordion.HeaderWithTrigger>
          <HeaderWrapper>
            <Color color={colorCode ?? titleToColor(title)} />
            <TriggerText size="lg">{title}</TriggerText>
          </HeaderWrapper>
        </Accordion.HeaderWithTrigger>
        <Accordion.Content open={(openItems ?? []).includes(title)}>
          <ContentWrapper>
            <Text as="p" size="xs" color="textPrimary">
              {description}
            </Text>
            <CoverageList items={covered} />
          </ContentWrapper>
        </Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  )
}

const ContentWrapper = styled.div({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.space.md,
  paddingLeft: '1.75rem',
  paddingBottom: theme.space.md,
  fontSize: theme.fontSizes.xs,

  [mq.lg]: {
    paddingTop: theme.space.xs,
    paddingBottom: theme.space.lg,
  },
})

const FakeAccordionItem = styled.div({
  backgroundColor: theme.colors.opaque1,
  borderRadius: theme.radius.sm,
  paddingInline: theme.space.md,
  paddingBlock: theme.space.sm,
  cursor: 'not-allowed',

  [mq.lg]: {
    paddingInline: theme.space.lg,
    paddingBlock: theme.space.md,
  },
})

const HeaderWrapper = styled.span({
  display: 'flex',
  alignItems: 'center',
  gap: theme.space.sm,
  overflow: 'hidden',
})

const TriggerText = styled(Text)({
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',

  '[data-state=open] &': { whiteSpace: 'normal' },
})

const Color = styled.div<{ color?: string }>(({ color }) => ({
  flexShrink: 0,
  width: '1rem',
  height: '1rem',
  borderRadius: '50%',
  backgroundColor: color,
}))

const perilsWithoutColorCode = new Set()
const titleToColor = (title: string) => {
  if (!perilsWithoutColorCode.has(title)) {
    perilsWithoutColorCode.add(title)
    if (isBrowser()) {
      datadogLogs.logger.warn(`Peril has no colorCode`, { perilTitle: title })
    } else {
      console.warn(`Peril has no colorCode`, { perilTitle: title })
    }
  }
  switch (title.trim()) {
    case 'Fire':
    case 'Eldsvåda':
      return theme.colors.red700
    case 'Water leaks':
    case 'Vattenläcka':
      return theme.colors.blue500
    case 'Storms':
    case 'Oväder':
      // TODO: double-check english title
      return theme.colors.blue700
    case 'Burglary':
    case 'Inbrott':
      return theme.colors.gray500
    case 'Theft and damage':
    case 'Stöld och skadegörelse':
      return theme.colors.gray700
    case 'Liability protection':
    case 'Ansvarsskydd':
      return theme.colors.yellow500
    case 'Legal protection':
    case 'Rättskydd':
      return theme.colors.yellow500
    case 'Travel insurance':
    case 'Resetrubbel':
      return theme.colors.amber600
    case 'Assault':
    case 'Överfall':
      return theme.colors.amber500
    case 'Travel illness':
    case 'Sjuk på resa':
      return theme.colors.teal500
    case 'White goods':
    case 'Vitvaror':
      return theme.colors.grayTranslucent25
    case 'All-risk':
    case 'Drulle':
      return theme.colors.yellow700
    case 'Criminal damage':
    case 'Skadegörelse':
      return theme.colors.gray700
    case 'Tenant ownership':
    case 'Bostadsrättstillägg':
      return theme.colors.green600
    case 'Care and treatment':
    case 'Vård & Behandling':
      return theme.colors.teal500
    case 'Dental injury':
    case 'Tandskada':
      return theme.colors.teal500
    case 'Hospitalisation':
    case 'Sjukhusvistelse':
      return theme.colors.teal700
    case 'Scarring':
    case 'Ärr':
      return theme.colors.yellow500
    case 'Crisis cover':
    case 'Krishjälp':
      return theme.colors.teal700
    case 'Permanent injury':
    case 'Bestående men':
      return theme.colors.purple500
    case 'Lost or reduced working capacity':
    case 'Förlorad arbetsförmåga':
      return theme.colors.purple500
    case 'Death':
    case 'Dödsfall':
      return theme.colors.purple700
    case 'Pests':
    case 'Skadedjur':
      return theme.colors.gray700
    case 'Rebuilding':
    case 'Ombyggnation':
      return theme.colors.pink700
    case 'Traffic insurance, personal injury':
    case 'Trafikförsäkring, personskador':
      return theme.colors.amber700
    case 'Traffic insurance, third-party property':
    case 'Trafikförsäkring, annans egendom':
      return theme.colors.yellow700
    case 'Theft & burglary':
    case 'Stöld & inbrott':
      return theme.colors.gray700
    case 'Brand':
      return theme.colors.red700
    case 'Glass damage':
    case 'Glas':
      return theme.colors.blue500
    case 'Roadside assistance':
    case 'Räddningshjälp och bärgning':
      return theme.colors.red600
    case 'Motor insurance':
    case 'Maskinskydd':
      return theme.colors.green600
    case 'Liability coverage':
    case 'Rättsskydd':
      return theme.colors.yellow500
    case 'Crisis counseling':
    case 'Kristerapi':
      return theme.colors.teal700
    case 'Car body damage':
    case 'Vagnskada':
      return theme.colors.green500
    case 'Veterinärvård':
    case 'Veterinary care':
      return theme.colors.teal600

    case 'Dolda fel':
    case 'Hidden defects':
      return theme.colors.gray700

    case 'Förlossning':
    case 'Pregnancy OR Giving birth':
      return theme.colors.teal700

    case 'Kastrering/Sterilisering':
    case 'Castration & Sterilization':
      return theme.colors.pink700

    case 'Specialkost':
    case 'Food':
      return theme.colors.yellow500

    case 'Tandvård':
    case 'Dental care':
      return theme.colors.teal500

    case 'Diagnostik':
    case 'Advanced diagnostics':
      return theme.colors.gray500

    case 'Medicin':
    case 'Medicine':
      return theme.colors.teal500

    case 'Avlivning':
    case 'Euthanasia':
      return theme.colors.purple700

    case 'Plastikoperation':
    case 'Plastic surgery':
      return theme.colors.pink600

    case 'Rehabilitering':
    case 'Rehabilitation':
      return theme.colors.yellow500

    case 'Vård av djur':
      return theme.colors.yellow700

    case 'Sorgbearbetning':
      return theme.colors.purple500

    case 'Livförsäkring':
      return theme.colors.purple600

    case 'Strålning och kemoterapi':
      return theme.colors.pink500
  }
}
