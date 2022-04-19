import styled from '@emotion/styled'
import * as RadioGroup from '@radix-ui/react-radio-group'
import { AnimatePresence, motion } from 'framer-motion'
import { Space } from 'ui'
import { Tick } from './icons/tick'

const StyledItem = styled(RadioGroup.Item)(({ theme }) => ({
  padding: 0,
  backgroundColor: theme.colors.white,
  boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.1)',
  borderRadius: '0.5rem',
  width: '100%',

  border: '2px solid transparent',
  textAlign: 'left',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'stretch',

  ['&[data-state=checked]']: {
    borderColor: theme.colors.gray900,
  },

  '&:focus': {
    outlineColor: theme.colors.gray500,
  },
}))

const InnerWrapper = styled.div({
  padding: '1rem',
  display: 'flex',
  gap: '1rem',
})

const IndicatorWrapper = styled.div(({ theme }) => ({
  display: 'inline-flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '1.375rem',
  width: '1.375rem',
  border: `1px solid ${theme.colors.gray900}`,
  borderRadius: '0.75rem',
  cursor: 'pointer',
  flexShrink: 0,
}))

const Indicator = styled(RadioGroup.Indicator)(({ theme }) => ({
  backgroundColor: theme.colors.gray900,
  borderRadius: '0.75rem',
  width: '100%',
  height: '100%',
}))

const Title = styled.h3(({ theme }) => ({
  margin: 0,
  fontFamily: theme.fonts.body,
  fontSize: '1.125rem',
  lineHeight: 1,
}))

const Description = styled.p(({ theme }) => ({
  margin: 0,
  fontFamily: theme.fonts.body,
  fontSize: '0.875rem',
  lineHeight: 1,
  color: theme.colors.gray600,
}))

const StyledAnimatedContent = styled(motion.div)({
  overflow: 'hidden',
  padding: '1rem',
  paddingTop: '0.5rem',
})

type AnimatedContentProps = {
  children: React.ReactNode
}

const AnimatedContent = ({ children }: AnimatedContentProps) => {
  return (
    <StyledAnimatedContent
      initial="collapsed"
      animate="open"
      exit="collapsed"
      variants={{
        open: { opacity: 1, height: 'auto' },
        collapsed: { opacity: 0, height: 0 },
      }}
      transition={{ duration: 0.25 }}
    >
      {children}
    </StyledAnimatedContent>
  )
}

type RadioGroupItemProps = {
  value: string
  checked: boolean
  children?: React.ReactNode
  title: string
  description: string
}

export const RadioGroupItem = ({
  value,
  checked,
  children,
  title,
  description,
}: RadioGroupItemProps) => {
  return (
    <StyledItem value={value}>
      <InnerWrapper>
        <IndicatorWrapper>
          <Indicator>
            <Tick size={20} />
          </Indicator>
        </IndicatorWrapper>

        <Space y={0.5}>
          <Title>{title}</Title>
          <Description>{description}</Description>
        </Space>
      </InnerWrapper>

      {children && (
        <AnimatePresence initial={false}>
          {checked && <AnimatedContent>{children}</AnimatedContent>}
        </AnimatePresence>
      )}
    </StyledItem>
  )
}
