import { IconProps } from './types'

export const DisabledTick = ({ className, width = 10, height = 2 }: IconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      width={width}
      height={height}
      viewBox="0 0 10 2"
      fill="none"
      style={{ marginTop: 1 }}
    >
      <line y1="1" x2="10" y2="1" stroke="#AAAAAA" strokeWidth="2" />
    </svg>
  )
}
