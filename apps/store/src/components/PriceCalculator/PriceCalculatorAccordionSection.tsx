import styled from '@emotion/styled'
import { useTranslation } from 'next-i18next'
import type { ReactNode} from 'react';
import { useMemo } from 'react'
import { Heading, InfoIcon, Text, theme } from 'ui'
import { Tooltip } from '@/components/Tooltip/Tooltip'
import type { Label, SectionItem } from '@/services/PriceCalculator/PriceCalculator.types'
import { useAutoFormat } from '@/utils/useFormatter'
import * as Accordion from './Accordion'
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
        <Grid>
          <GridIcon>
            <StepIcon state={stepIconState} />
          </GridIcon>

          <GridTitle>
            <Heading
              as="h3"
              variant="standard.18"
              color={showMutedHeading ? 'textSecondary' : 'textPrimary'}
            >
              {props.title}
            </Heading>
          </GridTitle>

          {props.tooltip && !showEditButton && (
            <Tooltip message={translateLabel(props.tooltip)}>
              <button>
                <InfoIcon color={theme.colors.textSecondary} size="1.25rem" />
              </button>
            </Tooltip>
          )}

          <GridEdit hidden={!showEditButton}>
            <Accordion.Trigger>
              <Text size="md" color="textPrimary">
                {t('PRICE_CALCULATOR_SECTION_EDIT_BUTTON')}
              </Text>
            </Accordion.Trigger>
          </GridEdit>

          <GridPreview hidden={props.active || !previewText}>
            <Text color="textSecondary">{previewText}</Text>
          </GridPreview>
        </Grid>
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

enum Area {
  Icon = 'icon',
  Title = 'title',
  Edit = 'edit',
  Preview = 'preview',
}

const Grid = styled.div({
  display: 'grid',
  gridTemplateColumns: 'auto 1fr auto',
  gridTemplateRows: 'auto auto',
  gridTemplateAreas: `
    "${Area.Icon} ${Area.Title}   ${Area.Edit}"
    ".            ${Area.Preview} ${Area.Preview}"
  `,
  columnGap: theme.space.xs,
  alignItems: 'center',
})

const GridIcon = styled.div({ gridArea: Area.Icon, paddingTop: 1 })
const GridTitle = styled.div({ gridArea: Area.Title })
const GridEdit = styled.div({ gridArea: Area.Edit })
const GridPreview = styled.div({ gridArea: Area.Preview })
