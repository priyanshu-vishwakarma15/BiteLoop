import { Link } from 'react-router-dom'
import './BrandLogo.css'

function BrandLogo({ to = '/', className = '', ariaLabel = 'BiteLoop home' }) {
  const classes = ['biteloop-brand', className].filter(Boolean).join(' ')

  return (
    <Link className={classes} to={to} aria-label={ariaLabel}>
      <svg
        className="biteloop-brand__mark"
        viewBox="0 0 48 48"
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          <linearGradient id="biteloop-gradient" x1="5" y1="5" x2="43" y2="43" gradientUnits="userSpaceOnUse">
            <stop stopColor="#ff9a54" />
            <stop offset="1" stopColor="#ed3f38" />
          </linearGradient>
        </defs>
        <circle cx="24" cy="24" r="22" fill="url(#biteloop-gradient)" />
        <path
          className="biteloop-brand__loop"
          d="M36.2 19.3A13 13 0 0 0 13 15.2M11.8 28.7A13 13 0 0 0 35 32.8"
          fill="none"
          stroke="white"
          strokeLinecap="round"
          strokeWidth="2.4"
        />
        <path d="m34.1 12.7 2.8 6.8-7.2-.8 4.4-6ZM13.9 35.3l-2.8-6.8 7.2.8-4.4 6Z" fill="white" />
        <path
          d="M19.2 14.5v5.2m-2.5-5.2v4.1a2.5 2.5 0 0 0 5 0v-4.1m-2.5 7v11.2"
          fill="none"
          stroke="white"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.8"
        />
        <path d="m26 19.5 7 4.5-7 4.5v-9Z" fill="white" />
      </svg>
      <span className="biteloop-brand__name">
        Bite<span>Loop</span>
      </span>
    </Link>
  )
}

export default BrandLogo
