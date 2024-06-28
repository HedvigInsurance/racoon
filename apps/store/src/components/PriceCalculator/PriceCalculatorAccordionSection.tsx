import { useTranslation } from 'next-i18next'
import type { ReactNode } from 'react'
import { useMemo } from 'react'
import { Heading, InfoIcon, Text, theme } from 'ui'
import { Tooltip } from '@/components/Tooltip/Tooltip'
import type { Label, SectionItem } from '@/services/PriceCalculator/PriceCalculator.types'
import { useAutoFormat } from '@/utils/useFormatter'
import * as Accordion from './Accordion'
import {
  grid,
  gridEdit,
  gridIcon,
  gridPreview,
  gridTitle,
} from './PriceCalculatorAccordionSection.css'
import { StepIcon } from './StepIcon'
import { useTranslateFieldLabel } from './useTranslateFieldLabel'

type Props = {
  children: ReactNode
  active: boolean
  valid: boolean
  title: string
  tooltip?: Label
  value: string
  previewFieldName?: string
  previewLabel?: Label
  editable?: boolean
  items: Array<SectionItem>
}

export const PriceCalculatorAccordionSection = (props: Props) => {
  const { t } = useTranslation('purchase-form')
  const translateLabel = useTranslateFieldLabel()

  const showMutedHeading = !(props.active || props.valid)
  const isSectionEditable = props.editable ?? true
  const showEditButton = isSectionEditable && props.valid && !props.active

  const stepIconState = useMemo(() => {
    if (props.active) return 'filled'
    if (props.valid) return 'valid'
    return 'muted'
  }, [props.active, props.valid])

  const autoFormat = useAutoFormat()
  const previewText = useMemo(() => {
    if (!props.previewFieldName) return

    const item = props.items.find((item) => item.field.name === props.previewFieldName)
    const value = item?.field.value
    if (value === undefined) return

    if (props.previewLabel) {
      return translateLabel(props.previewLabel, parseTranslateOptions(value))
    }

    return autoFormat(props.previewFieldName, value)
  }, [props.previewFieldName, props.items, props.previewLabel, translateLabel, autoFormat])

  return (
    <Accordion.Item value={props.value}>
      <Accordion.Header>
        <div className={grid}>
          <div className={gridIcon}>
            <StepIcon state={stepIconState} />
          </div>

          <Heading
            as="h3"
            variant="standard.18"
            color={showMutedHeading ? 'textSecondary' : 'textPrimary'}
            className={gridTitle}
          >
            {props.title}
          </Heading>

          {props.tooltip && !showEditButton && (
            <Tooltip message={translateLabel(props.tooltip)}>
              <button>
                <InfoIcon color={theme.colors.textSecondary} size="1.25rem" />
              </button>
            </Tooltip>
          )}

          <div className={gridEdit} hidden={!showEditButton}>
            <Accordion.Trigger>
              <Text size="md" color="textPrimary">
                {t('PRICE_CALCULATOR_SECTION_EDIT_BUTTON')}
              </Text>
            </Accordion.Trigger>
          </div>

          <div className={gridPreview} hidden={props.active || !previewText}>
            <Text color="textSecondary">{previewText}</Text>
          </div>
        </div>
      </Accordion.Header>
      <Accordion.Content>{props.children}</Accordion.Content>
    </Accordion.Item>
  )
}

const parseTranslateOptions = (value: unknown) => {
  if (typeof value === 'number') return { count: value }
  if (typeof value === 'string') {
    const intValue = parseInt(value)
    if (!isNaN(intValue)) return { count: intValue }
  }
}
