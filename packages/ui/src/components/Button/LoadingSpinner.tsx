import { keyframes } from '@emotion/react'
import styled from '@emotion/styled'

type Props = {
  size: string
  color?: string
}

// Adapted from Fran Pérez: https://codepen.io/mrrocks/details/ExLovj
export const LoadingSpinner = ({ size = '1rem', color = 'currentColor' }: Props) => {
  return (
    <Spinner width={size} height={size} viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg">
      <Path
        fill="none"
        stroke={color}
        strokeWidth="6"
        strokeLinecap="round"
        cx="33"
        cy="33"
        r="30"
      ></Path>
    </Spinner>
  )
}

const OFFSET = 187
const DURATION = '1.4s'

const RotatorAnimation = keyframes({
  from: {
    transform: 'rotate(0deg)',
  },
  to: {
    transform: 'rotate(270deg)',
  },
})

const Spinner = styled.svg({
  animation: `${RotatorAnimation} ${DURATION} linear infinite`,
})

const DashAnimation = keyframes({
  '0%': {
    strokeDashoffset: OFFSET,
  },
  '50%': {
    strokeDashoffset: OFFSET / 4,
    transform: 'rotate(135deg)',
  },
  '100%': {
    strokeDashoffset: OFFSET,
    transform: 'rotate(450deg)',
  },
})

const Path = styled.circle({
  strokeDasharray: OFFSET,
  strokeDashoffset: 0,
  transformOrigin: 'center',
  animation: `${DashAnimation} ${DURATION} ease-in-out infinite`,
})
