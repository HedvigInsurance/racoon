'use client'
import { datadogLogs } from '@datadog/browser-logs'
import { useCallback, useMemo, useRef, useState } from 'react'
import { Text, tokens } from 'ui'
import * as Accordion from '@/components/Accordion/Accordion'
import type { PerilFragment } from '@/services/graphql/generated'
import { isBrowser } from '@/utils/env'
import { useResizeObserver } from '@/utils/useResizeObserver'
import { CoverageList } from './CoverageList'
import {
  colorIcon,
  header,
  column,
  grid,
  triggerText,
  contentWrapper,
  disabledPeril,
} from './Perils.css'

type Peril = PerilFragment & { disabled?: boolean }

const getPerilColumns = (items: Array<Peril>, columns: number) =>
  items.reduce(
    (acc, item, index) => {
      const columnIndex = index % columns
      if (!acc[columnIndex]) {
        acc[columnIndex] = []
      }
      acc[columnIndex].push(item)
      return acc
    },
    [] as Array<Array<Peril>>,
  )

type Props = {
  items: Array<PerilFragment>
  missingItems?: Array<PerilFragment>
}

export const Perils = ({ items, missingItems = [] }: Props) => {
  const perilItems = useMemo<Array<Peril>>(
    () => [...items, ...missingItems.map((item) => ({ ...item, disabled: true }))],
    [items, missingItems],
  )

  const [columns, setColumns] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  // Optimization:
  //
  // We're using lower-level utility compared to potential `useElementSize()` hook because we only care
  // about number of columns as a function of container width
  //
  // Older version used to handle box resize as a state update which effectively meant
  // ~30 renders on every expand/collapse animation
  const handleResize: ResizeObserverCallback = useCallback(([resizeEntry]) => {
    const width = resizeEntry.borderBoxSize[0].inlineSize
    setColumns(getColumnsCount(width))
  }, [])
  useResizeObserver({ elementRef: containerRef, onResize: handleResize })

  const perilsByColumn = getPerilColumns(perilItems, columns)
  return (
    <div className={grid} ref={containerRef}>
      {columns == 0
        ? null // We don't want to render anything before sizing to prevent rendering rework and content jump
        : perilsByColumn.map((perils, index) => (
            <div key={index} className={column}>
              {perils.map((peril) => (
                <PerilsAccordion key={`${index}-${peril.title}`} peril={peril} />
              ))}
            </div>
          ))}
    </div>
  )
}

const getColumnsCount = (width: number) => {
  if (width === 0) return 0
  // Matching peril grid styles below
  const colSize = 18 * 16
  const gapSize = 16
  const extraColumns = Math.floor((width - colSize) / (colSize + gapSize))
  return Math.min(1 + extraColumns, 4)
}

const PerilsAccordion = ({ peril }: { peril: Peril }) => {
  const { title, description, covered, colorCode } = peril
  const [openItems, setOpenItems] = useState<Array<string>>()

  const handleValueChange = useCallback((value: Array<string>) => {
    setOpenItems(value)
  }, [])

  if (peril.disabled) {
    return (
      <div className={disabledPeril}>
        <div className={header}>
          <ColorIcon color={tokens.colors.textDisabled} />
          <Text size="lg" color="textSecondary" className={triggerText}>
            {title}
          </Text>
        </div>
      </div>
    )
  }

  return (
    <Accordion.Root type="multiple" value={openItems} onValueChange={handleValueChange}>
      <Accordion.Item key={title} value={title}>
        <Accordion.HeaderWithTrigger className={header}>
          <div className={header}>
            <ColorIcon color={colorCode ?? titleToColor(title)} />
            <Text size="lg" className={triggerText}>
              {title}
            </Text>
          </div>
        </Accordion.HeaderWithTrigger>
        <Accordion.Content open={(openItems ?? []).includes(title)}>
          {/* styles need to be applied to child of content, otherwise height measurement fails */}
          <div className={contentWrapper}>
            <Text as="p" size="xs" color="textPrimary">
              {description}
            </Text>
            <CoverageList items={covered} />
          </div>
        </Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  )
}

