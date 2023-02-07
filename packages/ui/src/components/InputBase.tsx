import styled from '@emotion/styled'
import { WarningTriangleIcon } from '../icons'
import { Space } from './Space'

const Label = styled.label(({ theme }) => ({
  fontFamily: theme.fonts.body,
  color: theme.colors.textPrimary,
  fontSize: '0.875rem',
  lineHeight: '1.375rem',
}))

const MessageWrapper = styled(Space)({
  display: 'flex',
  alignItems: 'center',
})

const StyledWarningTriangleIcon = styled(WarningTriangleIcon)(({ theme }) => ({
  color: theme.colors.red600,
  width: '1rem',
  height: '1rem',
}))

const ErrorMessage = styled.span(({ theme }) => ({
  fontFamily: theme.fonts.body,
  color: theme.colors.red600,
  fontSize: '0.75rem',
  lineHeight: '1rem',
}))

const InfoMessage = styled.span(({ theme }) => ({
  fontFamily: theme.fonts.body,
  color: theme.colors.textSecondary,
  fontSize: '0.75rem',
  lineHeight: '1rem',
}))

type ChildrenProps = {
  hasError: boolean
  errorMessageId: string
}

export type InputBaseProps = {
  id?: string
  errorMessage?: string
  infoMessage?: string
  label?: string
}

type Props = InputBaseProps & { children: (props: ChildrenProps) => JSX.Element }

export const InputBase = ({ id, errorMessage, infoMessage, label, children }: Props) => {
  const hasError = errorMessage !== undefined
  const errorMessageId = `${id}-error`
  const hasInfo = infoMessage !== undefined && !hasError

  return (
    <Space y={0.5}>
      {label && <Label htmlFor={id}>{label}</Label>}
      <Space y={0.25}>
        {children({ hasError, errorMessageId })}

        {hasInfo ? (
          <MessageWrapper x={0.25}>
            <InfoMessage>{infoMessage}</InfoMessage>
          </MessageWrapper>
        ) : (
          hasError && (
            <MessageWrapper x={0.25}>
              <StyledWarningTriangleIcon />
              <ErrorMessage id={errorMessageId}>{errorMessage || 'PLACEHOLDER'}</ErrorMessage>
            </MessageWrapper>
          )
        )}
      </Space>
    </Space>
  )
}
