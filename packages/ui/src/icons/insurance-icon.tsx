type IconProps = {
  className?: string
  width?: number
  height?: number
}

export const InsuranceIcon = ({ className, width = 32, height = 32 }: IconProps) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 32 33"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M20.3332 3.16666H11.9998C10.1665 3.16666 8.6665 4.66666 8.6665 6.49999V26.5C8.6665 28.3333 10.1665 29.8333 11.9998 29.8333H20.3332C22.1665 29.8333 23.6665 28.3333 23.6665 26.5V6.49999C23.6665 4.58332 22.1665 3.16666 20.3332 3.16666Z"
      stroke="#121212"
      strokeWidth="1.5"
      strokeMiterlimit="10"
    />
    <path
      d="M22.8332 4L19.1665 9.66667L13.4998 10.5L8.6665 15.6667"
      stroke="#121212"
      strokeWidth="1.5"
      strokeMiterlimit="10"
    />
    <path
      d="M13.5 10.5L18.8333 17.0833L14.8333 21.1666L19.5 29.8333"
      stroke="#121212"
      strokeWidth="1.5"
      strokeMiterlimit="10"
    />
    <path
      d="M23.6665 25.6666L14.8332 21.1666L8.6665 23.1666"
      stroke="#121212"
      strokeWidth="1.5"
      strokeMiterlimit="10"
    />
    <path d="M18.833 17.0834H23.6663" stroke="#121212" strokeWidth="1.5" strokeMiterlimit="10" />
  </svg>
)