function ColorIcon({ color }: { color?: string }) {
  return <div className={colorIcon} style={{ backgroundColor: color }} />
}

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
      return tokens.colors.red700
    case 'Water leaks':
    case 'Vattenläcka':
      return tokens.colors.blue500
    case 'Storms':
    case 'Oväder':
      return tokens.colors.blue700
    case 'Burglary':
    case 'Inbrott':
      return tokens.colors.gray500
    case 'Theft and damage':
    case 'Stöld och skadegörelse':
      return tokens.colors.gray700
    case 'Liability protection':
    case 'Ansvarsskydd':
      return tokens.colors.yellow500
    case 'Legal protection':
    case 'Rättskydd':
      return tokens.colors.yellow500
    case 'Travel insurance':
    case 'Resetrubbel':
      return tokens.colors.amber600
    case 'Assault':
    case 'Överfall':
      return tokens.colors.amber500
    case 'Travel illness':
    case 'Sjuk på resa':
      return tokens.colors.teal500
    case 'White goods':
    case 'Vitvaror':
      return tokens.colors.grayTranslucent25
    case 'All-risk':
    case 'Drulle':
      return tokens.colors.yellow700
    case 'Criminal damage':
    case 'Skadegörelse':
      return tokens.colors.gray700
    case 'Tenant ownership':
    case 'Bostadsrättstillägg':
      return tokens.colors.green600
    case 'Care and treatment':
    case 'Vård & Behandling':
      return tokens.colors.teal500
    case 'Dental injury':
    case 'Tandskada':
      return tokens.colors.teal500
    case 'Hospitalisation':
    case 'Sjukhusvistelse':
      return tokens.colors.teal700
    case 'Scarring':
    case 'Ärr':
      return tokens.colors.yellow500
    case 'Crisis cover':
    case 'Krishjälp':
      return tokens.colors.teal700
    case 'Permanent injury':
    case 'Bestående men':
      return tokens.colors.purple500
    case 'Lost or reduced working capacity':
    case 'Förlorad arbetsförmåga':
      return tokens.colors.purple500
    case 'Death':
    case 'Dödsfall':
      return tokens.colors.purple700
    case 'Pests':
    case 'Skadedjur':
      return tokens.colors.gray700
    case 'Rebuilding':
    case 'Ombyggnation':
      return tokens.colors.pink700
    case 'Traffic insurance, personal injury':
    case 'Trafikförsäkring, personskador':
      return tokens.colors.amber700
    case 'Traffic insurance, third-party property':
    case 'Trafikförsäkring, annans egendom':
      return tokens.colors.yellow700
    case 'Theft & burglary':
    case 'Stöld & inbrott':
      return tokens.colors.gray700
    case 'Brand':
      return tokens.colors.red700
    case 'Glass damage':
    case 'Glas':
      return tokens.colors.blue500
    case 'Roadside assistance':
    case 'Räddningshjälp och bärgning':
      return tokens.colors.red600
    case 'Motor insurance':
    case 'Maskinskydd':
      return tokens.colors.green600
    case 'Liability coverage':
    case 'Rättsskydd':
      return tokens.colors.yellow500
    case 'Crisis counseling':
    case 'Kristerapi':
      return tokens.colors.teal700
    case 'Car body damage':
    case 'Vagnskada':
      return tokens.colors.green500
    case 'Veterinärvård':
    case 'Veterinary care':
      return tokens.colors.teal600

    case 'Dolda fel':
    case 'Hidden defects':
      return tokens.colors.gray700

    case 'Förlossning':
    case 'Pregnancy OR Giving birth':
      return tokens.colors.teal700

    case 'Kastrering/Sterilisering':
    case 'Castration & Sterilization':
      return tokens.colors.pink700

    case 'Specialkost':
    case 'Food':
      return tokens.colors.yellow500

    case 'Tandvård':
    case 'Dental care':
      return tokens.colors.teal500

    case 'Diagnostik':
    case 'Advanced diagnostics':
      return tokens.colors.gray500

    case 'Medicin':
    case 'Medicine':
      return tokens.colors.teal500

    case 'Avlivning':
    case 'Euthanasia':
      return tokens.colors.purple700

    case 'Plastikoperation':
    case 'Plastic surgery':
      return tokens.colors.pink600

    case 'Rehabilitering':
    case 'Rehabilitation':
      return tokens.colors.yellow500

    case 'Vård av djur':
      return tokens.colors.yellow700

    case 'Sorgbearbetning':
      return tokens.colors.purple500

    case 'Livförsäkring':
      return tokens.colors.purple600

    case 'Strålning och kemoterapi':
      return tokens.colors.pink500
  }
}
