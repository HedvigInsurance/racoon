type IconProps = {
  className?: string
  width?: number
  height?: number
}
export const CheckIcon = ({ className, width = 14, height = 14 }: IconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      width={width}
      height={height}
      viewBox="0 0 14 11"
      fill="none"
      style={{ marginTop: 1.5 }}
    >
      <path d="M1 5L5 9L13 1" stroke="#FAFAFA" strokeWidth="2" />
    </svg>
  )
}
