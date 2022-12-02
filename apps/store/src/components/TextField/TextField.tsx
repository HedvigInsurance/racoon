import styled from '@emotion/styled'
import { motion } from 'framer-motion'
import { InputHTMLAttributes } from 'react'
import { useHighlightAnimation } from '@/utils/useHighlightAnimation'

const Input = styled(motion.input)(({ theme }) => ({
  width: '100%',
  fontSize: theme.fontSizes[5],
  padding: `${theme.space[3]} ${theme.space[4]}`,
  borderRadius: theme.radius.sm,
  backgroundColor: theme.colors.gray300,
  color: theme.colors.gray900,

  ':focus': {
    outline: `1px solid ${theme.colors.gray500}`,
  },
  '::placeholder': {
    color: theme.colors.gray600,
  },
}))

type Props = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'onAnimationStart' | 'onDragStart' | 'onDragEnd' | 'onDrag'
>

export const TextField = (props: Props) => {
  const { highlight, animationProps } = useHighlightAnimation()
  return <Input {...props} onKeyDown={highlight} {...animationProps} />
}
