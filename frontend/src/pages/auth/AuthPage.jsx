import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import BrandLogo from '../../components/BrandLogo'
import '../../styles/auth-shared.css'

const pageContent = {
  user: {
    audience: 'food lovers',
    registerTitle: 'A little taste of what’s next.',
    registerDescription: 'Create an account to save the good stuff and find your next favorite.',
    loginTitle: 'Good to have you back.',
    loginDescription: 'Sign in to pick up right where your cravings left off.',
  },
  partner: {
    audience: 'food partners',
    registerTitle: 'Let’s put you on the menu.',
    registerDescription: 'Create your partner account and bring more people to your table.',
    loginTitle: 'Welcome back to your kitchen.',
    loginDescription: 'Sign in to continue growing your food business.',
  },
}

function AuthPage({ audience, mode }) {
  const isPartner = audience === 'partner'
  const isRegister = mode === 'register'
  const content = pageContent[audience]
  const basePath = isPartner ? '/food-partner' : '/user'
  const oppositeAudience = isPartner ? 'user' : 'partner'
  const oppositeLabel = isPartner ? 'For diners' : 'For food partners'

  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const name = formData.get('name')
    const payload = {
      email: formData.get('email'),
      password: formData.get('password'),
    }

    if (isRegister) {
      if (isPartner) {
        payload.name = name
        payload.RestaurantName = formData.get('restaurantName')
      } else {
        payload.fullName = name
      }
    }

    setError('')
    setIsSubmitting(true)

    try {
      const accountType = isPartner ? 'food-partner' : 'user'
      const action = isRegister ? 'register' : 'login'
      const response = await fetch(`http://localhost:3000/api/auth/${accountType}/${action}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(payload),
      })
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Unable to continue. Please try again.')
      }
  
    

      navigate(isPartner ? '/food-partner/profile' : '/')
    } catch (requestError) {
      setError(requestError.message || 'Unable to connect to the server. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="auth-page">
      <header className="auth-header">
        <BrandLogo className="biteloop-brand--auth" to={`${basePath}/login`} />
        <Link className="audience-link" to={`/${oppositeAudience === 'partner' ? 'food-partner' : 'user'}/${mode}`}>
          {oppositeLabel}
          <span aria-hidden="true">↗</span>
        </Link>
      </header>

      <section className="auth-layout" aria-labelledby="auth-title">
        <aside className="auth-story">
          <div className="story-orbit story-orbit--outer" />
          <div className="story-orbit story-orbit--inner" />
          <div className="story-dish" aria-hidden="true">
            <span className="story-dish__center" />
            <span className="story-dish__leaf story-dish__leaf--one" />
            <span className="story-dish__leaf story-dish__leaf--two" />
            <span className="story-dish__leaf story-dish__leaf--three" />
          </div>
          <div className="story-copy">
            <span className="eyebrow">MADE FOR {content.audience.toUpperCase()}</span>
            <h1>{isRegister ? content.registerTitle : content.loginTitle}</h1>
            <p>{isRegister ? content.registerDescription : content.loginDescription}</p>
          </div>
          <span className="story-footnote">GOOD FOOD, GOOD MOOD.</span>
        </aside>

        <div className="auth-panel">
          <div className="auth-card">
            <div className="auth-heading">
              <span className="eyebrow">{isPartner ? 'PARTNER ACCOUNT' : 'YOUR FOOD ACCOUNT'}</span>
              <h2 id="auth-title">{isRegister ? 'Create your account' : 'Sign in'}</h2>
              <p>
                {isRegister ? 'A few details and you’re all set.' : 'Enter your details to continue.'}
              </p>
            </div>

            <form className="auth-form" onSubmit={handleSubmit}>
              {isRegister && (
                <>
                  {isPartner ? (
                    <>
                      <label className="field">
                        <span>Restaurant name</span>
                        <input name="restaurantName" type="text" placeholder="e.g. Sunday Kitchen" autoComplete="organization" required />
                      </label>
                      <label className="field">
                        <span>Your name</span>
                        <input name="name" type="text" placeholder="Name on your account" autoComplete="name" required />
                      </label>
                    </>
                  ) : (
                    <label className="field">
                      <span>Your name</span>
                      <input name="name" type="text" placeholder="Name on your account" autoComplete="name" required />
                    </label>
                  )}
                </>
              )}
              <label className="field">
                <span>Email address</span>
                <input name="email" type="email" placeholder="you@example.com" autoComplete="email" required />
              </label>
              <label className="field">
                <span>Password</span>
                <input
                  name="password"
                  type="password"
                  placeholder="At least 8 characters"
                  autoComplete={isRegister ? 'new-password' : 'current-password'}
                  required
                />
              </label>

              {!isRegister && (
                <div className="form-meta">
                  <label className="remember-option">
                    <input type="checkbox" name="remember" />
                    <span>Remember me</span>
                  </label>
                  <button className="text-button" type="button">Forgot password?</button>
                </div>
              )}

              {isRegister && (
                <label className="remember-option terms-option">
                  <input type="checkbox" name="terms" required />
                  <span>I agree to the <a href="#terms">Terms</a> and <a href="#privacy">Privacy Policy</a>.</span>
                </label>
              )}

              {error && <p className="auth-error" role="alert">{error}</p>}

              <button className="primary-button" type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Please wait…' : isRegister ? 'Create account' : 'Sign in'}
                {!isSubmitting && <span aria-hidden="true">→</span>}
              </button>
            </form>

            <p className="auth-switch">
              {isRegister ? 'Already have an account?' : 'New to BiteLoop?'}
              {' '}
              <Link to={`${basePath}/${isRegister ? 'login' : 'register'}`}>
                {isRegister ? 'Sign in' : 'Create an account'}
              </Link>
            </p>
            <nav className="account-type-links" aria-label="Choose account type">
              <span>Register as</span>
              <Link to="/user/register">a normal user</Link>
              <span aria-hidden="true">·</span>
              <Link to="/food-partner/register">a food partner</Link>
            </nav>
          </div>
          <p className="auth-footnote">By continuing, you agree to our <a href="#terms">Terms of Service</a>.</p>
        </div>
      </section>
    </main>
  )
}

export default AuthPage
