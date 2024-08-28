import { Flex, InfoTag } from '@hedvig-ui/redesign'
import { ComponentPropsWithoutRef } from 'react'
import clsx from 'clsx'
import { selectedTags, selectTag } from './SelectedTags.css'
import { Option } from '../Select.types'

interface Props extends ComponentPropsWithoutRef<typeof Flex> {
  value: string[]
  options: Option[]
  onTagClicked: (value: string) => void
}

export function SelectedTags({
  value,
  options,
  className,
  onTagClicked,
  ...props
}: Props) {
  const selectedValuesToLabels: Record<string, string> = value.reduce(
    (valueToLabelMap, currentValue) => {
      const valueLabel = options.find((option) => option.value === currentValue)

      return {
        ...valueToLabelMap,
        [currentValue]: valueLabel?.label || currentValue,
      }
    },
    {},
  )

  return (
    <Flex
      direction="row"
      gap="fraction"
      wrap="wrap"
      className={clsx(className, selectedTags)}
      {...props}
    >
      {value.map((optionKey) => (
        <InfoTag
          key={optionKey}
          variant="warning"
          className={selectTag}
          onClick={(e) => {
            e.stopPropagation()
            const option = options.find((o) => o.value === optionKey)
            option?.action?.()
            onTagClicked?.(optionKey)
          }}
        >
          {selectedValuesToLabels[optionKey]}
        </InfoTag>
      ))}
    </Flex>
  )
}
