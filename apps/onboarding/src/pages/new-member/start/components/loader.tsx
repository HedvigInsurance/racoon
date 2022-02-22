import { keyframes } from '@emotion/react'
import styled from '@emotion/styled'
import { theme } from 'ui'

const spinner = keyframes({
  '0%': {
    opacity: '1',
  },
  '100%': {
    opacity: '0',
  },
})

const LoadingWrapper = styled.div({
  color: 'official',
  display: 'inline-block',
  position: 'relative',
  width: '80px',
  height: '80px',
  transform: 'scale(0.5)',
  'div': {
    transformOrigin: '40px 40px',
    animation: `${spinner} 1.2s linear infinite`,
  },
  'div:after': {
    content: '" "',
    display: 'block',
    position: 'absolute',
    top: '3px',
    left: '37px',
    width: '6px',
    height: '18px',
    borderRadius: '20%',
    background: theme.colors.gray600,
  },
  'div:nth-child(1)': {
    transform: 'rotate(0deg)',
    animationDelay: '-1.1s',
  },
  'div:nth-child(2)': {
    transform: 'rotate(30deg)',
    animationDelay: '-1s',
  },
  'div:nth-child(3)': {
    transform: 'rotate(60deg)',
    animationDelay: '-0.9s',
  },
  'div:nth-child(4)': {
    transform: 'rotate(90deg)',
    animationDelay: '-0.8s',
  },
  'div:nth-child(5)': {
    transform: 'rotate(120deg)',
    animationDelay: '-0.7s',
  },
  'div:nth-child(6)': {
    transform: 'rotate(150deg)',
    animationDelay: '-0.6s',
  },
  'div:nth-child(7)': {
    transform: 'rotate(180deg)',
    animationDelay: '-0.5s',
  },
  'div:nth-child(8)': {
    transform: 'rotate(210deg)',
    animationDelay: '-0.4s',
  },
  'div:nth-child(9)': {
    transform: 'rotate(240deg)',
    animationDelay: '-0.3s',
  },
  'div:nth-child(10)': {
    transform: 'rotate(270deg)',
    animationDelay: '-0.2s',
  },
  'div:nth-child(11)': {
    transform: 'rotate(300deg)',
    animationDelay: '-0.1s',
  },
  'div:nth-child(12)': {
    transform: 'rotate(330deg)',
    animationDelay: '0s',
  },
})

export const Loader = () => (
  <LoadingWrapper>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
  </LoadingWrapper>
)
