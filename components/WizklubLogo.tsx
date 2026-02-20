type WizklubLogoVariant = 'full' | 'mark'

export default function WizklubLogo({
  variant = 'full',
  className,
}: {
  variant?: WizklubLogoVariant
  className?: string
}) {
  if (variant === 'mark') {
    return (
      <svg
        viewBox="0 0 64 64"
        role="img"
        aria-label="WizKlub"
        className={className}
      >
        <defs>
          <linearGradient id="wk_grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#0EA5A3" />
            <stop offset="1" stopColor="#0B5FAE" />
          </linearGradient>
        </defs>
        <path
          d="M10 18c0-2 1.6-3.6 3.6-3.6h5.3c1.6 0 3 1 3.5 2.5l2.6 7.7 2.6-7.7c.5-1.5 1.9-2.5 3.5-2.5h2.8c1.6 0 3 1 3.5 2.5l2.6 7.7 2.6-7.7c.5-1.5 1.9-2.5 3.5-2.5h5.3c2 0 3.6 1.6 3.6 3.6 0 .4-.1.8-.2 1.2L48.4 48c-.5 1.5-1.9 2.5-3.5 2.5h-3.2c-1.6 0-3-1-3.5-2.5l-2.6-7.6-2.6 7.6c-.5 1.5-1.9 2.5-3.5 2.5h-3.2c-1.6 0-3-1-3.5-2.5L10.2 19.2c-.1-.4-.2-.8-.2-1.2Z"
          fill="url(#wk_grad)"
        />
        <path
          d="M26 10l1.2 3.2L30.5 14l-3.3 1.1L26 18.3 24.8 15.1 21.5 14l3.3-.8L26 10Z"
          fill="#F59E0B"
        />
      </svg>
    )
  }

  return (
    <svg
      viewBox="0 0 360 110"
      role="img"
      aria-label="WizKlub Futurz"
      className={className}
    >
      <path
        d="M28 30c0-3 2.4-5.4 5.4-5.4h7.9c2.3 0 4.4 1.5 5.1 3.7l3.8 11.3 3.8-11.3c.7-2.2 2.8-3.7 5.1-3.7h4.2c2.3 0 4.4 1.5 5.1 3.7l3.8 11.3 3.8-11.3c.7-2.2 2.8-3.7 5.1-3.7h7.9c3 0 5.4 2.4 5.4 5.4 0 .6-.1 1.2-.3 1.8L85.8 78c-.7 2.2-2.8 3.7-5.1 3.7h-4.8c-2.3 0-4.4-1.5-5.1-3.7l-3.8-11.2-3.8 11.2c-.7 2.2-2.8 3.7-5.1 3.7h-4.8c-2.3 0-4.4-1.5-5.1-3.7L28.3 36.4c-.2-.6-.3-1.2-.3-1.8Z"
        fill="#0EA5A3"
      />
      <path
        d="M55 12l1.8 5 5.2 1.2-5.2 1.7L55 25l-1.8-5.1-5.2-1.7 5.2-1.2L55 12Z"
        fill="#F59E0B"
      />
      <text
        x="110"
        y="52"
        fill="#0B5FAE"
        fontFamily="ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial"
        fontSize="44"
        fontWeight="800"
        letterSpacing="1"
      >
        WIZKLUB
      </text>
      <text
        x="110"
        y="92"
        fill="#F97316"
        fontFamily="ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial"
        fontSize="48"
        fontWeight="800"
      >
        Futurz
      </text>
    </svg>
  )
}

