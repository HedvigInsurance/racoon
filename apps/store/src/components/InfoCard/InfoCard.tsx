import type { ComponentProps } from 'react'
import { InfoIcon } from 'ui/src/icons/InfoIcon'
import { WarningTriangleIcon } from 'ui/src/icons/WarningTriangleIcon'
import { Alert } from 'ui'

type Props = Omit<ComponentProps<typeof Alert.Root>, 'variant'>

export const InfoCard = (props: Props) => {
  return (
    <Alert.Root variant="info" {...props}>
      <Alert.Icon icon={InfoIcon} />
      <Alert.Body>
        {typeof props.children === 'string' ? (
          <Alert.Message>{props.children}</Alert.Message>
        ) : (
          props.children
        )}
      </Alert.Body>
    </Alert.Root>
  )
}

export const AttentionCard = (props: Props) => {
  return (
    <Alert.Root variant="warning" {...props}>
      <Alert.Icon icon={WarningTriangleIcon} />
      <Alert.Body>
        {typeof props.children === 'string' ? (
          <Alert.Message>{props.children}</Alert.Message>
        ) : (
          props.children
        )}
      </Alert.Body>
    </Alert.Root>
  )
}

export const ErrorCard = (props: Props) => {
  return (
    <Alert.Root variant="error" {...props}>
      <Alert.Icon icon={WarningTriangleIcon} />
      <Alert.Body>
        {typeof props.children === 'string' ? (
          <Alert.Message>{props.children}</Alert.Message>
        ) : (
          props.children
        )}
      </Alert.Body>
    </Alert.Root>
  )
}

export const CampaignCard = (props: Props) => {
  return (
    <Alert.Root variant="success" {...props}>
      <Alert.Icon icon={InfoIcon} />
      <Alert.Body>
        {typeof props.children === 'string' ? (
          <Alert.Message>{props.children}</Alert.Message>
        ) : (
          props.children
        )}
      </Alert.Body>
    </Alert.Root>
  )
}
