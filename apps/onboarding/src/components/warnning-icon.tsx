type WarningIconProps = {
  className?: string
}

export const WarningIcon = ({ className }: WarningIconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    className={className}
  >
    <g fill="none" fillRule="evenodd">
      <circle cx="12" cy="12" r="12" fill="currentColor" />
      <path
        className="fill-white"
        d="M13.053 5.238h-2.124l.468 9.108h1.206l.45-9.108zM10.821 16.92c0 .648.522 1.17 1.17 1.17.648 0 1.188-.522 1.188-1.17 0-.648-.54-1.188-1.188-1.188-.648 0-1.17.54-1.17 1.188z"
      />
    </g>
  </svg>
)
