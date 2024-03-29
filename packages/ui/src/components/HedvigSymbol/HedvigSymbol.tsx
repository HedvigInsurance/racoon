type HedvigSymbolProps = {
  color?: string
  size?: string
}

export const HedvigSymbol = ({ color = 'currentColor', size = '1.5rem' }: HedvigSymbolProps) => (
  <svg
    width={size}
    height={size}
    fill="none"
    color={color}
    viewBox="0 0 40 40"
    aria-label="Hedvig logo"
  >
    <path
      d="M14.0932 18.6496H25.9075V9.11377H28.608V30.8859H25.9075V21.3501H14.0932V30.8859H11.3084V9.11377H14.0932V18.6496Z"
      fill="currentColor"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M0 20C0 8.94515 8.94516 0 20 0C31.0549 0 40 8.94515 40 20C40 31.0549 31.0549 40 20 40C8.94516 40 0 31.0549 0 20ZM2.70043 20C2.70043 29.5359 10.4641 37.2996 20 37.2996C29.5359 37.2996 37.2996 29.5359 37.2996 20C37.2996 10.4641 29.5359 2.70042 20 2.70042C10.4641 2.70042 2.70043 10.4641 2.70043 20Z"
      fill="currentColor"
    />
  </svg>
)
